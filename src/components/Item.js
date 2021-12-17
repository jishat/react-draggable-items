import React, { useContext } from 'react';
import { itemContext } from '../App';
import './Item.css'

const Item = (props) => {
    const [items, setItems] = useContext(itemContext);
    const {h, w, x, y} = props.data[1];
    const action = props.action;
    const removeAxis = props.removeAxis;
    const addAxis = props.addAxis;
    const getCurrentValue = items.data.items.movableItem.itemList[props.data[0]];
    return (
        <>
            <div className="eachItem" id={props.data[0]} data-key={props.data[0]}  onMouseDown={e=>removeAxis(e)}  onMouseMove={e=>action(e)} onMouseUp={e=>addAxis(e)}  style={{height:h, width:w, left:x, top:y}}>
                <div style={{padding:'15px'}}>
                    <p>X: {getCurrentValue.x}</p>
                    <p>Y: {getCurrentValue.y}</p>
                    <p>H: {getCurrentValue.h}</p>
                    <p>W: {getCurrentValue.w}</p>
                </div>
                <span className="leftTopCorner corner"></span>
                <span className="rightTopCorner corner"></span>
                <span className="rightBottomCorner corner"></span>
                <span className="leftBottomCorner corner"></span>
            </div>
        </>
    );
};

export default Item;