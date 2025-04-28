import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [classes, setClasses] = useState(null);
  const [absents, setAbsents] = useState(null);
  const [bunks, setBunks] = useState(null);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [requiredClasses, setRequiredClasses] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Check system preference for dark mode on load
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const calculateStats = (classes, absents, threshold = 75) => {
    const attended = classes - absents;
    const currentPercent = classes > 0 ? ((attended / classes) * 100).toFixed(2) : 0;

    let futureBunks = 0;
    while (true) {
      const newTotal = classes + futureBunks;
      const newAbsent = absents + futureBunks;
      const newAttendance = ((newTotal - newAbsent) / newTotal) * 100;
      if (newAttendance < threshold) break;
      futureBunks++;
    }

    let neededClasses = 0;
    if (currentPercent < threshold) {
      while (true) {
        const newTotal = classes + neededClasses;
        const newAttendance = ((attended + neededClasses) / newTotal) * 100;
        if (newAttendance >= threshold) break;
        neededClasses++;
      }
    }

    return {
      maxBunks: futureBunks - 1,
      currentPercent,
      neededClasses: currentPercent < threshold ? neededClasses : 0
    };
  };

  const handleCalculate = () => {
    if (classes === null || absents === null || classes < absents) {
      alert("⚠️ Please enter valid class and absence values.");
      return;
    }

    const result = calculateStats(classes, absents);
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
        } backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full border transition-all duration-300`}>
        
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

          {/* Results - Bigger Box */}
          {bunks !== null && (
            <div className={`mt-6 p-6 rounded-2xl ${
              darkMode 
                ? 'bg-gray-700/50 border border-purple-600' 
                : 'bg-purple-50 border border-purple-200'
              } shadow-lg animate-fade-in transition-all duration-300`}>
              <div className="text-center space-y-4">
                <p className={`text-xl font-medium italic ${
                  darkMode ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  📊 Your current attendance is <span className="font-bold text-2xl">{currentAttendance}%</span>
                </p>
                
                {currentAttendance >= 75 ? (
                  <p className={`text-xl font-medium italic ${
                    darkMode ? 'text-green-300' : 'text-green-600'
                  }`}>
                    ✅ You can bunk <span className="font-bold text-2xl">{bunks}</span> more classes and still stay above 75%.
                  </p>
                ) : (
                  <p className={`text-xl font-medium italic ${
                    darkMode ? 'text-red-300' : 'text-red-600'
                  }`}>
                    ⚠️ You need to attend at least <span className="font-bold text-2xl">{requiredClasses}</span> more classes to reach 75%.
                  </p>
                )}
                
                <div className={`mt-4 pt-4 border-t ${
                  darkMode ? 'border-gray-600' : 'border-purple-200'
                }`}>
                  <p className={`text-sm italic ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Keep track of your attendance to stay on target!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;