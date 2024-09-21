import styled from 'styled-components';



export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;

  th {
    padding: 8px;
    text-align: left;
  }

  thead {
  background-color:whitesmoke;
  border-radius:8px;
  border-style:none;
  }

  td {
    padding: 8px;
    text-align: left;
    font-family: "Montserrat", "sans-serif";
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    font-size:14px
  }

  th {
    border-bottom: 2px solid grey;
  }

  td {
    border-bottom: 1px solid grey;
  }

`;

export const FilterContainer = styled.form`
width:100%;
display:flex;
align-items:center;
justify-content:center;
border:none;
flex-direction:column;
padding:10px;
margin-bottom:20px;

`
export const SearchItems = styled.div`
width:100%;
display:flex;
align-items:center;
justify-content:space-between;
border:none;
flex-wrap:wrap;
`

export const SearchItem = styled.div`
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
flex:1;
padding:5px;
`

export const Input = styled.input`
border-bottom: 2px solid grey;

&:focus{
    border-bottom:2px solid lightgreen;
    outline: none;
    
}
`

export const SearchTitle = styled.h2`
font-family:"Montserrat", "sans-serif";
font-weight:400;
font-style: italics;
margin-bottom:3px;
`

export const SearchButton = styled.button`
border: 2px solid grey;
height: 30px;
width: 80px;
padding:5px;
display:flex;
justify-content:center;
align-items:center;
font-family:"Montserrat", "sans-serif";
margin-top:8px;


&:hover{
background-color:teal;
color:white

}
`