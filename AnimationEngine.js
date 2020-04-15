"use strict"


function init() {

    const renderer = new Renderer();
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

function run(renderer, programs) {
    var then = 0.0;

    document.getElementById("animate-button").onclick = () => animate(renderer, programs);

    function render(now) {
        now *= 0.001;
        const dt = now - then;
        then = now;

        renderer.frame(dt);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}


function animate(renderer, programs) {
    // Keep in mind that here is not a lot of error handling
    let expressionElement = document.getElementById("plain-text-expression");

    let expression = expressionElement.value;
    let re = /([-+*\/()])/g;
    let parsedExpression = expression.split(re);
    parsedExpression = parsedExpression.filter(function (el) {
        return el !== '' && el != null;
    });

    let count = 0;
    for (let i = 0; i < parsedExpression.length; ++i) {
        if (parsedExpression[i].match(re)) {
            count++;
        }
    }

    renderer.clear();
    renderer.addLongLiveObject(new Stack(renderer, programs.colorOnlyProgram, count, 1.5));

    // let t = new Text(renderer, [100.0, 100.0], 32, 'Hello world!');
    // t.setAnimation('move', 1.0, [200.0, 200.0]);
    //
    // renderer.addRandableObject(t);
    // renderer.addJob(dt => t.update(dt));
    // renderer.addSeparator();
    // renderer.addJob(dt => t.update(dt));
}

window.onload = init();
