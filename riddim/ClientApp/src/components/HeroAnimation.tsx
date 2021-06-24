import React, { FC, useRef, useEffect } from 'react'
import ParticleEngine from '../theme/particleEngine'
import createjs from 'createjs-module';
import { HeroAnimationLayout } from '../ui/HeroComponents';

const HeroAnimation: FC<React.CanvasHTMLAttributes<HTMLCanvasElement>> = props => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    
    const updateCanvas = () => {
        engine.render();
    }

    const resizeCanvas = () => {
        engine.resize();
    }
    
    let engine: ParticleEngine;

    useEffect(() => {
        if (canvasRef.current) {
            engine = new ParticleEngine(canvasRef.current);
            createjs.Ticker.addEventListener('tick', updateCanvas);
	        window.addEventListener('resize', resizeCanvas, false);
        }
    }, [])

    return <HeroAnimationLayout ref={canvasRef} {...props}/>
}

export default HeroAnimation