import styled from "styled-components";


export const DetailsContainer = styled.div`
display:flex;
width:100%;
justify-content:flex-start;
align-items:center;
flex-direction:column;
padding:10px;
margin: 10px;
border-radius:8px;
background-color:whitesmoke;

`

export const Title = styled.h2`
font-weight:400;
font-style:normal;
margin-bottom:3px;
font-size:15px;
`
export const Info =styled.div`
font-weight:200
`

export const DetailItem = styled.div`
font-family:"Montserrat", "sans-serif";
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
flex:1;
padding:5px;
`

export const ProfilePic = styled.img`
border-radius:50%;
height:50px;
width:50px;
`