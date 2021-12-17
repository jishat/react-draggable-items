import './App.css';
import { createContext, useEffect, useState } from 'react';
import Item from './components/Item';


export const itemContext = createContext();

const App= ()=> {

  // initial state
  const [items, setItems] = useState({
    data: {
      items: {
        movableItem: {
          totalItem: 3,
          itemList: {
            [`item-1`]: {
              h: 120,
              w: 120,
              x: 0,
              y: 0
            },
            [`item-2`]: {
              h: 120,
              w: 120,
              x: 500,
              y: 10
            },
            [`item-3`]: {
              h: 120,
              w: 120,
              x: 800,
              y: 100
            }
          }
        }
      }
    }
  });


  /*
   * 
   *  useEffect is use for to read
   *  the DOM and initialize item & board
   *  
  **/ 
  useEffect(()=>{
    const canvas = document.getElementById("board");
    const ctx = canvas && canvas.getContext("2d");
    drawBoard(ctx); // call the function for draw board

    const getAllItems = document.querySelectorAll(".eachItem");
    for (let i = 0; i < getAllItems.length; i++) {
      dragItem(getAllItems[i]);
    }
  },[]);


  /*
   * 
   *  Declare a function for Create
   *  the board
   *  
  **/ 
  const drawBoard = (ctx)=>{

    // Declare main rect weight & height of board
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "#6fbfff";
    ctx.strokeRect(0, 0, 1000, 500); //Draws a rectangle (no fill) for board
    
    //Draw each row of board
    let rowY = 10;
    for(let i=0; i < (500/10); i++){
      ctx.beginPath(); // begin path
      ctx.lineWidth = "0.5";
      if((i+1) % 5 === 0){
        ctx.strokeStyle = "#9dd4ff";
      }else{
        ctx.strokeStyle = "#c9e6fd";
      }
      ctx.moveTo(0, rowY);
      ctx.lineTo(1000, rowY);
      ctx.stroke(); // Draw it
      rowY +=10;
    }

    // Draw each column of board
    let colX = 10;
    for(let i=0; i < (1000/10); i++){
      ctx.beginPath(); // begin path
      ctx.lineWidth = "0.5";
      if((i+1) % 5 === 0){
        ctx.strokeStyle = "#9dd4ff";
      }else{
        ctx.strokeStyle = "#c9e6fd";
      }
      ctx.moveTo(colX, 0);
      ctx.lineTo(colX, 500);
      ctx.stroke(); // Draw it
      colX +=10;
    }
  } //end drawBoard()


  /*
   * 
   *  Declare a function for Drag
   *  the items
   *  
  **/ 
  const dragItem = (eachItem)=> {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    const dragMouseDown = (e)=>{
      e = e || window.event;
      e.preventDefault();

      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragItem;
      document.onmousemove = elementDrag;

    }
    eachItem.onmousedown = dragMouseDown;

    const elementDrag = (e)=>{
      e = e || window.event;
      e.preventDefault();

      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      eachItem.style.top = (eachItem.offsetTop - pos2) + "px";
      eachItem.style.left = (eachItem.offsetLeft - pos1) + "px";
    }

    const closeDragItem = ()=>{
      document.onmouseup = null;
      document.onmousemove = null;
    }
  } // End dragItem()

  

  /*
   * 
   *  Change the X,Y cordinate
   *  during drag items
   *  
  **/ 
  const changeProp = (d)=>{
    const getElement = d.currentTarget;
    const itemKey = getElement.getAttribute('data-key');


    if(itemKey !== null){
      const rect = getElement.getBoundingClientRect();

      const itemTop = getElement.offsetTop;
      const itemBottom = 500-(rect.height+getElement.offsetTop);
      const itemLeft = getElement.offsetLeft;    
      const itemRight = 1000-(rect.width+getElement.offsetLeft);

      let leftTmp = itemLeft;
      let topTmp = itemTop;
      if(itemTop < 1){
        getElement.style.top = 0+ "px";
        topTmp=0; 
      }else{
        getElement.style.top = topTmp+ "px";
      }
      if(itemBottom < 1){
        getElement.style.top = (500-rect.height)+ "px";
        topTmp = (500-rect.height);
      }
      if(itemLeft < 1){
        getElement.style.left = 0+ "px";
        leftTmp=0; 
      }
      if(itemRight < 1){
        getElement.style.left = (1000-rect.width)+ "px";
        leftTmp = (1000-rect.width);
      }
      items.data.items.movableItem.itemList[itemKey] ={
        h: rect.height,
        w: rect.width,
        x: leftTmp,
        y: topTmp
      }
      setItems({...items});
      const allItems = items.data.items.movableItem.itemList;
      drawMatchPointer(itemKey, allItems[itemKey], allItems);
    }
  } //End changeProp()


  /*
   * 
   *  Focus X,Y cordinate
   *  Axis during move drag items
   *  
  **/ 
  const addAxis = (e)=>{
    const rect = e.currentTarget.getBoundingClientRect();
    var centerX = e.currentTarget.offsetLeft + (rect.width / 2);
    var centerY = e.currentTarget.offsetTop + (rect.height / 2);
    drawAxis(centerX, centerY);
  } //End addAxis()


  /*
   * 
   *  Draw X,Y cordinate
   *  Axis for focus
   *  
  **/ 
  const drawAxis = (x, y)=>{
    const canvas = document.getElementById("axis");
    const ctx = canvas && canvas.getContext("2d");
    if ( ctx.setLineDash !== undefined )   ctx.setLineDash([2,2]);
    if ( ctx.mozDash !== undefined )       ctx.mozDash = [2,2];

    ctx.beginPath(); // begin path
    ctx.lineWidth = "1";
    ctx.strokeStyle = '#3f51b5';
    ctx.moveTo(0, y);
    ctx.lineTo(x, y);
    ctx.stroke(); // Draw it

    ctx.beginPath(); // begin path
    ctx.lineWidth = "1";
    ctx.strokeStyle = '#3f51b5';
    ctx.moveTo(x, 0);
    ctx.lineTo(x, y);
    ctx.stroke(); // Draw it
  } //End drawAxis()


  /*
   * 
   *  Remove focused X,Y cordinate
   *  Axis after move dragged items
   *  
  **/ 
  const removeAxis=(e)=>{
    const canvas = document.getElementById("axis");
    const ctx = canvas && canvas.getContext("2d");
    ctx.clearRect(0, 0, 1000, 500);
  } //removeAxis()

  

  /*
   * 
   *  If items align with X, Y, H, W cordinate
   *  the will focus pointer
   *  
  **/ 
  const drawMatchPointer = (currentItemKey, currentItem, allItems)=>{
    const canvas = document.getElementById("matchPointer");
    const ctx = canvas && canvas.getContext("2d");
    ctx.clearRect(0, 0, 1000, 500);
    ctx.lineWidth = "1";
    ctx.strokeStyle = '#e91e63';

    const getAllItems = Object.entries(allItems);

    const draw=(d)=>{
      if(d[0] !== currentItemKey){

        if(d[1].y < currentItem.y){
          if(d[1].x === currentItem.x){
            ctx.beginPath(); // begin path
            ctx.moveTo(currentItem.x, (currentItem.y + currentItem.h));
            ctx.lineTo(d[1].x, d[1].y);
            ctx.stroke(); // Draw it
          }
          if((d[1].x + d[1].w) === (currentItem.x + currentItem.w)){
            ctx.beginPath(); // begin path
            ctx.moveTo((currentItem.x + currentItem.w), (currentItem.y + currentItem.h));
            ctx.lineTo((d[1].x + d[1].w), d[1].y);
            ctx.stroke(); // Draw it
          }
          if((d[1].x + d[1].w) === currentItem.x){
            ctx.beginPath(); // begin path
            ctx.moveTo(currentItem.x, (currentItem.y + currentItem.h));
            ctx.lineTo((d[1].x + d[1].w), d[1].y);
            ctx.stroke(); // Draw it
          }
          if(d[1].x=== (currentItem.x + currentItem.w)){
            ctx.beginPath(); // begin path
            ctx.moveTo((currentItem.x+currentItem.w), (currentItem.y + currentItem.h));
            ctx.lineTo(d[1].x, d[1].y);
            ctx.stroke(); // Draw it
          }
        }
        if(d[1].y > currentItem.y){
          if(d[1].x === currentItem.x){
            ctx.beginPath(); // begin path
            ctx.moveTo(d[1].x, (d[1].y + d[1].h));
            ctx.lineTo(currentItem.x, currentItem.y);
            ctx.stroke(); // Draw it
          }
          if((d[1].x + d[1].w) === (currentItem.x + currentItem.w)){
            ctx.beginPath(); // begin path
            ctx.moveTo((d[1].x + d[1].w), (d[1].y + d[1].h));
            ctx.lineTo((currentItem.x + currentItem.w), currentItem.y);
            ctx.stroke(); // Draw it
          }
          if((d[1].x + d[1].w) === currentItem.x){
            ctx.beginPath(); // begin path
            ctx.moveTo((d[1].x+d[1].w), (d[1].y + d[1].h));
            ctx.lineTo(currentItem.x, currentItem.y);
            ctx.stroke(); // Draw it
          }
          if(d[1].x=== (currentItem.x + currentItem.w)){
            ctx.beginPath(); // begin path
            ctx.moveTo((currentItem.x+currentItem.w), currentItem.y );
            ctx.lineTo(d[1].x, (d[1].y+d[1].h));
            ctx.stroke(); // Draw it
          }
        }
        if(d[1].x < currentItem.x){
          if(d[1].y === currentItem.y){
            ctx.beginPath(); // begin path
            ctx.moveTo(d[1].x, d[1].y);
            ctx.lineTo((currentItem.x+currentItem.w), currentItem.y);
            ctx.stroke(); // Draw it
          }
          if((d[1].y+d[1].h) === (currentItem.y+currentItem.h)){
            ctx.beginPath(); // begin path
            ctx.moveTo(d[1].x, (d[1].y+d[1].h));
            ctx.lineTo((currentItem.x+currentItem.w), (currentItem.y+currentItem.h));
            ctx.stroke(); // Draw it
          }
          if((d[1].y+d[1].h) === currentItem.y){
            ctx.beginPath(); // begin path
            ctx.moveTo(d[1].x, (d[1].y+d[1].h));
            ctx.lineTo((currentItem.x+currentItem.w), currentItem.y);
            ctx.stroke(); // Draw it
          }
          if(d[1].y=== (currentItem.y+currentItem.h)){
            ctx.beginPath(); // begin path
            ctx.moveTo(d[1].x, d[1].y);
            ctx.lineTo((currentItem.x+currentItem.w), (currentItem.y+currentItem.h));
            ctx.stroke(); // Draw it
          }
        }
        if(d[1].x > currentItem.x){
          if(d[1].y === currentItem.y){
            ctx.beginPath(); // begin path
            ctx.moveTo((d[1].x+d[1].w), d[1].y);
            ctx.lineTo(currentItem.x, currentItem.y);
            ctx.stroke(); // Draw it
          }
          if((d[1].y+d[1].h) === (currentItem.y+currentItem.h)){
            ctx.beginPath(); // begin path
            ctx.moveTo((d[1].x+d[1].w), (d[1].y+d[1].h));
            ctx.lineTo(currentItem.x, (currentItem.y+currentItem.h));
            ctx.stroke(); // Draw it
          }
          if((d[1].y+d[1].h) === currentItem.y){
            ctx.beginPath(); // begin path
            ctx.moveTo((d[1].x+d[1].w), (d[1].y+d[1].h));
            ctx.lineTo(currentItem.x, currentItem.y);
            ctx.stroke(); // Draw it
          }
          if(d[1].y=== (currentItem.y+currentItem.h)){
            ctx.beginPath(); // begin path
            ctx.moveTo((d[1].x+d[1].w), d[1].y);
            ctx.lineTo(currentItem.x, (currentItem.y+currentItem.h));
            ctx.stroke(); // Draw it
          }
        }
      }
    }
    getAllItems.map(d => draw(d));
  } //End drawMatchPointer()

  const allItems = Object.entries(items.data.items.movableItem.itemList);
  
  return (
    <itemContext.Provider value={[items, setItems]}>
      <canvas id="board" width="1000" height="500"></canvas>
      <div id="myItems">{allItems.map(d=><Item data={d} key={d[0]} addAxis={addAxis} removeAxis={removeAxis} action={changeProp}/>)}</div>
      <canvas id="axis" width="1000" height="500"></canvas>
      <canvas id="matchPointer" width="1000" height="500"></canvas>
    </itemContext.Provider>
  );
}

export default App;
