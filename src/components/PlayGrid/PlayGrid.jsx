import React, { Component } from 'react';
import MineSweeperCore from 'core/MineSweeperCore'
import styled from 'styled-components';
import './PlayGrid.css';

const PlayGridStyled = styled('div')`
    ${({ height, width }) => `
        grid: repeat(${height}, 1fr) / repeat(${width}, 1fr)
    `}
`;

class PlayGrid extends Component {
    state = {
        height: 0,
        width: 0,
        grid: [],
    }
    mineSweeper = new MineSweeperCore(20, 20);
    componentDidMount() {
        const { grid, height, width } = this.mineSweeper.getGridInfo();
        this.setState({ grid, height, width });
    }
    Init(height, width, mineNum) {
        console.log(height, width, mineNum);
        const { onStatusChange } = this.props;
        this.mineSweeper = new MineSweeperCore(height, width, { mineNum });
        this.setState({ height, width });
        this.mineSweeper.onRender((grid) => { this.setState({ grid }); });
        this.mineSweeper.onStatusChange(status => onStatusChange(status));
    }
    render() {
        const { grid, height, width } = this.state;
        return (
            <PlayGridStyled className="PlayGrid" {...{ height, width }}>
                {
                    grid.map((row, y) => (
                        row.map((slot, x) => (
                            <div
                                key={`${x},${y}`}
                                className={
                                    slot.hasRevealed() && (
                                        (slot.hasMine() && 'mine')
                                        || (slot.getNumber() > -1 && 'surround')
                                        || 'empty'
                                    ) || (slot.hasFlag() && 'flag') || 'unreveal'
                                }
                                num={slot.getNumber()}
                                onClick={() => this.mineSweeper.reveal(x, y)}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    this.mineSweeper.flag(x, y);
                                }}
                            >
                                {slot.hasRevealed() && slot.getNumber() > -1 && slot.getNumber() || ''}
                            </div>
                        ))
                    ))
                }
            </PlayGridStyled>
        );
    }
}
 
export default PlayGrid;