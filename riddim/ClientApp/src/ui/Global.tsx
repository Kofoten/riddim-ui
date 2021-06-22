import { createGlobalStyle } from 'styled-components';

const Global = createGlobalStyle`
html {
    box-sizing: border-box;
}

body {
    margin: 0;
    background-color: ${props => props.theme.secondary}
}

*, *:before, *:after {
    box-sizing: inherit;
}
`

export default Global;