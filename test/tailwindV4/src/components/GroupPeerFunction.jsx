import React from 'react'

const GroupPeerFunction = () => {
    return (
        <div className=''>
            <div className="grid justify-center h-[100vh]">
                <div>
                    <div className="peer group h-40 w-40 grid place-content-center gap-2 bg-blue-500">
                        <div className="group-hover:bg-red-400 h-10 w-10 bg-black"></div>
                        <div className="group-hover:bg-green-400 h-10 w-10 bg-black"></div>
                    </div>
                    <div className="h-20 w-20 bg-accent peer-hover:bg-orange-400"></div>
                </div>
                <div className="">
                    <div className="peer/tanvir group h-40 w-40 grid place-content-center gap-2 bg-blue-500">
                        <div className="group-hover:bg-red-400 h-10 w-10 bg-black"></div>
                        <div className="group-hover:bg-green-400 h-10 w-10 bg-black"></div>
                    </div>
                    <div className="h-20 w-20 bg-accent peer-hover/tanvir:bg-orange-400"></div>
                </div>
            </div>
            <div className="text-center text-4xl">Peering with different names </div>
            <div className="grid justify-center h-[100vh]">
                <div className="">
                    <div className="peer/tanvir group h-40 w-40 grid place-content-center gap-2 bg-blue-500">
                        <div className="group-hover:bg-red-400 h-10 w-10 bg-black"></div>
                        <div className="group-hover:bg-green-400 h-10 w-10 bg-black"></div>
                    </div>
                    <div className="h-20 w-20 bg-accent peer-hover/tanvir:bg-orange-400"></div>
                </div>
                <div className="">
                    <div className="peer/rahim group h-40 w-40 grid place-content-center gap-2 bg-blue-500">
                        <div className="group-hover:bg-red-400 h-10 w-10 bg-black"></div>
                        <div className="group-hover:bg-green-400 h-10 w-10 bg-black"></div>
                    </div>
                    <div className="h-20 w-20 bg-accent peer-hover/rahim:bg-orange-400"></div>
                </div>
            </div>
        </div>
    )
}

export default GroupPeerFunction
