import { motion, AnimatePresence, color } from "framer-motion";
import { ChangeEvent, useState } from "react";
import ParticlesComponent from "./Particles";
import './ThreatReportApp.css';
import Page from '../lib/Image/page.png'
import Calender from '../lib/Image/schedule.png'
import Hack from '../lib/Image/scam.png'
import Media from '../lib/Image/bullhorn.png'
import Write from '../lib/Image/write.png'
import Delay from '../lib/Image/expired.png'
import Location from '../lib/Image/Location.png'
import Evidence from '../lib/Image/fingerprint.png'
import Step from '../lib/Image/milestones.png'

interface Option {
  value: string;
  label: string;
}

function ThreatReport() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<number | string>("");

  const items = [
    { id: 1, message:"Threat Details",img:Page,color:"bg-pink-100" },
    { id: 2, message:"Threat Date",img:Calender,color:"bg-yellow-300" },
    { id: 3, message:"Select Threat Type",img:Hack,color:"bg-sky-300"  },
    { id: 4,  message:"IncidentLocation",img:Media,color:"bg-lime-100"  },
    { id: 5,  message:"More information",img:Write,color:"bg-lime-500"  },
    { id: 6,  message:"Reason for delay",img:Delay,color:"bg-purple-300"  },
    { id: 7,  message:"Location URL",img:Location,color:"bg-yellow-300"  },
    { id: 8,  message:"Add Evidence",img:Evidence,color:"bg-blue-300"  },
    { id: 9,  message:"Your first step?",img:Step,color:"bg-pink-100"  },
  ];


  const locationOptions: Option[] = [
    { value: "youtube", label: "YouTube" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter/X" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "facebook", label: "Facebook" },
    { value: "tiktok", label: "TikTok" },
    { value: "snapchat", label: "SnapChat" },
    { value: "other-online", label: "Other Online Platform" },
    { value: "offline", label: "Offline Pamphlet" },
    { value: "other", label: "Other" },
  ];

  const threatOptions = [
    "Phishing",
    "Malware",
    "Ransomware",
    "Social Engineering",
    "DDoS Attack",
    "Other",
  ];

  return (
    <div className="flex flex-wrap  h-screen w-screen justify-between ">
      <ParticlesComponent id="particle"></ParticlesComponent>
      <h1 className="w-screen bg-white bg-opacity-10 backdrop-blur-md p-4 h-[13vh]  brightness-150 font-bold text-sky-300  text-3xl">Cyber Threat Report</h1>
      <div className="flex flex-wrap justify-between px-5">
      {items.map((item) => (
        <motion.div
          key={item.id}
          layoutId={String(item.id || "default")}
          className={`w-[25vw] h-[30vh] rounded-xl cursor-pointer bg-zinc-800 flex justify-center items-center flex-col mt-4 mb-4`}
          onClick={() => setSelectedId(item.id )}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", }}
        >
          <motion.div 
          className={`  ${item.color}   flex justify-center items-center flex-col rounded-xl`}
          initial={{height:"25vh",width:"20vw"}}
          whileHover={{width:"25vw",height:"30vh"}}
          transition={{ease:"easeInOut"}}
          >
          <img src={item.img} className="h-[10vw] w-[10vw] " alt="helloU" />
          <h1 className=" text-white bg-black rounded-xl px-3 mb-3 bg-opacity-30 font-semibold font-mono text-[1.5vw] ">{item.message}</h1>
          </motion.div>
        </motion.div>
      ))}

      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            layoutId={String(selectedId)}
            className="fixed inset-0 flex items-center justify-center flex-col p-4 bg-black/50"
            onClick={() => {setSelectedId(null); setInputValue("")}}
          >
            <motion.div
              className={`w-[35vw]  h-[55vh] rounded-xl bg-zinc-800 flex flex-col items-center `}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              
              <motion.div 
              className={`h-[27vh] w-full max-w-md  ${items.find((item)=>item.id===selectedId)?.color}
                         flex items-center justify-center flex-col rounded-xl overflow-scroll `}
              >
                  <img src={items.find((item)=>item.id===selectedId)?.img} className="h-[10vw] w-[10vw] " alt="helloU" />

                  <motion.h1
                    className=" text-white bg-black px-3 bg-opacity-30 font-semibold font-mono text-lg"
                    initial={{opacity:0,width:"15vw"}}
                    animate={{opacity:1,width:"35vw"}}
                    transition={{duration:0.9}}
                  >{items.find((item) => item.id === selectedId)?.message}
                  </motion.h1>

                 </motion.div>

                {/* TO display Inputs for slelected Field*/}
                 { (selectedId === 1 || selectedId === 2 || selectedId === 5 || selectedId === 6) &&
                 <>
                    <motion.input type="text"
                      className="mt-2 outline-none rounded-xl text-black px-2"
                      initial={{opacity:0,width:"5vw"}}
                      animate={{opacity:1,width:"30vw"}}
                      transition={{duration:0.9}}
                      value={inputValue}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                      
                    />
                    {(selectedId === 1 || selectedId === 5 || selectedId === 6 ) && 
                    <>
                    <p className="text-white opacity-20 text-sm">Your text will be displayed here</p>
                    <p>{inputValue}</p>
                    </>
                    }
                    
                    {(selectedId === 2 ) && 
                    <>
                    <p className="text-white opacity-20">dd/mm/yyyy & Please Enter an Valid Date</p>
                    <p className="text-3xl text-sky">{inputValue}</p>
                    </>
                    }
                  </>
                    
                 }
                 {/*To display Options for Id 3*/}
                 {selectedId===3 &&
                 <div>
                  <motion.ul
                              className="h-[30vh] w-full absolute left-0 bg-gray-900 text-white rounded-md shadow-lg overflow-scroll"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {threatOptions.map((option, index) => (
                                <motion.li
                                  key={index}
                                  className="p-3 text-sm text-center text-cyan-400 cursor-pointer transition duration-300 ease-in-out hover:bg-cyan-400 hover:text-black"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }}
                                  transition={{ duration: 0.2, delay: index * 0.05 }}
                                  // onClick={() => {
                                  //   setThreatType(option);
                                  //   setIsOpen(false);
                                  // }}
                                >
                                  {option}
                                </motion.li>
                              ))}
                            </motion.ul>
                            </div>
                 }
                            {/*To Display Option for id 4*/}

                 {selectedId===4 &&
                 <div>
                  <motion.ul
                              className="h-[30vh] w-full absolute left-0 bg-gray-900 text-white rounded-md shadow-lg overflow-scroll"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {locationOptions.map((option, index) => (
                                <motion.li
                                  key={option.value}
                                  className="p-2 text-sm text-center text-cyan-400 cursor-pointer transition duration-300 ease-in-out hover:bg-cyan-400 hover:text-black"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }}
                                  transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                  {option.label}
                                </motion.li>
                              ))}
                            </motion.ul>
                 </div>
                 }
                 </motion.div>
          </motion.div>
          
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThreatReport;