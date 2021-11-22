import styled, { keyframes } from 'styled-components';

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`

export const PlayerWrapper = styled.div`
    background-color: ${props => props.theme.accent};
    width: 400px;
`

export const PlayerButton = styled.div`
    width: 400px;
    height: 400px;
    margin: 0;
`

export const PlayerPausedBorder = styled.div`
    border-radius: 50%;
    border: 36px solid ${props => props.theme.primary};
    color: ${props => props.theme.primary};
    padding-left: 36px;
    padding-top: 18px;
    width: 400px;
    height: 400px;
    &:hover {
        border: 36px solid ${props => props.theme.variant};
        color: ${props => props.theme.variant};
    }
    &:active {
        border: 36px solid ${props => props.theme.exclaim};
        color: ${props => props.theme.exclaim};
    }
`

export const PlayerPlayingImage = styled.img`
    border-radius: 50%;
    width: 400px;
    height: 400px;
    animation: ${spin} 5s linear infinite;
    margin: 0;
`