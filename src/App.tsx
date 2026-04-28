import { useState } from 'react';
import './App.css';
// import the components 

//ignore typing, i don't want to deal with it rn 
// @ts-ignore
import Sticker from './components/Sticker';
// @ts-ignore
import CanvasBrush from './components/CanvasBrush';

// these are the "stickers" allowed right now
// i could add more 
const STICKER_TYPES = ['🌟', '🌸', '💖', '🐛', '🌈'];

function App() {
  const [activeStickers, setActiveStickers] = useState([]);

  // actually adding the new sticker after presseing associated button
  const addSticker = (emoji:any) => {
    const newSticker = {
      id: Date.now(), // id is it's specfic date 
      emoji: emoji,
      x: 300, 
      y: 200, 
    };
    setActiveStickers([...activeStickers, newSticker]);
  };

  return (
  <div className="app-container">
    <header className="app-header">
      <h1>Interact.js Demo</h1>
      {/* reset button, clears everything */}
      <button onClick={() => window.location.reload()} className="clear-btn">Reset All</button>
    </header>

    <div className="sidebar">

      <h3>Sticker Box</h3>

      <div className="sticker-grid">
        {/* map tje stickers to the sticker grid (where they can be selected) */}
        {STICKER_TYPES.map((emoji) => (
          <button 
            key={emoji} 
            className="spawn-btn" 
            onClick={() => addSticker(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>

      <p className="hint">Click to add to canvas!</p>

    </div>

    <CanvasBrush />

    {/* the stickers are rendered on top of the canvas, so you can still interact with them after drawing with brush  */}
    {activeStickers.map((s) => (
      <Sticker key={s.id} emoji={s.emoji} startX={s.x} startY={s.y} />
    ))}
  </div>
);
}

export default App;