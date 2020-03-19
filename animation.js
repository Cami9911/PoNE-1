const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vertexColor;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vertexColor = aVertexColor;
    }
`;

const fsSource = `
    varying lowp vec4 vertexColor;
    void main() {
        gl_FragColor = vertexColor;
    }
`;

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


function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create shader program
    const shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize shaders; Errors: " + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function initBuffers(gl) {
    const vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    size = 1.0;
    minSize = -1.0;
    const positions = [
        minSize,  size,
        size,  size,
        minSize, minSize,
        size, minSize,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 0.0, 1.0
    ];
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return {
        vertexBuffer: vertexBuffer,
        vertexColor: colorBuffer
    }
}

function main() {

    var canvas = document.querySelector("#glCanvas");

    const gl = canvas.getContext("webgl");
    if (gl == null) {
        alert("WebGL is not compatible with your browser");
        return;
    }

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attributeLocations : {
            aVertexPosition : gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            aVertexColor : gl.getAttribLocation(shaderProgram, "aVertexColor")
        },
        uniformLocations : {
            uProjectionMatrix : gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            uModelViewMatrix : gl.getUniformLocation(shaderProgram, "uModelViewMatrix")
        }
    }

    const buffers = initBuffers(gl);

    drawScene(gl, programInfo, buffers);

}

function drawScene(gl, programInfo, buffers) {

    var then = 0.0;
    var squareRotation = 0.0;

    function render(now) {
        now *= 0.001;
        const dt = now - then;
        then = now;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);


        const fieldOfView = 45.0 * Math.PI / 180.0;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;

        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        // mat4.ortho(projectionMatrix, 0, 1280, 720, 0, zNear, zFar);

        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);
        squareRotation += dt;
        mat4.rotate(modelViewMatrix, modelViewMatrix, squareRotation, [0, 0, 1, 0]);

        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
            gl.vertexAttribPointer(programInfo.attributeLocations.aVertexPosition,
                numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attributeLocations.aVertexPosition);
        }
        {
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexColor);
            gl.vertexAttribPointer(
                programInfo.attributeLocations.aVertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attributeLocations.aVertexColor);
        }
        gl.useProgram(programInfo.program);

        gl.uniformMatrix4fv(programInfo.uniformLocations.uProjectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.uModelViewMatrix, false, modelViewMatrix);
        
        const drawOffset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, drawOffset, vertexCount)

        requestAnimationFrame(render)

    }

    requestAnimationFrame(render)

}


window.onload = main;
