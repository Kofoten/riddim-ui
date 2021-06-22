import styled from 'styled-components';

export const SeoHeader = styled.h1`
    display: none;
`

export const LogoWrapper = styled.div`
    display: block;
    width: 100%;
    background-color: ${props => props.theme.secondary};
    font-family: 'Bungee Inline', cursive;
`

export const LogoSvg = styled.svg`  
    display: block;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    font-size: 10em;
`