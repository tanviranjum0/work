import { useCallback, useEffect } from 'react'

const DarkMode = () => {


    return (
        <div id='main'>
            <div className="flex items-center justify-center h-screen">
                <select name="theme" id="new">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                </select>
                <div className="border-2 w-80 h-80 bg-orange-500 dark:bg-gray-200 text-2xl text-center">Hello</div>
            </div>
        </div>
    )
}

export default DarkMode
