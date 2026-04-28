import { useEffect, useRef } from 'react';
import interact from 'interactjs';

export default function Sticker({ emoji, startX, startY }) {
  const stickerRef = useRef(null);
  const interactRef = useRef(null); // store the interact instance

  useEffect(() => {
    const el = stickerRef.current;

    // attach library to sticker element 
    interactRef.current = interact(el)
      .draggable({

        // restrictRect keeps stickers from flying of the canvas/screen
        modifiers: [interact.modifiers.restrictRect({ restriction: 'parent' })],
        listeners: {
            // update sticker coords based on moving the mouse 
            move(event) {
                const x = (parseFloat(el.dataset.x) || startX) + event.dx;
                const y = (parseFloat(el.dataset.y) || startY) + event.dy;
                update(el, x, y);
            }
        }
      })
      
      .resizable({
        // define which CSS classes are resizable handles 
        edges: { 
          left: '.top-left, .bottom-left', 
          right: '.bottom-right', 
          bottom: '.bottom-right, .bottom-left', 
          top: '.top-left' 
        },
        // listeners for those movements
        listeners: {
          move(event) {
            let x = (parseFloat(el.dataset.x) || startX) + event.deltaRect.left;
            let y = (parseFloat(el.dataset.y) || startY) + event.deltaRect.top;
            el.style.width = `${event.rect.width}px`;
            el.style.height = `${event.rect.height}px`;
            update(el, x, y);
          }
        }
      });

    // actually rotate based on the listern's information
    const handleRotation = (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        el.dataset.angle = angle;
        update(el);
    };

    // on clicking, make interactive for rotating (top right handle)
    const onMouseDown = (e) => {
      if (e.target.classList.contains('top-right')) {
        e.preventDefault();
        e.stopPropagation(); // stop the event from bubbling to the draggable parent

        // temporarily disable interact.js dragging/resizing
        interactRef.current.draggable(false);
        interactRef.current.resizable(false);

        window.addEventListener('mousemove', handleRotation);
        window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', handleRotation);
          
            // re-enable interact.js when done
            interactRef.current.draggable(true);
            interactRef.current.resizable(true);
        }, { once: true });
      }
    };

    el.addEventListener('mousedown', onMouseDown);

    // visual rendering, for rotating or repositioning or the rest
    function update(target, x, y) {
        const tx = (x ?? parseFloat(target.dataset.x)) || startX;
        const ty = (y ?? parseFloat(target.dataset.y)) || startY;
        const r = target.dataset.angle || 0;
        target.style.transform = `translate(${tx}px, ${ty}px) rotate(${r}deg)`;
        target.style.fontSize = `${target.offsetWidth * 0.8}px`;
        target.dataset.x = tx;
        target.dataset.y = ty;
    }

    update(el, startX, startY);

    return () => {
      interact(el).unset();
      el.removeEventListener('mousedown', onMouseDown);
    };
  }, [startX, startY]);

  // sticker itself and it's interaction tools 
  return (
    <div ref={stickerRef} className="sticker" style={{ position: 'absolute', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="emoji-content" style={{ userSelect: 'none', lineHeight: 1 }}>{emoji}</span>
      
      <div className="resize-handle top-left"></div>
      
      <div className="resize-handle top-right" title="Rotate"></div>
      
      <div className="resize-handle bottom-left"></div>
      
      <div className="resize-handle bottom-right"></div>
    </div>
  );
}