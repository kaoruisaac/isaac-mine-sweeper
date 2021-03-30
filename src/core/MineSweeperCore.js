import Slot from './model/Slot'
import { STATUS_GAME_OVER, STATUS_WIN } from './assets';
import EventEmmiter from 'events';

const EVENT_RENDER = 'render';
const EVENT_STATUS = 'status';

class MineSweeperCore {
    PlayGrid = null;
    MineMap = new Map();
    SpaceArray = [];
    #RevaledNum = 0;
    #EventEmmiter = new EventEmmiter();
    #config = {
      height: 10,
      width: 10,
      mineNum: 10,
      shouldReval: 90,
    }

    constructor(
      height = this.#config.height,
      width = this.#config.width,
      options = {}) {
      const {
        mineNum = parseInt(height * width / 10, 10),
      } = options;
      this.#config = {
        ...this.#config,
        height,
        width,
        mineNum,
        shouldReval: height * width - mineNum,
      }
      this.#generatePlayGrid(height, width);
      setTimeout(() => this.#EventEmmiter.emit(EVENT_RENDER), 0);
    }

    #generatePlayGrid(height, width) {
        this.PlayGrid = [...new Array(height)].map((empty, y) => [...new Array(width)].map((empty, x) => new Slot(x, y)));
    }

    getGridInfo() {
      const { height, width } = this.#config;
      return {
        grid: this.PlayGrid,
        height,
        width,
      };
    }

    #start(x = 0, y = 0) {
      this.#mineSetUp(x, y);
      this.#setSurroundMineNumber();
      this.#travelSpace();
    }
    
    #mineSetUp(x, y) {
      const { mineNum, height, width } = this.#config;
      let restOfMine = mineNum;
      while (restOfMine > 0) {
        const targetY = Math.round(Math.random() * (height - 1));
        const targetX = Math.round(Math.random() * (width - 1));
        const slot = this.PlayGrid[targetY][targetX];
        if (!(targetX === x && targetY === y) && !slot.hasMine()) {
          slot.setMine();
          this.MineMap.set(String(slot.getPosition()), slot);
          restOfMine -= 1;
        }
      }
    }

    #setSurroundMineNumber() {
      [...this.MineMap.values()].forEach(({ x, y }) => {
        [...new Array(3)].forEach((empty, offsetY) => [...new Array(3)].forEach((empty, offsetX) => {
          const slot = (this.PlayGrid[y + offsetY - 1] || [])[x + offsetX - 1];
          if (slot && !slot.hasMine()) slot.addNumber();
        }));
      });
    }

    #travelSpace() {
      let spaceIndex = -1;
      this.PlayGrid.forEach((row, y) => row.forEach((slot, x) => {
        if (!slot.hasMine() && !slot.getNumber()) {
          const topOfSlot = (this.PlayGrid[y - 1] || [])[x];
          const rightOfSlot = this.PlayGrid[y][x-1];
          if (topOfSlot && topOfSlot.getSpaceIndex() > -1) {
            slot.setSpaceIndex(topOfSlot.getSpaceIndex());
            this.SpaceArray[topOfSlot.getSpaceIndex()].push(slot);
          } else if (rightOfSlot && rightOfSlot.getSpaceIndex() > -1) {
            slot.setSpaceIndex(rightOfSlot.getSpaceIndex());
            this.SpaceArray[rightOfSlot.getSpaceIndex()].push(slot);
          } else {
            spaceIndex ++;
            slot.setSpaceIndex(spaceIndex);
            this.SpaceArray[spaceIndex] = [slot];
          }
          if (
            rightOfSlot && rightOfSlot.getSpaceIndex() > -1
            && slot && slot.getSpaceIndex() > -1
            && rightOfSlot.getSpaceIndex() !== slot.getSpaceIndex()) {
            const rightOfSlotSpaceIndex = rightOfSlot.getSpaceIndex();
            this.SpaceArray[rightOfSlotSpaceIndex].forEach(s => s.setSpaceIndex(slot.getSpaceIndex()));
            this.SpaceArray[slot.getSpaceIndex()] = this.SpaceArray[slot.getSpaceIndex()].concat(this.SpaceArray[rightOfSlotSpaceIndex]);
            this.SpaceArray[rightOfSlotSpaceIndex] = undefined;
          }
        }
      }));
    }

    reveal(x, y) {
      if (this.MineMap.size === 0) this.#start(x, y);
      const slot = this.PlayGrid[y][x];
      if (this.#revealSlot(slot)) {
        if (slot.hasMine()) {
          this.#EventEmmiter.emit(EVENT_STATUS, STATUS_GAME_OVER)
          setTimeout(() => this.#showAllMine(), 1000);
        }
        if (slot.getSpaceIndex() > -1) this.#triggerSpace(slot.getSpaceIndex());
        if (this.#RevaledNum >= this.#config.shouldReval) this.#EventEmmiter.emit(EVENT_STATUS, STATUS_WIN);
        this.#EventEmmiter.emit(EVENT_RENDER);
      };
    }

    #revealSlot(slot) {
      if (!slot.hasFlag() && !slot.hasRevealed()) {
        slot.reveal();
        this.#RevaledNum ++;
        return true;
      }
      return false;
    }

    #triggerSpace(spaceIndex) {
      this.SpaceArray[spaceIndex].forEach((emptySlot) => {
        const {x, y} = emptySlot;
        this.#revealSlot(emptySlot);
        const offsetArray = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        offsetArray.forEach(([offsetX, offsetY]) => {
          const slotBeside = (this.PlayGrid[y + offsetY] || [])[x + offsetX];
          if (slotBeside && !slotBeside.hasMine()) this.#revealSlot(slotBeside);
        });
      })
    }

    #showAllMine() {
      [...this.MineMap.values()].forEach(slot => slot.reveal());
      this.#EventEmmiter.emit(EVENT_RENDER);
    }

    flag(x, y) {
      const slot = this.PlayGrid[y][x];
      if (!slot.hasRevealed()) {
        slot.flag();
        this.#EventEmmiter.emit(EVENT_RENDER);
      }
    }

    onRender(func) {
      this.#EventEmmiter.on(EVENT_RENDER, () => func(this.PlayGrid));
    }
    
    onStatusChange(func) {
      this.#EventEmmiter.on(EVENT_STATUS, (status) => func(status));
    }
}

export default MineSweeperCore;