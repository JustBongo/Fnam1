import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store';
import CameraSystem from './CameraSystem';
import { setHumVolume, setFanVolume, playAlarm } from '../lib/audio';
import { MarcusModel, PiperModel, TinyMarcusModel, GuestModel, SmileUnitModel, GoldenMarcusModel } from './Models';
import PhoneCall from './PhoneCall';

export default function Office() {
  const officeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0.5);
  const alarmPlayedRef = useRef(false);
  
  const { 
    leftDoorOpen, rightDoorOpen, ventDoorOpen, sideVentDoorOpen,
    leftLightOn, rightLightOn, ventLightOn, sideVentLightOn,
    toggleLeftDoor, toggleRightDoor, toggleVentDoor, toggleSideVentDoor,
    toggleLeftLight, toggleRightLight, toggleVentLight, toggleSideVentLight,
    cameraOpen, toggleCamera, power, powerUsage, time, animatronics,
    maskOn, toggleMask, toxicity, flashCamera,
    isPaused, togglePause, setGameState
  } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Pause handling (Esc or `)
      if (key === 'escape' || key === '`') {
        togglePause();
        return;
      }

      if (power <= 0 || isPaused) return;
      // Doors
      if (key === 'a') toggleLeftDoor();
      if (key === 'd') toggleRightDoor();
      if (key === 'w') toggleVentDoor();
      if (key === 'x') toggleSideVentDoor();
      
      // Lights
      if (key === 'q') toggleLeftLight();
      if (key === 'e') toggleRightLight();
      if (key === 'r') toggleVentLight();
      if (key === 't') toggleSideVentLight();
      
      // Systems
      if (key === 's' || e.shiftKey) toggleMask();
      if (key === ' ') toggleCamera();
      if (key === 'f' && cameraOpen) flashCamera();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [power, isPaused, cameraOpen, toggleLeftDoor, toggleRightDoor, toggleVentDoor, toggleSideVentDoor, toggleLeftLight, toggleRightLight, toggleVentLight, toggleSideVentLight, toggleMask, toggleCamera, flashCamera, togglePause]);

  useEffect(() => {
    // Hum louder if power is on, quiet if power out
    if (power > 0) {
      setHumVolume(0.2);
      setFanVolume(0.15);
    } else {
      setHumVolume(0);
      setFanVolume(0);
      if (!alarmPlayedRef.current) {
        playAlarm();
        alarmPlayedRef.current = true;
      }
    }
  }, [power]);

  useEffect(() => {
     return () => setFanVolume(0); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const percentage = e.clientX / window.innerWidth;
      setMouseX(percentage);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (officeRef.current && containerRef.current) {
      const maxScroll = officeRef.current.scrollWidth - window.innerWidth;
      containerRef.current.scrollTo({
        left: maxScroll * mouseX,
        behavior: 'auto'
      });
    }
  }, [mouseX]);

  // Display formatting for time
  const tickCount = useGameStore(s => s.tickCount) || 0;
  const inGameSecondsTotal = (tickCount % 45) * 80;
  const inGameMinutes = Math.floor(inGameSecondsTotal / 60);
  const inGameSeconds = inGameSecondsTotal % 60;
  const formattedMin = inGameMinutes.toString().padStart(2, '0');
  const formattedSec = inGameSeconds.toString().padStart(2, '0');
  const displayHour = time === 0 ? 12 : time;

  const speedrunTimer = useGameStore(s => s.speedrunTimer) || 0;
  const debugMode = useGameStore(s => s.debugMode);
  const infiniteNight = useGameStore(s => s.infiniteNight);
  const batteryUpgrades = useGameStore(s => s.batteryUpgrades);
  const activeSubtitle = useGameStore(s => s.activeSubtitle);
  
  const srMin = Math.floor(speedrunTimer / 60).toString().padStart(2, '0');
  const srSec = (speedrunTimer % 60).toString().padStart(2, '0');

  if (power <= 0) {
    return (
      <div className="relative w-full h-screen bg-black overflow-hidden select-none crt flex items-center justify-center">
         <div className="scanlines z-[70] pointer-events-none"></div>
      </div>
    );
  }

  // If camera is open, we show it on top, but office is still behind it
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none crt" ref={containerRef}>
      
      {/* Pause Menu Overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center backdrop-blur-md">
           <div className="bg-zinc-900 border-4 border-zinc-700 p-12 flex flex-col items-center gap-8 shadow-[0_0_50px_black] rounded-lg">
              <h2 className="text-6xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_white]">PAUSED</h2>
              
              <div className="flex flex-col gap-4 w-64">
                 <button 
                   onClick={togglePause}
                   className="w-full bg-[#c084fc] text-black font-black py-4 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xl"
                 >
                   Resume
                 </button>
                 <button 
                   onClick={() => {
                     togglePause();
                     setGameState('MENU');
                   }}
                   className="w-full bg-zinc-800 text-zinc-300 font-black py-4 hover:bg-purple-900 hover:text-white transition-all uppercase tracking-widest text-xl border-2 border-zinc-700"
                 >
                   Quit to Menu
                 </button>
              </div>

              <div className="text-zinc-500 text-xs text-center uppercase tracking-widest">
                Night {useGameStore.getState().night} - {time === 0 ? 12 : time}:00 AM
              </div>
           </div>
        </div>
      )}

      {/* Office Wide Background */}
      <div 
        ref={officeRef}
        className={`relative h-full transition-transform 0.1s linear ${maskOn ? 'scale-105' : ''}`}
        style={{ width: '150vw' }}
      >
        {/* Basic Office Aesthetics - constructed with divs and gradients */}
         <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-800 to-black overflow-hidden flex justify-between px-10">
            {/* Ambient Office Lighting (Warm / Realistic) */}
            <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Window in front */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-64 border-[16px] border-[#111] bg-black flex flex-col items-center justify-center z-0 shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,20,30,0.5)_0%,rgba(0,0,0,1)_100%)] opacity-80" />
               <div className="w-full h-4 bg-[#111] absolute top-1/2 -translate-y-1/2" />
               <div className="w-4 h-full bg-[#111] absolute left-1/2 -translate-x-1/2" />
               <div className="absolute w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-20 pointer-events-none mix-blend-screen" />
            </div>

            {/* Left Door Area */}
            <div className="relative flex flex-col justify-end w-1/4 h-full pb-10 border-r-8 border-gray-950">
               <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent opacity-80" />
               
               {/* Left Door */}
               <div className={`absolute top-0 right-0 w-48 bg-zinc-700 border-x-4 border-b-8 border-zinc-900 transition-all duration-300 ease-in-out z-10 ${leftDoorOpen ? '-translate-y-full' : 'translate-y-0 h-full'}`}>
                 <div className="w-full h-1/4 border-b-2 border-zinc-800 bg-zinc-600"></div>
                 <div className="w-full h-1/4 border-b-2 border-zinc-800 bg-zinc-600"></div>
                 <div className="w-full h-1/4 border-b-2 border-zinc-800 bg-zinc-600"></div>
               </div>
               
               {/* Behind left door / Hallway */}
               <div className={`absolute top-0 right-0 w-48 h-full bg-black z-0 border-x-4 border-black flex items-center justify-center ${leftLightOn ? 'bg-zinc-800' : ''}`}>
                 {leftLightOn && animatronics['Piper'].location === 'CAM7A' && <PiperModel className="w-64 h-64 -translate-y-10 scale-150 drop-shadow-2xl" />}
               </div>

               {/* Left Controls */}
               <div className="absolute top-1/3 right-[14rem] z-40 flex flex-col gap-4 bg-zinc-800 p-2 rounded border-2 border-black shadow-xl shrink-0">
                  <div className="flex flex-col gap-2 border-zinc-700 pb-2">
                     <div className="text-[10px] text-zinc-500 text-center uppercase">Door</div>
                     <button 
                       onClick={toggleLeftDoor} 
                       className={`w-10 h-10 rounded-full border-4 ${leftDoorOpen ? 'bg-purple-800 border-purple-900' : 'bg-purple-500 border-purple-200'}`}
                     >DR</button>
                     <button 
                       onClick={toggleLeftLight}
                       className={`w-10 h-10 rounded-full border-4 transition-all ${!leftLightOn ? 'bg-zinc-300 border-zinc-500' : 'bg-white border-blue-200 shadow-[0_0_30px_#fff,0_0_50px_#fff,inset_0_0_10px_#fff] scale-110'}`}
                     >LT</button>
                  </div>
               </div>
            </div>

            {/* Center Desk Area */}
            <div className="relative w-2/4 flex flex-col items-center justify-between z-20">
               
               {/* Vent / Ceiling Area */}
               <div className="relative w-96 h-48 bg-zinc-900 border-x-8 border-b-8 border-black rounded-b-3xl overflow-hidden mt-[-10px] shadow-2xl">
                  {/* Vent Light Area */}
                  <div className={`absolute inset-0 transition-colors duration-200 ${ventLightOn ? 'bg-zinc-800' : 'bg-black'}`}>
                     {ventLightOn && animatronics['SmileUnit'].location === 'OFFICE' && (
                        <div className="flex justify-center items-center h-full">
                           <SmileUnitModel className="w-48 h-48 drop-shadow-[0_0_20px_white]" />
                        </div>
                     )}
                  </div>

                  {/* Vent Door */}
                  <div className={`absolute inset-0 bg-zinc-700 border-b-8 border-zinc-950 transition-all duration-300 ease-in-out z-10 ${ventDoorOpen ? '-translate-y-full' : 'translate-y-0'}`}>
                     <div className="w-full h-8 border-b border-zinc-800 bg-zinc-600"></div>
                     <div className="w-full h-8 border-b border-zinc-800 bg-zinc-600"></div>
                     <div className="w-full h-8 border-b border-zinc-800 bg-zinc-600"></div>
                  </div>

                  {/* Vent Controls */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                     <button 
                        onClick={toggleVentDoor} 
                        className={`w-10 h-10 rounded-full border-2 text-xs font-bold flex items-center justify-center ${ventDoorOpen ? 'bg-purple-800 border-purple-900 text-purple-200' : 'bg-purple-500 border-purple-200 text-white shadow-[0_0_10px_purple]'}`}
                     >VENT</button>
                     <button 
                        onClick={toggleVentLight}
                        className={`w-10 h-10 rounded-full border-2 text-xs font-bold flex items-center justify-center transition-all ${!ventLightOn ? 'bg-zinc-300 border-zinc-500 text-zinc-600' : 'bg-white border-blue-200 text-black shadow-[0_0_20px_#fff] scale-110'}`}
                     >LIT</button>
                  </div>
               </div>

               <div className="flex flex-col items-center justify-end h-full w-full pb-10">
                 {/* Piper in the Office */}
                 {animatronics['Piper'].location === 'OFFICE' && (
                 <div className="absolute inset-x-0 bottom-40 flex justify-center items-end pointer-events-none z-10">
                    <PiperModel className="w-[800px] h-[800px] drop-shadow-[0_0_50px_rgba(255,255,255,0.05)] opacity-95 transition-opacity" />
                 </div>
               )}

               {/* Guest in the Office */}
               {animatronics['TheGuest'].location === 'OFFICE' && (
                 <div className="absolute inset-x-0 bottom-40 flex justify-center items-end pointer-events-none z-10">
                    <GuestModel className="w-[1000px] h-[1000px] drop-shadow-[0_0_50px_rgba(0,0,0,1)] opacity-40 transition-opacity mix-blend-multiply" />
                 </div>
               )}

               {/* Desk */}
               <div className="w-[180%] h-48 bg-zinc-800 border-t-8 border-zinc-950 flex justify-center items-end relative overflow-hidden rounded-t-[2rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
                  {/* Desk Fan */}
                  <div className="absolute left-20 bottom-8 w-24 h-32 flex flex-col items-center z-10">
                     <div className="w-20 h-20 rounded-full border-4 border-gray-600 flex items-center justify-center animate-spin">
                        <div className="w-2 h-16 bg-gray-500 absolute"></div>
                        <div className="w-16 h-2 bg-gray-500 absolute"></div>
                     </div>
                     <div className="w-4 h-12 bg-gray-700"></div>
                     <div className="w-16 h-4 bg-gray-800 rounded"></div>
                  </div>

                  {/* Functional Radio */}
                  <div 
                    className="absolute left-60 bottom-10 w-24 h-16 bg-zinc-950 border-2 border-zinc-700 rounded-md cursor-pointer hover:bg-zinc-800 transition-colors shadow-2xl flex flex-col items-center justify-between p-2 z-10"
                    onClick={() => {
                        import('../lib/audio').then(m => {
                           m.setStaticVolume(0.8);
                           useGameStore.setState({ activeSubtitle: "* BZZZZZT * ...do not trust them... * KSHHH *" });
                           setTimeout(() => {
                              m.setStaticVolume(0);
                              useGameStore.setState({ activeSubtitle: null });
                           }, 3000);
                        });
                    }}
                  >
                     <div className="w-full flex justify-between px-1">
                        <div className="w-2 h-2 rounded-full bg-red-500 pointer-events-none"></div>
                        <div className="w-8 h-1 bg-zinc-600"></div>
                     </div>
                     <div className="w-full h-6 flex gap-1 items-center justify-center pointer-events-none">
                        <div className="w-1 h-2 bg-red-900 rounded-full animate-pulse"></div>
                        <div className="w-1 h-4 bg-red-900 rounded-full animate-pulse delay-75"></div>
                        <div className="w-1 h-3 bg-red-900 rounded-full animate-pulse delay-150"></div>
                        <div className="w-1 h-5 bg-red-900 rounded-full animate-pulse delay-300"></div>
                     </div>
                  </div>

                  {/* Monitors */}
                  <div className="absolute right-40 bottom-6 w-32 h-24 bg-gray-900 border-4 border-gray-700 rounded p-2 z-0">
                     <div className="w-full h-full bg-green-900/20 crt"></div>
                  </div>
                  
                  {/* Coffee Cup */}
                  <div 
                     className="absolute left-1/3 bottom-8 w-12 h-16 bg-blue-800 rounded-b-lg border-t-4 border-white cursor-pointer hover:-translate-y-2 transition-transform shadow-lg z-10"
                     onClick={() => {
                        useGameStore.setState({ activeSubtitle: "* sip * Mmm, cold coffee." });
                        setTimeout(() => useGameStore.setState({ activeSubtitle: null }), 2000);
                     }}
                  >
                     <div className="absolute -right-3 top-4 w-4 h-8 border-4 border-blue-800 rounded-r-full"></div>
                     <div className="absolute w-full h-full flex flex-col overflow-hidden opacity-50 rounded-b-lg">
                        <div className="text-[8px] text-white rotate-90 transform origin-left translate-x-4 translate-y-2 mt-4 ml-6 uppercase">World's #1 Guard</div>
                     </div>
                  </div>

                  {/* Scattered Papers */}
                  <div 
                     className="absolute left-[45%] bottom-4 w-16 h-20 bg-[#f4ebd0] rotate-12 cursor-pointer shadow-md border border-[#e0cca0] hover:scale-110 transition-transform z-0 p-1"
                     onClick={() => {
                        useGameStore.setState({ activeSubtitle: "Memo: 'Do NOT open the sealed vent under any circumstances.'" });
                        setTimeout(() => useGameStore.setState({ activeSubtitle: null }), 3500);
                     }}
                  >
                     <div className="w-1/2 h-1 bg-black/60 mb-1"></div>
                     <div className="w-full h-1 bg-black/40 mb-1"></div>
                     <div className="w-3/4 h-1 bg-black/40 mb-2"></div>
                     <div className="w-full h-1 bg-red-900/40 mb-1"></div>
                  </div>
                  <div 
                     className="absolute left-[48%] bottom-6 w-16 h-20 bg-[#e0d6b8] -rotate-6 cursor-pointer shadow-md border border-[#c2b591] hover:scale-110 transition-transform z-0 p-2"
                     onClick={() => {
                        useGameStore.setState({ activeSubtitle: "Children's drawing: A yellow bear with black eyes." });
                        setTimeout(() => useGameStore.setState({ activeSubtitle: null }), 3000);
                     }}
                  >
                     <div className="w-8 h-8 rounded-full border-4 border-yellow-800 opacity-60 mx-auto mt-2"></div>
                     <div className="w-2 h-2 rounded-full bg-black absolute top-4 left-4"></div>
                     <div className="w-2 h-2 rounded-full bg-black absolute top-4 right-4"></div>
                  </div>
                  
                  {/* Tiny Marcus */}
                  {animatronics['TinyMarcus'].location === 'OFFICE' && (
                     <div 
                         className="absolute right-40 bottom-6 w-16 h-16 cursor-pointer -rotate-12 hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,0,0,0.3)] z-50 rounded-full bg-black/20"
                         onClick={useGameStore.getState().clickTinyMarcus}
                     >
                         <TinyMarcusModel className="w-full h-full drop-shadow-lg" />
                     </div>
                  )}
               </div>
               
               {/* Poster */}
               <div className="absolute top-10 left-[75%] -translate-x-1/2 w-48 h-64 bg-yellow-900/30 border-4 border-black flex flex-col items-center justify-center -rotate-2 opacity-60 mix-blend-multiply z-10">
                 <div className="text-3xl font-black text-black">LET'S</div>
                 <div className="text-5xl font-black text-black">PARTY!</div>
               </div>
            </div>
          </div>

            {/* Right Door Area */}
            <div className="relative flex flex-col justify-end w-1/4 h-full pb-10 border-l-8 border-gray-950">
               <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent opacity-80" />
               
               {/* Right Door */}
               <div className={`absolute top-0 left-0 w-48 bg-zinc-700 border-x-4 border-b-8 border-zinc-900 transition-all duration-300 ease-in-out z-10 ${rightDoorOpen ? '-translate-y-full' : 'translate-y-0 h-full'}`}>
                 <div className="w-full h-1/4 border-b-2 border-zinc-800 bg-zinc-600"></div>
                 <div className="w-full h-1/4 border-b-2 border-zinc-800 bg-zinc-600"></div>
                 <div className="w-full h-1/4 border-b-2 border-zinc-800 bg-zinc-600"></div>
               </div>

                {/* Behind right door / Hallway */}
                <div className={`absolute top-0 left-0 w-48 h-full bg-black z-0 border-x-4 border-black flex flex-col items-center justify-center ${rightLightOn ? 'bg-zinc-800' : ''}`}>
                  {rightLightOn && animatronics['Marcus'].location === 'CAM7B' && <MarcusModel className="w-64 h-64 -translate-y-10 scale-150 drop-shadow-2xl opacity-80" />}
                  
                  {/* Side Vent inside Hallway */}
                  <div className="mt-20 relative w-32 h-32 bg-zinc-950 border-2 border-zinc-800 rounded-lg overflow-hidden shadow-inner">
                     <div className={`absolute inset-0 transition-colors duration-200 ${sideVentLightOn ? 'bg-zinc-800' : 'bg-black'}`}>
                        {sideVentLightOn && animatronics['SmileUnit'].location === 'OFFICE' && <SmileUnitModel className="w-full h-full opacity-50" />}
                     </div>
                     <div className={`absolute inset-0 bg-zinc-800 transition-all duration-300 ${sideVentDoorOpen ? '-translate-y-full' : 'translate-y-0'}`}>
                        <div className="w-full h-4 bg-zinc-700 border-b border-black"></div>
                        <div className="w-full h-4 bg-zinc-700 border-b border-black"></div>
                        <div className="w-full h-4 bg-zinc-700 border-b border-black"></div>
                     </div>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="absolute top-1/3 left-[14rem] z-40 flex flex-col gap-4 bg-zinc-800 p-2 rounded border-2 border-black shadow-xl shrink-0">
                   <div className="flex flex-col gap-2 border-b border-zinc-700 pb-2">
                      <div className="text-[10px] text-zinc-500 text-center uppercase">Door</div>
                      <button 
                        onClick={toggleRightDoor} 
                        className={`w-10 h-10 rounded-full border-4 ${rightDoorOpen ? 'bg-purple-800 border-purple-900' : 'bg-purple-500 border-purple-200'}`}
                      >DR</button>
                      <button 
                        onClick={toggleRightLight}
                        className={`w-10 h-10 rounded-full border-4 transition-all ${!rightLightOn ? 'bg-zinc-300 border-zinc-500' : 'bg-white border-blue-200 shadow-[0_0_30px_#fff,0_0_50px_#fff,inset_0_0_10px_#fff] scale-110'}`}
                      >LT</button>
                   </div>
                   <div className="flex flex-col gap-2">
                      <div className="text-[10px] text-zinc-500 text-center uppercase">Vent</div>
                      <button 
                        onClick={toggleSideVentDoor} 
                        className={`w-10 h-10 rounded-full border-2 text-[10px] font-bold flex items-center justify-center ${sideVentDoorOpen ? 'bg-purple-950 border-purple-900 text-purple-500' : 'bg-purple-600 border-purple-200 text-white shadow-[0_0_10px_purple]'}`}
                      >SIDE</button>
                      <button 
                        onClick={toggleSideVentLight}
                        className={`w-10 h-10 rounded-full border-2 text-[10px] font-bold flex items-center justify-center transition-all ${!sideVentLightOn ? 'bg-zinc-400 border-zinc-600 text-zinc-700' : 'bg-white border-blue-200 text-black shadow-[0_0_20px_#fff]'}`}
                      >LIT</button>
                   </div>
                </div>
            </div>
         </div>
      </div>

      {/* Persistent UI overlays (not scrolling) */}
      
      {/* Power Meter */}
      <div className="absolute bottom-4 left-4 z-50 text-xl flex flex-col gap-1 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
        <div>Power left: {Math.max(0, Math.floor(power))}%</div>
        <div className="flex gap-1 items-center">
          Usage: 
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-3 h-6 ${i < powerUsage ? 'bg-green-500' : 'bg-gray-800'} border border-black`} />
          ))}
        </div>
      </div>
      
      {/* Toxicity Bar */}
      <div className="absolute top-4 left-4 z-50 w-64">
         <div className="flex justify-between text-yellow-500 mb-1 border-b border-yellow-700/50 pb-1">
            <span className="font-bold tracking-widest">TOXICITY</span>
            <span>{Math.floor(toxicity)}%</span>
         </div>
         <div className="w-full h-4 bg-zinc-900 border-2 border-yellow-800/80 p-[1px]">
            <div className={`h-full transition-all duration-300 ${toxicity > 80 ? 'bg-red-600' : 'bg-yellow-500'}`} style={{ width: `${toxicity}%` }} />
         </div>
         {toxicity > 80 && (
            <div className="text-red-500 mt-2 animate-pulse font-bold tracking-widest text-center border-y border-red-500 py-1 bg-red-900/20">
               WARNING: TOXICITY CRITICAL
            </div>
         )}
      </div>

      {<PhoneCall />}

      {/* Time */}
      <div className="absolute top-4 right-4 z-50 text-4xl text-right drop-shadow-[0_2px_2px_rgba(0,0,0,1)] flex flex-col items-end">
        <div className="flex items-baseline gap-1">
           {infiniteNight ? (
             <span className="text-purple-400">∞</span>
           ) : (
             <>
               <span>{displayHour}:{formattedMin}</span>
               <span className="text-xl text-zinc-400">:{formattedSec}</span>
               <span className="ml-2 text-3xl">AM</span>
             </>
           )}
        </div>
        <div className="text-2xl text-gray-300 font-bold">Night {useGameStore(s => s.night)}</div>
        
        <div className="mt-2 text-purple-400 text-sm tracking-widest font-mono select-none drop-shadow-md">
           SPEEDRUN: {srMin}:{srSec}
        </div>
        
        {debugMode && (
           <div className="mt-4 text-xs font-mono text-green-400 opacity-80 text-right uppercase absolute top-28 right-0 border border-green-500 bg-black/50 p-2">
             [DEBUG MODE ACTIVE]<br/>
             Power: {Math.floor(power)}%<br/>
             Battery Upgrades: {batteryUpgrades}/3<br/>
             L-Door: {leftDoorOpen ? 'UP' : 'DN'}<br/>
             R-Door: {rightDoorOpen ? 'UP' : 'DN'}
           </div>
        )}
      </div>

      {/* Subtitles */}
      {activeSubtitle && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[55] w-full max-w-2xl text-center pointer-events-none">
          <span className="bg-black/80 text-zinc-300 font-sans px-4 py-2 text-lg tracking-wider border border-zinc-700/50 shadow-2xl backdrop-blur-sm animate-pulse rounded">
             "{activeSubtitle}"
          </span>
        </div>
      )}

      {/* Toggle Monitor */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 w-96 h-12 bg-white/10 hover:bg-white/20 border-2 border-white/50 cursor-pointer flex items-center justify-center z-[60] backdrop-blur transition-all bottom-4`}
        onClick={toggleCamera}
      >
         <span className="text-white font-bold uppercase tracking-widest">{cameraOpen ? 'Close Monitor' : 'Open Monitor'}</span>
      </div>

      {/* Toggle Mask */}
      <div 
        className={`absolute right-4 md:right-1/4 bottom-4 w-64 h-12 ${maskOn ? 'bg-purple-900/80 hover:bg-purple-800 border-purple-500' : 'bg-purple-900/40 hover:bg-purple-900/60 border-purple-500/50'} cursor-pointer flex items-center justify-center z-[60] backdrop-blur transition-all border-2`}
        onClick={toggleMask}
      >
         <span className="text-purple-200 font-bold uppercase tracking-widest">{maskOn ? 'Remove Mask' : 'Put on Mask'}</span>
      </div>

      {cameraOpen && (
          <div className="absolute inset-0 z-50">
             <CameraSystem />
          </div>
      )}

      {/* Mask Overlay */}
      {maskOn && (
         <svg className="absolute inset-0 w-full h-full z-[55] pointer-events-none opacity-95" preserveAspectRatio="none">
           <defs>
             <mask id="mask-holes">
               <rect width="100%" height="100%" fill="white" />
               <ellipse cx="30%" cy="50%" rx="18%" ry="22%" fill="black" filter="blur(25px)" />
               <ellipse cx="70%" cy="50%" rx="18%" ry="22%" fill="black" filter="blur(25px)" />
             </mask>
           </defs>
           <rect width="100%" height="100%" fill="black" mask="url(#mask-holes)" />
           {/* Stitching / Details */}
           <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#111" strokeWidth="4" strokeDasharray="10 5" opacity="0.3" />
         </svg>
      )}

      <div className="scanlines z-[70] pointer-events-none"></div>
    </div>
  );
}
