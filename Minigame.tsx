import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store';

// Night 1
const baseWalls = [
  { x: 30, y: 0, w: 10, h: 40 },
  { x: 30, y: 60, w: 10, h: 40 },
  { x: 60, y: 20, w: 10, h: 60 },
];

export default function Minigame() {
  const { setGameState, minigameNight } = useGameStore();
  const [playerPos, setPlayerPos] = useState({ x: 10, y: 50 });
  const [won, setWon] = useState(false);
  const [dead, setDead] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Levels data depending on the night
  const [walls, setWalls] = useState(baseWalls);
  const [goalPos, setGoalPos] = useState({ x: 85, y: 50, w: 12, h: 16 });
  const [hiddenDanger, setHiddenDanger] = useState<null | {x: number, y: number, r: number, dx?: number, dy?: number}>(null);
  const [objectiveText, setObjectiveText] = useState("Find the yellow suit.");

  useEffect(() => {
     // Check if mobile
     if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
         setIsMobile(true);
     }

     switch(minigameNight) {
        case 1:
          setWalls(baseWalls);
          setGoalPos({ x: 85, y: 50, w: 12, h: 16 });
          setObjectiveText("Find the yellow suit.");
          setHiddenDanger({x: 80, y: 85, r: 8});
          break;
        case 2:
          setWalls([
             { x: 20, y: 20, w: 60, h: 10 },
             { x: 20, y: 70, w: 60, h: 10 },
             { x: 50, y: 30, w: 10, h: 30 }
          ]);
          setPlayerPos({ x: 10, y: 10 });
          setGoalPos({ x: 50, y: 85, w: 8, h: 8 });
          setObjectiveText("Find the scattered pieces.");
          setHiddenDanger({x: 20, y: 50, r: 8});
          break;
        case 3:
          setWalls([
             { x: 10, y: 10, w: 10, h: 80 },
             { x: 35, y: 10, w: 10, h: 80 },
             { x: 60, y: 10, w: 10, h: 80 },
             { x: 85, y: 10, w: 10, h: 80 },
          ]);
          setPlayerPos({ x: 25, y: 50 });
          setGoalPos({ x: 75, y: 50, w: 10, h: 10 });
          setObjectiveText("Hurry.");
          setHiddenDanger({x: 50, y: 50, r: 15});
          break;
        case 4:
          setWalls([
             { x: 0, y: 45, w: 40, h: 10 },
             { x: 60, y: 45, w: 40, h: 10 },
          ]);
          setPlayerPos({ x: 50, y: 10 });
          setGoalPos({ x: 50, y: 90, w: 12, h: 16 });
          setObjectiveText("Do not wake them.");
          setHiddenDanger({x: 50, y: 50, r: 10, dx: 1, dy: 0});
          break;
        case 5:
          // A glitchy maze
          setWalls([
             { x: 30, y: 30, w: 40, h: 40 }
          ]);
          setPlayerPos({ x: 10, y: 10 });
          setGoalPos({ x: 90, y: 90, w: 12, h: 16 });
          setObjectiveText("It's almost over.");
          setHiddenDanger({x: 50, y: 50, r: 8});
          break;
        case 6:
        case 7:
          setWalls([]);
          setPlayerPos({ x: 50, y: 90 });
          setGoalPos({ x: 50, y: 10, w: 20, h: 10 });
          setObjectiveText("Tomorrow is another day.");
          setHiddenDanger({x: 20, y: 20, r: 12});
          break;
     }

     if (minigameNight === 4) {
         const interval = setInterval(() => {
             if (won || dead) return;
             setHiddenDanger(prev => {
                if (!prev) return prev;
                let nx = prev.x + (prev.dx || 0);
                if (nx > 80 || nx < 20) nx = prev.x;
                return { ...prev, x: nx };
             });
         }, 50);
         return () => clearInterval(interval);
     }
  }, [minigameNight, won, dead]);

  // Touch controls logic
  const moveRef = useRef<{ dx: number, dy: number } | null>(null);
  
  useEffect(() => {
    let handle: number;
    const loop = () => {
       if (moveRef.current) {
          move(moveRef.current.dx, moveRef.current.dy);
       }
       handle = requestAnimationFrame(loop);
    };
    handle = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(handle);
  }, [won, dead, walls, goalPos, hiddenDanger, setGameState]);

  const move = (dx: number, dy: number) => {
    if (won || dead) return;
    const speed = 2;
    setPlayerPos(prev => {
        let newX = prev.x + dx * speed;
        let newY = prev.y + dy * speed;
        
        newX = Math.max(2, Math.min(newX, 98));
        newY = Math.max(2, Math.min(newY, 98));

        for (const wall of walls) {
           if (newX > wall.x && newX < wall.x + wall.w && newY > wall.y && newY < wall.y + wall.h) {
              return prev; 
           }
        }

        if (newX > goalPos.x - goalPos.w/2 && newX < goalPos.x + goalPos.w/2 && newY > goalPos.y - goalPos.h/2 && newY < goalPos.y + goalPos.h/2) {
           setWon(true);
           setTimeout(() => setGameState('MENU'), 4000);
        }
        
        if (hiddenDanger && newX > hiddenDanger.x - hiddenDanger.r && newX < hiddenDanger.x + hiddenDanger.r && newY > hiddenDanger.y - hiddenDanger.r && newY < hiddenDanger.y + hiddenDanger.r) {
           setDead(true);
           setTimeout(() => setGameState('MENU'), 3000);
        }

        return { x: newX, y: newY };
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp' || e.key === 'w') move(0, -1);
        if (e.key === 'ArrowDown' || e.key === 's') move(0, 1);
        if (e.key === 'ArrowLeft' || e.key === 'a') move(-1, 0);
        if (e.key === 'ArrowRight' || e.key === 'd') move(1, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [won, dead, walls, goalPos, hiddenDanger, setGameState]);

  return (
    <div className="w-full h-screen bg-black crt flex flex-col items-center justify-center p-8 font-mono overflow-hidden selection:bg-transparent">
       <div className="absolute top-10 left-10 text-white text-2xl animate-pulse tracking-widest drop-shadow-[0_0_5px_white]">
          Night {minigameNight > 6 ? 6 : minigameNight}
       </div>
       <div className="absolute top-16 left-10 text-zinc-500 text-lg uppercase tracking-widest">
          {objectiveText}
       </div>
       
       <div className="w-full max-w-[800px] aspect-video border-4 border-white relative bg-black overflow-hidden scale-110">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9IiMxMTEiLz48cGF0aCBkPSJNMCAwaDQwdjJIMFoiIGZpbGw9IiMzMzMiLz48cGF0aCBkPSJNMCAwaDJ2NDBIMFoiIGZpbGw9IiMzMzMiLz4KPC9zdmc+')] opacity-20" />
          
          {/* Walls */}
          {walls.map((wall, i) => (
             <div 
               key={i} 
               className="absolute bg-white" 
               style={{ left: `${wall.x}%`, top: `${wall.y}%`, width: `${wall.w}%`, height: `${wall.h}%` }}
             />
          ))}

          {/* Player Sprite */}
          <div 
             className={`absolute w-8 h-8 md:w-12 md:h-12 bg-purple-600 transition-all duration-75 ${dead ? 'rotate-90 opacity-50' : ''}`}
             style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: dead ? 'translate(-50%, -50%) rotate(90deg)' : 'translate(-50%, -50%)' }}
          >
             {/* Eyes */}
             <div className="w-2 h-2 md:w-3 md:h-3 bg-white absolute top-1 md:top-2 left-1 md:left-2 flex items-center justify-center">
                <div className="w-1 h-1 bg-black" />
             </div>
             <div className="w-2 h-2 md:w-3 md:h-3 bg-white absolute top-1 md:top-2 right-1 md:right-2 flex items-center justify-center">
                <div className="w-1 h-1 bg-black" />
             </div>
             <div className="absolute -bottom-3 left-1 w-2 h-4 md:-bottom-4 md:left-2 md:w-2 md:h-6 bg-purple-600" />
             <div className="absolute -bottom-3 right-1 w-2 h-4 md:-bottom-4 md:right-2 md:w-2 md:h-6 bg-purple-600" />
          </div>

          {/* Goal Sprite */}
          {minigameNight === 6 ? (
             <div className="absolute bg-purple-900 border-b-8 border-r-8 border-purple-800" style={{ left: `${goalPos.x}%`, top: `${goalPos.y}%`, width: `${goalPos.w}%`, height: `${goalPos.h}%`, transform: 'translate(-50%, -50%)' }} />
          ) : (
             <div className="absolute bg-yellow-600" style={{ left: `${goalPos.x}%`, top: `${goalPos.y}%`, width: `12%`, height: `16%`, transform: 'translate(-50%, -50%)' }}>
                <div className="w-4 h-4 bg-black absolute top-2 left-2 rounded-full" />
                <div className="w-4 h-4 bg-black absolute top-2 right-2 rounded-full" />
                <div className="w-8 h-4 bg-black absolute bottom-2 left-2" />
             </div>
          )}
          
          {/* Hidden danger */}
          {hiddenDanger && (
              <div 
                 className={`absolute bg-red-900 rounded-full animate-pulse mix-blend-screen ${minigameNight === 5 ? 'opacity-80 scale-150' : 'opacity-20 '}`} 
                 style={{ left: `${hiddenDanger.x}%`, top: `${hiddenDanger.y}%`, width: `${hiddenDanger.r * 2}%`, height: `${hiddenDanger.r * 2}%`, transform: 'translate(-50%, -50%)' }} 
              />
          )}
          
          
          {won && (
             <div className="absolute inset-0 bg-yellow-900/50 flex flex-col items-center justify-center text-2xl md:text-4xl text-white font-bold tracking-widest uppercase jrs-glitch backdrop-blur-sm z-50 text-center px-4">
                <div className="mb-4">
                    {minigameNight === 6 ? "THE END." : "I WILL PUT YOU BACK TOGETHER"}
                </div>
             </div>
          )}
          {dead && (
             <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center text-4xl md:text-6xl text-white font-bold tracking-widest uppercase jrs-glitch backdrop-blur-sm z-50">
                L E A V E
             </div>
          )}
       </div>

       {isMobile && (
          <div className="mt-8 flex flex-col items-center gap-2 z-50">
             <button 
               onPointerDown={() => moveRef.current = { dx: 0, dy: -1 }} 
               onPointerUp={() => moveRef.current = null} 
               onPointerCancel={() => moveRef.current = null} 
               className="w-16 h-16 bg-zinc-800 border-2 border-white/40 active:bg-zinc-600 text-white font-bold text-2xl"
             >
                ↑
             </button>
             <div className="flex gap-2">
                 <button 
                   onPointerDown={() => moveRef.current = { dx: -1, dy: 0 }} 
                   onPointerUp={() => moveRef.current = null} 
                   onPointerCancel={() => moveRef.current = null} 
                   className="w-16 h-16 bg-zinc-800 border-2 border-white/40 active:bg-zinc-600 text-white font-bold text-2xl"
                 >
                    ←
                 </button>
                 <button 
                   onPointerDown={() => moveRef.current = { dx: 0, dy: 1 }} 
                   onPointerUp={() => moveRef.current = null} 
                   onPointerCancel={() => moveRef.current = null} 
                   className="w-16 h-16 bg-zinc-800 border-2 border-white/40 active:bg-zinc-600 text-white font-bold text-2xl"
                 >
                    ↓
                 </button>
                 <button 
                   onPointerDown={() => moveRef.current = { dx: 1, dy: 0 }} 
                   onPointerUp={() => moveRef.current = null} 
                   onPointerCancel={() => moveRef.current = null} 
                   className="w-16 h-16 bg-zinc-800 border-2 border-white/40 active:bg-zinc-600 text-white font-bold text-2xl"
                 >
                    →
                 </button>
             </div>
          </div>
       )}
    </div>
  );
}
