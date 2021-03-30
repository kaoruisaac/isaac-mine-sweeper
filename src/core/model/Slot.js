export default class Slot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    setMine() {
        this.mine = true;
        return this;
    }
    
    hasMine() {
        return this.mine;
    }
    
    getPosition() {
        return [this.x, this.y];
    }
    
    addNumber() {
        this.number = (this.number || 0) + 1;
        return this;
    }

    getNumber() {
        return this.number;
    }

    setSpaceIndex(spaceIndex) {
        this.spaceIndex = spaceIndex;
        return this;
    }

    getSpaceIndex() {
        return this.spaceIndex;
    }

    reveal() {
        this.revealed = true;
        return this;
    }

    hasRevealed() {
        return this.revealed || false;
    }

    flag() {
        this.isFlag = !this.isFlag;
        return this;
    }
    
    hasFlag() {
        return this.isFlag || false;
    }
}