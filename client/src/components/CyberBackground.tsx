import React from 'react';

const CyberBackground = () => {
  return (
    <div className="fixed top-0 bg-black left-0 w-full h-full overflow-hidden z-0">
      {/* Grid Lines */}
      <div className="absolute top-0 left-0 w-full h-full bg-[length:20px_20px] bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_2px,transparent_0px),linear-gradient(rgba(255,255,255,0.08)_2px,transparent_0px)] animate-moveGrid"></div>

      {/* Glowing Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,rgba(0,255,255,0.2)_10%,transparent_15.01%)] bg-[length:20px_20px] animate-glow"></div>
    </div>
  );
};

export default CyberBackground;