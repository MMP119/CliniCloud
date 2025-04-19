import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center text-gray-800 font-sans">
      <div className="flex gap-8 mb-6">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="w-20 hover:scale-110 transition-transform duration-300" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="w-20 hover:scale-110 transition-transform duration-300" alt="React logo" />
        </a>
      </div>

      <h1 className="text-5xl font-extrabold mb-4">Vite + React + Tailwind</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-600">
          Edit <code className="bg-gray-100 px-1 py-0.5 rounded">src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
