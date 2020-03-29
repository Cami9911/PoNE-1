"use strict"


// ~~~~~~~~~~~~~~~~~~~~~~~~~~ UTILITIES ~~~~~~~~~~~~~~~~~~~~~~~~~~

function normalizeVector(vector) {
    vectorLength(vector);
    for (var i = 0; i < vector.length; ++i) {
        vector[i] = vector[i] / mag;
    }

    return vector;
}

function vectorLength(vector) {
    var sum = 0.0;
    for (var i = 0; i < vector.length; ++i) {
        sum += vector[i] * vector[i];
    }
    var mag = Math.sqrt(sum);
    return mag;
}

function distance(v1, v2) {
    if (v1.length != v2.length) {
        return 0.0;
    }
    let temp = [];
    for (var i = 0; i < v1.length; ++i) {
        temp.push(v1[i] - v2[i]);
    }
    return vectorLength(temp);
}

function lerp(start, end, value) {
    return (1.0 - value) * start + value * end;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Unable to compile shader; Errors: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function initProgram(gl, vsSource, fsSource) {

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const resultProgram = gl.createProgram();

    gl.attachShader(resultProgram, vertexShader);
    gl.attachShader(resultProgram, fragmentShader);

    gl.linkProgram(resultProgram);

    if (!gl.getProgramParameter(resultProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize shaders; Errors: " + gl.getProgramInfoLog(resultProgram));
        return null;
    }

    return resultProgram;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~ END UTILITIES ~~~~~~~~~~~~~~~~~~~~~~~~~~

// ~~~~~~~~~~~~~~~~~~~~~~~~~~ CLASSES ~~~~~~~~~~~~~~~~~~~~~~~~~~

class Renderer {

    constructor() {
        console.log("Initializing renderer");

        this.frameID = 0;
        this.jobs = [];
        this.randableObjects = [];

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
        const fieldOfView = 45.0 * Math.PI / 180.0;
        const aspect = this.width / this.height;
        const zNear = 0.1;
        const zFar = 100.0;
        mat4.ortho(this.projectionMatrix, 0, this.width, this.height, 0, this.zNear, this.zFar);
        
    }

    addJob(job) {
        this.jobs.push(job);
    }
    addSeparator() {
        this.jobs.push(null);
    }
    addRandableObject(obj) {
        this.randableObjects.push(obj);
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

        this.gl.clearColor(this.clearColor[0],this.clearColor[1],this.clearColor[2],this.clearColor[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        if (this.jobs.length) {
            let reset = false;
            for (var i = 0; i < this.jobs.length; ++i) {
                if (this.jobs[i] == null || i == this.jobs.length - 1) {
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

        for (var i = 0; i < this.randableObjects.length; ++i) {
            if (!this.randableObjects[i].render(this.projectionMatrix)) {
                // For some reason, the object doesn't to be drawn further
                this.randableObjects.splice(i, 1);
            }
        }
    }

    clear() {
        this.jobs.clear();
        this.randableObjects.clear();
    }
    
};

class Line {

    initBuffers() {
        const min = 0.0;
        const max = 1.0;
        let vertices = [
            min, max, 
            max, max,
            max, min,
            
            min, max,
            max, min,
            min, min
        ];
        vertices = vertices.flat(1); // we need flattened vertices
        this.vertexBuffer = this.renderer.createBuffer(this.renderer.gl.ARRAY_BUFFER,
                                    new Float32Array(vertices), this.renderer.gl.STATIC_DRAW);

        let colors = [
            this.colorEnd, this.colorStart, this.colorStart,
            this.colorEnd, this.colorStart, this.colorEnd
        ];
        colors = colors.flat(1);
        this.colorBuffer = this.renderer.createBuffer(this.renderer.gl.ARRAY_BUFFER,
                                    new Float32Array(colors), this.renderer.gl.STATIC_DRAW);
    }

    setProgram(program) {
        this.programToUse = program;
    }

    constructor(renderer, program, startPoint, endPoint, colorStart, colorEnd, thickness, animationDuration = 3.0) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.colorStart = colorStart;
        this.colorEnd = colorEnd;

        this.animationTime = 0.0;
        this.animationDuration = animationDuration;
        this.thickness = thickness;

        this.programToUse = program;
        this.renderer = renderer;

        this.initBuffers();

        this.angle = Math.atan2(this.endPoint[1] - this.startPoint[1],
                            this.endPoint[0] - this.startPoint[0]);
        

        this.modelViewMatrix = mat4.create();
    }

    update(dt) {
        if (this.animationTime >= this.animationDuration) {

            // Stabilize stuff
            let currentLength = distance(this.startPoint, this.endPoint);

            this.modelViewMatrix = mat4.create();
            let startPosition = [this.startPoint, -1.0];
            startPosition = startPosition.flat(1);
            mat4.translate(this.modelViewMatrix, this.modelViewMatrix, startPosition);
            mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, this.angle, [0.0, 0.0, 1.0]);
            mat4.scale(this.modelViewMatrix, this.modelViewMatrix, [currentLength, 1.0, 1.0]);
            mat4.scale(this.modelViewMatrix, this.modelViewMatrix, [1.0, this.thickness, 1.0]);

            return false;
        }
        
        let dist = distance(this.startPoint, this.endPoint);
        let currentLength = lerp(0.0, dist, this.animationTime / this.animationDuration);
        

        this.animationTime += dt;

        this.modelViewMatrix = mat4.create();
        let startPosition = [this.startPoint, -6.0];
        startPosition = startPosition.flat(1);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, startPosition);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, this.angle, [0.0, 0.0, 1.0]);
        mat4.scale(this.modelViewMatrix, this.modelViewMatrix, [currentLength, 1.0, 1.0]);
        mat4.scale(this.modelViewMatrix, this.modelViewMatrix, [1.0, this.thickness, 1.0]);
        

        return true;
    }

    render(projectionMatrix) {

        // bind program
        this.renderer.gl.useProgram(this.programToUse.program);

        // bind attributes
        this.renderer.bindVertexBuffer(this.renderer.gl.ARRAY_BUFFER,
            this.vertexBuffer, this.programToUse.attributeLocations.aVertexPosition, 2,
            this.renderer.gl.FLOAT, false, 0, 0);
        this.renderer.bindVertexBuffer(this.renderer.gl.ARRAY_BUFFER,
            this.colorBuffer, this.programToUse.attributeLocations.aVertexColor, 4,
            this.renderer.gl.FLOAT, false, 0, 0);

        // bind uniforms
        this.renderer.gl.uniformMatrix4fv(this.programToUse.uniformLocations.uProjectionMatrix,
                false, projectionMatrix);
        this.renderer.gl.uniformMatrix4fv(this.programToUse.uniformLocations.uModelViewMatrix,
                false, this.modelViewMatrix);

        const drawOffset = 0;
        const vertexCount = 6;
        this.renderer.gl.drawArrays(this.renderer.gl.TRIANGLES, drawOffset, vertexCount);

        return true;
    }

};

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
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~ END CLASSES ~~~~~~~~~~~~~~~~~~~~~~~~~~

// ~~~~~~~~~~~~~~~~~~~~~~~~~~ MAIN SCRIPT ~~~~~~~~~~~~~~~~~~~~~~~~~~

function init() {

    const renderer = new Renderer();

    document.getElementById("animate-button").onclick = animate;

    const colorOnlyProgram = initProgram(renderer.gl,
        `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;
    
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
    
        varying lowp vec4 vertexColor;
    
        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vertexColor = aVertexColor;
        }`,
        `
        varying lowp vec4 vertexColor;
    
        void main() {
            gl_FragColor = vertexColor;
        }`);
    
    run(renderer, {
        colorOnlyProgram: {
            program: colorOnlyProgram,
            attributeLocations: {
                aVertexPosition : renderer.gl.getAttribLocation(colorOnlyProgram, "aVertexPosition"),
                aVertexColor : renderer.gl.getAttribLocation(colorOnlyProgram, "aVertexColor"),
            },
            uniformLocations: {
                uModelViewMatrix : renderer.gl.getUniformLocation(colorOnlyProgram, "uModelViewMatrix"),
                uProjectionMatrix : renderer.gl.getUniformLocation(colorOnlyProgram, "uProjectionMatrix")
            }
        }
    });
}

function run(renderer, programs, matrices) {
    var then = 0.0;


    const sq = new Square(renderer, programs.colorOnlyProgram,
            [100.0, 30.0], 200, renderer.fillColor, 5, 1.0);



    function render(now) {
        now *= 0.001;
        const dt = now - then;
        then = now;

        renderer.frame(dt);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}


function animate() {
    let expressionElement = document.getElementById("plain-text-expression");

    let expression = expressionElement.value;
    let parsedExpression = expression.split(/([-+(\/)])/g);
    parsedExpression = parsedExpression.filter(function (el) {
        return el != '' && el != null;
    });
    console.log(parsedExpression);
    let variables = expression.split(/[-+\/]/g)
    variables = variables.filter(function (el) {
        return el != '' && el != null;
    });
    console.log(variables);

}

window.onload = init();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~ END MAIN SCRIPT ~~~~~~~~~~~~~~~~~~~~~~~~~~