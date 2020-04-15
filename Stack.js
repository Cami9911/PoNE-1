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

        this.generateSquares();

        this.text = new Text(renderer, ['middle', TEXT_EXPLAIN_Y], EXPLAIN_TEXT_SIZE, '#550a46', '1. Build a stack', 'explain-text');
        this.text.setAnimation('fade-in', animationTime);

        renderer.addJob(dt => this.update(dt));

        renderer.addRandableObject(this.text);
        this.jobs = [dt=> this.text.update(dt), [this.jobs]];
        this.setStackText('2. ??', 0);
        this.setStackText('3. Become a millionaire', 0.5);
        this.setStackText('4. Buy a truck and an F1 car', 0.5);
        this.setStackText('5. Be happy.', 0.5);
    }

    setStackText(text, waitTime = 0) {
        this.addSeparator();
        this.addJob(dt => {
            waitTime -= dt;
            if (waitTime <= 0.0) {
                this.text.setAnimation('fade-out', this.animationTime);
                return false;
            } else {
                return true;
            }
        });
        this.addSeparator();
        this.addJob(dt => this.text.update(dt));
        this.addSeparator();
        this.addJob(dt => {
            this.text.setText(text);
            this.text.setPosition('middle', TEXT_EXPLAIN_Y);
            this.text.setAnimation('fade-in', this.animationTime);
            return false;
        });
        this.addSeparator();
        this.addJob(dt => this.text.update(dt));
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
                [center + i * this.elementSize, yPosition], this.elementSize, this.renderer.fillColor, 8, this.animationTime / this.numElements);
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

    update(dt) {
        return this.renderer.executeJobs(this.jobs, dt);
    }

}