import createjs from 'createjs-module';
import gsap, { Power1, Cubic } from 'gsap';

export interface ParticleSettings {
    id: string,
    count: number,
    fromX: number,
    toX: number,
    diameter: number,
    alphaMax: number,
    areaHeight: number,
    color: string,
    fill: boolean
}

export interface Ellipse {
    width: number,
    height: number,
    alpha: number,
    offsetX: number,
    offsetY: number,
    color: string,
    element?: createjs.Shape,
    initX: number,
    initY: number
}

export interface Particle {
    shape: createjs.Shape,
    alphaMax: number,
    distance: number,
    diameter: number,
    flag: string,
    speed: number,
    initX: number,
    initY: number,
    areaHeight: number
}

const range = (min: number, max: number): number =>
{
	return min + (max - min) * Math.random();
}
		
const round = (num: number, precision: number): number =>
{
   var decimal = Math.pow(10, precision);
   return Math.round(decimal * num) / decimal;
}

const weightedRange = (to: number, from: number, decimalPlaces: number, rangeStart: number, rangeEnd: number, strength: number): number =>
{
    if (to == from) {
       return to;
    }
 
    if (Math.random() <= strength) {
        return round(Math.random() * (rangeEnd - rangeStart) + rangeStart, decimalPlaces);
    } else {
	    return round(Math.random() * (to - from) + from, decimalPlaces);
    }
}

class ParticleEngine {
    private canvas: HTMLCanvasElement;
    private stage: createjs.Stage;
    private compositeStyle: string;
    private particleSettings: ParticleSettings[];
    private lights: Ellipse[];
    private particles: Particle[];
    private width: number;
    private height: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
        this.stage = new createjs.Stage(this.canvas);
        this.compositeStyle = 'lighter';
        this.particleSettings = [
            {id: 'small', count: 300, fromX: 0, toX: this.width, diameter: 3, alphaMax: 0.4, areaHeight: .5, color: '#0cdbf3', fill: false }, 
            {id: 'medium', count: 100, fromX: 0, toX: this.width, diameter: 8, alphaMax: 0.3, areaHeight: 1, color: '#6fd2f3', fill: true }, 
            {id: 'large', count: 10, fromX: 0, toX: this.width, diameter: 30, alphaMax: 0.2, areaHeight: 1, color: '#93e9f3', fill: true }
        ];
		this.lights = [
            { width: 400, height: 100, alpha: 0.6, offsetX: 0, offsetY: 0, color: '#6ac6e8', initX: 0, initY: 0 }, 
            { width: 350, height: 250, alpha: 0.3, offsetX: -50, offsetY: 0, color: '#54d5e8', initX: 0, initY: 0 }, 
			{ width: 100, height: 80, alpha: 0.2, offsetX: 80, offsetY: -50, color: '#2ae8d8', initX: 0, initY: 0 }
        ];
        this.particles = [];
        this.stage.compositeOperation = this.compositeStyle;

        this.drawBgLight();
        this.drawParticles();
    }
    
    private drawBgLight()
    {
       this.lights.forEach((light) => {
            const shape = new createjs.Shape();
            shape.graphics.beginFill(light.color).drawEllipse(0, 0, light.width, light.height);
            shape.regX = light.width / 2;
            shape.regY = light.height / 2;
            shape.x = light.initX = this.width / 2 + light.offsetX;
            shape.y = light.initY = this.height / 2 + light.offsetY;

            const filter = new createjs.BlurFilter(light.width, light.height, 1);
            const bounds = filter.getBounds();
            shape.filters = [ filter ];
            shape.cache(bounds.x - light.width / 2, bounds.y - light.height / 2, bounds.width * 2, bounds.height * 2);
            shape.alpha = light.alpha;
            shape.compositeOperation = 'screen';
            this.stage.addChildAt(shape, 0);
            light.element = shape;
        });

        if (this.lights[0].element) {
            gsap.fromTo(this.lights[0].element, {
                duration: 10,
                scaleX: 1.5,
                x: this.lights[0].initX,
                y: this.lights[0].initY
            }, {
                yoyo: true,
                repeat: -1,
                ease: Power1.easeInOut,
                scaleX: 2,
                scaleY: 0.7
            });
        }

        if (this.lights[1].element) {
            gsap.fromTo(this.lights[1].element, {
                duration: 12,
                x: this.lights[1].initX,
                y: this.lights[1].initY
            }, {
                delay: 5,
                yoyo: true,
                repeat: -1,
                ease: Power1.easeInOut,
                scaleX: 2,
                scaleY: 2,
                x: this.width / 2 + 100,
                y: this.height / 2 - 50
            });
        }

        if (this.lights[2].element) {
            gsap.fromTo(this.lights[2].element, {
                duration: 8,
                x: this.lights[2].initX,
                y: this.lights[2].initY
            }, {
                delay: 2,
                yoyo: true,
                repeat: -1,
                ease: Power1.easeInOut,
                scaleX: 1.5,
                scaleY: 1.5,
                x: this.width / 2 - 200,
                y: this.height / 2
            });
        }
    }

    private drawParticles() {
        this.particleSettings.forEach((settings) => {
            for (let i = 0; i < settings.count; i++) {
                const shape = new createjs.Shape();

                if (settings.fill) {
                    shape.graphics.beginFill(settings.color).drawCircle(0, 0, settings.diameter);
                    const filter = new createjs.BlurFilter(settings.diameter / 2, settings.diameter / 2, 1);
                    const bounds = filter.getBounds();
                    shape.filters = [ filter ];
                    shape.cache(-50 + bounds.x, -50 + bounds.y, 100 + bounds.width, 100 + bounds.height);
                } else {
                    shape.graphics.beginStroke(settings.color).setStrokeStyle(1).drawCircle(0, 0, settings.diameter);
                }

                const xRangeStart = settings.fromX + (settings.toX - settings.fromX) / 4;
                const xRangeEnd = settings.fromX + (settings.toX - settings.fromX) * 3 / 4;
                const yRangeStart = this.height * (2 - settings.areaHeight / 2) / 4;
                const yRangeEnd = this.height * (2 + settings.areaHeight / 2) / 4;
                const particle: Particle = {
                    shape: shape,
                    alphaMax: settings.alphaMax,
                    distance: settings.diameter * 2,
                    diameter: settings.diameter,
                    flag: settings.id,
                    speed: range(2, 10),
                    initX: weightedRange(settings.fromX, settings.toX, 1, xRangeStart, xRangeEnd, 0.6),
                    initY: weightedRange(0, this.width, 1, yRangeStart, yRangeEnd, 0.8 ),
                    areaHeight: settings.areaHeight
                }

                const scale = range(.3, 1);
                shape.alpha = range(0, .1);
                shape.y = particle.initY;
                shape.x = particle.initX;
                shape.scaleX = scale;
                shape.scaleY = scale;

                this.stage.addChild(shape);
                this.animateParticle(particle);
                this.particles.push(particle);
            }
        });
    }

    private applySettings(particle: Particle, positionX: number, totalWidth: number, areaHeight: number)
    {
        const xRangeStart = positionX + (totalWidth - positionX) / 4;
        const xRangeEnd = positionX + (totalWidth - positionX) * 3 / 4;
        const yRangeStart = this.height * (2 - areaHeight / 2) / 4;
        const yRangeEnd = this.height * (2 + areaHeight / 2) / 4;
        
        particle.speed = range(1, 3);
        particle.initX = weightedRange(positionX, totalWidth, 1, xRangeStart, xRangeEnd, 0.6);
        particle.initY = weightedRange(0, this.width, 1, yRangeStart, yRangeEnd, 0.8);
    }

    private animateParticle(particle: Particle) {
        const speed = particle.speed;
        const scale = range(0.3, 1);
        const x = range(particle.initX - particle.distance, particle.initX + particle.distance);
        const y = range(particle.initY - particle.distance, particle.initY + particle.distance);
        gsap.to(particle, { duration: speed, scaleX: scale, scaleY: scale, x: x, y: y, onComplete: this.animateParticle, onCompleteParams: [ particle ], ease: Cubic.easeInOut });	
        gsap.to(particle, { duration: speed / 2, alpha: range(0.1, particle.alphaMax), onComplete: this.fadeout, onCompleteParams: [ particle, speed ] });	
    }

    private fadeout(particle: Particle, speed: number)
    {
        particle.speed = range(2, 10);
        gsap.to(particle.shape, { duration: speed / 2, alpha: 0 });
    }

    public render() {
        this.stage.update();
    }

    public resize() {
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
		this.render();

        this.particles.forEach(particle => {
            this.applySettings(particle, 0, this.width, particle.areaHeight);
        });

        this.lights.forEach((light) => {
            light.initX = this.width / 2 + light.offsetX;
            light.initY = this.height / 2 + light.offsetY;

            if (light.element) {
                gsap.to(light.element, { duration: .5, x: light.initX, y: light.initY });
            }
        });
	}
}

export default ParticleEngine;
