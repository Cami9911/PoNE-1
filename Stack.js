"use strict"

const TEXT_EXPLAIN_Y = 100.0;

class Stack {

    generateSquares() {
        let halfNumElements = this.numElements / 2.0;

        let center = this.renderer.getWidth() / 2.0;
        let yPosition = this.renderer.getHeight() - 1.3 * this.elementSize;

        this.squares = [];
        let lowerBound = -Math.round(halfNumElements);
        let upperBound = Math.floor(halfNumElements);
        for (let i = lowerBound; i < upperBound; ++i) {
            this.squares.push(new Square(this.renderer, this.program,
                [center + i * this.elementSize, yPosition], this.elementSize, this.renderer.fillColor, 8, this.animationTime / this.numElements));
        }
    }

    getExplainTextPosition(text, width, height) {

    }

    constructor(renderer, program, numElements, animationTime) {

        this.renderer = renderer;
        this.program = program;
        this.numElements = numElements;
        this.animationTime = animationTime;

        this.MIN_SQUARE_SIZE = 10;
        this.MAX_SQUARE_SIZE = 200;

        this.elementSize = clamp(renderer.getWidth() / (numElements + 1), this.MIN_SQUARE_SIZE, this.MAX_SQUARE_SIZE);

        this.generateSquares();

        this.text = new Text(renderer, ['middle', TEXT_EXPLAIN_Y], EXPLAIN_TEXT_SIZE, '#550a46', 'Build a stack', 'explain-text');
        this.text.setAnimation('fade-in', animationTime);

        renderer.addAsyncJob(dt => this.text.update(dt));
        renderer.addRandableObject(this.text);

        renderer.addSeparator();
        let waitTime = 2.0;
        renderer.addJob(dt => {
            waitTime -= dt;
            return waitTime > 0.0;
        });
        renderer.addSeparator();
        renderer.addJob(dt => {
            this.text.setAnimation('fade-out', animationTime);
            return false;
        });
        renderer.addSeparator();
        renderer.addJob(dt => this.text.update(dt));

    }

}