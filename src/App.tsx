import React from 'react';
import { motion } from 'framer-motion';

function ChipGrid() {
  const pattern = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ];

  const containerVariants = {
    hidden: { 
      scale: 0,
      opacity: 0,
      rotateY: 180,
      filter: 'blur(20px)'
    },
    visible: { 
      scale: 1,
      opacity: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1,
        ease: "anticipate",
        staggerChildren: 0.03
      }
    }
  };

  const cellVariants = {
    hidden: { 
      opacity: 0,
      scale: 0,
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="relative w-24 h-24"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="absolute inset-0 grid grid-cols-5 gap-[2px] bg-black/50 p-1.5 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.3)] border border-green-500/50 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
        }}
      >
        {pattern.flat().map((cell, index) => (
          <motion.div
            key={index}
            variants={cellVariants}
            className={`aspect-square rounded-sm ${
              cell
                ? 'bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                : 'bg-black/40 border border-green-900/50'
            }`}
            style={{
              backdropFilter: 'blur(8px)',
            }}
          />
        ))}
      </motion.div>
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        variants={textVariants}
      >
        <h1 className="text-green-500 text-sm font-mono font-bold tracking-wider z-10">
          EQTY
        </h1>
      </motion.div>
    </motion.div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <ChipGrid />
    </div>
  );
}

export default App;