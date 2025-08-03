import { useEffect } from "react";

const DarkMode = () => {

    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.getElementById('main').classList.add('dark');
            localStorage.setItem('theme', 'dark')
        } else {
            document.getElementById('main').classList.remove('dark');
            localStorage.setItem('theme', 'light')
        }

    }, [])

    const handleThemeChange = (event) => {
        event.preventDefault();
        const selectedTheme = event.target.value;
        if (selectedTheme === 'dark') {
            document.getElementById('main').classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else if (selectedTheme === 'light') {
            document.getElementById('main').classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.getElementById('main').classList.add('dark');
                localStorage.setItem('theme', 'dark')
            } else {
                document.getElementById('main').classList.remove('dark');
                localStorage.setItem('theme', 'light')
            }
        }
    };

    return (
        <div id='main' className="dark">
            <div className="flex flex-col items-center justify-center h-screen">
                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 ">Select theme</label>
                <select defaultValue="system" onChange={handleThemeChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="theme" id="new">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                </select>
                <div className="border-2 w-80 h-80 bg-orange-500 dark:bg-gray-200 text-2xl text-center">Hello</div>
            </div>
        </div >
    )
}

export default DarkMode
