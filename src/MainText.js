"use strict"

class MainText extends SVGText {

    constructor(renderer, position, fontSize, fontColor, text, animationTime = 1.5) {
        super(renderer, position, fontSize, fontColor, "", "explain-text");
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
                this.setAnimation('fade-out', this.animationTime);
                return false;
            } else {
                return true;
            }
        });
        this.addSeparator();
        this.addJob(dt => super.update(dt));
    }

    fadeInText(text) {
        this.addSeparator();
        this.addJob(dt => {
            this.setText(text);
            this.setPosition(this.position[0], this.position[1]);
            this.setAnimation('fade-in', this.animationTime);
            return false;
        });
        this.addSeparator();
        this.addJob(dt => super.update(dt));
    }

    update(dt) {
        return this.renderer.executeJobs(this.jobs, dt);
    }

}
