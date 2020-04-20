"use strict"


class AtomicElement {

    constructor(value, type) {

        this.value = value;
        this.type = type; // Number, operator, special or cursor

    }

    getType() {
        return this.type;
    }

    getValue() {
        return this.value;
    }

}