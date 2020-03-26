const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec2 aVertexUVCoordinate;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vertexColor;
    varying highp vec2 vertexCoordinate;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vertexColor = aVertexColor;
        vertexCoordinate = aVertexUVCoordinate;
    }
`;

const fsSource = `

    uniform sampler2D uSampler;

    varying lowp vec4 vertexColor;
    varying highp vec2 vertexCoordinate;

    void main() {
        gl_FragColor = texture2D(uSampler, vertexCoordinate) * vertexColor;
    }
`;

function isPowerOfTwo(n) {
    return (n & (n - 1)) == 0;
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

    const coordinates = [
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
    ];
    const coordinatesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coordinatesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordinates), gl.STATIC_DRAW);

    return {
        vertexBuffer: vertexBuffer,
        vertexColor: colorBuffer,
        coordinatesBuffer: coordinatesBuffer
    }
}

function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixels = new Uint8Array([255,255,0,255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height,
        border, srcFormat, srcType, pixels);

    const image = new Image();

    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

        if (isPowerOfTwo(image.width) && isPowerOfTwo(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParametri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParametri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParametri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParametri(gl.TEXTURE_2D, gl.TEXTURE_MAX_FILTER, gl.LINEAR);
        }
    };
    image.crossOrigin = "anonymous";
    image.src = url;
    return texture;
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
            aVertexColor : gl.getAttribLocation(shaderProgram, "aVertexColor"),
            aVertexUVCoordinate : gl.getAttribLocation(shaderProgram, "aVertexUVCoordinate")
        },
        uniformLocations : {
            uProjectionMatrix : gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            uModelViewMatrix : gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            uSampler : gl.getUniformLocation(shaderProgram, "uSampler")
        }
    }

    const buffers = initBuffers(gl);

    const texture = loadTexture(gl, 'https://webglfundamentals.org/webgl/resources/f-texture.png');

    drawScene(gl, programInfo, buffers, texture);

}

function drawScene(gl, programInfo, buffers, texture) {

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

        { // Position
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
        { // Color
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexColor);
            gl.vertexAttribPointer(programInfo.attributeLocations.aVertexColor,
                numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attributeLocations.aVertexColor);
        }
        { // Coordinates
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = true;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.coordinatesBuffer);
            gl.vertexAttribPointer(programInfo.attributeLocations.aVertexUVCoordinate,
                numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attributeLocations.aVertexUVCoordinate);
        }

        // Bind program
        gl.useProgram(programInfo.program);

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
        
        // Bind matrices
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
