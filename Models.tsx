export function MarcusModel({ className = '' }: { className?: string; }) {
  return (
    <svg viewBox="0 0 100 200" className={className} width="100" height="200" style={{ overflow: 'visible' }}>
       <defs>
          <linearGradient id="marcusFur" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor="#4a3623" />
             <stop offset="100%" stopColor="#1a120a" />
          </linearGradient>
          <linearGradient id="marcusBelly" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="#5c4c3b" />
             <stop offset="100%" stopColor="#2e251d" />
          </linearGradient>
          <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stopColor="#222" />
             <stop offset="50%" stopColor="#888" />
             <stop offset="100%" stopColor="#111" />
          </linearGradient>
       </defs>
       {/* Tail */}
       <ellipse cx="85" cy="170" rx="15" ry="15" fill="url(#marcusFur)" />
       
       {/* Endoskeleton joints */}
       <rect x="25" y="80" width="8" height="20" fill="url(#metal)" rx="2" transform="rotate(15 25 80)" />
       <rect x="67" y="80" width="8" height="20" fill="url(#metal)" rx="2" transform="rotate(-15 67 80)" />
       <circle cx="28" cy="98" r="6" fill="#111" />
       <circle cx="72" cy="98" r="6" fill="#111" />

       {/* Body */}
       <path d="M 25 90 C 10 120, 10 180, 20 200 L 80 200 C 90 180, 90 120, 75 90 Z" fill="url(#marcusFur)"/>
       {/* Belly */}
       <path d="M 35 110 C 25 140, 25 180, 30 200 L 70 200 C 75 180, 75 140, 65 110 Z" fill="url(#marcusBelly)"/>
       {/* Arms */}
       <rect x="5" y="100" width="18" height="70" rx="5" fill="url(#marcusFur)" transform="rotate(15 10 100)"/>
       <rect x="77" y="100" width="18" height="70" rx="5" fill="url(#marcusFur)" transform="rotate(-15 80 100)"/>
       
       {/* Creepy Endo Hand peeking out */}
       <path d="M -5 160 L -10 170 L -5 175 Z" fill="url(#metal)" transform="rotate(15 10 100)"/>
       <path d="M 105 160 L 110 170 L 105 175 Z" fill="url(#metal)" transform="rotate(-15 80 100)"/>

       {/* Bowtie */}
       <path d="M 40 90 L 60 90 L 50 100 Z" fill="#111" filter="drop-shadow(0 5px 2px rgba(0,0,0,0.5))"/>
       <path d="M 40 110 L 60 110 L 50 100 Z" fill="#111" filter="drop-shadow(0 5px 2px rgba(0,0,0,0.5))"/>

       {/* Head moved up */}
       <g transform="translate(0, -10)">
           <path d="M 30 20 Q 20 0 10 20 Q 20 40 30 30" fill="url(#marcusFur)"/>
           <path d="M 70 20 Q 80 0 90 20 Q 80 40 70 30" fill="url(#marcusFur)"/>
           
           <circle cx="50" cy="50" r="42" fill="url(#marcusFur)"/>
           
           {/* Snout */}
           <ellipse cx="50" cy="65" rx="22" ry="18" fill="url(#marcusBelly)"/>
           <ellipse cx="50" cy="55" rx="8" ry="6" fill="#111"/>
           
           <g filter="drop-shadow(0 0 5px red)">
              <circle cx="35" cy="40" r="5" fill="#ff2200"/>
              <circle cx="65" cy="40" r="5" fill="#ff2200"/>
              {/* Pupils */}
              <circle cx="35" cy="40" r="1.5" fill="#fff"/>
              <circle cx="65" cy="40" r="1.5" fill="#fff"/>
           </g>

           {/* Exposed endo teeth */}
           <path d="M 35 75 Q 50 85 65 75" stroke="#111" strokeWidth="6" fill="none"/>
           <path d="M 38 75 L 38 80 M 44 78 L 44 83 M 50 79 L 50 84 M 56 78 L 56 83 M 62 75 L 62 80" stroke="#bbb" strokeWidth="2" fill="none"/>
       </g>
    </svg>
  );
}

export function GoldenMarcusModel({ className = '' }: { className?: string; }) {
  return (
    <svg viewBox="0 0 100 200" className={className} width="100" height="200" style={{ overflow: 'visible' }}>
       <defs>
          <linearGradient id="goldFur" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor="#e8c95c" />
             <stop offset="50%" stopColor="#a37e12" />
             <stop offset="100%" stopColor="#4a3908" />
          </linearGradient>
          <linearGradient id="goldBelly" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="#ffe484" />
             <stop offset="100%" stopColor="#c9a12c" />
          </linearGradient>
       </defs>
       <ellipse cx="85" cy="170" rx="15" ry="15" fill="url(#goldFur)" />
       <path d="M 25 90 C 10 120, 10 180, 20 200 L 80 200 C 90 180, 90 120, 75 90 Z" fill="url(#goldFur)"/>
       <path d="M 35 110 C 25 140, 25 180, 30 200 L 70 200 C 75 180, 75 140, 65 110 Z" fill="url(#goldBelly)"/>
       <rect x="5" y="100" width="15" height="70" rx="5" fill="url(#goldFur)" transform="rotate(15 10 100)"/>
       <rect x="80" y="100" width="15" height="70" rx="5" fill="url(#goldFur)" transform="rotate(-15 80 100)"/>
       <path d="M 40 90 L 60 90 L 50 100 Z" fill="#4a0e4e"/>
       <path d="M 40 110 L 60 110 L 50 100 Z" fill="#4a0e4e"/>

       <g transform="translate(0, -10)">
           <path d="M 30 20 Q 20 0 10 20 Q 20 40 30 30" fill="url(#goldFur)"/>
           <path d="M 70 20 Q 80 0 90 20 Q 80 40 70 30" fill="url(#goldFur)"/>
           
           <circle cx="50" cy="50" r="42" fill="url(#goldFur)"/>
           <ellipse cx="50" cy="65" rx="22" ry="18" fill="url(#goldBelly)"/>
           <ellipse cx="50" cy="55" rx="8" ry="6" fill="#111"/>
           
           {/* Deep empty eye sockets */}
           <circle cx="35" cy="40" r="7" fill="#000" filter="drop-shadow(0 0 2px black)"/>
           <circle cx="65" cy="40" r="7" fill="#000" filter="drop-shadow(0 0 2px black)"/>
           
           {/* Pinprick glowing dots */}
           <circle cx="35" cy="40" r="1.5" fill="#fff" filter="drop-shadow(0 0 5px white)"/>
           <circle cx="65" cy="40" r="1.5" fill="#fff" filter="drop-shadow(0 0 5px white)"/>
           
           {/* Sunken teeth */}
           <path d="M 35 75 Q 50 85 65 75" stroke="#111" strokeWidth="5" fill="none"/>
           <path d="M 38 75 L 38 78 M 44 78 L 44 81 M 50 79 L 50 82 M 56 78 L 56 81 M 62 75 L 62 78" stroke="#cca" strokeWidth="2" fill="none"/>
       </g>
    </svg>
  );
}

export function PiperModel({ className = '' }: { className?: string; }) {
  return (
    <svg viewBox="0 0 100 200" className={className} width="100" height="200" style={{ overflow: 'visible' }}>
       {/* Tail */}
       <ellipse cx="85" cy="180" rx="10" ry="25" fill="#4a4b59" transform="rotate(-30 85 180)" />
       {/* Body */}
       <path d="M 30 90 C 20 120, 20 180, 25 200 L 75 200 C 80 180, 80 120, 70 90 Z" fill="#4a4b59"/>
       {/* Belly */}
       <path d="M 40 110 C 35 140, 35 180, 40 200 L 60 200 C 65 180, 65 140, 60 110 Z" fill="#58596b"/>
       {/* Arms */}
       <rect x="10" y="100" width="12" height="65" rx="5" fill="#4a4b59" transform="rotate(20 10 100)"/>
       <rect x="78" y="100" width="12" height="65" rx="5" fill="#4a4b59" transform="rotate(-20 78 100)"/>

       {/* Head */}
       <g transform="translate(0, -5)">
           <path d="M 35 40 L 30 5 Q 40 -5 45 35" fill="#4a4b59"/>
           <path d="M 65 40 L 70 5 Q 60 -5 55 35" fill="#4a4b59" transform="rotate(20 65 40)"/>
           <circle cx="50" cy="60" r="35" fill="#58596b"/>
           <circle cx="35" cy="55" r="3" fill="#fff" filter="drop-shadow(0 0 5px cyan)"/>
           <circle cx="65" cy="55" r="3" fill="#fff" filter="drop-shadow(0 0 5px cyan)"/>
           <path d="M 40 75 Q 50 80 60 75" fill="none" stroke="#222" strokeWidth="2"/>
       </g>
    </svg>
  );
}

export function RustyModel({ className = '' }: { className?: string; }) {
  return (
    <svg viewBox="0 0 100 200" className={className} width="100" height="200" style={{ overflow: 'visible' }}>
       {/* Tail */}
       <path d="M 75 170 Q 110 140 120 180 Q 90 200 75 190 Z" fill="#8b3a2b"/>
       {/* Body */}
       <path d="M 25 90 C 15 120, 15 180, 20 200 L 80 200 C 85 180, 85 120, 75 90 Z" fill="#8b3a2b"/>
       {/* Hook */}
       <path d="M 10 160 C -10 160, -10 190, 10 200 C 15 180, 20 170, 20 160 Z" fill="#777"/>
       <rect x="15" y="100" width="10" height="60" fill="#8b3a2b" transform="rotate(15 15 100)"/>
       {/* Right Arm */}
       <rect x="75" y="100" width="10" height="60" rx="5" fill="#8b3a2b" transform="rotate(-15 75 100)"/>

       {/* Head */}
       <g transform="translate(0, -15)">
           <polygon points="50,90 10,40 30,10 50,30 70,10 90,40" fill="#8b3a2b"/>
           <path d="M 50 20 L 80 50 L 90 40 Z" fill="#111"/>
           <circle cx="70" cy="40" r="10" fill="#111"/>
           <circle cx="30" cy="45" r="3" fill="#ffaa00" filter="drop-shadow(0 0 5px orange)"/>
           <polygon points="50,90 35,60 65,60" fill="#69281c"/>
           <circle cx="50" cy="85" r="5" fill="#111"/>
       </g>
    </svg>
  );
}

export function VhsModel({ className = '' }: { className?: string; }) {
  return (
    <svg viewBox="0 0 100 60" className={className} width="100" height="60">
       <rect x="5" y="5" width="90" height="50" rx="2" fill="#222" stroke="#111" strokeWidth="2"/>
       <rect x="15" y="10" width="70" height="20" fill="#111"/>
       <circle cx="30" cy="20" r="6" fill="#444"/>
       <circle cx="70" cy="20" r="6" fill="#444"/>
       <rect x="10" y="35" width="80" height="15" fill="#888"/>
       <text x="15" y="46" fontFamily="monospace" fontSize="8" fill="#c00">FAZ-MARCUS LOG</text>
    </svg>
  );
}

export function TinyMarcusModel({ className = '' }: { className?: string; }) {
  return (
    <svg viewBox="0 0 100 100" className={className} width="100" height="100" style={{ overflow: 'visible' }}>
       <ellipse cx="85" cy="85" rx="8" ry="8" fill="#2d2218" />
       <g transform="translate(0, 10)">
           <path d="M 30 20 Q 20 0 10 20 Q 20 40 30 30" fill="#2d2218"/>
           <path d="M 70 20 Q 80 0 90 20 Q 80 40 70 30" fill="#2d2218"/>
           <circle cx="50" cy="50" r="40" fill="#3a2f24"/>
           <ellipse cx="50" cy="65" rx="20" ry="15" fill="#2a2016"/>
           <ellipse cx="50" cy="55" rx="8" ry="5" fill="#111"/>
           <circle cx="35" cy="40" r="8" fill="#111" />
           <circle cx="65" cy="40" r="8" fill="#111" />
           <circle cx="36" cy="38" r="2" fill="#fff" />
           <circle cx="66" cy="38" r="2" fill="#fff" />
       </g>
    </svg>
  );
}

export function MelodyModel({ className = '' }: { className?: string; }) {
  return (
    <svg viewBox="0 0 100 200" className={className} width="100" height="200" style={{ overflow: 'visible' }}>
       <path d="M 75 160 Q 100 130 95 180 Q 95 200 75 190 Z" fill="#6a329f"/>
       <path d="M 75 170 Q 110 150 105 190 Q 100 210 75 200 Z" fill="#804fc0"/>
       <path d="M 30 90 C 20 120, 20 180, 25 200 L 75 200 C 80 180, 80 120, 70 90 Z" fill="#6a329f"/>
       <path d="M 40 110 C 35 140, 35 180, 40 200 L 60 200 C 65 180, 65 140, 60 110 Z" fill="#804fc0"/>
       <g transform="translate(0, -5)">
           <path d="M 10 0 L 40 40 L 30 40 Z" fill="#6a329f"/>
           <path d="M 90 0 L 60 40 L 70 40 Z" fill="#6a329f"/>
           <circle cx="50" cy="60" r="35" fill="#804fc0"/>
           <circle cx="35" cy="55" r="4" fill="#00ffcc" filter="drop-shadow(0 0 5px #00ffcc)"/>
           <circle cx="65" cy="55" r="4" fill="#00ffcc" filter="drop-shadow(0 0 5px #00ffcc)"/>
           <ellipse cx="50" cy="75" rx="10" ry="6" fill="#111"/>
       </g>
    </svg>
  );
}

export function BouncerModel({ className = '' }: { className?: string; }) {
  return (
    <svg viewBox="0 0 100 200" className={className} width="100" height="200" style={{ overflow: 'visible' }}>
       <rect x="90" y="140" width="5" height="40" fill="#111" transform="rotate(30 90 140)"/>
       <circle cx="110" cy="174" r="5" fill="#ff0000" filter="drop-shadow(0 0 5px red)"/>
       <path d="M 10 70 L 90 70 L 95 200 L 5 200 Z" fill="#1e2329"/>
       <rect x="20" y="65" width="60" height="30" fill="#111"/>
       <g transform="translate(0, -20)">
           <rect x="25" y="30" width="50" height="50" rx="10" fill="#2a333d"/>
           <rect x="35" y="45" width="30" height="15" fill="#ff0000" filter="drop-shadow(0 0 10px red)"/>
           <line x1="30" y1="70" x2="70" y2="70" stroke="#111" strokeWidth="4"/>
       </g>
    </svg>
  );
}

export function SmileUnitModel({ className = '' }: { className?: string; }) {
  return (
    <svg viewBox="0 0 100 200" className={className} width="100" height="200" style={{ overflow: 'visible' }}>
       <path d="M 60 180 Q 90 150 90 220" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5 5" opacity="0.5"/>
       <path d="M 30 90 L 70 90 L 60 200 L 40 200 Z" fill="#aaa" opacity="0.3"/>
       <g transform="translate(0, -10)">
           <circle cx="50" cy="60" r="30" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5 5" opacity="0.7"/>
           <path d="M 30 65 Q 50 95 70 65" fill="none" stroke="#fff" strokeWidth="4" filter="drop-shadow(0 0 10px white)"/>
           <circle cx="40" cy="50" r="3" fill="#fff" filter="drop-shadow(0 0 10px white)"/>
           <circle cx="60" cy="50" r="3" fill="#fff" filter="drop-shadow(0 0 10px white)"/>
       </g>
    </svg>
  );
}

export function GuestModel({ className = '' }: { className?: string; }) {
  return (
    <svg viewBox="0 0 100 200" className={className} width="100" height="200" style={{ overflow: 'visible' }}>
       {/* Tail */}
       <ellipse cx="75" cy="170" rx="8" ry="8" fill="#ddc099" />
       <path d="M 20 80 Q 50 70 80 80 L 70 200 L 30 200 Z" fill="#efd1a9" filter="drop-shadow(0 0 15px black)"/>
       <g transform="translate(0, -20)">
           <circle cx="50" cy="50" r="25" fill="#eed2b0"/>
           <circle cx="40" cy="45" r="4" fill="#000"/>
           <circle cx="60" cy="45" r="4" fill="#000"/>
           <path d="M 45 60 Q 50 65 55 60" fill="none" stroke="#000" strokeWidth="2"/>
       </g>
    </svg>
  );
}
