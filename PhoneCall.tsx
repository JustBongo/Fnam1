import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store';
import { initAudio, playPhoneRing, playTapeClick, startTapeHiss, stopTapeHiss } from '../lib/audio';

const PHONE_SCRIPTS: Record<number, { text: string; duration: number; action?: string }[]> = {
  1: [
    { text: "RING... RING...", duration: 3000, action: 'ring' },
    { text: "*click*", duration: 1000, action: 'click' },
    { text: "Uh, hello? Hello, hello?", duration: 4000 },
    { text: "Uh, I wanted to record a message for you to help you get settled in on your first night.", duration: 5500 },
    { text: "Um, I actually worked in that office before you. I'm finishing up my last week now, as a matter of fact.", duration: 6500 },
    { text: "So, I know it can be a bit overwhelming, but I'm here to tell you there's nothing to worry about. Uh, you'll do fine.", duration: 7500 },
    { text: "So, let's just focus on getting you through your first week. Okay?", duration: 5000 },
    { text: "Let's see, first there's an introductory greeting from the company that I'm supposed to read. Uh, it's kind of a legal thing, you know.", duration: 7000 },
    { text: "Um... 'Welcome to Faz-Marcus Entertainment. A magical place for kids and grown-ups alike, where fantasy and fun come to life.'", duration: 8000 },
    { text: "Blah blah blah... 'Faz-Marcus Entertainment is not responsible for damage to property or person...'", duration: 5000 },
    { text: "Upon discovering that damage or death has occurred, a missing person report will be filed within 90 days... or as soon as property and premises have been thoroughly cleaned and bleached.", duration: 8500 },
    { text: "Yeah, yeah, they don't really tell you that part when you sign up.", duration: 4500 },
    { text: "But hey, the animatronic characters here do get a bit, uh, quirky at night...", duration: 4500 },
    { text: "But do I blame them? No. If I were forced to sing those same stupid songs for twenty years and I never got a bath? I'd probably be a bit irritable at night too.", duration: 8000 },
    { text: "So remember, these characters hold a special place in the hearts of children, and we need to show them a little respect, right? Okay.", duration: 7500 },
    { text: "If they see you after hours, they probably won't recognize you as a person. They'll... uh... most likely see you as a metal endoskeleton without its costume on.", duration: 8000 },
    { text: "So just... check the cameras, and shut the doors if they get close. But watch your power! The generator isn't great.", duration: 7000 },
    { text: "Alright, you'll be fine. Catch you on the flip side!", duration: 3000 },
  ],
  2: [
    { text: "RING... RING...", duration: 3000, action: 'ring' },
    { text: "*click*", duration: 1000, action: 'click' },
    { text: "Uh, hello? Hello!", duration: 3000 },
    { text: "Uh, well, if you're hearing this, you made it to day two! Congrats!", duration: 5000 },
    { text: "I won't talk quite as long this time, since Marcus and his friends tend to become more active as the week progresses.", duration: 7000 },
    { text: "Uh, it might be a good idea to peek at those cameras while I talk. Just to make sure everyone's in their proper place.", duration: 7000 },
    { text: "Piper tends to wander into the office. She's the... eccentric one. If she gets in, put on that spare mask under your desk.", duration: 8000 },
    { text: "And keep an eye on Rusty in the Pirate Theater. He doesn't like being watched, but flashing the camera light seems to reset his system.", duration: 8000 },
    { text: "Alright, keep up the good work!", duration: 3000 },
  ],
  3: [
    { text: "RING... RING...", duration: 3000, action: 'ring' },
    { text: "*click*", duration: 1000, action: 'click' },
    { text: "Hello, hello!", duration: 2500 },
    { text: "Hey! You're doing great. Most people don't last this long.", duration: 4000 },
    { text: "I mean, you know, they usually move on to other things... it's not like they died, that's not what I meant.", duration: 7000 },
    { text: "Uh, anyway, things are getting a little weird. Bouncer is active, the big security bot. He ignores your flashlight completely.", duration: 8000 },
    { text: "Oh, and if you hear singing... that's Melody. She messes with your camera feeds. Sorry about that.", duration: 7000 },
    { text: "Just... stay alive, okay? I'll talk to you tomorrow.", duration: 4000 },
  ],
  4: [
    { text: "RING... RING...", duration: 3000, action: 'ring' },
    { text: "*click*", duration: 1000, action: 'click' },
    { text: "Hello? Hello! Hey, wow, day four.", duration: 4000 },
    { text: "Um, listen to me, I might not be around to send you a message tomorrow.", duration: 5000 },
    { text: "It's been a bad night here, I... I'm kind of glad that I recorded all these, you know.", duration: 6000 },
    { text: "Uh, hey, check the vents. Please. Both of them.", duration: 4500 },
    { text: "The Smile Unit... it's in the basement. I warned them about it... If it gets in, put on the mask immediately.", duration: 8000 },
    { text: "Oh no... I have to go.", duration: 3000 },
    { text: "*loud banging*", duration: 2500 },
    { text: "*static*", duration: 2000 },
  ],
  5: [
    { text: "RING... RING...", duration: 3000, action: 'ring' },
    { text: "*click*", duration: 1000, action: 'click' },
    { text: "...", duration: 3000 },
    { text: "*heavy metallic breathing*", duration: 4000 },
    { text: "W e  a r e  o n e . . .", duration: 3000 },
    { text: "P l a y  w i t h  u s . . .", duration: 3000 },
    { text: "*static*", duration: 2000 },
  ]
};

export default function PhoneCall() {
  const { night } = useGameStore();
  const [muted, setMuted] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [showCall, setShowCall] = useState(true);
  
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup speech when component unmounts
    return () => {
      window.speechSynthesis.cancel();
      stopTapeHiss();
    };
  }, []);

  useEffect(() => {
    const script = PHONE_SCRIPTS[night];
    if (!script) {
      setShowCall(false);
      return;
    }

    if (muted) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setShowCall(false);
      window.speechSynthesis.cancel();
      stopTapeHiss();
      return;
    }

    let currentIndex = 0;
    setCurrentLineIndex(currentIndex);

    const playNextLine = () => {
      if (currentIndex >= script.length - 1) {
        setShowCall(false);
        stopTapeHiss();
        return;
      }
      
      const currentDuration = script[currentIndex].duration;
      timeoutRef.current = window.setTimeout(() => {
        currentIndex++;
        setCurrentLineIndex(currentIndex);
        playNextLine();
      }, currentDuration);
    };

    playNextLine();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [night, muted]);

  useEffect(() => {
    if (muted || currentLineIndex === -1 || !showCall || !PHONE_SCRIPTS[night]) return;
    const line = PHONE_SCRIPTS[night][currentLineIndex];
    const text = line.text;
    
    if (line.action === 'ring') {
       initAudio();
       playPhoneRing();
       return;
    } else if (line.action === 'click') {
       playTapeClick();
       if (night !== 5) {
          startTapeHiss();
       }
       return;
    }

    // Don't speak sound effect text
    if (text.startsWith('*')) {
      return;
    }

    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    
    // Find a good voice for the phone guy
    const voices = window.speechSynthesis.getVoices();
    // Prefer male voices
    const maleVoice = voices.find(v => 
       v.lang.startsWith('en') && 
       (v.name.includes('Male') || v.name.includes('Google UK English Male') || v.name.includes('David') || v.name.includes('Mark'))
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (maleVoice) {
       msg.voice = maleVoice;
    }
    
    // Distort voice for night 5
    if (night === 5) {
      msg.pitch = 0.1;
      msg.rate = 0.5;
    } else {
      msg.pitch = 0.8; 
      msg.rate = 1.05; 
    }

    window.speechSynthesis.speak(msg);
  }, [currentLineIndex, night, muted, showCall]);

  if (!showCall || currentLineIndex === -1 || !PHONE_SCRIPTS[night]) return null;

  return (
    <div className="absolute top-16 left-4 z-50 flex flex-col items-start gap-2 max-w-sm pointer-events-auto">
      <div className="bg-purple-900/80 border-2 border-purple-500 p-3 rounded shadow-[0_0_15px_purple] backdrop-blur-sm">
        <div className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-1 flex justify-between items-center w-full min-w-[200px]">
          <span>Incoming Call...</span>
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>
        <p className="text-white text-sm font-sans italic">
          "{PHONE_SCRIPTS[night][currentLineIndex].text}"
        </p>
      </div>
      <button 
        onClick={() => setMuted(true)}
        className="px-3 py-1 bg-black/50 border border-purple-500 text-purple-400 text-xs uppercase tracking-widest hover:bg-purple-900/50"
      >
        Mute Call
      </button>
    </div>
  );
}
