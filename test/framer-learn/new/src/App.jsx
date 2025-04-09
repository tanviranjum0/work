
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
      {/* <motion.div 
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ originX: 0.5 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >Hello</motion.div> */}
      <motion.div
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 180, -180, 0],
          borderRadius: ["0%", "0%", "50%", "50%", "0%"],
        }}
        transition={{
          duration: 2,
          ease: "linear",
          times: [0, 2, 5, 8, 10],
          repeat: Infinity,
          repeatDelay: 1,
        }}
        style={box}
      />
    </div >
  )
}

export default App
