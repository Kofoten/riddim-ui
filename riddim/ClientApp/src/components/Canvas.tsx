import React, { FC, useRef, useEffect } from 'react'
import ParticleEngine from '../theme/particleEngine'
import createjs from 'createjs-module';

const Canvas: FC<React.CanvasHTMLAttributes<HTMLCanvasElement>> = props => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            const engine = new ParticleEngine(canvasRef.current);
            
            const updateCanvas = () => {
                engine.render();
            }

            const resizeCanvas = () => {
                engine.resize();
            }

            createjs.Ticker.addEventListener('tick', updateCanvas);
	        window.addEventListener('resize', resizeCanvas, false);
        }
    }, [])

    return <canvas ref={canvasRef} {...props}/>
}

export default Canvas