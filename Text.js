"use strict"

class Text{
    static clearAvailableTexts() {
        document.querySelector('svg').innerHTML = '';
    }

    constructor(renderer, position, fontSize, fontColor, text, textClass = null) {
        this.renderer = renderer;
        this.fontSize = fontSize;
        this.animationTime = 0.0;
        this.fontColor = fontColor;

        // Random ID to be able to select the line at any time
        this.id = Math.random().toString(36).substr(2, 10);

        // Proceed to add the element to the svg
        let svgElement = document.getElementById("text");
        this.parentElement = svgElement;

        // this.element = document.createElement("text");
        // svgElement.appendChild(this.element);
        // this.element.setAttribute('id', this.id);
        // this.element.setAttribute('overflow', 'visible');

        let elementString = "<text id=\"" + this.id + "\">" + text + "</text>";
        svgElement.innerHTML = svgElement.innerHTML + elementString;
        this.element = document.getElementById(this.id);

        this.element.setAttribute('font-size', fontSize);
        this.setPosition(position[0], position[1]);

        if (textClass != null) {
            this.element.setAttribute('class', textClass);
        }
        
    }

    setPosition(x, y) {
        this.position = [
            x === 'middle' ? this.getMiddleWidthCoordinate() : x,
            y === 'middle' ? this.getMiddleHeightCoordinate() : y
        ];
    }

    setFontSize(dimension) {
        this.fontSize = dimension;
    }

    getPosition() {
        return this.position;
    }

    getFontSize() {
        return this.fontSize;
    }

    getFontColor() {
        return this.fontColor;
    }

    setFontColor() {
        return this.fontColor;
    }

    getText() {
        return this.element.innerHTML;
    }

    setText(text) {
        this.element.innerHTML = text;
    }

    getMiddleWidthCoordinate() {
        let halfWidth = this.renderer.width / 2.0;
        let halfTextSize = this.element.getBoundingClientRect().width;
        return halfWidth - halfTextSize;
    }

    getMiddleHeightCoordinate() {
        let halfHeight = this.renderer.height / 2.0;
        let halfTextSize = this.element.getBoundingClientRect().height;
        return halfHeight - halfTextSize;
    }

    convertToRenderSizeHeight(size) {
        let actualHeight = this.parentElement.getBoundingClientRect().height;
        let inverseDifferenceHeight = actualHeight / this.renderer.height;
        return size * inverseDifferenceHeight;
    }

    convertToRenderSizeWidth(size) {
        let actualWidth = this.parentElement.getBoundingClientRect().width;
        let inverseDifferenceWidth = actualWidth / this.renderer.width;
        return size * inverseDifferenceWidth;
    }

    setAnimation(animation, ...animationArgs) {
        this.animation = animation;
        this.animationTime = 0.0;
        if (this.animation === "fade-in" || this.animation === "fade-out") {
            this.animationDuration = animationArgs[0];
        } else if (this.animation === "move") {
            this.animationDuration = animationArgs[0];
            this.startPosition = this.position; // start from here
            this.endPosition = [
                animationArgs[1][0] === 'middle' ? this.getMiddleWidthCoordinate() : animationArgs[1][0],
                animationArgs[1][1] === 'middle' ? this.getMiddleHeightCoordinate() : animationArgs[1][1]
            ];
        }
    }

    updateFadeIn(dt) {
        if (this.animationTime >= this.animationDuration) {
            this.element.setAttribute('opacity', '1.0');
            return false;
        }

        this.animationTime += dt;
        let opacity = this.animationTime / this.animationDuration;
        this.element.setAttribute('opacity', opacity.toString());

        return true;
    }

    updateFadeOut(dt) {
        if (this.animationTime >= this.animationDuration) {
            this.element.setAttribute('opacity', '0.0');
            return false;
        }

        this.animationTime += dt;
        let opacity = 1.0 - this.animationTime / this.animationDuration;
        this.element.setAttribute('opacity', opacity.toString());

        return true;
    }

    updateMove(dt) {
        if (this.animationTime >= this.animationDuration) {
            this.position = this.endPosition;
            this.element.setAttribute('x', this.position[0].toString());
            this.element.setAttribute('y', this.position[1].toString());
            return false;
        }

        this.frame++;

        this.animationTime += dt;

        let x = lerp(this.startPosition[0], this.endPosition[0], this.animationTime / this.animationDuration);
        let y = lerp(this.startPosition[1], this.endPosition[1], this.animationTime / this.animationDuration);

        this.position = [x, y];

        this.element.setAttribute('x', x.toString());
        this.element.setAttribute('y', y.toString());

        return true;
    }

    update(dt) {
        this.element = document.getElementById(this.id);
        if (this.animation === "fade-in") {
            return this.updateFadeIn(dt);
        } else if (this.animation === "fade-out") {
            return this.updateFadeOut(dt);
        } else if (this.animation === "move") {
            return this.updateMove(dt);
        } else {
            console.log("Unknown animation type: " + this.animation);
            return false;
        }
    }

    render(projectionMatrix) {
        this.element = document.getElementById(this.id);
        let position = [this.convertToRenderSizeWidth(this.position[0]), this.convertToRenderSizeHeight(this.position[1])];
        let fontSize = Math.min(this.convertToRenderSizeHeight(this.fontSize), this.convertToRenderSizeWidth((this.fontSize)));
        this.element.setAttribute('x', position[0]);
        this.element.setAttribute('y', position[1]);
        this.element.setAttribute('fill', this.fontColor);
        this.element.setAttribute('font-size', fontSize);
        return true;
    }
}