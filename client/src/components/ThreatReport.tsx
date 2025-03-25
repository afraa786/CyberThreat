import { motion, AnimatePresence, color } from "framer-motion";
import { useState } from "react";
import ParticlesComponent from "./Particles";
import './ThreatReportApp.css';
import Page from '../lib/Image/page.png'
import Calender from '../lib/Image/schedule.png'
import Hack from '../lib/Image/scam.png'
import Media from '../lib/Image/bullhorn.png'
import Write from '../lib/Image/write.png'
import Delay from '../lib/Image/expired.png'


function ThreatReport() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const items = [
    { id: 1, message:"Threat Details",img:Page,color:"bg-pink-100" },
    { id: 2, message:"Threat Date",img:Calender,color:"bg-yellow-300" },
    { id: 3, message:"Select Threat Type",img:Hack,color:"bg-sky-300"  },
    { id: 4,  message:"IncidentLocation",img:Media,color:"bg-lime-100"  },
    { id: 5,  message:"More information",img:Write,color:"bg-lime-500"  },
    { id: 6,  message:"Reason for delay",img:Delay,color:"bg-purple-300"  },

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
          className={`w-[25vw] h-[30vh] rounded-xl cursor-pointer bg-zinc-800 flex justify-center items-center flex-col`}
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
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              className={`w-full max-w-md h-[55vh] rounded-xl bg-zinc-800 flex flex-col items-center `}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              
              <motion.div 
              className={`h-[13vw] w-full max-w-md  ${items.find((item)=>item.id===selectedId)?.color}
                         flex items-center flex-col rounded-xl `}
              >
                  <img src={items.find((item)=>item.id===selectedId)?.img} className="h-[10vw] w-[10vw] " alt="helloU" />

                  <motion.h1
                    className=" text-white bg-black px-3 bg-opacity-30 font-semibold font-mono text-xl"
                    initial={{opacity:0,width:"15vw"}}
                    animate={{opacity:1,width:"35vw"}}
                    transition={{duration:0.9}}
                  >{items.find((item) => item.id === selectedId)?.message}
                  </motion.h1>

                 </motion.div>
                    <motion.input type="text"
                      // className="w-full max-w-md"
                      initial={{opacity:0,width:"5vw"}}
                      animate={{opacity:1,width:"15vw"}}
                      transition={{duration:0.9}}
                    />

                 </motion.div>
          </motion.div>
          
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThreatReport;