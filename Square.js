"use strict"

class Square {

    generateNewLine(startPosition, endPosition) {
        return new Line(this.renderer, this.program,
            startPosition, endPosition, this.color, this.color, this.thickness, this.animationDuration / 4.0);
    }

    constructor(renderer, program, position, size, color, thickness = 5, animationDuration = 0.5) {
        this.renderer = renderer;
        this.program = program;

        this.position = position;
        this.color = color;
        this.size = size;

        this.thickness = thickness;
        this.animationDuration = animationDuration;

        this.lines = [];
        this.lines.push(this.generateNewLine(position, [position[0] + size, position[1]]));
        renderer.addRandableObject(this.lines[0]);
        renderer.addJob(dt => this.lines[0].update(dt));
        renderer.addSeparator();

        this.lines.push(this.generateNewLine([position[0] + size, position[1]], [position[0] + size, position[1] + size]));
        renderer.addRandableObject(this.lines[1]);
        renderer.addJob(dt => this.lines[1].update(dt));
        renderer.addSeparator();

        this.lines.push(this.generateNewLine([position[0] + size, position[1] + size], [position[0], position[1] + size]));
        renderer.addRandableObject(this.lines[2]);
        renderer.addJob(dt => this.lines[2].update(dt));
        renderer.addSeparator();

        this.lines.push(this.generateNewLine([position[0], position[1] + size], position));
        renderer.addRandableObject(this.lines[3]);
        renderer.addJob(dt => this.lines[3].update(dt));
        renderer.addSeparator();

    }
}
