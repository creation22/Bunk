import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [classes, setClasses] = useState(null);
  const [absents, setAbsents] = useState(null);
  const [threshold, setThreshold] = useState(75);
  const [bunks, setBunks] = useState(null);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [requiredClasses, setRequiredClasses] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [funMessage, setFunMessage] = useState("");

  // Check system preference for dark mode on load
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  // Auto-calculate whenever inputs change
  useEffect(() => {
    if (classes !== null && absents !== null && classes >= absents && classes > 0) {
      const result = calculateStats(classes, absents, threshold);
      setBunks(result.maxBunks);
      setCurrentAttendance(result.currentPercent);
      setRequiredClasses(result.neededClasses);
      setFunMessage(getFunMessage(parseFloat(result.currentPercent)));
    } else {
      // Reset results if inputs are invalid
      setBunks(null);
      setCurrentAttendance(null);
      setRequiredClasses(null);
      setFunMessage("");
    }
  }, [classes, absents, threshold]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getFunMessage = (attendance) => {
    if (attendance >= 90) {
      return "Mat aya kar college! 🤓📚 Thoda break bhi le le!";
    } else if (attendance < 75) {
      return "College aa jaya kar bhai! 🏫 Attendance kam hai!";
    } else {
      return "On track! Keep it balanced! 👍";
    }
  };

  const calculateStats = (classes, absents, thresholdValue) => {
    // Handle edge cases
    if (classes <= 0) return { maxBunks: 0, currentPercent: "0.00", neededClasses: 0 };
    if (absents < 0) absents = 0;
    if (absents > classes) absents = classes;
    
    const attended = classes - absents;
    const currentPercent = ((attended / classes) * 100).toFixed(2);
    
    // Calculate future bunks possible
    let futureBunks = 0;
    // Test case: Student already below threshold
    if (parseFloat(currentPercent) < thresholdValue) {
      futureBunks = 0;
    } else {
      // Test case: Calculate maximum possible bunks
      while (true) {
        const newTotal = classes + futureBunks;
        const newAbsent = absents + futureBunks;
        // Ensure we don't divide by zero
        if (newTotal === 0) break;
        
        const newAttendance = ((newTotal - newAbsent) / newTotal) * 100;
        if (newAttendance < thresholdValue) break;
        futureBunks++;
        
        // Safety check: prevent infinite loops
        if (futureBunks > 1000) break;
      }
    }

    // Calculate classes needed to reach threshold
    let neededClasses = 0;
    if (parseFloat(currentPercent) < thresholdValue) {
      // Test case: Calculate classes needed to reach threshold
      while (true) {
        const newTotal = classes + neededClasses;
        const newAttendance = ((attended + neededClasses) / newTotal) * 100;
        if (newAttendance >= thresholdValue) break;
        neededClasses++;
        
        // Safety check: prevent infinite loops
        if (neededClasses > 1000) {
          neededClasses = "too many"; // If unrealistic number of classes needed
          break;
        }
      }
    }

    return {
      maxBunks: Math.max(0, futureBunks - 1), // Ensure no negative bunks
      currentPercent,
      neededClasses: parseFloat(currentPercent) < thresholdValue ? neededClasses : 0
    };
  };

  const handleReset = () => {
    setClasses(null);
    setAbsents(null);
    setBunks(null);
    setCurrentAttendance(null);
    setRequiredClasses(null);
    setFunMessage("");
    setThreshold(75); // Reset threshold to default
  };

  // Test case presets
  const runTestCase = (testCase) => {
    switch(testCase) {
      case 'perfect':
        // Test case: Perfect attendance
        setClasses(40);
        setAbsents(0);
        break;
      case 'critical':
        // Test case: Exactly at threshold
        setClasses(40);
        setAbsents(10); // 75% attendance
        break;
      case 'failing':
        // Test case: Below threshold
        setClasses(40);
        setAbsents(15); // 62.5% attendance
        break;
      case 'zero':
        // Test case: No classes yet
        setClasses(0);
        setAbsents(0);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-purple-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-purple-100'
    } px-4 py-10`}>
      <div className={`${
        darkMode 
          ? 'bg-gray-800/90 border-purple-700 text-white' 
          : 'bg-white/90 border-purple-200 text-gray-800'
        } backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-lg w-full border transition-all duration-300`}>
        
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-4xl font-extrabold italic ${
            darkMode ? 'text-purple-300' : 'text-purple-700'
          } drop-shadow-md tracking-tight`}>
            Bunk Buddy 💤
          </h1>
          
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode 
                ? 'bg-purple-700 hover:bg-purple-600' 
                : 'bg-purple-200 hover:bg-purple-300'
            } transition-colors duration-300`}
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {/* Input: Total Classes */}
          <div>
            <label className={`block text-sm font-semibold italic mb-1 ${
              darkMode ? 'text-purple-300' : 'text-purple-700'
            }`}>
              📚 Total Classes
            </label>
            <input
              type="number"
              min="0"
              value={classes !== null ? classes : ''}
              onChange={(e) => setClasses(e.target.value === '' ? null : Number(e.target.value))}
              className={`w-full px-4 py-3 rounded-xl border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500' 
                  : 'bg-white border-gray-300 focus:ring-purple-400'
                } focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm placeholder:text-gray-400`}
              placeholder="e.g. 40"
            />
          </div>

          {/* Input: Absents */}
          <div>
            <label className={`block text-sm font-semibold italic mb-1 ${
              darkMode ? 'text-purple-300' : 'text-purple-700'
            }`}>
              ❌ Absents
            </label>
            <input
              type="number"
              min="0"
              value={absents !== null ? absents : ''}
              onChange={(e) => setAbsents(e.target.value === '' ? null : Number(e.target.value))}
              className={`w-full px-4 py-3 rounded-xl border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500' 
                  : 'bg-white border-gray-300 focus:ring-purple-400'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm placeholder:text-gray-400`}
              placeholder="e.g. 6"
            />
          </div>

          {/* Custom Threshold Slider */}
          <div>
            <label className={`block text-sm font-semibold italic mb-1 ${
              darkMode ? 'text-purple-300' : 'text-purple-700'
            }`}>
              🎯 Attendance Threshold: <span className="font-bold">{threshold}%</span>
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                darkMode ? 'bg-gray-600' : 'bg-purple-200'
              }`}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>50%</span>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>75%</span>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>100%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className={`flex-1 font-semibold py-3 rounded-xl transition-all shadow-md active:scale-95 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-purple-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-purple-700'
              }`}
            >
              🔄 Reset
            </button>
          </div>

          {/* Test Cases Section */}
          <div className={`mt-2 p-3 rounded-xl ${
            darkMode ? 'bg-gray-700' : 'bg-purple-50'
          }`}>
            <p className={`text-sm font-medium mb-2 ${
              darkMode ? 'text-purple-300' : 'text-purple-700'
            }`}>🧪 Test Cases:</p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => runTestCase('perfect')}
                className={`text-xs px-3 py-1 rounded-lg ${
                  darkMode 
                    ? 'bg-green-800 hover:bg-green-700 text-white' 
                    : 'bg-green-100 hover:bg-green-200 text-green-800'
                }`}
              >
                Perfect (100%)
              </button>
              <button 
                onClick={() => runTestCase('critical')}
                className={`text-xs px-3 py-1 rounded-lg ${
                  darkMode 
                    ? 'bg-yellow-800 hover:bg-yellow-700 text-white' 
                    : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                }`}
              >
                Critical (75%)
              </button>
              <button 
                onClick={() => runTestCase('failing')}
                className={`text-xs px-3 py-1 rounded-lg ${
                  darkMode 
                    ? 'bg-red-800 hover:bg-red-700 text-white' 
                    : 'bg-red-100 hover:bg-red-200 text-red-800'
                }`}
              >
                Failing (62%)
              </button>
              <button 
                onClick={() => runTestCase('zero')}
                className={`text-xs px-3 py-1 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                No Classes
              </button>
            </div>
          </div>

          {/* Results - Much Bigger Box with Fun Message */}
          {bunks !== null && currentAttendance !== null && (
            <div className={`mt-6 p-8 rounded-2xl ${
              darkMode 
                ? 'bg-gray-700/50 border border-purple-600' 
                : 'bg-purple-50 border border-purple-200'
              } shadow-lg animate-fade-in transition-all duration-300`}>
              
              {/* Current Attendance */}
              <div className="text-center mb-6">
                <p className={`text-xl font-medium italic ${
                  darkMode ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  📊 Your current attendance is
                </p>
                <p className={`text-5xl font-bold mt-2 ${
                  parseFloat(currentAttendance) >= threshold 
                    ? (darkMode ? 'text-green-400' : 'text-green-600') 
                    : (darkMode ? 'text-red-400' : 'text-red-600')
                }`}>
                  {currentAttendance}%
                </p>
              </div>
              
              {/* Bunks or Required Classes */}
              <div className="text-center my-6">
                {parseFloat(currentAttendance) >= threshold ? (
                  <div>
                    <p className={`text-xl font-medium italic ${
                      darkMode ? 'text-green-300' : 'text-green-600'
                    }`}>
                      ✅ You can bunk
                    </p>
                    <p className="text-4xl font-bold mt-2">
                      {bunks} <span className="text-2xl">more classes</span>
                    </p>
                    <p className={`text-lg font-medium italic mt-1 ${
                      darkMode ? 'text-green-300' : 'text-green-600'
                    }`}>
                      and still stay above {threshold}%
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className={`text-xl font-medium italic ${
                      darkMode ? 'text-red-300' : 'text-red-600'
                    }`}>
                      ⚠️ You need to attend at least
                    </p>
                    <p className="text-4xl font-bold mt-2">
                      {requiredClasses} <span className="text-2xl">more classes</span>
                    </p>
                    <p className={`text-lg font-medium italic mt-1 ${
                      darkMode ? 'text-red-300' : 'text-red-600'
                    }`}>
                      to reach {threshold}%
                    </p>
                  </div>
                )}
              </div>
              
              {/* Fun Message */}
              <div className={`mt-6 pt-4 border-t ${
                darkMode ? 'border-gray-600' : 'border-purple-200'
              }`}>
                <p className={`text-xl font-bold italic text-center ${
                  darkMode ? 'text-yellow-300' : 'text-yellow-600'
                }`}>
                  {funMessage} 😎
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;