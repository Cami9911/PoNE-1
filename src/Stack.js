"use strict"

const TEXT_EXPLAIN_Y = 100.0;

class Stack {

    constructor(renderer, program, numElements, animationTime) {

        this.renderer = renderer;
        this.program = program;
        this.numElements = numElements;
        this.animationTime = animationTime;
        this.jobs = [];

        this.MIN_SQUARE_SIZE = 10;
        this.MAX_SQUARE_SIZE = 200;

        this.elementSize = clamp(renderer.getWidth() / (numElements + 1), this.MIN_SQUARE_SIZE, this.MAX_SQUARE_SIZE);
        this.squareLineThickness = 8;

        this.generateSquares();

        this.elementsInStack = [];
    }

    generateSquares() {
        let halfNumElements = this.numElements / 2.0;

        let center = this.renderer.getWidth() / 2.0;
        let yPosition = this.renderer.getHeight() - 1.3 * this.elementSize;

        this.squares = [];
        let lowerBound = -Math.round(halfNumElements);
        let upperBound = Math.floor(halfNumElements);
        for (let i = lowerBound; i < upperBound; ++i) {
            let sq = new Square(this.renderer, this.program,
                [center + i * this.elementSize, yPosition], this.elementSize, this.renderer.fillColor,
                            this.squareLineThickness, this.animationTime / this.numElements);
            this.squares.push(sq);
            this.addJob(sq.getJobs());
            this.addSeparator();
        }
    }

    addJob(job) {
        this.jobs.push(job);
    }

    addSeparator() {
        this.jobs.push(null);
    }

    getPreferredFontSize(numCharsInsideSquare = 3) {
        return this.getSquareSize() / numCharsInsideSquare - 2; // 2 tx padding
    }

    getSquareSize() {
        return this.elementSize;
    }

    getHead() {
        return this.elementsInStack[0];
    }

    pop() {
        let toReturn = this.elementsInStack[0];
        this.elementsInStack.splice(0, 1);
        for (let i = 0; i < this.elementsInStack.length; ++i) {
            let preferredFontSize = this.getPreferredFontSize(this.elementsInStack[i].value.length) + 1.0;
            let squareTargetPosition = this.getMiddlePosition(i, preferredFontSize, this.elementsInStack[i]);
            this.elementsInStack[i].setAnimation('move', this.animationTime, squareTargetPosition, preferredFontSize);
        }
        this.addJob(dt => {
            let res = false;
            for (let i = 0; i < this.elementsInStack.length; ++i) {
                res |= this.elementsInStack[i].update(dt);
            }
            return res;
        });
        return toReturn;
    }

    getMiddlePosition(index, preferredFontSize, element) {

        let topLeft = this.squares[index].getTopLeft();
        let halfElementWidth = preferredFontSize * element.value.length / 2.0;
        let halfSquareWidth = this.getSquareSize() / 2.0;

        let halfSquareHeight = this.getSquareSize() / 2.0 + preferredFontSize / 4.0;

        let targetPositionX = topLeft[0] + halfSquareWidth - halfElementWidth + this.squareLineThickness * 4.5;
        let targetPositionY = topLeft[1] + halfSquareHeight + this.squareLineThickness;

        return [targetPositionX, targetPositionY];
    }

    addElementToStack(element) {

        element.setOpacity(1.0);

        let preferredFontSize = this.getPreferredFontSize(element.value.length) + 1.0;

        let firstSquareTargetPosition = this.getMiddlePosition(0, preferredFontSize, element)
        element.setAnimation('move', this.animationTime, firstSquareTargetPosition,
            preferredFontSize);

        for (let i = 0; i < this.elementsInStack.length; ++i) {
            preferredFontSize = this.getPreferredFontSize(this.elementsInStack[i].value.length) + 1.0;
            let squareTargetPosition = this.getMiddlePosition(i + 1, preferredFontSize, this.elementsInStack[i]);
            this.elementsInStack[i].setAnimation('move', this.animationTime, squareTargetPosition, preferredFontSize);
        }

        // this.elementsInStack.push(element);
        this.elementsInStack = [element, this.elementsInStack].flat(1);
        this.addJob(dt => {
            let res = false;
            for (let i = 0; i < this.elementsInStack.length; ++i) {
                res |= this.elementsInStack[i].update(dt);
            }
            return res;
        });
    }

    hideWhatIsLeftInTheStack() {
        for (let i = 0; i < this.elementsInStack.length; ++i) {
            this.elementsInStack[i].setAnimation('fade-out', this.animationTime);
        }
        this.addJob(dt => {
            let res = false;
            for (let i = 0; i < this.elementsInStack.length; ++i) {
                res |= this.elementsInStack[i].update(dt);
            }
            return res;
        });
    }

    update(dt) {
        return this.renderer.executeJobs(this.jobs, dt);
    }

}