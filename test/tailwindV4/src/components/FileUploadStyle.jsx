import React from 'react'

const FileUploadStyle = () => {
    return (
        <div>
            <label htmlFor="" className='my-4 block'>
                <input type="file" name="file" id="file" className='block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100' />
            </label>
        </div>
    )
}

export default FileUploadStyle
