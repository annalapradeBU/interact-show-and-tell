import { useEffect, useRef } from 'react';
import interact from 'interactjs';


export default function CanvasBrush() {
  const canvasRef = useRef(null);

  // resize canvas with window (drawings do get reset, though :( )
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    interact(canvas).draggable({
      // prevents the brush from drawing when you click UI elements (kind of)
      ignoreFrom: '.sidebar, .app-header, button', 
      cursorChecker: () => 'crosshair',
      listeners: {
        // on moving (when clicking down) create a bunch of blue squares as a "pen"
        move(event) {
          ctx.fillStyle = 'hsla(200, 70%, 50%, 0.5)';
          const size = 20;
          ctx.fillRect(
            event.clientX - size / 2, 
            event.clientY - size / 2, 
            size, 
            size
          );
        }
      }
    });

    return () => {
      interact(canvas).unset();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="paint-canvas"
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        touchAction: 'none',
        display: 'block',
        zIndex: 1 // ensure it stays behind the UI
      }} 
    />
  );
}