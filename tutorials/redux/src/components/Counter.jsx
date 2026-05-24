
import Count from './Count'
import { useState } from 'react'
const Counter = ({ count, onIncrement, onDecrement }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="m-10 border-2 text-center flex flex-col items-center justify-center w-full">  <Count count={count} /></div>
            <div className="flex justify-center w-full text-xl mx-10">
                <button className="p-4 rounded cursor-pointer mx-3 bg-green-400" onClick={onIncrement}>Increment</button>
                <button className="p-4 rounded cursor-pointer mx-3 bg-red-400" onClick={onDecrement}>Decrement</button>
            </div>
        </div>
    )
}

export default Counter
