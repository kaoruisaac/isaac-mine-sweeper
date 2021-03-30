import React from 'react';

const GameOverPopUp = ({
    onConfirm,
}) => {
    return (
        <div className="GlobalPopUpFrame">
            <h2>GAME OVER</h2>
            <button onClick={() => { onConfirm(); }}>TRY AGAIN</button>
        </div>
    )
}

export default GameOverPopUp;
