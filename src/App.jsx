import { useState } from 'react'
import './App.css'

function App() {
  const [classes, setClasses] = useState(null)
  const [absents, setAbsents] = useState(null)
  const [bunks, setBunks] = useState(null)

  const calculateMaxBunks = (classes, absents, threshold = 75) => {
    let futureBunks = 0;

    while (true) {
      const newTotal = classes + futureBunks;
      const newAbsent = absents + futureBunks;
      const attendance = ((newTotal - newAbsent) / newTotal) * 100;

      if (attendance < threshold) break;

      futureBunks++;
    }

    return futureBunks - 1;
  }

  const handleCalculate = () => {
    const result = calculateMaxBunks(classes, absents);
    setBunks(result);
  }

  return (
    <div className="min-h-screen bg-[#fefbe9] flex flex-col items-center justify-center px-4">
      <div className="bg-[#fdf6e3] p-6 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#5c5c5c] text-center mb-6">Bunk Buddy 💤</h1>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-[#5c5c5c] font-medium">Total Classes:</label>
            <input
              type="number"
              value={classes}
              onChange={(e) => setClasses(Number(e.target.value))}
              className="w-full p-2 rounded-xl border border-[#d6d6d6] bg-white text-[#3e3e3e]"
              placeholder="Enter total number of classes"
            />
          </div>
          <div>
            <label className="block mb-1 text-[#5c5c5c] font-medium">Absents:</label>
            <input
              type="number"
              value={absents}
              onChange={(e) => setAbsents(Number(e.target.value))}
              className="w-full p-2 rounded-xl border border-[#d6d6d6] bg-white text-[#3e3e3e]"
              placeholder="Enter number of absents"
            />
          </div>
          <button
            onClick={handleCalculate}
            className="mt-2 bg-[#d6a76c] hover:bg-[#c1946c] text-white font-semibold py-2 rounded-xl transition-all"
          >
            Calculate
          </button>
          <div className="mt-4 text-center text-[#5c5c5c] text-lg">
            You can bunk <span className="font-bold">{bunks}</span> more classes and still stay above 75%
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
