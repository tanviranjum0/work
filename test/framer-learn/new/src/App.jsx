
import './App.css'
import React from 'react'
import { motion } from "motion/react"

const App = () => {

  return (
    <motion.div
      initial={{
        scale: 0,
        // borderRadius: "50%",
      }}
      animate={{
        scale: 1,
        // borderRadius: 0,
        x: [null, 100, 0]
      }}
      transition={{
        duration: 2,
      }}
      className='flex justify-center text-white items-center bg-gray-700 h-[100vh] w-[100vw] text-4xl' >
      Hello
    </motion.div>
  )
}

export default App
