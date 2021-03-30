import React, { createRef } from "react";
import { hot } from 'react-hot-loader/root';
import PlayGrid from './components/PlayGrid';
import PopUpWapper from './components/PopUpWapper';
import NewGamePopUp from './components/NewGamePopUp';
import GameOverPopUp from './components/GameOverPopUp';
import WinPopUp from './components/WinPopUp';
import { STATUS_GAME_OVER, STATUS_WIN } from './core/assets';
import './App.css';
class App extends React.Component {
  PlayGridRef = createRef();
  PopUpWrapperRef = createRef();
  componentDidMount() {
    this.StartNewGame();
  }
  StartNewGame() {
    const { current: PopUpProvider } = this.PopUpWrapperRef;
    PopUpProvider.PopUp(NewGamePopUp, {
      onConfirm: (height, width, mineNum) => {
          this.PlayGridRef.current.Init(height, width, mineNum);
      }
    });
  }
  onStatusChange(status) {
    const { current: PopUpProvider } = this.PopUpWrapperRef;
    switch (status) {
      case STATUS_GAME_OVER:
        setTimeout(() => {
          PopUpProvider.PopUp(GameOverPopUp, {
            onConfirm: () => {
                this.StartNewGame();
            }
          });
        }, 500)
        break;
      case STATUS_WIN:
        PopUpProvider.PopUp(WinPopUp, {
          onConfirm: () => {
              this.StartNewGame();
          }
        });
      default:
        break;
    }
  }
  render() {
    return (
      <PopUpWapper ref={this.PopUpWrapperRef}>
        <div className="wrapper">
          <div>
            <PlayGrid
              ref={this.PlayGridRef}
              onStatusChange={status => this.onStatusChange(status)}
            />
            <div className="controller">
              <button onClick={() => this.StartNewGame()}>Start A New Game</button>
            </div>
          </div>
        </div>
      </PopUpWapper>
    );
  }
}

export default hot(App);
