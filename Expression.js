"use strict"

class Expression {

    constructor(renderer, name, atomicElements, position, animationTime) {
        this.renderer = renderer;
        this.position = position;
        this.name = name;
        this.atomicElements = atomicElements;

        this.text = new Text(this.renderer, this.position, EXPLAIN_TEXT_SIZE, renderer.getHexFillColor(),
           name, 'expression-text');
        this.text.setAnimation('fade-in', animationTime);

        renderer.addRandableObject(this.text);
    }

    update(dt) {
        return this.text.update(dt);
    }

}