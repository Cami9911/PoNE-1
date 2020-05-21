"use strict"

class MainText {

    constructor(renderer, position, fontSize, fontColor, text, animationTime = 1.5) {
        this.text = new SVGText(renderer, position, fontSize, fontColor, "", "explain-text");
        this.text2 = new SVGText(renderer, [position[0], position[1] + fontSize + 10], fontSize, fontColor, "", "explain-text");

        this.fontSize = fontSize;
        this.renderer = renderer;
        this.animationTime = animationTime;
        this.jobs = [];
        this.position = position;

        this.fadeInText(text);
        this.renderer.addRandableObject(this);
    }

    addJob(job) {
        this.jobs.push(job);
    }

    addSeparator() {
        this.jobs.push(null);
    }

    fadeOutText(waitTime) {
        this.addSeparator();
        this.addJob(dt => {
            waitTime -= dt;
            if (waitTime <= 0.0) {
                this.text.setAnimation('fade-out', this.animationTime);
                this.text2.setAnimation('fade-out', this.animationTime);
                return false;
            } else {
                return true;
            }
        });
        this.addSeparator();
        this.addJob(dt => this.text.update(dt));
        this.addJob(dt => this.text2.update(dt));
    }

    fadeInText(text) {
        this.addSeparator();
        this.addJob(dt => {
            let firstText = "";
            let secondText = "";
            let lastSpace = 0;
            for (let i = 0; i < text.length; ++i) {
                if (text[i] === " ") {
                    lastSpace = i;
                }
                if (i > 45) {
                    firstText = text.substr(0, lastSpace);
                    secondText = text.substr(lastSpace, text.length);
                    break;
                }
            }
            if (firstText === "") {
                firstText = text;
            }
            this.text.setText(firstText);
            this.text.setPosition(this.position[0], this.position[1]);
            this.text.setAnimation('fade-in', this.animationTime);
            this.text2.setText(secondText);
            this.text2.setPosition(this.position[0], this.position[1] + this.fontSize + 10);
            this.text2.setAnimation('fade-in', this.animationTime);
            return false;
        });
        this.addSeparator();
        this.addJob(dt => this.text.update(dt));
        this.addJob(dt => this.text2.update(dt));
    }

    update(dt) {
        return this.renderer.executeJobs(this.jobs, dt);
    }

    render(projectionMatrix) {
        this.text.render(projectionMatrix);
        this.text2.render(projectionMatrix);
        return true;
    }

}
