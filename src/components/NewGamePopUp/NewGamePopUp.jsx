import React, { useState } from 'react';

const NewGamePopUp = ({
    PopUpClose,
    onConfirm,
}) => {
    const [height, setHeight] = useState(20);
    const [width, setWidth] = useState(20);
    const [mineNum, setMineNum] = useState(undefined);
    return (
        <div className="GlobalPopUpFrame">
            <h2>START A NEW GAME</h2>
            <div>
                <div className="flex">
                    <span>Size :</span>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)}/>
                    x
                    <input type="number" value={width}  onChange={e => setWidth(e.target.value)}/>
                </div>
                <div className="flex">
                    <span>Number of mine :</span>
                    <input type="number" value={mineNum || Math.round(height * width / 10)}  onChange={e => setMineNum(e.target.value > height * width - 1 ? height * width - 1 :  e.target.value)}/>
                </div>
            </div>
            <button onClick={() => { onConfirm(parseInt(height, 10), parseInt(width, 10), mineNum ? parseInt(mineNum, 10) : undefined); PopUpClose() }}>START</button>
        </div>
    )
}

export default NewGamePopUp;
