import React from 'react';

const GameOverPopUp = ({
    onConfirm,
}) => {
    return (
        <div className="GlobalPopUpFrame">
            <h2>YOU WIN !!!</h2>
            <button onClick={() => { onConfirm(); }}>START A NEW GAME</button>
        </div>
    )
}

export default GameOverPopUp;
