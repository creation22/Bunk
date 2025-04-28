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
    const attended = classes - absents;
    const currentPercent = classes > 0 ? ((attended / classes) * 100).toFixed(2) : 0;
    
    // Set fun message based on attendance
    const message = getFunMessage(parseFloat(currentPercent));
    setFunMessage(message);

    let futureBunks = 0;
    while (true) {
      const newTotal = classes + futureBunks;
      const newAbsent = absents + futureBunks;
      const newAttendance = ((newTotal - newAbsent) / newTotal) * 100;
      if (newAttendance < thresholdValue) break;
      futureBunks++;
    }

    let neededClasses = 0;
    if (currentPercent < thresholdValue) {
      while (true) {
        const newTotal = classes + neededClasses;
        const newAttendance = ((attended + neededClasses) / newTotal) * 100;
        if (newAttendance >= thresholdValue) break;
        neededClasses++;
      }
    }

    return {
      maxBunks: futureBunks - 1,
      currentPercent,
      neededClasses: currentPercent < thresholdValue ? neededClasses : 0
    };
  };

  const handleCalculate = () => {
    if (classes === null || absents === null || classes < absents) {
      alert("⚠️ Please enter valid class and absence values.");
      return;
    }

    const result = calculateStats(classes, absents, threshold);
    setBunks(result.maxBunks);
    setCurrentAttendance(result.currentPercent);
    setRequiredClasses(result.neededClasses);
  };

  const handleReset = () => {
    setClasses(null);
    setAbsents(null);
    setBunks(null);
    setCurrentAttendance(null);
    setRequiredClasses(null);
    setFunMessage("");
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
              value={classes || ''}
              onChange={(e) => setClasses(Number(e.target.value))}
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
              value={absents || ''}
              onChange={(e) => setAbsents(Number(e.target.value))}
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

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className={`flex-1 font-semibold py-3 rounded-xl transition-all shadow-md active:scale-95 ${
                darkMode 
                  ? 'bg-purple-600 hover:bg-purple-500 text-white' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              🔍 Calculate
            </button>
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

          {/* Results - Much Bigger Box with Fun Message */}
          {bunks !== null && (
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
                  currentAttendance >= threshold 
                    ? (darkMode ? 'text-green-400' : 'text-green-600') 
                    : (darkMode ? 'text-red-400' : 'text-red-600')
                }`}>
                  {currentAttendance}%
                </p>
              </div>
              
              {/* Bunks or Required Classes */}
              <div className="text-center my-6">
                {currentAttendance >= threshold ? (
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