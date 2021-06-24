import styled from 'styled-components';

export const SeoHeader = styled.h1`
    display: none;
`

export const HeroWrapper = styled.div`
    display: block;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    background-color: #000;
    font-family: 'Bungee Inline', cursive;
`

export const HeroSvg = styled.svg`  
    display: block;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    font-size: 10em;
`

export const HeroAnimationLayout = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 180px;
`