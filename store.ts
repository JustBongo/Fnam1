import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameState = 'WARNING' | 'MENU' | 'LOADING' | 'PLAYING' | 'JUMPSCARE' | 'GAMEOVER' | 'WIN' | 'CUSTOM_NIGHT' | 'MINIGAME';

export type AnimatronicName = 'Marcus' | 'Piper' | 'Rusty' | 'Melody' | 'Bouncer' | 'SmileUnit' | 'TinyMarcus' | 'TheGuest' | 'GoldenMarcus';

export interface Animatronic {
  name: AnimatronicName;
  location: string;
  agressiveness: number;
  stage: number;
}

export interface Tape {
  id: string;
  title: string;
  content: string;
  camId: string;
}

export const TAPES_LORE: Tape[] = [
  { id: 'TAPE_1', title: 'Tech Log 01 - The Prototype', content: 'Marcus insisted we use the new proprietary servos. They run hot, but he says they give the characters "lifelike" twitches. I just think it\'s a fire hazard.', camId: 'CAM1' },
  { id: 'TAPE_2', title: 'Audio Dept - Voice Cloning', content: 'We fed the AI hours of children laughing to synthesize Piper\'s voice. Now I sometimes hear it giggling even when the power is off.', camId: 'CAM2' },
  { id: 'TAPE_3', title: 'Incident Report - 1998', content: 'The fire in the maintenance hall was contained, but the smell... it didn\'t smell like burning wires. It smelled like... meat.', camId: 'CAM3' },
  { id: 'TAPE_4', title: 'Security Memo - After Hours', content: 'To all staff: The animatronics do NOT have a free-roam mode. If you see them off their stages after hours, do not engage.', camId: 'CAM4' },
  { id: 'TAPE_5', title: 'Tech Log 42 - The Black Box', content: 'I extracted the memory card from Rusty. It\'s not just recording pathing data. It\'s storing faces. Emotional micro-expressions.', camId: 'CAM5' },
  { id: 'TAPE_6', title: 'Personal Log - Owen', content: 'Lena has been missing for a week. Marcus hasn\'t stopped working. He\'s building something in the basement. Something... large.', camId: 'CAM6' },
  { id: 'TAPE_7', title: 'Interview Fragment', content: '"They aren\'t haunted, detective. That\'s absurd. They are state-of-the-art machines learning from their environment."', camId: 'CAM7A' },
  { id: 'TAPE_8', title: 'Tech Log 99 - The Smile Unit', content: 'DO NOT power on the Smile Unit. It is not finished. The safety limiters are bypassed. It broke Bouncer in half.', camId: 'CAM7B' },
  { id: 'TAPE_9', title: 'Voicemail - Joel', content: 'Hey man, it\'s Joel. Listen, don\'t take the night shift. I know the pay is good, but the building... it shifts, you know?', camId: 'CAM1' }, // spawn condition handles multiple
  { id: 'TAPE_10', title: 'Final Log - Marcus Hale', content: 'I have achieved it. The perfect host. The memories are intact. The shell is durable. Death is just a transition of data.', camId: 'CAM5' }
];

export interface Achievement {
  id: string;
  name: string;
  description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'survive_1', name: 'First Shift', description: 'Survive Night 1' },
  { id: 'survive_2', name: 'Still Alive', description: 'Survive Night 2' },
  { id: 'survive_3', name: 'Halfway There', description: 'Survive Night 3' },
  { id: 'survive_4', name: 'Getting the Hang of It', description: 'Survive Night 4' },
  { id: 'survive_5', name: 'Employee of the Month', description: 'Survive Night 5' },
  { id: 'survive_6', name: 'Overtime', description: 'Survive Night 6' },
  { id: 'custom_7_20', name: 'Faz-Marcus Fury', description: 'Beat 7/20 mode' },
  { id: 'custom_8_999', name: 'Master of Hell', description: 'Beat All/999 mode' },
  { id: 'lore', name: 'Investigator', description: 'Collect all VHS Tapes' },
  { id: '1987', name: 'Is that the bite of 87?', description: 'Find the Golden Bear' },
  { id: 'die_first', name: 'Welcome to the Family', description: 'Experience your first jumpscare' },
];

export interface PopupData {
  id: string;
  x: number;
  y: number;
  title: string;
  text: string;
}

interface GameStore {
  popups: PopupData[];
  closePopup: (id: string) => void;
  spawnPopup: () => void;

  gameState: GameState;
  setGameState: (state: GameState) => void;
  
  maxNight: number;
  customNightUnlocked: boolean;
  gameJoltUser: string | null;
  adminUnlocked: boolean;
  debugMode: boolean;
  toggleDebugMode: () => void;
  infiniteNight: boolean;
  toggleInfiniteNight: () => void;
  batteryUpgrades: number;
  buyBatteryUpgrade: () => void;
  cameraUpgrades: { nightVision: boolean; motionTracked: boolean };
  buyCameraUpgrade: (type: 'nightVision' | 'motionTracked') => void;
  activeSubtitle: string | null;
  
  speedrunTimer: number;
  
  unlockNight: (n: number) => void;
  unlockCustomNight: () => void;
  unlockAll: () => void;
  setGameJoltUser: (user: string | null) => void;

  night: number;
  time: number; // 0 to 6 (12am to 6am)
  tickCount?: number;
  power: number; // 0 to 100
  powerUsage: number; // 1 to 5
  
  leftDoorOpen: boolean;
  rightDoorOpen: boolean;
  ventDoorOpen: boolean; // Center Vent
  sideVentDoorOpen: boolean; // Side Vent
  leftLightOn: boolean;
  rightLightOn: boolean;
  ventLightOn: boolean;
  sideVentLightOn: boolean;
  cameraOpen: boolean;
  currentCamera: string;
  
  maskOn: boolean;
  toxicity: number;
  toggleMask: () => void;

  flashCamera: () => void;
  isFlashing: boolean;

  animatronics: Record<AnimatronicName, Animatronic>;
  
  collectedTapes: string[];
  collectTape: (id: string) => void;
  activeTapeSpawn: string | null;
  spawnTape: () => void;

  unlockedAchievements: string[];
  activeAchievement: Achievement | null;
  unlockAchievement: (id: string) => void;
  
  customAIConfig: Record<AnimatronicName, number>;
  setCustomAI: (name: AnimatronicName, val: number) => void;
  apply7999Mode: () => void;

  toggleLeftDoor: () => void;
  toggleRightDoor: () => void;
  toggleVentDoor: () => void;
  toggleSideVentDoor: () => void;
  toggleLeftLight: () => void;
  toggleRightLight: () => void;
  toggleVentLight: () => void;
  toggleSideVentLight: () => void;
  toggleCamera: () => void;
  setCamera: (cam: string) => void;
  
  tick: () => void;
  startGame: (night?: number, isCustom?: boolean) => void;
  skipTo6AM: () => void;
  clickTinyMarcus: () => void;
  jumpscareBy: AnimatronicName | null;
  triggerJumpscare: (by: AnimatronicName) => void;
  
  minigameNight: number;
  playMinigame: (night: number) => void;

  isPaused: boolean;
  togglePause: () => void;
  
  // Power drain
  calculatePowerUsage: () => void;
}

const initialAnimatronics: Record<AnimatronicName, Animatronic> = {
  Marcus: { name: 'Marcus', location: 'CAM1', agressiveness: 3, stage: 0 },
  Piper: { name: 'Piper', location: 'CAM3', agressiveness: 5, stage: 0 },
  Rusty: { name: 'Rusty', location: 'CAM2', agressiveness: 2, stage: 0 },
  Melody: { name: 'Melody', location: 'CAM4', agressiveness: 0, stage: 0 },
  Bouncer: { name: 'Bouncer', location: 'CAM6', agressiveness: 0, stage: 0 },
  SmileUnit: { name: 'SmileUnit', location: 'BASEMENT', agressiveness: 0, stage: 0 },
  TinyMarcus: { name: 'TinyMarcus', location: 'OFFICE', agressiveness: 0, stage: 0 },
  TheGuest: { name: 'TheGuest', location: 'CAM7A', agressiveness: 0, stage: 0 },
  GoldenMarcus: { name: 'GoldenMarcus', location: 'HIDDEN', agressiveness: 0, stage: 0 },
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
  gameState: 'WARNING',
  setGameState: (state) => set({ gameState: state }),
  
  maxNight: 1,
  customNightUnlocked: false,
  gameJoltUser: null,
  adminUnlocked: false,
  debugMode: false,
  toggleDebugMode: () => set(s => ({ debugMode: !s.debugMode })),
  infiniteNight: false,
  toggleInfiniteNight: () => set(s => ({ infiniteNight: !s.infiniteNight })),
  batteryUpgrades: 0,
  buyBatteryUpgrade: () => set(s => ({ batteryUpgrades: s.batteryUpgrades + 1 })),
  cameraUpgrades: { nightVision: false, motionTracked: false },
  buyCameraUpgrade: (type) => set(s => ({ cameraUpgrades: { ...s.cameraUpgrades, [type]: true } })),
  activeSubtitle: null,
  speedrunTimer: 0,

  unlockNight: (n) => set((s) => ({ maxNight: Math.max(s.maxNight, n) })),
  unlockCustomNight: () => set({ customNightUnlocked: true }),
  unlockAll: () => set({ maxNight: 7, customNightUnlocked: true, adminUnlocked: true, collectedTapes: TAPES_LORE.map(t => t.id) }),
  setGameJoltUser: (user) => set({ gameJoltUser: user }),

  night: 1,
  time: 0,
  power: 100,
  powerUsage: 1,
  isPaused: false,

  popups: [],
  closePopup: (id) => {
    set(s => ({ popups: s.popups.filter(p => p.id !== id) }));
  },
  spawnPopup: () => {
    const titles = ["FATAL ERROR", "WIN FREE PRIZES!", "SYSTEM UPDATE REQUIRED", "VIRUS DETECTED", "LOCAL SINGLES", "FAZ-COINS LOW!"];
    const texts = ["Click here to download more RAM.", "You have won a free giftcard!", "Your anti-virus is EXPIRED.", "Immediate action required.", "They are looking for you.", "Please insert 5 Faz-Coins to continue."];
    const rIdx = Math.floor(Math.random() * titles.length);
    set(s => {
       if (!s.cameraOpen) return s; // only spawn when monitor is open
       const newPopup = {
          id: Math.random().toString(),
          x: Math.random() * 60 + 10,
          y: Math.random() * 60 + 10,
          title: titles[rIdx],
          text: texts[rIdx]
       };
       return { popups: [...s.popups, newPopup] };
    });
  },
  
  leftDoorOpen: true, // true means up/open, false means closed
  rightDoorOpen: true,
  ventDoorOpen: true,
  sideVentDoorOpen: true,
  leftLightOn: false,
  rightLightOn: false,
  ventLightOn: false,
  sideVentLightOn: false,
  cameraOpen: false,
  currentCamera: 'CAM1',
  
  maskOn: false,
  toxicity: 0,
  isFlashing: false,

  toggleMask: () => set(state => {
    if (state.cameraOpen) return state; // Can't mask while camera is open
    return { maskOn: !state.maskOn, toxicity: state.toxicity };
  }),

  flashCamera: () => {
    const s = get();
    if (s.power <= 0 || s.isFlashing || !s.cameraOpen) return;
    set({ isFlashing: true, power: Math.max(0, s.power - 1) });
    setTimeout(() => {
      set({ isFlashing: false });
    }, 100);

    // If Rusty is in the current camera (CAM2), flashing pushes him back
    const rusty = s.animatronics['Rusty'];
    if (s.currentCamera === rusty.location) {
        set(state => ({
            animatronics: { ...state.animatronics, Rusty: { ...state.animatronics.Rusty, stage: 0 } }
        }));
    }
  },

  animatronics: JSON.parse(JSON.stringify(initialAnimatronics)),
  jumpscareBy: null,
  
  collectedTapes: [],
  collectTape: (id) => set(s => {
      const newTapes = [...s.collectedTapes, id];
      if (newTapes.length === TAPES_LORE.length) {
         get().unlockAchievement('lore');
      }
      return { collectedTapes: newTapes, activeTapeSpawn: null };
  }),
  activeTapeSpawn: null,
  spawnTape: () => {
    const s = get();
    // try to spawn an uncollected tape
    const uncollected = TAPES_LORE.filter(t => !s.collectedTapes.includes(t.id));
    if (uncollected.length > 0 && Math.random() > 0.5) { // 50% chance to spawn a tape when called
       const randomTape = uncollected[Math.floor(Math.random() * uncollected.length)];
       set({ activeTapeSpawn: randomTape.id });
    } else {
       set({ activeTapeSpawn: null });
    }
  },

  unlockedAchievements: [],
  activeAchievement: null,
  unlockAchievement: (id: string) => {
      const s = get();
      if (!s.unlockedAchievements.includes(id)) {
          const achievement = ACHIEVEMENTS.find(a => a.id === id);
          set({ 
            unlockedAchievements: [...s.unlockedAchievements, id],
            activeAchievement: achievement || null
          });
          
          // Clear after 5 seconds
          setTimeout(() => {
            if (get().activeAchievement?.id === id) {
              set({ activeAchievement: null });
            }
          }, 5000);
      }
  },
  
  customAIConfig: {
     'Marcus': 0,
     'Piper': 0,
     'Rusty': 0,
     'Melody': 0,
     'Bouncer': 0,
     'SmileUnit': 0,
     'TinyMarcus': 0,
     'TheGuest': 0,
     'GoldenMarcus': 0,
  },
  setCustomAI: (name, val) => set(s => ({ customAIConfig: { ...s.customAIConfig, [name]: val } })),
  apply7999Mode: () => set(s => ({ customAIConfig: { 'Marcus': 999, 'Piper': 999, 'Rusty': 999, 'Melody': 999, 'Bouncer': 999, 'SmileUnit': 999, 'TinyMarcus': 999, 'TheGuest': 999, 'GoldenMarcus': 999 } })),

  clickTinyMarcus: () => {
     set(state => {
         const tMarcus = state.animatronics['TinyMarcus'];
         if (tMarcus.location === 'OFFICE') {
             return { animatronics: { ...state.animatronics, TinyMarcus: { ...tMarcus, stage: 0 } } };
         }
         return state;
     });
  },

  toggleLeftDoor: () => set(state => ({ leftDoorOpen: !state.leftDoorOpen, leftLightOn: false }), false),
  toggleRightDoor: () => set(state => ({ rightDoorOpen: !state.rightDoorOpen, rightLightOn: false }), false),
  toggleVentDoor: () => set(state => ({ ventDoorOpen: !state.ventDoorOpen, ventLightOn: false }), false),
  toggleSideVentDoor: () => set(state => ({ sideVentDoorOpen: !state.sideVentDoorOpen, sideVentLightOn: false }), false),
  toggleLeftLight: () => set(state => ({ leftLightOn: !state.leftLightOn, leftDoorOpen: state.leftDoorOpen ? state.leftDoorOpen : false }), false),
  toggleRightLight: () => set(state => ({ rightLightOn: !state.rightLightOn, rightDoorOpen: state.rightDoorOpen ? state.rightDoorOpen : false }), false),
  toggleVentLight: () => set(state => ({ ventLightOn: !state.ventLightOn, ventDoorOpen: state.ventDoorOpen ? state.ventDoorOpen : false }), false),
  toggleSideVentLight: () => set(state => ({ sideVentLightOn: !state.sideVentLightOn, sideVentDoorOpen: state.sideVentDoorOpen ? state.sideVentDoorOpen : false }), false),
  toggleCamera: () => set(state => {
    // If turning on camera, turn off lights
    const camTarget = !state.cameraOpen;
    return { 
      cameraOpen: camTarget,
      leftLightOn: camTarget ? false : state.leftLightOn,
      rightLightOn: camTarget ? false : state.rightLightOn,
      ventLightOn: camTarget ? false : state.ventLightOn,
      sideVentLightOn: camTarget ? false : state.sideVentLightOn,
    };
  }),
  setCamera: (cam) => set({ currentCamera: cam }),
  
  togglePause: () => set(state => {
    if (state.gameState !== 'PLAYING') return state;
    return { isPaused: !state.isPaused };
  }),

  calculatePowerUsage: () => {
    const s = get();
    let usage = 1;
    if (!s.leftDoorOpen) usage++;
    if (!s.rightDoorOpen) usage++;
    if (!s.ventDoorOpen) usage++;
    if (!s.sideVentDoorOpen) usage++;
    if (s.leftLightOn) usage++;
    if (s.rightLightOn) usage++;
    if (s.ventLightOn) usage++;
    if (s.sideVentLightOn) usage++;
    if (s.cameraOpen) usage++;
    set({ powerUsage: usage });
  },
  
  tick: () => {
    const s = get();
    if (s.gameState !== 'PLAYING' || s.isPaused) return;
    
    // Spawn popup chance (higher on later nights)
    if (s.cameraOpen) {
       const chance = s.night * 0.05 + 0.05; // 10% on night 1, up to 35% on night 6
       if (Math.random() < chance && s.popups.length < 5) {
          s.spawnPopup();
       }
    }
    
    // Time progression (1 hour every 45 ticks)
    // We increment a hidden 'tickCount' state or just use time and fractional time
    // Let's add a tickCount to the store
    const newTickCount = (s.tickCount || 0) + 1;
    let newTime = s.time;
    let newGameState = s.gameState;
    
    // speedrunTimer is real-time milliseconds basically, but tick is every ~80ms 
    // so we can increment it by roughly 80
    
    if (newTickCount % 45 === 0) {
      if (!s.infiniteNight) {
        newTime += 1;
      }
      if (newTime >= 6 && !s.infiniteNight) {
        // WIN!
        if (s.night === 1) get().unlockAchievement('survive_1');
        if (s.night === 2) get().unlockAchievement('survive_2');
        if (s.night === 3) get().unlockAchievement('survive_3');
        if (s.night === 4) get().unlockAchievement('survive_4');
        if (s.night === 5) get().unlockAchievement('survive_5');
        if (s.night === 6) get().unlockAchievement('survive_6');
        if (s.night === 7) {
            const values = Object.values(s.customAIConfig);
            const twenty = values.every(v => v >= 20);
            if (twenty) get().unlockAchievement('custom_7_20');
            const nine = values.every(v => v >= 999);
            if (nine) get().unlockAchievement('custom_8_999');
        }

        if (s.night < 6) {
           s.unlockNight(s.night + 1);
        } else if (s.night === 6) {
           s.unlockCustomNight();
        }
        set({ gameState: 'WIN', time: 6 });
        return;
      }
    }

    // Power drain
    let newPower = s.power;
    // batteryUpgrades reduces drain amount (each upgrade reduces usage multiplier by 10%, max 3 upgrades to avoiding negative)
    const upgradeFactor = Math.max(0.7, 1 - (s.batteryUpgrades * 0.1));
    const drainAmount = (0.1 * s.powerUsage) * upgradeFactor; 
    newPower -= drainAmount;
    if (newPower <= 0 && s.power > 0) {
      newPower = 0;
      set({ leftDoorOpen: true, rightDoorOpen: true, ventDoorOpen: true, sideVentDoorOpen: true, leftLightOn: false, rightLightOn: false, ventLightOn: false, sideVentLightOn: false, cameraOpen: false });
      get().triggerJumpscare('Marcus');
    }

    if (newPower < 0) newPower = 0;
    
    // AI Ticks (every 3 seconds)
    const animatronics = { ...s.animatronics };
    
    // Mask / Toxicity Tick
    let newTox = s.toxicity;
    let newMaskOn = s.maskOn;
    if (s.maskOn) {
       newTox += 5; // Reaches max in 20 real seconds
       if (newTox >= 100) {
          newTox = 100;
          newMaskOn = false; // Force mask off
       }
    } else {
       newTox = Math.max(0, newTox - 4);
    }
    
    // Check if died from toxicity? Actually just forcing it off is punishing enough because Piper can kill you.

    if (newPower > 0 && newTickCount % 3 === 0) {
      // Marcus AI
      const marcus = animatronics['Marcus'];
      if (Math.random() * 20 < marcus.agressiveness || marcus.agressiveness > 20) {
        const marcusPath = ['CAM1', 'CAM3', 'CAM5', 'CAM7B', 'OFFICE'];
        const currentIndex = marcusPath.indexOf(marcus.location);
        if (currentIndex < marcusPath.length - 1) {
          const nextLocation = marcusPath[currentIndex + 1];
          if (nextLocation === 'OFFICE') {
            if (s.rightDoorOpen) {
              get().triggerJumpscare('Marcus');
            } else {
              marcus.location = 'CAM3';
            }
          } else {
             marcus.location = nextLocation;
          }
        }
      }

      // Piper AI (Requires Mask in Office)
      const piper = animatronics['Piper'];
      if (Math.random() * 20 < piper.agressiveness || piper.agressiveness > 20) {
        if (piper.location === 'OFFICE') {
           // Piper is in the office! 
           piper.stage += 1;
           if (piper.stage >= 2) {
              if (s.maskOn) {
                 // Evaded!
                 piper.location = 'CAM3';
                 piper.stage = 0;
              } else {
                 get().triggerJumpscare('Piper');
              }
           }
        } else {
           const piperPath = ['CAM3', 'CAM4', 'CAM6', 'CAM7A', 'OFFICE'];
           const currentIndex = piperPath.indexOf(piper.location);
           if (currentIndex < piperPath.length - 1) {
             const nextLocation = piperPath[currentIndex + 1];
             if (nextLocation === 'OFFICE') {
                piper.location = 'OFFICE';
                piper.stage = 0; // Wait 1 cycle for player to put on mask
             } else {
                piper.location = nextLocation;
             }
           }
        }
      }
      
      // Rusty AI (Requires Camera Flash on CAM2)
      const rusty = animatronics['Rusty'];
      rusty.stage += rusty.agressiveness > 20 ? 2 : 1; 
      
      if (rusty.stage > (rusty.agressiveness > 10 ? 15 : 20)) {
         get().triggerJumpscare('Rusty');
      }

      // Melody AI (Wanders)
      const melody = animatronics['Melody'];
      if (Math.random() * 20 < melody.agressiveness || melody.agressiveness > 20) {
         const cams = ['CAM1', 'CAM3', 'CAM4', 'CAM5', 'CAM6', 'CAM7A', 'CAM7B'];
         melody.location = cams[Math.floor(Math.random() * cams.length)];
      }

      // Bouncer AI (Patrols left hall, needs left door closed)
      const bouncer = animatronics['Bouncer'];
      if (Math.random() * 20 < bouncer.agressiveness || bouncer.agressiveness > 20) {
         const bouncerPath = ['CAM6', 'CAM7A', 'OFFICE'];
         const bIndex = bouncerPath.indexOf(bouncer.location);
         if (bIndex < bouncerPath.length - 1) {
             const nextBouncer = bouncerPath[bIndex + 1];
             if (nextBouncer === 'OFFICE') {
                 if (s.leftDoorOpen) {
                     get().triggerJumpscare('Bouncer');
                 } else {
                     bouncer.location = 'CAM6';
                 }
             } else {
                 bouncer.location = nextBouncer;
             }
         } else if (bIndex === -1) {
             bouncer.location = 'CAM6';
         }
      }

      // Smile Unit AI (Only active randomly, jumpscares if not repelled by mask OR vent door)
      const smile = animatronics['SmileUnit'];
      if (Math.random() * 20 < smile.agressiveness || smile.agressiveness > 20) {
          if (smile.location === 'OFFICE') {
              if (s.maskOn || !s.ventDoorOpen || !s.sideVentDoorOpen) {
                  smile.location = 'BASEMENT';
                  smile.stage = 0;
              } else {
                  smile.stage++;
                  if (smile.stage > 1) {
                      get().triggerJumpscare('SmileUnit');
                  }
              }
          } else {
              if (Math.random() < 0.2) smile.location = 'OFFICE';
          }
      }

      // Tiny Marcus AI (Appears on desk, must be clicked)
      const tMarcus = animatronics['TinyMarcus'];
      if (Math.random() * 20 < tMarcus.agressiveness || tMarcus.agressiveness > 20) {
          if (tMarcus.location !== 'OFFICE') {
              tMarcus.location = 'OFFICE';
              tMarcus.stage = 0;
          }
      }
      if (tMarcus.location === 'OFFICE') {
          tMarcus.stage++;
          if (tMarcus.stage > 10) {
              set({ power: 0 }); // Blackout
              tMarcus.location = 'HIDDEN';
          }
      }

      // The Guest AI (Randomly kills if active and you don't use the camera to hide)
      const guest = animatronics['TheGuest'];
      if (Math.random() * 20 < guest.agressiveness || guest.agressiveness > 20) {
          if (guest.location === 'OFFICE') {
               if (s.cameraOpen) {
                   guest.location = 'CAM5';
                   guest.stage = 0;
               } else {
                   guest.stage++;
                   if (guest.stage > 2) {
                       get().triggerJumpscare('TheGuest');
                   }
               }
          } else {
               if (Math.random() < 0.1) guest.location = 'OFFICE';
          }
      }
    }
    
    // spawn tapes randomly every ~10 ticks
    if (newPower > 0 && newTickCount % 10 === 0) {
      if (!s.activeTapeSpawn) {
         get().spawnTape();
      } else {
         if (Math.random() > 0.5) {
           set({ activeTapeSpawn: null });
         }
      }
    }
    
    const newSpeedrunTimer = s.speedrunTimer + 1;

    set({ tickCount: newTickCount, time: newTime, power: newPower, animatronics, toxicity: newTox, maskOn: newMaskOn, speedrunTimer: newSpeedrunTimer });
    get().calculatePowerUsage();
  },
  
  startGame: (n = 1, isCustom = false) => {
    const s = get();
    
    let ais = JSON.parse(JSON.stringify(initialAnimatronics));
    
    if (isCustom) {
       ais['Marcus'].agressiveness = s.customAIConfig['Marcus'];
       ais['Piper'].agressiveness = s.customAIConfig['Piper'];
       ais['Rusty'].agressiveness = s.customAIConfig['Rusty'];
       ais['Melody'].agressiveness = s.customAIConfig['Melody'];
       ais['Bouncer'].agressiveness = s.customAIConfig['Bouncer'];
       ais['SmileUnit'].agressiveness = s.customAIConfig['SmileUnit'];
       ais['TinyMarcus'].agressiveness = s.customAIConfig['TinyMarcus'];
       ais['TheGuest'].agressiveness = s.customAIConfig['TheGuest'];
    } else {
       // Scale AI by night
       ais['Marcus'].agressiveness = Math.min(20, 2 + (n * 2));
       ais['Piper'].agressiveness = Math.min(20, 3 + (n * 3));
       ais['Rusty'].agressiveness = Math.min(20, 1 + n);
       ais['Melody'].agressiveness = Math.min(20, n > 1 ? n * 2 : 0);
       ais['Bouncer'].agressiveness = Math.min(20, n > 2 ? n * 2 : 0);
       ais['SmileUnit'].agressiveness = Math.min(20, n > 5 ? n * 3 : 0);
       ais['TinyMarcus'].agressiveness = Math.min(20, n > 3 ? (n - 1) * 2 : 0);
       ais['TheGuest'].agressiveness = Math.min(20, n > 4 ? (n - 2) * 2 : 0);
    }
    
    set({
      gameState: 'LOADING',
      night: isCustom ? 7 : n,
      time: 0,
      tickCount: 0,
      power: 100,
      powerUsage: 1,
      leftDoorOpen: true,
      rightDoorOpen: true,
      ventDoorOpen: true,
      sideVentDoorOpen: true,
      leftLightOn: false,
      rightLightOn: false,
      ventLightOn: false,
      sideVentLightOn: false,
      cameraOpen: false,
      popups: [],
      jumpscareBy: null,
      animatronics: ais,
      isPaused: false,
      speedrunTimer: 0,
      // Battery/Camera Upgrades persist between nights (they are part of overall progression)
    });

    setTimeout(() => {
      set({ gameState: 'PLAYING' });
    }, 3000);
  },

  skipTo6AM: () => {
     const s = get();
     if (s.gameState === 'PLAYING') {
         if (s.night === 1) s.unlockAchievement('survive_1');
         if (s.night === 2) s.unlockAchievement('survive_2');
         if (s.night === 3) s.unlockAchievement('survive_3');
         if (s.night === 4) s.unlockAchievement('survive_4');
         if (s.night === 5) s.unlockAchievement('survive_5');
         if (s.night === 6) s.unlockAchievement('survive_6');
         if (s.night === 7) {
            const values = Object.values(s.customAIConfig);
            const twenty = values.every(v => v >= 20);
            if (twenty) s.unlockAchievement('custom_7_20');
            const nine = values.every(v => v >= 999);
            if (nine) s.unlockAchievement('custom_8_999');
         }

         if (s.night < 6) {
           s.unlockNight(s.night + 1);
         } else if (s.night === 6) {
           s.unlockCustomNight();
         }
         set({ gameState: 'WIN', time: 6 });
     }
  },
  
  triggerJumpscare: (by) => {
    get().unlockAchievement('die_first');
    set({ gameState: 'JUMPSCARE', jumpscareBy: by, cameraOpen: false });
    setTimeout(() => {
       set({ gameState: 'GAMEOVER' });
    }, 2000); // Jumpscare lasts 2 seconds
  },

  minigameNight: 1,
  playMinigame: (night: number) => {
    set({ minigameNight: night, gameState: 'MINIGAME' });
  }
    }),
    {
      name: 'faz-marcus-storage',
      partialize: (state) => ({
        maxNight: state.maxNight,
        customNightUnlocked: state.customNightUnlocked,
        adminUnlocked: state.adminUnlocked,
        gameJoltUser: state.gameJoltUser,
        collectedTapes: state.collectedTapes,
        unlockedAchievements: state.unlockedAchievements,
        batteryUpgrades: state.batteryUpgrades,
        cameraUpgrades: state.cameraUpgrades,
      }),
    }
  )
);
