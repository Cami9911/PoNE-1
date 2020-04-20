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
    let st = new Stack(renderer, programs.colorOnlyProgram, count, 1.5);
    let halfHeight = renderer.getHeight() / 2.0;
    let input = new Expression(renderer, " Input:", [], [PADDING_SIZE, halfHeight - EXPLAIN_TEXT_SIZE], 1.5);
    let output = new Expression(renderer, "Output:", [], [PADDING_SIZE, halfHeight + EXPLAIN_TEXT_SIZE], 1.5);

    function update(dt) {
        st.update(dt);
        input.update(dt);
        output.update(dt);
        return true;
    }

    renderer.addJob(update)
    
}

window.onload = init();
