"use strict"

class Expression {

    constructor(renderer, name, atomicElements, position, animationTime, sort = false) {
        this.renderer = renderer;
        this.position = position;
        this.name = name;
        this.animationTime = animationTime;

        if (sort) {
            this.atomicElements = atomicElements.sort((a, b) => {
                return a.index - b.index;
            });
        } else {
            this.atomicElements = atomicElements;
        }

        this.text = new SVGText(this.renderer, this.position, EXPLAIN_TEXT_SIZE, renderer.getHexFillColor(),
            this.name, 'expression-text');
        this.text.setAnimation('fade-in', this.animationTime);
        this.text.render(null);

        this.startExpression = this.position[0] + this.text.getWidth() + 80; // 80tx padding
        this.totalWidth = 0;

        for (let i = 0; i < atomicElements.length; ++i) {
            if (atomicElements[i].type !== "special") {
                // Make elements appear
                atomicElements[i].setAnimation('fade-in', this.animationTime);
            }
            atomicElements[i].setPosition(this.startExpression + this.totalWidth, position[1]);
            atomicElements[i].render(null);
            this.renderer.addRandableObject(atomicElements[i]);
            this.totalWidth += atomicElements[i].getWidth();
        }

        renderer.addRandableObject(this.text);
    }

    removeElement(id) {
        let indexToRemove = this.atomicElements.findIndex(element => element.id === id);
        if (indexToRemove > -1) {
            this.atomicElements.splice(indexToRemove, 1);
        }
    }

    updateWidth() {
        this.totalWidth = 0;
        for (let i = 0; i < this.atomicElements.length; ++i) {
            this.totalWidth += this.atomicElements[i].getWidth();
        }
    }

    addElement(element) {
        this.atomicElements.push(element);
        this.totalWidth += element.getWidth();
    }

    getNextElementPosition() {
        return [this.startExpression + this.totalWidth, this.position[1]];
    }

    clearAtomics() {
        this.totalWidth = 0;
        this.atomicElements = [];
    }

        update(dt) {
        let res = false;
        res |= this.text.update(dt);

        for (let i = 0; i < this.atomicElements.length; ++i) {
            res |= this.atomicElements[i].update(dt);
        }

        return res;
    }

    revealSpecial() {
        for (let i = 0; i < this.atomicElements.length; ++i) {
            if (this.atomicElements[i].type === "special") {
                this.atomicElements[i].setAnimation('fade-in', this.animationTime);
            }
        }
    }

    hideSpecial() {
        for (let i = 0; i < this.atomicElements.length; ++i) {
            if (this.atomicElements[i].type === "special") {
                this.atomicElements[i].setAnimation('fade-out', this.animationTime);
            }
        }
    }

}