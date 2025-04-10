
import './App.css'
import React from 'react'
import { motion } from "motion/react"

const App = () => {
  const box = {
    width: 100,
    height: 100,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  }
  return (
    <div className='flex justify-center items-center bg-gray-700 h-[100vh] w-[100vw] text-4xl'>
      Hello
    </div >
  )
}

export default App
