import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, easeInOut } from 'framer-motion'
import axios from 'axios'
import CyberBackground from './CyberBackground'
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
      const res = await axios.get('http://localhost:8080/api/auth/user')
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

      <CyberBackground/>
      
      <AnimatePresence>
        {signUp && (
            <motion.form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className='h-[72vh] w-[70vw] bg-black bg-opacity-50 rounded-3xl absolute flex items-center flex-col'
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
            className='h-[72vh] w-[70vw] bg-black bg-opacity-50 rounded-3xl absolute flex items-center flex-col justify-center z-10'
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            exit={{ x: '100vw' }}
            transition={{ duration: 1, type: 'spring', ease: easeInOut }}
          >
            <div className='w-[42vw]'>
              <h1 className='text-3xl font-bold'>Welcome Again..!</h1>
            </div>

            <div className='w-[42vw]'>
              <h1 className='font-semibold text-xl'>Email</h1>
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
              <h1 className='font-semibold text-3xl'>Password</h1>
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
          className="bg-black/90 w-[30vw] h-[20vw] z-20 absolute rounded-2xl flex flex-col justify-center items-center shadow-xl border border-gray-700"
          initial={{ y: "-100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100vh", opacity: 0 }}
          transition={{ duration: 0.7, type: "spring", ease: easeInOut }}
        >
          <p className="text-2xl text-red-500 font-semibold font-mono mb-1">
            ❌ Invalid Username
          </p>
          <p className="text-xl text-gray-300 font-semibold font-mono">OR</p>
          <p className="text-2xl text-red-500 font-semibold font-mono mt-1">
            ❌ Invalid Password
          </p>
        
          <motion.button
            className="bg-gradient-to-r from-red-500 to-red-700 text-white w-[10vw] h-[4vw] rounded-3xl mt-[1vh] shadow-lg font-semibold tracking-wide hover:shadow-red-500"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ rotate: 5, scale: 1 }}
            transition={{ duration: 0.2, ease: easeInOut }}
            onClick={() => setInvalid(false)}
          >
            OK
          </motion.button>
        </motion.div>
        

          }
      </AnimatePresence>

    </div>
  )
}

export default Signup