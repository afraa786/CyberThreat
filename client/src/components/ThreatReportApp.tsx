import { useState,useRef,useEffect } from "react";
import "./ThreatReportApp.css";
import { easeInOut, motion,AnimatePresence, } from "framer-motion";

type Option = {
  value: string;
  label: string;
};

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

export default function ThreatReportApp() {
  const [threat, setThreat] = useState("");
  const [platform, setPlatform] = useState("");
  const [dateHeard, setDateHeard] = useState("");
  const [firstStep, setFirstStep] = useState("");
  const [phishingURL, setPhishingURL] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [delayReason, setDelayReason] = useState("");
  const [linkedinURL, setLinkedinURL] = useState("");
  const [evidence, setEvidence] = useState<File | null>(null);
  const [threatType, setThreatType] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  interface ValidateDateFunction {
    (date: string): boolean;
  }

  const validateDate: ValidateDateFunction = (date) => {
    const today = new Date().toISOString().split("T")[0];
    return date <= today;
  };

  const validateURL = (url: string): boolean => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + 
      "((([a-zA-Z0-9$-_@.&+!*\"(),]+)\\.)+[a-zA-Z]{2,6})" + 
      "(\\/[a-zA-Z0-9$-_@.&+!*\"(),]*)*$"
    );
    return urlPattern.test(url);
  };

  const handleSubmit = () => {
    if (!validateDate(dateHeard)) {
      alert("Invalid date! Please enter a valid past date.");
      return;
    }
    if (phishingURL && !validateURL(phishingURL)) {
      alert("Invalid URL format!");
      return;
    }
    console.log({
      threat,
      platform,
      dateHeard,
      firstStep,
      threatType,
      phishingURL,
      incidentLocation,
      additionalInfo,
      delayReason,
      linkedinURL,
      evidence,
    });
    alert("🚀 Report submitted successfully!");
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="cyberpunk-container flex p-3">
      <div className="cyberpunk-box h-screen! w-screen!">
      <h1 className="cyberpunk-title">🚨 Cyber Threat Report</h1>

      
        <motion.input
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{backgroundColor:"greenyellow"}}
          transition={{ duration: 0.2, ease: "easeInOut" }}

          type="text"
          placeholder="Enter threat details..."
          className=" hover:shadow-[0_0_20px_#00ffff] bg-gray-800 text-cyan-400 rounded-xl shadow-lg w-full p-3 mb-2 border-2
             border-cyan-400 text-center text-base outline-none transition duration-300 ease-in-out focus:shadow-[0_0_10px_#00ffff] hover:cursor-pointer "
          value={threat}
          onChange={(e) => setThreat(e.target.value)}
        />


        <motion.input
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{backgroundColor:"greenyellow"}}
          transition={{ duration: 0.2, ease: "easeInOut" }}

          type="text"
          placeholder="dd/mm/yyyy"
          className=" hover:shadow-[0_0_20px_#00ffff] bg-gray-800 text-cyan-400 rounded-xl shadow-lg w-full p-3 mb-2 border-2
             border-cyan-400 text-center text-base outline-none transition duration-300 ease-in-out focus:shadow-[0_0_10px_#00ffff] hover:cursor-pointer "
          value={dateHeard}
          onChange={(e) => setDateHeard(e.target.value)}
        />


      {/* Select Button */}
      <motion.div
        className=" hover:shadow-[0_0_20px_#00ffff] cyberpunk-input p-2 cursor-pointer text-white bg-gray-800"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{backgroundColor:"greenyellow"}}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {threatType || "Select Threat Type"}
      </motion.div>

      {/* AnimatePresence for Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="absolute left-0 mt-2 w-full bg-gray-900 text-white rounded-md shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {threatOptions.map((option, index) => (
              <motion.li
                key={index}
                className="p-3 text-center text-cyan-400 cursor-pointer transition duration-300 ease-in-out hover:bg-cyan-400 hover:text-black"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => {
                  setThreatType(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* End 1 */}

      {threatType === "Phishing" && (
          <motion.input
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{backgroundColor:"greenyellow"}}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          

          className=" hover:shadow-[0_0_20px_#00ffff] bg-gray-800 text-cyan-400 rounded-xl shadow-lg w-full p-3 mb-2 border-2
             border-cyan-400 text-center text-base outline-none transition duration-300 ease-in-out focus:shadow-[0_0_10px_#00ffff] hover:cursor-pointer"
            type="text"
            placeholder="Enter phishing URL..."
            value={phishingURL}
            onChange={(e) => setPhishingURL(e.target.value)}
          />
        )}


      <div className="z-0" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <motion.div
         initial={{ scale: 1 }}
         whileHover={{ scale: 1.05 }}
         whileTap={{backgroundColor:"greenyellow"}}
         transition={{ duration: 0.2, ease: "easeInOut" }}
         
        className="w-full p-3 bg-gray-800 border-2 border-cyan-400 text-cyan-400 rounded-xl text-center text-base cursor-pointer transition duration-300 mb-[10px]  hover:shadow-[0_0_20px_#00ffff] "
        onClick={() => setIsOpen1(!isOpen1)}
      >
        {incidentLocation
          ? locationOptions.find((opt) => opt.value === incidentLocation)?.label
          : "Where did the incident occur?"}
      </motion.div>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen1 && (
          <motion.ul
            className=" absolute left-0 mt-2 w-full  bg-gray-800 border-2 border-cyan-400 rounded-lg overflow-hidden shadow-lg z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {locationOptions.map((option, index) => (
              <motion.li
                key={option.value}
                className="p-3 text-center text-cyan-400 cursor-pointer transition duration-300 ease-in-out hover:bg-cyan-400 hover:text-black"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => {
                  setIncidentLocation(option.value);
                  setIsOpen1(false);
                  console.log(option.value)
                }}
              >
                {option.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>

        {/* Additional Information */}
        <motion.textarea
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{backgroundColor:"greenyellow"}}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className=" hover:shadow-[0_0_20px_#00ffff] bg-gray-800 text-cyan-400 rounded-xl shadow-lg w-full p-3 mb-2 border-2
          border-cyan-400 text-center text-base outline-none transition duration-300 ease-in-out focus:shadow-[0_0_10px_#00ffff] hover:cursor-pointer"
          placeholder="Additional information about the incident (Min 150, Max 1500 characters)"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          minLength={150}
          maxLength={1500}
        />

        {/* Reason for delay in reporting */}
        <motion.input
           initial={{ scale: 1 }}
           whileHover={{ scale: 1.05 }}
           whileTap={{backgroundColor:"greenyellow"}}
           transition={{ duration: 0.2, ease: "easeInOut" }}
           className=" hover:shadow-[0_0_20px_#00ffff] bg-gray-800 text-cyan-400 rounded-xl shadow-lg w-full p-3 mb-2 border-2
           border-cyan-400 text-center text-base outline-none transition duration-300 ease-in-out focus:shadow-[0_0_10px_#00ffff] hover:cursor-pointer"
          type="text"
          placeholder="Reason for delay in reporting"
          value={delayReason}
          onChange={(e) => setDelayReason(e.target.value)}
        />

        {/* LinkedIn URL */}
        <motion.input
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{backgroundColor:"greenyellow"}}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className=" hover:shadow-[0_0_20px_#00ffff] bg-gray-800 text-cyan-400 rounded-xl shadow-lg w-full p-3 mb-2 border-2
          border-cyan-400 text-center text-base outline-none transition duration-300 ease-in-out focus:shadow-[0_0_10px_#00ffff] hover:cursor-pointer"
          type="url"
          placeholder={incidentLocation+" handle / URL"}
          value={linkedinURL}
          onChange={(e) => setLinkedinURL(e.target.value)}
        />

        {/* Upload Evidence */}
        <motion.input
           initial={{ scale: 1 }}
           whileHover={{ scale: 1.05 }}
           whileTap={{backgroundColor:"greenyellow"}}
           transition={{ duration: 0.2, ease: "easeInOut" }}
           placeholder="Add Evidence"
           className=" hover:shadow-[0_0_20px_#00ffff] bg-gray-800 text-cyan-400 rounded-xl shadow-lg w-full p-3 mb-2 border-2
           border-cyan-400 text-center text-base outline-none transition duration-300 ease-in-out focus:shadow-[0_0_10px_#00ffff] hover:cursor-pointer"
          type="file"
          accept=".pdf,.jpg,.png"
          onChange={(e) => setEvidence(e.target.files ? e.target.files[0] : null)}
        />

        {/* What would be your first step? */}
        <motion.textarea
           initial={{ scale: 1 }}
           whileHover={{ scale: 1.05 }}
           whileTap={{backgroundColor:"greenyellow"}}
           transition={{ duration: 0.2, ease: "easeInOut" }}
           className=" hover:shadow-[0_0_20px_#00ffff] bg-gray-800 text-cyan-400 rounded-xl shadow-lg w-full p-3 mb-2 border-2
           border-cyan-400 text-center text-base outline-none transition duration-300 ease-in-out focus:shadow-[0_0_10px_#00ffff] hover:cursor-pointer"
          placeholder="What would be your first step?"
          value={firstStep}
          onChange={(e) => setFirstStep(e.target.value)}
        />

        <motion.button
           initial={{ scale: 1 }}
           whileHover={{ scale: 1.05 }}
          className="w-full p-3 bg-black border-2 border-cyan-400 text-cyan-400 rounded-xl text-center text-base outline-none transition duration-300 ease-in-out shadow-[0_0_10px_#00ffff] hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_#00ffff] active:scale-95"
          onClick={handleSubmit}
        >
          Submit Report
        </motion.button>

        <div className="cyberpunk-footer">
        🎮 Earn XP for every valid report! Level up in the Cyber Security community.
      </div>
      </div>


    </div>
  );
}
