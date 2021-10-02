import styled from 'styled-components';

export const MintingContainer = styled.div`
display: flex;
flex-direction:  column;
padding: 100px;
width: auto;
height: auto;
margin: 0px 10px 50px 10px;
align-items: center;

border-radius: 10px;
// border: 1px solid;
box-shadow: -1px 7px 16px 8px;
& input {
    margin-top: 10px;
    height: 32px;
}
& textarea {
    margin-top: 10px;

}
& img {
    height: 200px;
    border: 1px solid grey;
    border-radius: 10px;
}

`

export const MintingInput = styled.input`
    height: 50px;
    width: auto;
    border-radius: 8px;


`