import { useState } from 'react';
import './App.css';

function App() {
  const [classes, setClasses] = useState(null);
  const [absents, setAbsents] = useState(null);
  const [bunks, setBunks] = useState(null);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [requiredClasses, setRequiredClasses] = useState(null);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100 px-4 py-10">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full border border-yellow-200 transition-all duration-300">
        <h1 className="text-4xl font-extrabold text-center text-amber-700 mb-6 drop-shadow-md tracking-tight">
          Bunk Buddy 💤
        </h1>

        <div className="flex flex-col gap-5">
          {/* Input: Total Classes */}
          <div>
            <label className="block text-sm font-semibold text-amber-800 mb-1">📚 Total Classes</label>
            <input
              type="number"
              min="0"
              value={classes || ''}
              onChange={(e) => setClasses(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all bg-white shadow-sm placeholder:text-gray-400"
              placeholder="e.g. 40"
            />
          </div>

          {/* Input: Absents */}
          <div>
            <label className="block text-sm font-semibold text-amber-800 mb-1">❌ Absents</label>
            <input
              type="number"
              min="0"
              value={absents || ''}
              onChange={(e) => setAbsents(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all bg-white shadow-sm placeholder:text-gray-400"
              placeholder="e.g. 6"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              🔍 Calculate
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-amber-700 font-semibold py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              🔄 Reset
            </button>
          </div>

          {/* Results */}
          {bunks !== null && (
            <div className="mt-4 text-center text-amber-800 text-lg font-medium space-y-2 animate-fade-in">
              <p>
                📊 Your current attendance is <span className="font-bold text-amber-700">{currentAttendance}%</span>
              </p>
              {currentAttendance >= 75 ? (
                <p>
                  ✅ You can bunk <span className="font-bold text-green-600">{bunks}</span> more classes and still stay above 75%.
                </p>
              ) : (
                <p>
                  ⚠️ You need to attend at least <span className="font-bold text-red-600">{requiredClasses}</span> more classes to reach 75%.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
