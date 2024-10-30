import React from 'react';
import '../App.css';
import { TypeAnimation } from 'react-type-animation';

function Overlay() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
      <a href="https://pmnd.rs/" style={{ position: 'absolute', bottom: 40, left: 90, fontSize: '13px' }}>
        pmnd.rs
        <br />
        dev collective
      </a>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%,-50%,0)' }}>
        <TypeAnimation
          sequence={[
            'LinguaGen',
            1000,  // 대기 시간 (밀리초)
            'Study English',
            1000,
            'AI-Powered',
            1000,
            'LinguaGen',
            1000
          ]}
          wrapper="h3"
          cursor={true}
          repeat={Infinity}  // 무한 반복
          className="hello InterBold"
          style={{
            margin: 0,
            padding: 0,
            fontSize: '9em',
            fontWeight: 500,
            letterSpacing: '-0.05em',
            background: 'linear-gradient(30deg, #c850c0, #ffcc70)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        />
      </div>
    </div>
  );
}

export default Overlay;
