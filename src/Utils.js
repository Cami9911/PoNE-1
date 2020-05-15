"use strict"

const EXPLAIN_TEXT_SIZE = 54;
const PADDING_SIZE = 50;


let speed = 1.0;

function normalizeVector(vector) {
    let mag = vectorLength(vector);
    for (let i = 0; i < vector.length; ++i) {
        vector[i] = vector[i] / mag;
    }

    return vector;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function vectorLength(vector) {
    let sum = 0.0;
    for (let i = 0; i < vector.length; ++i) {
        sum += vector[i] * vector[i];
    }
    const mag = Math.sqrt(sum);
    return mag;
}

function distance(v1, v2) {
    if (v1.length != v2.length) {
        return 0.0;
    }
    let temp = [];
    for (let i = 0; i < v1.length; ++i) {
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

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function precedence(c)  {
    if (c === '*' || c === '/')
        return 2;
    else if (c === '+' || c === '-')
        return 1;
    else
        return -1;
}