import styled from 'styled-components';


export const HorizontalScrollLayout = styled.div`
    margin: auto;
    top: 50%;
    width: 80%;
    height: 80%;
    padding: 10px;
    // background-color: #d3edfd;
    vertical-align: center;
    border-radius: 10px;
    box-shadow: 0px 1px 5px 0px;
    overflow: auto;
    white-space: nowrap;

    & div {
        display: inline-block;
        color: white;
        text-align: center;
        padding: 14px;
        text-decoration: none;
    }

`



export const ViewBox = styled.div`
    height: 100px;
    width: 200px;
    border:1px solid grey;
    padding: 5px;
    margin-top: 200px;
    margin-left: 20px;
    border-radius: 8px;
`