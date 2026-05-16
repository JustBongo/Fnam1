import { useEffect, useState } from 'react';
import { useGameStore, AnimatronicName, TAPES_LORE } from '../store';
import { setStaticVolume } from '../lib/audio';
import { MarcusModel, PiperModel, RustyModel, VhsModel, MelodyModel, BouncerModel, SmileUnitModel, GuestModel } from './Models';

const CAMERAS = [
  { id: 'CAM1', name: 'Show Stage', x: 20, y: 20 },
  { id: 'CAM2', name: 'Pirate Theater', x: 20, y: 50 },
  { id: 'CAM3', name: 'Prize Hall', x: 50, y: 20 },
  { id: 'CAM4', name: 'Ball Pit Room', x: 80, y: 20 },
  { id: 'CAM5', name: 'Storage Corridor', x: 50, y: 50 },
  { id: 'CAM6', name: 'Kitchen', x: 80, y: 50 },
  { id: 'CAM7A', name: 'Left Hall', x: 30, y: 80 },
  { id: 'CAM7B', name: 'Right Hall', x: 70, y: 80 },
  { id: 'BASEMENT', name: 'Basement Facility', x: 90, y: 80 },
];

const CAMERA_STYLES: Record<string, string> = {
  CAM1: 'bg-zinc-900 border-b-[20vh] border-zinc-950', // Show Stage
  CAM2: 'bg-red-950/20 shadow-[inset_0_0_100px_rgba(100,0,0,0.5)] bg-slate-900', // Pirate Theater
  CAM3: 'bg-zinc-800 border-b-[30vh] border-zinc-900 shadow-[inset_0_0_50px_black]', // Prize Hall
  CAM4: 'bg-blue-950/20 bg-slate-800 shadow-[inset_0_0_80px_black]', // Ball Pit Room
  CAM5: 'bg-zinc-900 border-x-[10vw] border-black', // Storage Corridor
  CAM6: 'bg-zinc-700 shadow-[inset_0_0_150px_black] border-b-[10vh] border-zinc-800', // Kitchen
  CAM7A: 'bg-zinc-900 border-l-[15vw] border-black border-b-[5vh] border-zinc-950', // Left Hall
  CAM7B: 'bg-zinc-900 border-r-[15vw] border-black border-b-[5vh] border-zinc-950', // Right Hall
  BASEMENT: 'bg-zinc-950 shadow-[inset_0_0_200px_black] bg-red-900/5', // Basement Facility
};

export default function CameraSystem() {
  const { currentCamera, setCamera, animatronics, toggleCamera, activeTapeSpawn, collectTape, flashCamera, isFlashing, cameraUpgrades, popups, closePopup } = useGameStore();
  const [staticFade, setStaticFade] = useState(false);

  const isMelodyActive = animatronics['Melody'].location === currentCamera;

  useEffect(() => {
    setStaticVolume(0.05); // low static while camera Open
    return () => setStaticVolume(0);
  }, []);

  const handleSetCamera = (id: string) => {
    if (id === currentCamera) return;
    setStaticFade(true);
    setStaticVolume(0.3); // loud static during switch
    setCamera(id);
    setTimeout(() => {
      setStaticFade(false);
      setStaticVolume(0.05);
    }, 300);
  };

  // Find who is in this camera
  const inCam = Object.values(animatronics).filter(a => a.location === currentCamera);
  
  // Find tape in this camera
  const hasTape = activeTapeSpawn && TAPES_LORE.find(t => t.id === activeTapeSpawn)?.camId === currentCamera;

  return (
    <div className="absolute inset-0 z-40 bg-zinc-950 flex flex-col crt shadow-[inset_0_0_100px_#000]">
      {cameraUpgrades.nightVision && (
         <div className="absolute inset-0 z-[55] bg-green-900/10 mix-blend-screen pointer-events-none" />
      )}
      
      {/* Camera Viewport */}
      <div className={`relative flex-1 overflow-hidden ${cameraUpgrades.nightVision ? 'brightness-150 contrast-125 saturate-50' : ''}`}>
        {/* Render Environment Placeholder based on Camera */}
        <div className={`absolute inset-0 transition-all duration-500 overflow-hidden ${CAMERA_STYLES[currentCamera] || 'bg-black'}`}>
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
           <div className="flex items-center justify-center h-full">
             <h1 className="text-8xl text-white/5 select-none uppercase tracking-[0.5em] font-black">{CAMERAS.find(c => c.id === currentCamera)?.name}</h1>
           </div>
        </div>
        
        {/* Details in the room (shelves, pipes, etc) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
           {currentCamera === 'CAM5' && <div className="absolute top-1/4 left-1/2 w-4 bg-zinc-800 h-full border-x-2 border-black -translate-x-1/2" />}
           {currentCamera === 'CAM6' && <div className="absolute inset-20 border-4 border-zinc-800 rounded-full" />}
           {currentCamera === 'BASEMENT' && <div className="absolute inset-0 bg-red-900/10 animate-pulse" />}
        </div>
        
        {/* Flash Effect */}
        {isFlashing && (
           <>
              <div className="absolute inset-0 bg-white z-[60] pointer-events-none opacity-90 transition-opacity"></div>
              <div className="absolute inset-x-20 top-20 bottom-20 bg-white/50 blur-[100px] z-[61] pointer-events-none"></div>
           </>
        )}

        {/* Melody Static Boost */}
        {isMelodyActive && <div className="absolute inset-0 static-heavy z-[55] opacity-50 pointer-events-none mix-blend-color-burn"></div>}

        {/* Flash Button */}
        <button 
           onClick={flashCamera}
           className={`absolute top-1/2 right-12 z-50 px-6 py-4 border-2 uppercase tracking-widest backdrop-blur-sm transition-all ${
             isFlashing 
             ? 'bg-white text-black border-white shadow-[0_0_50px_#fff,inset_0_0_20px_#fff]' 
             : 'border-yellow-500 bg-yellow-900/30 hover:bg-yellow-500 hover:text-black text-yellow-500 shadow-[0_0_20px_#ca8a04]'
           }`}
        >
           Flash
        </button>

        {/* Render Animatronics if present */}
        {inCam.map((anim, idx) => (
          <div key={anim.name} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ml-${idx*24} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mix-blend-screen scale-150`}>
            {anim.name === 'Marcus' && <MarcusModel />}
            {anim.name === 'Piper' && <PiperModel />}
            {anim.name === 'Rusty' && <RustyModel />}
            {anim.name === 'Melody' && <MelodyModel />}
            {anim.name === 'Bouncer' && <BouncerModel />}
            {anim.name === 'SmileUnit' && <SmileUnitModel />}
            {anim.name === 'TheGuest' && <GuestModel />}
          </div>
        ))}
        
        {/* Render VHS Tape Collectible */}
        {hasTape && (
          <div 
             className="absolute bottom-32 right-[40%] cursor-pointer hover:scale-110 transition-transform drop-shadow-[0_0_10px_#fff] z-30 opacity-70 hover:opacity-100"
             onClick={() => collectTape(activeTapeSpawn)}
          >
             <VhsModel className="w-16 h-10" />
             <div className="text-white text-xs text-center mt-1 bg-black/50 px-1 uppercase scale-75 border border-white/30">Click to Collect</div>
          </div>
        )}
        
        {/* Static Overlay when switching */}
        {staticFade && <div className="absolute inset-0 static-heavy"></div>}
        <div className="absolute inset-0 static-noise pointer-events-none"></div>
        <div className="scanlines"></div>
        
        {/* Ad / Error Popups */}
        {popups.map(popup => (
           <div 
             key={popup.id}
             className="absolute z-[70] bg-zinc-200 border-2 border-zinc-500 shadow-[0_0_20px_black] text-black w-64 pointer-events-auto"
             style={{ left: `${popup.x}%`, top: `${popup.y}%` }}
           >
             <div className="bg-blue-800 text-white px-2 py-1 flex justify-between items-center font-sans font-bold text-sm">
                <span>{popup.title}</span>
                <button onClick={() => closePopup(popup.id)} className="bg-red-500 hover:bg-red-600 px-2 rounded-sm ml-2">X</button>
             </div>
             <div className="p-4 bg-zinc-100 font-sans text-center text-sm border-t border-zinc-400">
                <div className="text-4xl text-red-600 mb-2 font-black">!</div>
                {popup.text}
                <button onClick={() => closePopup(popup.id)} className="mt-4 bg-zinc-300 hover:bg-zinc-400 border border-zinc-500 px-4 py-1 text-black font-bold">OK</button>
             </div>
           </div>
        ))}
        
        {/* Recording / UI overlay */}
        <div className="absolute top-8 left-12 flex items-center gap-4">
          <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse blur-[1px]"></div>
          <div className="text-3xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">REC</div>
        </div>
        
        <div className="absolute top-8 right-12 z-50 p-4 border border-white/50 bg-black/50 backdrop-blur">
          <div className="text-2xl text-white">{currentCamera}</div>
          <div className="text-xl text-zinc-400">{CAMERAS.find(c => c.id === currentCamera)?.name}</div>
        </div>

      </div>

      {/* Map Overlay */}
      <div className="absolute bottom-20 right-12 w-80 h-80 border-2 border-white/30 bg-black/60 p-4 relative hidden md:block backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.8)]">
         <div className="text-lg text-white/50 mb-2 border-b border-white/20 pb-1">MAP :: SUB-LEVEL 1</div>
         {CAMERAS.map(cam => {
           const hasMovement = cameraUpgrades.motionTracked && Object.values(animatronics).some(a => a.location === cam.id);
           return (
             <button
               key={cam.id}
               onClick={() => handleSetCamera(cam.id)}
               className={`absolute px-2 py-1 text-xs border-2 transition-colors flex items-center justify-center gap-1 ${
                 currentCamera === cam.id 
                   ? 'bg-white text-black border-white' 
                   : 'bg-zinc-800 text-white border-zinc-500 hover:bg-zinc-700'
               }`}
               style={{ left: `${cam.x}%`, top: `${cam.y}%`, transform: 'translate(-50%, -50%)' }}
             >
               {hasMovement && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_red]" />}
               {cam.id}
             </button>
           );
         })}
         
         <div className="absolute bottom-4 mx-auto left-0 right-0 text-center text-red-500/50 text-xs tracking-widest border border-red-500/50 w-24">YOU ARE HERE</div>
      </div>
    </div>
  );
}
