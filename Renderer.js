"use strict"

class Renderer {

    constructor() {
        console.log("Initializing renderer");

        this.frameID = 0;
        this.jobs = [];
        this.asyncJobs = [];
        this.randableObjects = [];
        this.longLiveObjects = [];

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.clearColor = [0.0, 0.0, 0.0, 1.0];
            this.fillColor  = [1.0, 1.0, 1.0, 1.0];
        } else {
            this.clearColor = [1.0, 1.0, 1.0, 1.0];
            this.fillColor  = [0.0, 0.0, 0.0, 1.0];
        }
        console.log("Selected color", this.clearColor);

        var canvas = document.querySelector("#glCanvas");
        this.gl = canvas.getContext("webgl");
        if (this.gl == null) {
            alert("WebGL is not compatible with your browser");
            return;
        }

        // Set default states
        this.gl.cullFace(this.gl.FRONT_AND_BACK);

        // Initialize matrices
        this.projectionMatrix = mat4.create();
        this.width = canvas.getAttribute("width");
        this.height = canvas.getAttribute("height");
        console.log("Canvas size: width =", this.width, "height =", this.height);
        this.zNear = 0.1;
        this.zFar = 100.0;
        mat4.ortho(this.projectionMatrix, 0, this.width, this.height, 0, this.zNear, this.zFar);

    }

    addJob(job, position = null) {
        if (position == null) {
            this.jobs.push(job);
            return this.jobs.length - 1; // return the index
        } else {
            this.jobs.splice(position, 0, job); // add the job at specified index
            return position;
        }
    }
    addAsyncJob(job) {
        this.asyncJobs.push(job);
    }
    addSeparator() {
        this.jobs.push(null);
    }
    addRandableObject(obj) {
        this.randableObjects.push(obj);
    }
    addLongLiveObject(obj) {
        this.longLiveObjects.push(obj);
    }

    createBuffer(target, data, usage) {
        const buffer = this.gl.createBuffer(); // let's hope it doesn't crash

        this.updateBuffer(buffer,target, data, usage);

        return buffer;
    }

    updateBuffer(buffer, target, data, usage) {
        this.gl.bindBuffer(target, buffer);
        this.gl.bufferData(target, data, usage);
    }

    bindVertexBuffer(target, buffer, location, numComponents, type, normalize, stride, offset) {
        this.gl.bindBuffer(target, buffer);
        this.gl.vertexAttribPointer(location, numComponents, type, normalize, stride, offset);
        this.gl.enableVertexAttribArray(location);
    }

    frame(dt) {
        this.frameID = this.frameID + 1;

        if (dt >= 0.15) {
            dt = 0.15;
        }

        this.gl.clearColor(this.clearColor[0],this.clearColor[1],this.clearColor[2],this.clearColor[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        if (this.jobs.length) {
            let reset = false;
            for (let i = 0; i < this.jobs.length; ++i) {
                if (this.jobs[i] == null) {
                    if (!reset) { // delete elements [0, i]
                        this.jobs.splice(0, i + 1);
                    }
                    break;
                } else if (i === this.jobs.length - 1) {
                    reset |= this.jobs[i](dt);
                    if (!reset) { // delete elements [0, i]
                        this.jobs.splice(0, i + 1);
                    }
                    break;
                } else {
                    reset |= this.jobs[i](dt); // This is some sort of update
                }
            }
        } else {
            // No jobs? Just look pretty for now!
        }

        if (this.asyncJobs.length) {
            for (let i = 0; i < this.asyncJobs.length; ++i) {
                if (!this.asyncJobs[i](dt)) {
                    this.asyncJobs.splice(i, 1);
                }
            }
        }

        for (let i = 0; i < this.randableObjects.length; ++i) {
            if (!this.randableObjects[i].render(this.projectionMatrix)) {
                // For some reason, the object doesn't to be drawn further
                this.randableObjects.splice(i, 1);
            }
        }
    }

    clear() {
        this.jobs = [];
        this.asyncJobs = [];
        this.randableObjects = [];
        this.longLiveObjects = [];
        Text.clearAvailableTexts();
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

}