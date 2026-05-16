import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore, TAPES_LORE, AnimatronicName, ACHIEVEMENTS } from './store';
import Office from './components/Office';
import { initAudio, playJumpscareSound, startMenuMusic, stopMenuMusic, playVictoryMusic, playMenuSelectSound } from './lib/audio';
import { MarcusModel, PiperModel, RustyModel, VhsModel, MelodyModel, BouncerModel, SmileUnitModel, GuestModel, GoldenMarcusModel } from './components/Models';
import Minigame from './components/Minigame';
import './index.css';

function WarningScreen() {
   const { setGameState } = useGameStore();
   const [headphoneStatus, setHeadphoneStatus] = useState<string>('Detecting audio devices...');

   useEffect(() => {
     if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
       navigator.mediaDevices.enumerateDevices()
        .then(devices => {
           let found = false;
           for (const dev of devices) {
              if (dev.kind === 'audiooutput' && (dev.label.toLowerCase().includes('headset') || dev.label.toLowerCase().includes('headphone') || dev.label.toLowerCase().includes('earbuds'))) {
                  found = true;
                  break;
              }
           }
           if (found) setHeadphoneStatus('HEADPHONES DETECTED - Optimal audio experience.');
           else setHeadphoneStatus('HEADPHONES NOT DETECTED - Headphones strongly recommended.');
        })
        .catch(err => {
           setHeadphoneStatus('HEADPHONES RECOMMENDED - For the best experience.');
        });
     } else {
         setHeadphoneStatus('HEADPHONES RECOMMENDED - For the best experience.');
     }

     const handler = () => {
         initAudio();
         startMenuMusic();
         setGameState('MENU');
     }
     window.addEventListener('keydown', handler);
     window.addEventListener('mousedown', handler);
     window.addEventListener('touchstart', handler);
     return () => {
         window.removeEventListener('keydown', handler);
         window.removeEventListener('mousedown', handler);
         window.removeEventListener('touchstart', handler);
     };
   }, [setGameState]);

   return (
       <div 
          className="w-full h-screen bg-purple-950 flex flex-col items-center justify-center text-purple-300 font-mono p-8 text-center cursor-pointer crt select-none"
       >
          <div className="absolute inset-0 static-noise opacity-10 mix-blend-screen" />
          <div className="absolute inset-0 scanlines" />
          <h1 className="text-6xl text-purple-400 mb-8 font-bold tracking-widest drop-shadow-[0_0_30px_#a855f7] animate-pulse">WARNING</h1>
          <p className="max-w-3xl text-2xl leading-relaxed mb-8 font-sans font-black flex flex-wrap justify-center gap-2">
             {"This game contains flashing lights, loud noises, and lots of jumpscares. If you are sensitive to such elements, please do not play.".split(' ').map((word, i) => (
               <span key={i} className="text-purple-200 drop-shadow-[0_0_15px_#d8b4fe] animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                 {word}
               </span>
             ))}
          </p>
          
          <div className="mb-12 mt-4 text-yellow-400 font-bold tracking-widest uppercase border border-yellow-500/50 px-6 py-3 bg-yellow-900/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
             {headphoneStatus}
          </div>

          <p className="text-purple-400 animate-pulse uppercase tracking-widest text-xl drop-shadow-[0_0_20px_#c084fc] font-bold">
             Click any key / or tap to continue
          </p>
       </div>
   );
}

function LoadingScreen() {
  const { night } = useGameStore();
  
  return (
    <div className="w-full h-screen bg-[#1a0f2e] flex flex-col items-center justify-center crt select-none cursor-none relative font-mono text-white">
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.15)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
       <div className="text-3xl text-[#c084fc] tracking-[0.3em] font-light animate-pulse drop-shadow-[0_0_10px_#c084fc]">12:00 AM</div>
       <div className="mt-8 text-5xl font-bold tracking-widest text-[#e9d5ff] drop-shadow-[0_0_15px_#c084fc]">
         {night === 7 ? "CUSTOM NIGHT" : `NIGHT ${night}`}
       </div>
       <div className="absolute inset-0 scanlines opacity-50" />
       
       <div className="absolute bottom-12 right-12 flex items-center gap-4">
         <div className="w-4 h-4 bg-[#c084fc] rounded-full animate-bounce shadow-[0_0_10px_#c084fc]" style={{ animationDelay: '0s' }} />
         <div className="w-4 h-4 bg-[#c084fc] rounded-full animate-bounce shadow-[0_0_10px_#c084fc]" style={{ animationDelay: '0.2s' }} />
         <div className="w-4 h-4 bg-[#c084fc] rounded-full animate-bounce shadow-[0_0_10px_#c084fc]" style={{ animationDelay: '0.4s' }} />
       </div>
    </div>
  );
}

function LoreGallery({ onClose }: { onClose: () => void }) {
  const { collectedTapes } = useGameStore();

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col crt font-mono text-white p-8 overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto pb-20">
         <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl uppercase tracking-widest text-zinc-500">Lore Timeline & Employee Logs</h2>
            <button 
              onClick={onClose} 
              className="text-xl hover:text-red-500 uppercase tracking-widest border border-current px-4 py-2 hover:bg-red-500/10"
            >
              Close
            </button>
         </div>
         
         <div className="relative border-l-4 border-zinc-800 pl-8 ml-4 flex flex-col gap-12">
           {TAPES_LORE.map((tape, i) => {
             const isCollected = collectedTapes.includes(tape.id);
             return (
               <div key={tape.id} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[42px] top-4 w-6 h-6 rounded-full border-4 border-black ${isCollected ? 'bg-purple-500 shadow-[0_0_10px_purple]' : 'bg-zinc-800'}`} />
                  
                  <div className={`p-6 border rounded-lg transition-all ${isCollected ? 'border-zinc-600 bg-zinc-900/50' : 'border-zinc-900 bg-transparent'}`}>
                     <div className="flex items-center gap-4 mb-4">
                        <VhsModel className={`w-10 h-10 ${isCollected ? 'opacity-100' : 'opacity-20'}`} />
                        <div>
                           <div className="text-sm text-zinc-500 tracking-widest">LOG ENTRY {i+1} • {tape.camId}</div>
                           <h3 className={`text-2xl font-bold ${isCollected ? 'text-white' : 'text-zinc-700 uppercase'}`}>
                              {isCollected ? tape.title : 'CORRUPTED RECORD'}
                           </h3>
                        </div>
                     </div>
                     {isCollected ? (
                        <p className="text-lg leading-relaxed text-zinc-300 font-sans tracking-wide mt-4 pl-14 border-l-2 border-purple-900/50">
                          {tape.content}
                        </p>
                     ) : (
                        <p className="text-zinc-800 font-mono mt-4 pl-14">
                           [DATA REDACTED OR MISSING]
                        </p>
                     )}
                  </div>
               </div>
             )
           })}
         </div>
      </div>
      <div className="fixed inset-0 static-noise pointer-events-none opacity-5 mix-blend-screen" />
      <div className="fixed inset-0 scanlines pointer-events-none" />
    </div>
  );
}

function CustomNight({ onClose }: { onClose: () => void }) {
  const { startGame, customAIConfig, setCustomAI, apply7999Mode, adminUnlocked } = useGameStore();
  const holdInterval = useRef<number | null>(null);

  const handleStart = () => {
    initAudio();
    stopMenuMusic();
    startGame(7, true);
  };

  const handleHold = (anim: AnimatronicName, delta: number) => {
     const update = () => {
         const current = useGameStore.getState().customAIConfig[anim];
         setCustomAI(anim, Math.max(0, Math.min(999, current + delta)));
     };
     update();
     holdInterval.current = window.setInterval(update, 100);
  };
  const clearHold = () => {
     if (holdInterval.current) clearInterval(holdInterval.current);
  };

  const applyPreset = (preset: Record<string, number>) => {
      Object.keys(preset).forEach(k => {
          setCustomAI(k as AnimatronicName, preset[k]);
      });
  };

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center crt font-mono text-white p-8">
      <h2 className="text-6xl mb-8 text-purple-600 drop-shadow-[0_0_20px_purple] font-bold">CUSTOM NIGHT</h2>

      <div className="flex flex-wrap gap-4 mb-8 text-sm justify-center">
         <button onClick={() => applyPreset({Marcus: 20, Piper: 20, Rusty: 20, Melody: 0, Bouncer: 0, SmileUnit: 0, TinyMarcus: 0, TheGuest: 0})} className="border border-zinc-500 px-4 py-2 hover:bg-zinc-800">Classic</button>
         <button onClick={() => applyPreset({Marcus: 0, Piper: 20, Rusty: 0, Melody: 20, Bouncer: 0, SmileUnit: 0, TinyMarcus: 0, TheGuest: 0})} className="border border-zinc-500 px-4 py-2 hover:bg-zinc-800">Ladies Night</button>
         <button onClick={() => applyPreset({Marcus: 20, Piper: 20, Rusty: 20, Melody: 20, Bouncer: 20, SmileUnit: 20, TinyMarcus: 20, TheGuest: 20})} className="border border-zinc-500 px-4 py-2 hover:bg-zinc-800">Faz-Marcus Fury</button>
         <button onClick={() => applyPreset({Marcus: 999, Piper: 999, Rusty: 999, Melody: 999, Bouncer: 999, SmileUnit: 999, TinyMarcus: 999, TheGuest: 999})} className="border border-purple-900 bg-purple-950 px-4 py-2 hover:bg-purple-900 text-white font-bold animate-pulse shadow-[0_0_15px_purple]">HELL</button>
      </div>

      <div className="grid grid-cols-4 gap-x-8 gap-y-12 mb-12">
         {['Marcus', 'Piper', 'Rusty', 'Melody', 'Bouncer', 'SmileUnit', 'TinyMarcus', 'TheGuest'].map(anim => (
            <div key={anim} className="flex flex-col items-center">
               <div className="text-xl mb-2">{anim}</div>
               <div className="text-4xl font-black mb-2 select-none w-24 text-center bg-zinc-900 border-2 border-zinc-700 py-2 tabular-nums">
                 {customAIConfig[anim as AnimatronicName] || 0}
               </div>
               <div className="flex gap-2">
                  <button 
                    onMouseDown={() => handleHold(anim as AnimatronicName, -1)}
                    onMouseUp={clearHold}
                    onMouseLeave={clearHold}
                    className="w-10 h-10 bg-zinc-800 hover:bg-zinc-600 border border-white text-xl"
                  >-</button>
                  <button 
                    onMouseDown={() => handleHold(anim as AnimatronicName, 1)}
                    onMouseUp={clearHold}
                    onMouseLeave={clearHold}
                    className="w-10 h-10 bg-zinc-800 hover:bg-zinc-600 border border-white text-xl"
                  >+</button>
               </div>
            </div>
         ))}
      </div>

      <div className="flex gap-8">
         <button 
           onClick={handleStart}
           className="px-12 py-4 bg-purple-900/50 hover:bg-purple-800 border-2 border-purple-500 text-3xl transition-colors uppercase tracking-widest font-bold"
         >
           READY
         </button>
         <button 
           onClick={apply7999Mode}
           className="px-8 py-4 bg-purple-900/50 hover:bg-purple-800 border-2 border-purple-500 text-xl transition-colors uppercase tracking-widest hidden md:block"
         >
           7/999 MODE
         </button>
         <button 
           onClick={onClose}
           className="px-8 py-4 border-2 border-zinc-700 hover:bg-zinc-800 text-xl transition-colors uppercase tracking-widest"
         >
           BACK
         </button>
      </div>

      <div className="absolute inset-0 static-noise pointer-events-none opacity-[0.15]" />
      <div className="scanlines pointer-events-none" />
    </div>
  );
}

function StarsDisplay() {
  const { unlockedAchievements, customNightUnlocked } = useGameStore();
  
  const stars = [
    { id: 'survive_5', icon: '★', color: 'text-white' },
    { id: 'custom_night', icon: '★', color: 'text-purple-500', condition: customNightUnlocked },
    { id: 'lore', icon: '★', color: 'text-blue-400' },
    { id: 'custom_7_20', icon: '★', color: 'text-[#c084fc]' },
    { id: 'custom_8_999', icon: '★', color: 'text-purple-600', glow: 'drop-shadow-[0_0_10px_purple]' },
  ];

  const earnedStars = stars.filter(s => 
    s.condition !== undefined ? s.condition : unlockedAchievements.includes(s.id)
  );

  if (earnedStars.length === 0) return null;

  return (
    <div className="flex gap-4 mb-4">
      {earnedStars.map((star, i) => (
        <motion.span
          key={star.id}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.1, type: 'spring' }}
          className={`text-4xl ${star.color} ${star.glow || 'drop-shadow-[0_0_8px_currentColor]'} select-none`}
        >
          {star.icon}
        </motion.span>
      ))}
    </div>
  );
}

function Gallery({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<'animatronics' | 'rooms'>('animatronics');
  
  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col crt font-mono text-white p-8 overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto pb-20 mt-12">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl uppercase tracking-widest text-[#4ade80]">Faz-Marcus Gallery</h2>
            <button 
              onClick={onClose} 
              className="text-xl hover:text-red-500 uppercase tracking-widest border border-current px-4 py-2 hover:bg-red-500/10"
            >
              Close
            </button>
         </div>
         
         <div className="flex gap-4 mb-8">
           <button 
             onClick={() => setView('animatronics')}
             className={`px-4 py-2 tracking-widest uppercase border ${view === 'animatronics' ? 'bg-[#4ade80] text-black border-[#4ade80]' : 'text-zinc-500 border-zinc-700 hover:text-white'}`}
           >
             Animatronics
           </button>
           <button 
             onClick={() => setView('rooms')}
             className={`px-4 py-2 tracking-widest uppercase border ${view === 'rooms' ? 'bg-[#4ade80] text-black border-[#4ade80]' : 'text-zinc-500 border-zinc-700 hover:text-white'}`}
           >
             Facility Cameras
           </button>
         </div>
         
         {view === 'animatronics' && (
           <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
             <div className="border border-zinc-800 bg-zinc-900/50 p-4 flex flex-col items-center">
               <div className="w-full aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden border border-zinc-800 mb-4 relative">
                 <div className="absolute inset-0 bg-blue-900 opacity-20" />
                 <MarcusModel className="w-3/4 h-3/4 drop-shadow-2xl translate-y-4" />
               </div>
               <h3 className="text-xl font-bold uppercase text-zinc-300">Marcus</h3>
               <div className="text-sm text-zinc-500 uppercase mt-1">Lead Singer</div>
             </div>
             
             <div className="border border-zinc-800 bg-zinc-900/50 p-4 flex flex-col items-center">
               <div className="w-full aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden border border-zinc-800 mb-4 relative">
                 <div className="absolute inset-0 bg-purple-900 opacity-20" />
                 <PiperModel className="w-3/4 h-3/4 drop-shadow-2xl translate-y-4" />
               </div>
               <h3 className="text-xl font-bold uppercase text-zinc-300">Piper</h3>
               <div className="text-sm text-zinc-500 uppercase mt-1">Guitarist</div>
             </div>
             
             <div className="border border-zinc-800 bg-zinc-900/50 p-4 flex flex-col items-center">
               <div className="w-full aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden border border-zinc-800 mb-4 relative">
                 <div className="absolute inset-0 bg-red-900 opacity-20" />
                 <RustyModel className="w-3/4 h-3/4 drop-shadow-2xl translate-y-4" />
               </div>
               <h3 className="text-xl font-bold uppercase text-zinc-300">Rusty</h3>
               <div className="text-sm text-zinc-500 uppercase mt-1">Out of Order</div>
             </div>
             
             <div className="border border-zinc-800 bg-zinc-900/50 p-4 flex flex-col items-center">
               <div className="w-full aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden border border-zinc-800 mb-4 relative">
                 <div className="absolute inset-0 bg-pink-900 opacity-20" />
                 <MelodyModel className="w-3/4 h-3/4 drop-shadow-2xl translate-y-4 scale-75" />
               </div>
               <h3 className="text-xl font-bold uppercase text-zinc-300">Melody</h3>
               <div className="text-sm text-zinc-500 uppercase mt-1">Music Box</div>
             </div>
             
             <div className="border border-zinc-800 bg-zinc-900/50 p-4 flex flex-col items-center">
               <div className="w-full aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden border border-zinc-800 mb-4 relative">
                 <div className="absolute inset-0 bg-yellow-900 opacity-20" />
                 <SmileUnitModel className="w-3/4 h-3/4 drop-shadow-2xl translate-y-4" />
               </div>
               <h3 className="text-xl font-bold uppercase text-zinc-300">Smile Unit</h3>
               <div className="text-sm text-zinc-500 uppercase mt-1">Service Drone</div>
             </div>
             
             <div className="border border-zinc-800 bg-zinc-900/50 p-4 flex flex-col items-center">
               <div className="w-full aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden border border-zinc-800 mb-4 relative">
                 <div className="absolute inset-0 bg-yellow-600 opacity-20 animate-pulse" />
                 <GoldenMarcusModel className="w-3/4 h-3/4 drop-shadow-2xl translate-y-4 hue-rotate-15" />
               </div>
               <h3 className="text-xl font-bold uppercase text-yellow-500">Golden Marcus</h3>
               <div className="text-sm text-yellow-900 uppercase mt-1">???</div>
             </div>
           </div>
         )}
         
         {view === 'rooms' && (
           <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
             <div className="border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="w-full aspect-video bg-zinc-950 border border-zinc-800 mb-4 p-4 relative overflow-hidden flex flex-col items-center justify-end shadow-inner">
                   {/* Main Stage Mock */}
                   <div className="absolute bottom-0 w-3/4 h-1/2 bg-red-950/20 rounded-t-full border-t-4 border-zinc-700"></div>
                   <div className="w-full h-8 bg-zinc-800 absolute bottom-0"></div>
                   <div className="absolute top-4 flex gap-8">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/10 shadow-[0_0_30px_yellow]" />
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 shadow-[0_0_30px_blue]" />
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 shadow-[0_0_30px_purple]" />
                   </div>
                </div>
                <h3 className="text-xl font-bold uppercase text-zinc-300">CAM 1A</h3>
                <div className="text-sm text-zinc-500 uppercase">Show Stage</div>
             </div>
             
             <div className="border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="w-full aspect-video bg-zinc-950 border border-zinc-800 mb-4 p-4 relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
                   {/* Cove Mock */}
                   <div className="w-1/2 h-full bg-purple-900/20 border-x-8 border-purple-950 border-double absolute right-0"></div>
                   <div className="absolute top-1/2 text-2xl text-purple-900 font-bold -rotate-12 select-none tracking-widest opacity-20">SORRY!</div>
                   <div className="absolute bottom-0 text-xl text-purple-900 font-bold -rotate-12 select-none tracking-widest opacity-20">OUT OF ORDER</div>
                </div>
                <h3 className="text-xl font-bold uppercase text-zinc-300">CAM 2</h3>
                <div className="text-sm text-zinc-500 uppercase">Rusty's Cove</div>
             </div>
             
             <div className="border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="w-full aspect-video bg-zinc-950 border border-zinc-800 mb-4 p-4 relative overflow-hidden shadow-inner flex flex-wrap gap-2 items-start opacity-70">
                   {Array(10).fill(0).map((_,i) => (
                      <div key={i} className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                         <div className="w-2 h-2 bg-black rounded-full" />
                      </div>
                   ))}
                   <div className="absolute bottom-0 w-full h-8 border-t-8 border-zinc-800 bg-zinc-900" />
                </div>
                <h3 className="text-xl font-bold uppercase text-zinc-300">CAM 1B</h3>
                <div className="text-sm text-zinc-500 uppercase">Dining Area / Parts</div>
             </div>
             
             <div className="border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="w-full aspect-video bg-zinc-950 border border-zinc-800 mb-4 p-4 relative overflow-hidden shadow-inner group">
                   <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-4 opacity-10">
                      {Array(64).fill(0).map((_,i) => <div key={i} className="bg-white/50" />)}
                   </div>
                   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
                   <div className="w-3/4 h-2/3 bg-zinc-900 absolute bottom-0 left-1/2 -translate-x-1/2 border-t-2 border-x-2 border-zinc-700 shadow-2xl">
                      <div className="w-full h-4 bg-zinc-800"></div>
                   </div>
                </div>
                <h3 className="text-xl font-bold uppercase text-zinc-300">CAM 7A/7B</h3>
                <div className="text-sm text-zinc-500 uppercase">Hallways</div>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}

function MainMenu() {
  const { startGame, collectedTapes, maxNight, customNightUnlocked, adminUnlocked, unlockAll, unlockNight, unlockCustomNight, gameJoltUser, setGameJoltUser, triggerJumpscare, unlockAchievement, unlockedAchievements } = useGameStore();
  const [showLore, setShowLore] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [showTrophies, setShowTrophies] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showGameJolt, setShowGameJolt] = useState(false);
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [menuAudioStarted, setMenuAudioStarted] = useState(false);
  
  const [showGallery, setShowGallery] = useState(false);
  const debugMode = useGameStore(s => s.debugMode);
  const toggleDebugMode = useGameStore(s => s.toggleDebugMode);
  const infiniteNight = useGameStore(s => s.infiniteNight);
  const toggleInfiniteNight = useGameStore(s => s.toggleInfiniteNight);
  const batteryUpgrades = useGameStore(s => s.batteryUpgrades);
  const buyBatteryUpgrade = useGameStore(s => s.buyBatteryUpgrade);
  const cameraUpgrades = useGameStore(s => s.cameraUpgrades);
  const buyCameraUpgrade = useGameStore(s => s.buyCameraUpgrade);
  
  const [selectedNight, setSelectedNight] = useState(maxNight);

  useEffect(() => {
    startMenuMusic();
  }, []);

  const handleStart = () => {
    initAudio();
    stopMenuMusic();
    playMenuSelectSound();
    startGame(1);
  };
  
  const handleContinue = () => {
    initAudio();
    stopMenuMusic();
    playMenuSelectSound();
    startGame(selectedNight);
  };

  const handleInteract = () => {
      initAudio();
      setMenuAudioStarted(true);
  };

  useEffect(() => {
    // Menu cheat codes and key tracking
    const downKeys = new Set<string>();
    
    const handleDown = (e: KeyboardEvent) => downKeys.add(e.key.toLowerCase());
    const handleUp = (e: KeyboardEvent) => {
      if (downKeys.has('c') && downKeys.has('d') && e.key === '1') {
         unlockNight(6);
      }
      if (downKeys.has('c') && downKeys.has('d') && e.key === '2') {
         unlockCustomNight();
      }
      downKeys.delete(e.key.toLowerCase());
    }

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
       window.removeEventListener('keydown', handleDown);
       window.removeEventListener('keyup', handleUp);
    };
  }, [unlockNight, unlockCustomNight]);
  
  if (showLore) return <LoreGallery onClose={() => setShowLore(false)} />;
  if (showCustom) return <CustomNight onClose={() => setShowCustom(false)} />;
  if (showGallery) return <Gallery onClose={() => setShowGallery(false)} />;

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center crt relative overflow-hidden">
      <div className="absolute inset-0 static-noise" />
      <div className="absolute inset-0 scanlines" />
      
      {/* Background aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(88,28,135,0.1)_0%,rgba(0,0,0,1)_100%)] pointer-events-none" />
      <div className="absolute -left-20 top-1/4 opacity-10 select-none -rotate-12 scale-150 pointer-events-none mix-blend-screen text-purple-900"><MarcusModel className="w-96 h-96" /></div>
      <div className="absolute right-10 bottom-1/4 opacity-10 select-none rotate-12 scale-150 pointer-events-none mix-blend-screen text-purple-900"><PiperModel className="w-96 h-96" /></div>

      <div className="z-10 flex flex-col items-start w-full max-w-4xl pl-20" onClick={handleInteract}>
        <StarsDisplay />
        <h1 className="text-7xl font-mono text-[#e9d5ff] drop-shadow-[0_0_15px_#c084fc] mb-2">Fun nights</h1>
        <h1 className="text-7xl font-mono text-[#c084fc] drop-shadow-[0_0_10px_#9333ea] mb-16">with Marcus</h1>
        
        <div className="flex flex-col gap-6 w-96 text-2xl">
          <button 
            onClick={handleStart}
            className="text-left text-white hover:text-purple-500 hover:translate-x-2 transition-all"
          >
            &gt; New Game
          </button>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleContinue}
              className={`text-left transition-all ${maxNight > 1 ? 'text-white hover:text-purple-500 hover:translate-x-2' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              &gt; Continue (Night {selectedNight})
            </button>
            {maxNight > 1 && (
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedNight(Math.max(1, selectedNight - 1)); }}
                  className="px-2 border border-zinc-700 hover:bg-zinc-800 text-white"
                >-</button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedNight(Math.min(maxNight, selectedNight + 1)); }}
                  className="px-2 border border-zinc-700 hover:bg-zinc-800 text-white"
                >+</button>
              </div>
            )}
          </div>
          <button 
            onClick={() => { playMenuSelectSound(); setShowLore(true); }}
            className="text-left text-zinc-400 hover:text-white hover:translate-x-2 transition-all"
          >
            &gt; Lore Logs ({collectedTapes.length}/{TAPES_LORE.length})
          </button>
          <button 
            onClick={() => { if (customNightUnlocked) { playMenuSelectSound(); setShowCustom(true); } }}
            className={`text-left transition-colors ${customNightUnlocked ? 'text-white hover:text-purple-500 hover:translate-x-2' : 'text-zinc-600 cursor-not-allowed'}`}
          >
            &gt; Custom Night {customNightUnlocked ? '' : '(Locked)'}
          </button>
          <button 
            onClick={() => { playMenuSelectSound(); setShowTrophies(true); }}
            className="text-left text-[#c084fc] drop-shadow-[0_0_5px_#c084fc] hover:text-white hover:translate-x-2 transition-all"
          >
            &gt; Trophies
          </button>
          {(maxNight > 5 || adminUnlocked) && (
            <button 
              onClick={() => { playMenuSelectSound(); setShowExtras(true); }}
              className="text-left text-green-400 drop-shadow-[0_0_5px_#4ade80] hover:text-white hover:translate-x-2 transition-all"
            >
              &gt; Upgrades & Extras
            </button>
          )}
          
          <div className="flex flex-wrap gap-4 mt-8 items-center">
             <button 
               onClick={() => setShowPasscode(true)}
               className="text-sm border border-zinc-700 px-3 py-1 hover:bg-zinc-800 text-zinc-400"
             >
               Enter Passcode
             </button>
             <button 
               onClick={() => setShowGameJolt(true)}
               className="text-sm border border-[#c084fc] bg-[#000] px-3 py-1 hover:bg-[#2f2f2f] text-[#c084fc]"
             >
               {gameJoltUser ? `Logged in: ${gameJoltUser}` : 'Log into GameJolt'}
             </button>
             <button 
               onClick={() => setShowPatchNotes(true)}
               className="text-sm border border-zinc-700 px-3 py-1 hover:bg-zinc-800 text-zinc-400"
             >
               Patch Notes
             </button>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 items-center">
             <a 
               href="https://gamejolt.com/@LeftyGamerHD1211" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2 border border-green-500/50 bg-black px-3 py-1 hover:bg-green-900/30 text-green-400 transition-all shadow-[0_0_10px_rgba(34,197,94,0.2)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
               title="LeftyGamerHD1211 on GameJolt"
             >
                <div className="w-4 h-4 flex items-center justify-center text-green-500">
                  <svg viewBox="0 0 100 100" width="16" height="16"><path d="M 10 10 L 40 10 L 40 40 L 90 40 L 90 90 L 10 90 Z" fill="currentColor"/></svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#86efac]">LeftyGamerHD1211</span>
             </a>
             <a 
               href="https://www.youtube.com/@MynameisLeftyYT" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2 border border-purple-500/50 bg-black px-3 py-1 hover:bg-purple-900/30 text-purple-400 transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
               title="MynameisLeftyYT on YouTube"
             >
                <div className="w-5 h-4 bg-purple-500 rounded flex items-center justify-center crt relative overflow-hidden">
                   <div className="absolute inset-0 scanlines opacity-50"></div>
                   <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-black border-b-[3px] border-b-transparent ml-0.5 z-10"></div>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#d8b4fe]">MynameisLeftyYT</span>
             </a>
          </div>

          <div className="mt-8 text-zinc-600 text-sm italic">
            v1.1.0 &copy; 1998 Faz-Marcus Entertainment
            <br />
            Made by LeftyGamerHd1311
          </div>
        </div>
      </div>
      
      
      {/* Extras Modal */}
      {showExtras && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
           <div className="bg-zinc-950 border-2 border-green-500 p-8 flex flex-col gap-4 w-[600px] h-[80vh] overflow-y-auto overflow-x-hidden">
              <h2 className="text-3xl text-green-400 font-bold mb-4 tracking-widest uppercase">Upgrades & Extras</h2>
              
              <div className="flex flex-col gap-2">
                 <h3 className="text-xl text-white font-mono uppercase border-b border-zinc-700 pb-2">Upgrades</h3>
                 <div className="flex items-center justify-between bg-zinc-900 p-4">
                    <div>
                       <div className="text-green-300 font-bold">Battery Upgrade</div>
                       <div className="text-zinc-400 text-sm">Reduces power drain by 10%. (Max 3)</div>
                    </div>
                    <button 
                      onClick={() => { playMenuSelectSound(); buyBatteryUpgrade(); }} 
                      disabled={batteryUpgrades >= 3}
                      className={`px-4 py-2 font-bold ${batteryUpgrades >= 3 ? 'bg-zinc-800 text-zinc-600' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                    >
                      {batteryUpgrades >= 3 ? 'MAXED' : `UPGRADE (${batteryUpgrades}/3)`}
                    </button>
                 </div>
                 
                 <div className="flex items-center justify-between bg-zinc-900 p-4">
                    <div>
                       <div className="text-green-300 font-bold">Night Vision Camera</div>
                       <div className="text-zinc-400 text-sm">Better visibility in dark rooms.</div>
                    </div>
                    <button 
                      onClick={() => { playMenuSelectSound(); buyCameraUpgrade('nightVision'); }} 
                      disabled={cameraUpgrades.nightVision}
                      className={`px-4 py-2 font-bold ${cameraUpgrades.nightVision ? 'bg-zinc-800 text-green-500' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                    >
                      {cameraUpgrades.nightVision ? 'OWNED' : 'UPGRADE'}
                    </button>
                 </div>
                 
                 <div className="flex items-center justify-between bg-zinc-900 p-4">
                    <div>
                       <div className="text-green-300 font-bold">Motion Tracker Camera</div>
                       <div className="text-zinc-400 text-sm">Detects subtle movements.</div>
                    </div>
                    <button 
                      onClick={() => { playMenuSelectSound(); buyCameraUpgrade('motionTracked'); }} 
                      disabled={cameraUpgrades.motionTracked}
                      className={`px-4 py-2 font-bold ${cameraUpgrades.motionTracked ? 'bg-zinc-800 text-green-500' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                    >
                      {cameraUpgrades.motionTracked ? 'OWNED' : 'UPGRADE'}
                    </button>
                 </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                 <h3 className="text-xl text-white font-mono uppercase border-b border-zinc-700 pb-2">Minigames</h3>
                 {[
                    { n: 1, title: 'Find the yellow suit.' },
                    { n: 2, title: 'Find the scattered pieces.' },
                    { n: 3, title: 'Hurry.' },
                    { n: 4, title: 'Do not wake them.' },
                    { n: 5, title: 'It\'s almost over.' },
                    { n: 6, title: 'Tomorrow is another day.' }
                 ].map(mg => (
                    <button 
                       key={mg.n}
                       onClick={() => {
                          setShowExtras(false);
                          useGameStore.getState().playMinigame(mg.n);
                       }}
                       className="flex justify-between items-center bg-zinc-900 hover:bg-zinc-800 p-3 transition-colors text-left"
                    >
                       <div>
                          <div className="text-yellow-500 font-bold uppercase tracking-widest text-lg">Night {mg.n}</div>
                          <div className="text-zinc-500 text-sm">{mg.title}</div>
                       </div>
                       <div className="text-2xl text-zinc-600">&gt;</div>
                    </button>
                 ))}
                 
                 <button 
                    onClick={() => setShowGallery(true)}
                    className="mt-4 flex justify-between items-center bg-zinc-900 hover:bg-zinc-800 p-4 transition-colors text-left"
                 >
                    <div>
                       <div className="text-purple-300 font-bold uppercase tracking-widest">Model & Location Gallery</div>
                       <div className="text-zinc-500 text-sm">View animatronics and rooms in detail.</div>
                    </div>
                    <div className="text-2xl text-zinc-600">&gt;</div>
                 </button>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                 <h3 className="text-xl text-white font-mono uppercase border-b border-zinc-700 pb-2">Cheats & Mods</h3>
                 
                 <label className="flex items-center justify-between bg-zinc-900 p-4 cursor-pointer hover:bg-zinc-800 transition-colors">
                    <div>
                       <div className="text-purple-300 font-bold">Debug Mode HUD</div>
                       <div className="text-zinc-400 text-sm">Shows internal values.</div>
                    </div>
                    <div className={`w-12 h-6 border-2 flex items-center p-1 ${debugMode ? 'border-purple-500 bg-purple-900 justify-end' : 'border-zinc-500 bg-zinc-800 justify-start'}`}>
                       <input type="checkbox" className="hidden" checked={debugMode} onChange={toggleDebugMode} />
                       <div className={`w-4 h-4 ${debugMode ? 'bg-purple-400' : 'bg-zinc-500'}`} />
                    </div>
                 </label>
                 
                 <label className="flex items-center justify-between bg-zinc-900 p-4 cursor-pointer hover:bg-zinc-800 transition-colors">
                    <div>
                       <div className="text-purple-300 font-bold">Infinite Night</div>
                       <div className="text-zinc-400 text-sm">Time stops at 5 AM.</div>
                    </div>
                    <div className={`w-12 h-6 border-2 flex items-center p-1 ${infiniteNight ? 'border-purple-500 bg-purple-900 justify-end' : 'border-zinc-500 bg-zinc-800 justify-start'}`}>
                       <input type="checkbox" className="hidden" checked={infiniteNight} onChange={toggleInfiniteNight} />
                       <div className={`w-4 h-4 ${infiniteNight ? 'bg-purple-400' : 'bg-zinc-500'}`} />
                    </div>
                 </label>
              </div>

              <button onClick={() => { playMenuSelectSound(); setShowExtras(false); }} className="mt-8 border border-green-500 hover:bg-green-900 text-green-400 py-3 font-bold transition-colors tracking-widest text-xl">CLOSE</button>
           </div>
        </div>
      )}

      {/* Trophies Modal */}
      {showTrophies && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
           <div className="bg-zinc-950 border-2 border-[#c084fc] p-8 flex flex-col gap-4 w-[600px] max-h-[80vh] overflow-y-auto">
              <h2 className="text-3xl text-white font-bold tracking-widest uppercase flex items-center gap-4">
                 <div className="w-10 h-10 bg-[#c084fc] rounded-full flex items-center justify-center text-black text-2xl">★</div>
                 Achievements
              </h2>
              <div className="text-zinc-400 mb-4 border-b border-zinc-800 pb-4">
                 Completed: {unlockedAchievements.length} / {ACHIEVEMENTS.length}
              </div>
              <div className="flex flex-col gap-3">
                 {ACHIEVEMENTS.map(ach => {
                    const isUnlocked = unlockedAchievements.includes(ach.id);
                    return (
                       <div key={ach.id} className={`flex items-center gap-4 p-4 border rounded transition-colors ${isUnlocked ? 'border-[#c084fc] bg-[#c084fc]/10' : 'border-zinc-800 bg-zinc-900/50'}`}>
                          <div className={`w-12 h-12 rounded-full flex shrink-0 items-center justify-center text-2xl ${isUnlocked ? 'bg-[#c084fc] text-black shadow-[0_0_15px_#c084fc]' : 'bg-zinc-800 text-zinc-600'}`}>
                             ★
                          </div>
                          <div className="flex flex-col flex-1">
                             <div className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-zinc-600'}`}>
                                {ach.name}
                             </div>
                             <div className={isUnlocked ? 'text-[#c084fc]' : 'text-zinc-700'}>
                                {isUnlocked ? ach.description : '???'}
                             </div>
                          </div>
                       </div>
                    )
                 })}
              </div>
              <button 
                onClick={() => setShowTrophies(false)} 
                className="mt-6 border border-[#c084fc] hover:bg-[#c084fc]/20 text-[#c084fc] py-3 font-bold transition-colors uppercase tracking-widest text-lg"
              >
                Close
              </button>
           </div>
        </div>
      )}
      {showPasscode && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
           <div className="bg-zinc-950 border-2 border-red-900 p-8 flex flex-col items-center">
              <h3 className="text-xl mb-4 text-red-500 font-bold uppercase tracking-widest">Admin Override</h3>
              <input 
                type="password" 
                maxLength={4}
                value={passcode}
                onChange={e => {
                  setPasscode(e.target.value);
                  if (e.target.value === '9999') {
                     unlockAll();
                     setPasscode('');
                     setShowPasscode(false);
                     alert("Admin System Unlocked.");
                  } else if (e.target.value === '1987') {
                     initAudio();
                     setPasscode('');
                     setShowPasscode(false);
                     unlockAchievement('1987');
                     triggerJumpscare('GoldenMarcus');
                  }
                }}
                className="bg-black border border-red-900 text-center text-4xl p-2 w-48 mb-4 focus:outline-none focus:border-red-500 text-white" 
                autoFocus
              />
              <button onClick={() => setShowPasscode(false)} className="text-zinc-500 hover:text-white uppercase tracking-widest text-sm">Cancel</button>
           </div>
        </div>
      )}

      {/* GameJolt Modal */}
      {showGameJolt && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
           <div className="bg-[#191919] border-t-4 border-[#c084fc] p-8 flex flex-col gap-4 w-96 rounded-md shadow-2xl">
              <h3 className="text-xl text-[#ffffff] font-bold text-center flex items-center justify-center gap-2">
                 <svg viewBox="0 0 100 100" width="24" height="24"><path d="M 10 10 L 40 10 L 40 40 L 90 40 L 90 90 L 10 90 Z" fill="#c084fc"/></svg>
                 Game Jolt
              </h3>
              <p className="text-[#a4a4a4] text-xs text-center mb-2">Log in with your Game Jolt account to earn trophies.</p>
              <input 
                id="gj-user"
                placeholder="Username"
                className="bg-[#2f2f2f] border border-[#a4a4a4] p-3 focus:outline-none focus:border-[#c084fc] text-white font-sans rounded-sm" 
              />
              <input 
                type="password"
                placeholder="Game Token"
                className="bg-[#2f2f2f] border border-[#a4a4a4] p-3 focus:outline-none focus:border-[#c084fc] text-white font-sans rounded-sm" 
              />
              <div className="flex gap-4 mt-4">
                 <button 
                   onClick={() => {
                     const u = (document.getElementById('gj-user') as HTMLInputElement).value;
                     if (u) setGameJoltUser(u);
                     setShowGameJolt(false);
                   }}
                   className="flex-1 bg-[#c084fc] hover:bg-[#a855f7] text-[#191919] py-2 font-bold transition-colors"
                 >LOG IN</button>
                 <button onClick={() => setShowGameJolt(false)} className="flex-1 border border-[#a4a4a4] hover:bg-[#a4a4a4]/20 text-white py-2 font-bold transition-colors">CANCEL</button>
              </div>
           </div>
        </div>
      )}

      {/* Patch Notes Modal */}
      {showPatchNotes && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
           <div className="bg-zinc-950 border-2 border-zinc-700 p-8 flex flex-col gap-4 w-[600px] max-h-[80vh] overflow-y-auto">
              <h3 className="text-2xl text-white font-bold uppercase tracking-widest text-center border-b border-zinc-700 pb-4">Patch Notes v1.1.0</h3>
              <ul className="text-zinc-300 space-y-4 text-sm font-sans list-disc pl-6 leading-relaxed">
                 <li><strong className="text-white">Melody the Cat:</strong> Singer animatronic. Distorts camera feeds with static singing.</li>
                 <li><strong className="text-white">Bouncer:</strong> Large security animatronic that patrols halls. Immune to flashlight.</li>
                 <li><strong className="text-white">New Defensive Systems:</strong> Added a Center Ceiling Vent and a Side Hallway Vent. Both consume power when closed.</li>
                 <li><strong className="text-white">Keyboard Shortcuts:</strong> Added a full keybind system: 
                    <br/>- [A/D] Left/Right Doors, [W/X] Center/Side Vents
                    <br/>- [Q/E] Left/Right Lights, [R/T] Vent Lights
                    <br/>- [Space] Camera, [F] Camera Flash, [S/Shift] Mask
                 </li>
                 <li><strong className="text-white">Smile Unit Buff:</strong> Now moves through vents. Close the vent or use the mask to repel it.</li>
                 <li><strong className="text-white">Custom Night Overhaul:</strong> Added new presets (Classic, Ladies Night, Faz-Marcus Fury) and a 7/999 Mode. Hold down +/- to quickly change values!</li>
                 <li><strong className="text-white">GameJolt Trophies:</strong> Authentic GameJolt login added to the main menu.</li>
                 <li><strong className="text-white">Menu Music:</strong> Spooky new YouTube menu music override.</li>
              </ul>
              <button onClick={() => { playMenuSelectSound(); setShowPatchNotes(false); }} className="mt-8 border flex items-center justify-center border-zinc-700 hover:bg-zinc-800 text-white py-2 font-bold transition-colors">CLOSE</button>
           </div>
        </div>
      )}
    </div>
  );
}

function Jumpscare() {
  const { jumpscareBy } = useGameStore();
  
  useEffect(() => {
    playJumpscareSound();
  }, []);

  const getAnimationProps = () => {
    switch (jumpscareBy) {
      case 'Marcus':
        return {
          initial: { scale: 5, y: 300, rotate: -20 },
          animate: { scale: [5, 12, 10], y: [300, -100, 50], rotate: [-20, 10, -5] },
          transition: { duration: 0.15, ease: 'easeOut' }
        };
      case 'Piper':
        return {
          initial: { scale: 6, rotate: -45, x: -200, y: 100 },
          animate: { scale: [6, 14], rotate: [-45, 10], x: [-200, 0], y: [100, -100] },
          transition: { duration: 0.15, ease: 'easeOut' }
        };
      case 'Rusty':
        return {
          initial: { scale: 5, y: 400 },
          animate: { scale: [5, 12], y: [400, -50] },
          transition: { duration: 0.12, ease: 'linear' }
        };
      case 'Melody':
        return {
          initial: { scale: 4, x: -300 },
          animate: { scale: [4, 13, 11], x: [-300, 100, 0], rotate: [20, -10, 0] },
          transition: { duration: 0.15, ease: 'backOut' }
        };
      case 'Bouncer':
        return {
          initial: { scale: 6, y: -400 },
          animate: { scale: 12, y: 0 },
          transition: { duration: 0.1, ease: 'easeIn' }
        };
      case 'SmileUnit':
        return {
          initial: { scale: 8, opacity: 0, filter: 'blur(20px)' },
          animate: { scale: [8, 14, 12], opacity: 1, filter: 'blur(0px)', rotate: [-10, 10, 0] },
          transition: { duration: 0.1, ease: 'linear' }
        };
      case 'TheGuest':
        return {
          initial: { scale: 5, opacity: 0 },
          animate: { scale: [5, 12], opacity: [0, 1] },
          transition: { duration: 0.08, ease: 'linear' }
        };
      case 'GoldenMarcus':
        return {
          initial: { scale: 10, rotate: 180, opacity: 0 },
          animate: { scale: 12, rotate: 0, opacity: 1 },
          transition: { duration: 0.15, ease: 'easeOut' }
        };
      default:
        return {
          initial: { scale: 3 },
          animate: { scale: 12 },
          transition: { duration: 0.15 }
        };
    }
  };
  
  return (
    <div className="w-full h-screen bg-black crt flex items-center justify-center overflow-hidden jrs-shake jrs-glitch">
      <div className="absolute inset-0 bg-red-900/60 mix-blend-color-burn z-10" />
      <div className="absolute inset-0 static-heavy z-20 pointer-events-none opacity-50" />
      <motion.div 
        {...getAnimationProps()}
        className={`z-30 drop-shadow-[0_0_100px_#f00]`}
      >
        {jumpscareBy === 'Marcus' && <MarcusModel className="w-64 h-64" />}
        {jumpscareBy === 'Piper' && <PiperModel className="w-64 h-64" />}
        {jumpscareBy === 'Rusty' && <RustyModel className="w-64 h-64" />}
        {jumpscareBy === 'Melody' && <MelodyModel className="w-64 h-64" />}
        {jumpscareBy === 'Bouncer' && <BouncerModel className="w-64 h-64" />}
        {jumpscareBy === 'SmileUnit' && <SmileUnitModel className="w-64 h-64" />}
        {jumpscareBy === 'TheGuest' && <GuestModel className="w-64 h-64" />}
        {jumpscareBy === 'GoldenMarcus' && <GoldenMarcusModel className="w-64 h-64 drop-shadow-[0_0_200px_#c084fc]" />}
      </motion.div>
    </div>
  );
}

function GameOver() {
  const { setGameState, time, tickCount, jumpscareBy } = useGameStore();

  useEffect(() => {
    let text = "";
    if (jumpscareBy === 'Marcus') text = "I'm the star of this show, not you.";
    if (jumpscareBy === 'Piper') text = "Let me fix that face of yours... permanently.";
    if (jumpscareBy === 'Rusty') text = "Avast ye! Time to walk the plank into the abyss!";
    if (jumpscareBy === 'Melody') text = "My song is a requiem just for you.";
    if (jumpscareBy === 'Bouncer') text = "You didn't have the V I P pass... access denied.";
    if (jumpscareBy === 'SmileUnit') text = "Smile! You're on camera... forever.";
    if (jumpscareBy === 'TheGuest') text = "I have always been here. You just didn't notice.";
    if (jumpscareBy === 'GoldenMarcus') text = "I WILL PUT YOU BACK TOGETHER.";

    if (text && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        const setVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            if (jumpscareBy === 'Piper' || jumpscareBy === 'Melody') {
               utterance.voice = voices.find(v => v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Susan')) || null;
               utterance.pitch = jumpscareBy === 'Piper' ? 1.2 : 1.5;
            } else if (jumpscareBy === 'Rusty') {
               utterance.pitch = 0.5;
               utterance.rate = 0.8;
            } else if (jumpscareBy === 'GoldenMarcus' || jumpscareBy === 'TheGuest') {
               utterance.pitch = 0.1;
               utterance.rate = 0.6;
            } else if (jumpscareBy === 'SmileUnit') {
               utterance.pitch = 2;
               utterance.rate = 1.2;
            } else {
               utterance.pitch = 0.7;
            }
            window.speechSynthesis.speak(utterance);
        };
        
        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
        } else {
            setVoice();
        }

        return () => window.speechSynthesis.cancel();
    }
  }, [jumpscareBy]);

  const inGameSecondsTotal = ((tickCount || 0) % 45) * 80;
  const inGameMinutes = Math.floor(inGameSecondsTotal / 60);
  const inGameSeconds = inGameSecondsTotal % 60;
  const formattedMin = inGameMinutes.toString().padStart(2, '0');
  const formattedSec = inGameSeconds.toString().padStart(2, '0');
  const displayHour = time === 0 ? 12 : time;
  
  return (
    <div className="w-full h-screen bg-black crt flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0 static-noise" />
      <div className="absolute inset-0 scanlines" />
      <h1 className="text-8xl text-purple-600 mb-8 z-10 font-bold opacity-80 mix-blend-screen drop-shadow-[0_0_20px_purple]">GAME OVER</h1>
      
      <div className="z-10 flex flex-col items-center gap-4 mb-12 font-mono uppercase tracking-widest text-center mt-12">
        <div className="text-2xl text-[#c084fc] bg-black/50 border border-[#c084fc]/30 px-6 py-4 shadow-[0_0_15px_rgba(192,132,252,0.3)] min-w-[300px]">
            Time of Death: {displayHour}:{formattedMin}:{formattedSec} AM
        </div>
        
        {jumpscareBy && (
           <>
              <div className="text-3xl text-red-500 drop-shadow-[0_0_10px_red] font-black mt-4">
                  Killed by: {jumpscareBy}
              </div>
              <div className="text-xl text-yellow-500 drop-shadow-[0_0_5px_yellow] mt-8 max-w-2xl text-center italic">
                  {jumpscareBy === 'Marcus' && '"I\'m the star of this show, not you."'}
                  {jumpscareBy === 'Piper' && '"Let me fix that face of yours... permanently."'}
                  {jumpscareBy === 'Rusty' && '"Avast ye! Time to walk the plank into the abyss!"'}
                  {jumpscareBy === 'Melody' && '"My song is a requiem just for you."'}
                  {jumpscareBy === 'Bouncer' && '"You didn\'t have the VIP pass... access denied."'}
                  {jumpscareBy === 'SmileUnit' && '"Smile! You\'re on camera... forever."'}
                  {jumpscareBy === 'TheGuest' && '"I have always been here. You just didn\'t notice."'}
                  {jumpscareBy === 'GoldenMarcus' && '"I WILL PUT YOU BACK TOGETHER."'}
              </div>
           </>
        )}
      </div>

      <div className="text-xl text-zinc-500 z-10 text-center max-w-xl mt-8 italic">
        <p>"We are not responsible for damage to property or person."</p>
      </div>
      <button 
        onClick={() => setGameState('MENU')}
        className="mt-20 text-xl text-white hover:text-purple-500 z-10 border border-white/20 px-8 py-3 hover:bg-white/10"
      >
        Return to Menu
      </button>
    </div>
  );
}


function Win() {
  const { playMinigame, night } = useGameStore();

  useEffect(() => {
    playVictoryMusic();
  }, []);
  
  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center p-8 crt">
      <div className="absolute inset-0 static-noise opacity-20" />
      <div className="absolute inset-0 scanlines" />
      <div className="text-8xl text-yellow-500 mb-8 z-10 font-bold opacity-80 mix-blend-screen drop-shadow-[0_0_20px_#ea580c] select-none">
        6:00 AM
      </div>
      <div className="text-4xl text-white z-10 text-center uppercase tracking-widest font-black mb-4">
        Shift Complete
      </div>
      <div className="text-xl text-zinc-400 z-10">Paycheck to: Ashley Simms</div>
      <div className="text-xl text-green-400 z-10">$120.00</div>
      <button 
        onClick={() => playMinigame(night)}
        className="mt-20 text-xl text-white hover:text-yellow-500 z-10 border border-white/20 px-8 py-3 hover:bg-white/10 transition-colors uppercase tracking-widest"
      >
        Continue
      </button>
    </div>
  );
}

function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const handleDown = () => setClicked(true);
    const handleUp = () => setClicked(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75"
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div className={`relative ${clicked ? 'scale-90' : 'scale-100'} transition-transform duration-100`}>
        {/* Retro Yellow Pointer Cursor */}
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]"
        >
          <path 
            d="M8 4V24.5858C8 25.4767 9.07714 25.9229 9.70711 25.2929L15.2929 19.7071C15.6834 19.3166 16.3166 19.3166 16.7071 19.7071L22.2929 25.2929C22.9229 25.9229 24 25.4767 24 24.5858V4C24 3.44772 23.5523 3 23 3H9C8.44772 3 8 3.44772 8 4Z" 
            fill="#ffff00" 
            className="hidden" // This is just a placeholder path, using a standard arrow below
          />
          <path 
            d="M6 2L22 18L14.5 19L19 28L15.5 30L11 21L6 26V2Z" 
            fill="#ffff00" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
    </div>
  );
}

function AchievementNotifier() {
  const { activeAchievement } = useGameStore();

  return (
    <AnimatePresence>
      {activeAchievement && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.8 }}
          animate={{ y: 20, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.8 }}
          className="fixed top-0 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none"
        >
          <div className="bg-[#191919] border-2 border-[#c084fc] p-4 flex items-center gap-4 shadow-[0_0_30px_rgba(192,132,252,0.3)] rounded-lg min-w-[300px]">
             <div className="w-12 h-12 rounded-full bg-[#c084fc] flex items-center justify-center shrink-0 shadow-[0_0_10px_#c084fc]">
                <span className="text-[#191919] text-2xl font-bold">★</span>
             </div>
             <div className="font-mono">
                <div className="text-[10px] text-[#c084fc] uppercase tracking-[0.2em] font-bold mb-0.5">Achievement Unlocked</div>
                <div className="text-white text-lg font-bold leading-tight">{activeAchievement.name}</div>
                <div className="text-zinc-400 text-xs">{activeAchievement.description}</div>
             </div>
             <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const { gameState, tick, skipTo6AM } = useGameStore();

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const interval = setInterval(() => {
        tick();
      }, 1000); // 1 second real-time tick
      return () => clearInterval(interval);
    }
  }, [gameState, tick]);

  useEffect(() => {
     // Global gameplay cheats
     const downKeys = new Set<string>();
     const handleDown = (e: KeyboardEvent) => downKeys.add(e.key.toLowerCase());
     const handleUp = (e: KeyboardEvent) => {
        // C + D + + (numpad plus or regular plus)
        if (downKeys.has('c') && downKeys.has('d') && (e.key === '+' || e.code === 'NumpadAdd')) {
           skipTo6AM();
        }
        downKeys.delete(e.key.toLowerCase());
     };
     window.addEventListener('keydown', handleDown);
     window.addEventListener('keyup', handleUp);
     return () => {
        window.removeEventListener('keydown', handleDown);
        window.removeEventListener('keyup', handleUp);
     }
  }, [skipTo6AM]);

  return (
    <main className="w-full h-screen bg-black overflow-hidden font-mono text-white selection:bg-red-900/50 cursor-none">
      <CustomCursor />
      <AchievementNotifier />
      {gameState === 'WARNING' && <WarningScreen />}
      {gameState === 'MENU' && <MainMenu />}
      {gameState === 'LOADING' && <LoadingScreen />}
      {gameState === 'PLAYING' && <Office />}
      {gameState === 'JUMPSCARE' && <Jumpscare />}
      {gameState === 'GAMEOVER' && <GameOver />}
      {gameState === 'WIN' && <Win />}
      {gameState === 'MINIGAME' && <Minigame />}
    </main>
  );
}
