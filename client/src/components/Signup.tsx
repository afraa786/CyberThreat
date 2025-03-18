import React,{useState} from 'react'
import {motion,AnimatePresence, easeInOut} from 'framer-motion'
import { TerminalIcon } from 'lucide-react'
import { set } from 'date-fns'
const Signup = () => {

  const [singnUP, setSingnUP] = useState(true)
  const [login, setLogin] = useState(false)

  const SignTrueLogFalse=()=>{
  setSingnUP(true);
  setLogin(false);}

  const LogTrueSignFalse=()=>{
    setLogin(true);
    setSingnUP(false)
  }

  return (
    <div className='h-screen w-screen flex justify-center bg-zinc-800 items-center'>
        <motion.img className='h-screen w-screen blur-md' src="https://thumbs.dreamstime.com/b/d-render-abstract-cosmic-neon-background-glowing-laser-ring-rocks-under-starry-night-sky-reflection-water-216712620.jpg" alt="" 
        /> 
        <AnimatePresence>{
          singnUP &&
        <motion.div className='h-[72vh] w-[70vw] bg-white bg-opacity-20 rounded-3xl absolute flex items-center flex-col'
        initial={{x:"-100vw"}}
        animate={{x:0}}
        exit={{x:"100vw"}}
        transition={{duration:1,type:"spring",ease:easeInOut}}
        >
          
          <div className='w-[42vw]'>
            <h1 className='text-3xl font-bold'>Create an Account</h1>
          </div>

          <div className='flex'>
            <div className='flex flex-col'>
              <h1 className='ml-3 mt-4'>First name</h1>
          <input placeholder='Iyami' type="text" className=' placeholder-sky-200 text-white outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[20vw] m-3' />
            </div>
            <div className='flex flex-col'>
              <h1 className='ml-3 mt-4'>Last name</h1>
          <input placeholder='Iyami' type="text" className=' placeholder-sky-200 text-white outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[20vw] m-3' />
            </div>
          </div>

          <div className='w-[42vw]'>
            <h1 className='font-semibold'>Email</h1>
          </div>
          <input placeholder='amogus@gmail.com' type="text" className=' placeholder-sky-200 outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[42vw] m-1' />
          <div className='w-[42vw]'>
            <h1 className='font-semibold'>Password</h1>
          </div>
          <input placeholder='78J$xxxy2' type="text" className=' placeholder-sky-200 outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[42vw] m-1' />
          <div className='w-[42vw]'>
            <h1 className='font-semibold'>Confirm Password</h1>
          </div>
          <input placeholder='78J$xxxy2' type="text" className=' placeholder-sky-200 outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[42vw] m-1' />

          <motion.button className='bg-blue-700 w-[42vw] rounded-xl h-[6vh] text-lg font-semibold m-1'
          initial={{opacity:1, scale:0.7}}
          whileHover={{scale:1.1}}
          whileTap={{scale:0.9}}
          animate={{opacity:1,scale:1}}
          transition={{duration:0.2}}
          >Sign up</motion.button>
                    <motion.button className='bg-zinc-700 w-[42vw] rounded-xl h-[6vh] text-lg font-semibold m-1'
          initial={{opacity:1, scale:0.7}}
          whileHover={{scale:1.1}}
          whileTap={{scale:0.9}}
          animate={{opacity:1,scale:1}}
          transition={{duration:0.2}}
          onClick={LogTrueSignFalse}
          >Already have an account</motion.button>
        </motion.div>}
        </AnimatePresence>

        <AnimatePresence>
        {
          login &&
          <motion.div className='h-[72vh] w-[70vw] bg-white bg-opacity-20 rounded-3xl absolute flex items-center flex-col justify-center'
        initial={{x:"-100vw"}}
        animate={{x:0}}
        exit={{x:"100vw"}}
        transition={{duration:1,type:"spring",ease:easeInOut}}
        >
          
          <div className='w-[42vw]'>
            <h1 className='text-3xl font-bold'>Welcome Again..!</h1>
          </div>

         

          <div className='w-[42vw]'>
            <h1 className='font-semibold'>Email</h1>
          </div>
          <input placeholder='amogus@gmail.com' type="text" className=' placeholder-sky-200 outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[42vw] m-1' />
          <div className='w-[42vw]'>
            <h1 className='font-semibold'>Password</h1>
          </div>
          <input placeholder='78J$xxxy2' type="text" className=' placeholder-sky-200 outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[42vw] m-1' />

          <motion.button className='bg-blue-700 w-[42vw] rounded-xl h-[6vh] text-lg font-semibold m-1'
          initial={{opacity:1, scale:0.7}}
          whileHover={{scale:1.1}}
          whileTap={{scale:0.9}}
          animate={{opacity:1,scale:1}}
          transition={{duration:0.2}}
          >Log in</motion.button>
                    <motion.button className='bg-zinc-700 w-[42vw] rounded-xl h-[6vh] text-lg font-semibold m-1'
          initial={{opacity:1, scale:0.7}}
          whileHover={{scale:1.1}}
          whileTap={{scale:0.9}}
          animate={{opacity:1,scale:1}}
          transition={{duration:0.2}}
          onClick={SignTrueLogFalse}
          >Already have an account</motion.button>
        </motion.div>}
        </AnimatePresence>

        
        
    </div>
  )
}

export default Signup