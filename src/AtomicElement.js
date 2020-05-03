"use strict"



// Wrapper around Text, it has also a type
class AtomicElement extends SVGText {

    constructor(renderer, value, type, index, position = [0, 0], color = null) {
        if (type === "Number") {
            value = value.toFixed(2);
        }
        if (color === null) {
            color = renderer.getHexFillColor();
        }
        super(renderer, position, EXPLAIN_TEXT_SIZE, color, value,
            "expression-text");

        this.value = value;
        this.type = type.toLowerCase(); // operand, operator, special or cursor
        if (this.type === "operator") {
            if (this.value === "(") {
                this.type = "open bracket";
            } else if (this.value === ")") {
                this.type = "closed bracket";
            }
        }
        this.index = index;
    }

    isClosedBracket() {
        return this.type === "closed bracket";
    }

    isOpenBracket() {
        return this.type === "open bracket";
    }

    isOperator() {
        return this.type === "operator";
    }

    isOperand() {
        return this.type === "operand";
    }

    isSpecial() {
        return this.type === "special";
    }

    getType() {
        return this.type;
    }

    getValue() {
        return this.value;
    }

}