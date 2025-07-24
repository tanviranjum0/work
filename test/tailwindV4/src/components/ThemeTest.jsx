import React from 'react'

const ThemeTest = () => {
    return (
        <div className='flex  justify-center'>
            <ul className='grid gap-5'>
                <li className="text-main text-primary">Primary </li>
                <li className="text-main text-secondary">Secondary</li>
                <li className="text-main text-accent">Accent</li>
                <li className="text-main text-text">Text</li>
            </ul>
        </div>
    )
}

export default ThemeTest
