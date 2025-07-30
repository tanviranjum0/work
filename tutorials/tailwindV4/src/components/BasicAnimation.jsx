import loadingIcon1 from '../assets/loadingIcon1.png'
import loadingIconblack from '../assets/loadingIcon1-black.png'
import loadingIcon2 from '../assets/loadingIcon2.png';
import loadingIcon2black from '../assets/loadingIcon2-black.png';
import loadingIcon3 from '../assets/loadingIcon3.png';
import loadingIcon3black from '../assets/loadingIcon3-black.png';

const BasicAnimation = () => {
    return (
        <div className=" bg-amber-500">
            <div className="flex">
                <div className="text-4xl  p-10">Basic Loader Symbol</div>
                <div className="animate-spin text-6xl">↻</div>
            </div>
            <div className="flex">
                <div className="text-center  p-10 text-4xl">Loader Icons 1</div>
                <div className="h-20 animate-spin w-20">
                    <img src={loadingIcon1} alt="" className='h-full   w-full' />
                </div>
                <div className="h-20 animate-spin  w-20">
                    <img src={loadingIconblack} alt="" className='h-full   w-full' />
                </div>

            </div>
            <div className="flex">
                <div className="text-center text-4xl p-10">Loader Icons 2</div>
                <div className="h-20 animate-spin  w-20">
                    <img src={loadingIcon2black} alt="" className='h-full   w-full' />

                </div>
                <div className="h-20 animate-spin  w-20">
                    <img src={loadingIcon2} alt="" className='h-full   w-full' />
                </div>
            </div>
            <div className="flex">
                <div className="text-center text-4xl p-10">Loader Icons 3</div>
                <div className="h-20 animate-spin  w-20">
                    <img src={loadingIcon3black} alt="" className='h-full   w-full' />

                </div>
                <div className="h-20 animate-spin  w-20">
                    <img src={loadingIcon3} alt="" className='h-full   w-full' />
                </div>
            </div>
            <div className="text-4xl text-cente">Other Animations</div>
            <div className="flex h-32 gap-20">
                <div className="animate-ping font-bold text-2xl">Like</div>
                <div className="animate-bounce font-bold text-2xl">Comment</div>
                <div className="animate-pulse font-bold text-2xl">Share</div>
            </div>
        </div>

    )
}

export default BasicAnimation
