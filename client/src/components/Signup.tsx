import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, easeInOut } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const [signUp, setSignUp] = useState(true)
  const [login, setLogin] = useState(false)
  const [verifyPass, setVerifyPass] = useState('')
  const [verifyEmail, setVerifyEmail] = useState('')
  const [invalid, setInvalid] = useState(false)
  const [newUser, setNewUser] = useState({
    first_name: '',
    second_name: '',
    Email: '',
    Password: '',
  })

  const navigate=useNavigate()

  const FetchD = async () => {
    try {
      const res = await axios.get('http://localhost:3001/users')
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const PostD = async () => {
    try {
      const res = await axios.post('http://localhost:3001/users', newUser)
      console.log('POSTED')
      FetchD()
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser((prevD) => ({ ...prevD, [e.target.name]: e.target.value }))
  }
  
  
  useEffect(() => {
    FetchD()
  }, [])

  const SignTrueLogFalse = () => {
    setSignUp(true)
    setLogin(false)
  }

  const LogTrueSignFalse = () => {
    setLogin(true)
    setSignUp(false)
  }

  const handleSubmit=()=>{
      PostD()
      setSignUp(false)
      setLogin(true)
  }

  const PassThrough = async () => {
    try {
      const res = await axios.get('http://localhost:3001/users');
      const foundUser = res.data.find((val: any) => val.Email === verifyEmail);
      const foundPass = res.data.find((val: any) => val.Password === verifyPass);
  
      if (foundUser&&foundPass) {
        console.log("Email found:", foundUser);
        navigate('/home');
      } else {
        setInvalid(true)
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  

  return (
    <div className='h-screen w-screen flex justify-center bg-zinc-800 items-center'>
      <motion.img
        className='h-screen w-screen blur-md'
        src='https://thumbs.dreamstime.com/b/d-render-abstract-cosmic-neon-background-glowing-laser-ring-rocks-under-starry-night-sky-reflection-water-216712620.jpg'
        alt=''
      />
      <AnimatePresence>
        {signUp && (
            <motion.form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className='h-[72vh] w-[70vw] bg-white bg-opacity-20 rounded-3xl absolute flex items-center flex-col'
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            exit={{ x: '100vw' }}
            transition={{ duration: 1, type: 'spring', ease: easeInOut }}
            >
            <div className='w-[42vw]'>
              <h1 className='text-3xl font-bold'>Create an Account</h1>
            </div>

            <div className='flex'>
              <div className='flex flex-col'>
              <h1 className='ml-3 mt-4'>First name</h1>
              <input
                value={newUser.first_name}
                name='first_name'
                placeholder='Iyami'
                type='text'
                className=' placeholder-sky-200 text-white outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[20vw] m-3'
                onChange={handleChange}
              />
              </div>
              <div className='flex flex-col'>
              <h1 className='ml-3 mt-4'>Last name</h1>
              <input
                value={newUser.second_name}
                name='second_name'
                placeholder='Iyami'
                type='text'
                className=' placeholder-sky-200 text-white outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[20vw] m-3'
                onChange={handleChange}
              />
              </div>
            </div>

            <div className='w-[42vw]'>
              <h1 className='font-semibold'>Email</h1>
            </div>
            <input
              value={newUser.Email}
              name='Email'
              placeholder='amogus@gmail.com'
              type='email'
              className=' placeholder-sky-200 outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[42vw] m-1'
              onChange={handleChange}
              required
            />
            <div className='w-[42vw]'>
              <h1 className='font-semibold'>Password</h1>
            </div>
            <input
              value={newUser.Password}
              name='Password'
              placeholder='78J$xxxy2'
              type='password'
              className=' placeholder-sky-200 outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[42vw] m-1'
              onChange={handleChange}
            />
            <div className='w-[42vw]'>
              <h1 className='font-semibold'>Confirm Password</h1>
            </div>
            <input
              name='Confirm_password'
              placeholder='78J$xxxy2'
              type='password'
              className=' placeholder-sky-200 outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[42vw] m-1'
            />

            <motion.button
              type='submit'
              className='bg-blue-700 w-[42vw] rounded-xl h-[6vh] text-lg font-semibold m-1'
              initial={{ opacity: 1, scale: 0.7 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              Sign up
            </motion.button>
            <motion.button
              className='bg-zinc-700 w-[42vw] rounded-xl h-[6vh] text-lg font-semibold m-1'
              initial={{ opacity: 1, scale: 0.7 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={LogTrueSignFalse}
            >
              Already have an account
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {login && (
          <motion.form
          onSubmit={(e) => { e.preventDefault();}}
            className='h-[72vh] w-[70vw] bg-white bg-opacity-20 rounded-3xl absolute flex items-center flex-col justify-center z-10'
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            exit={{ x: '100vw' }}
            transition={{ duration: 1, type: 'spring', ease: easeInOut }}
          >
            <div className='w-[42vw]'>
              <h1 className='text-3xl font-bold'>Welcome Again..!</h1>
            </div>

            <div className='w-[42vw]'>
              <h1 className='font-semibold'>Email</h1>
            </div>
            <input
              required
              value={verifyEmail}
              onChange={(e)=>{setVerifyEmail(e.target.value)}}
              placeholder='amogus@gmail.com'
              type='text'
              className=' placeholder-sky-200 outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[42vw] m-1'
            />
            <div className='w-[42vw]'>
              <h1 className='font-semibold'>Password</h1>
            </div>
            <input
              required
              value={verifyPass}
              onChange={(e)=>{setVerifyPass(e.target.value)}}
              placeholder='78J$xxxy2'
              type='password'
              className=' placeholder-sky-200 outline-none p-2 border-[1px] border-white bg-transparent rounded h-[6vh] w-[42vw] m-1'
            />

            <motion.button
              type='submit'
              className='bg-blue-700 w-[42vw] rounded-xl h-[6vh] text-lg font-semibold m-1'
              initial={{ opacity: 1, scale: 0.7 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={PassThrough}
            >
              Log in
            </motion.button>
            <motion.button
              className='bg-zinc-700 w-[42vw] rounded-xl h-[6vh] text-lg font-semibold m-1'
              initial={{ opacity: 1, scale: 0.7 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={SignTrueLogFalse}
            >
              Never had an account ?
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
          {invalid &&
          <motion.div 
          className='bg-black w-[30vw] h-[20vw] z-20 absolute rounded-2xl flex justify-center items-center flex-col'
          initial={{y:"-100vh"}}
          animate={{y:0}}
          exit={{y:"-100vh"}}
          transition={{duration:0.7,type:'spring',ease:easeInOut}}
          >
            <p className=' text-2xl text-red-500 font-semibold font-mono'>Invalid Username ❌</p>
            <p className=' text-2xl text-red-500 font-semibold font-mono'>OR</p>
            <p className=' text-2xl text-red-500 font-semibold font-mono'>Invalid Password ❌</p>
            <motion.button
            className='bg-red-400 w-[10vw] h-[5vw] rounded-3xl mt-[1vh]'
            initial={{scale:1}}
            whileHover={{scale:1.2}}
            whileTap={{rotate:5,scale:1}}
            transition={{duration:0.2,ease:easeInOut}}
             onClick={()=>{setInvalid(false)}}>OK</motion.button>
          </motion.div>

          }
      </AnimatePresence>

    </div>
  )
}

export default Signup