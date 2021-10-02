import styled, {css} from 'styled-components';


interface IAppContainer {
    isMinting?: boolean;
}

export const AppContainer = styled.div<IAppContainer>`
text-align: center;
position: fixed;
height: 100%;
width: 100%;
display: grid;
${props => props.isMinting ? css`
        grid-template-areas:
        "a a b b b . . c "
        ". d d d d d d ."
        ". d d d d d d ."
        ". d d d d d d .";`
    :

    `
    grid-template-areas:
    ". . h h y a c"
    ". b b b b b b"
    ". b b b b b b"
    ". b b b b b b";`
}


`

export const CurateHeader = styled.span`

background: -webkit-linear-gradient(#fce043, #fb7ba2);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
`

export const ConnectButton = styled.button`
    border-radius: 12px;
    height: 50px;
    width: 150px;
    background-color: #fce043;
    background-image: linear-gradient(315deg, #fce043 0%, #fb7ba2 74%);
    border: none;
    color: white;
    font-weight: bold;
    font-size: large;
    float: left;
    margin: 20px;
    cursor: pointer;
    &:hover {
        opacity: 0.5;
    }

`