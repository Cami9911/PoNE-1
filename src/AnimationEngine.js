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
    let then = 0.0;

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
    const animationTime = 1.5;

    let expression = expressionElement.value;
    let re = /([-+*\/()])/g;
    let parsedExpression = expression.split(re);
    parsedExpression = parsedExpression.filter(function (el) {
        return el !== '' && el != null;
    });

    renderer.clear();

    let count = 0;

    let operators = [];
    let operands = [];

    for (let i = 0; i < parsedExpression.length; ++i) {
        if (parsedExpression[i].match(re)) {
            count++;
            operators.push(new AtomicElement(renderer, parsedExpression[i], "Operator", i));
        } else {
            operands.push(new AtomicElement(renderer, parsedExpression[i], "Operand", i));
        }
    }
    let specialCharacter = new AtomicElement(renderer, "⊥", "Special", parsedExpression.length,
        [0,0], "#FF0000");
    let st = new Stack(renderer, programs.colorOnlyProgram, count + 1, animationTime);
    let halfHeight = renderer.getHeight() / 2.0;
    let mainText = new MainText(renderer, [PADDING_SIZE, TEXT_EXPLAIN_Y], EXPLAIN_TEXT_SIZE,
        renderer.getHexFillColor(), "After writing the input and building a stack", animationTime);
    expression = [operators, operands, specialCharacter].flat(1);
    let input = new Expression(renderer, " Input:", expression.slice(0),
        [PADDING_SIZE, halfHeight - 2 * EXPLAIN_TEXT_SIZE], animationTime, true);
    let output = new Expression(renderer, "Output:", [],
        [PADDING_SIZE, halfHeight + EXPLAIN_TEXT_SIZE], animationTime);


    // Do animation stuff
    // Get ready
    function initVisual(dt) {
        let res = false;
        res |= mainText.update(dt);
        res |= st.update(dt);
        res |= input.update(dt);
        res |= output.update(dt);
        return res;
    }

    renderer.addJob(initVisual);
    renderer.addSeparator();
    renderer.addJob(dt => {
        mainText.fadeOutText(0.0);
        return false;
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
       return mainText.update(dt);
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        input.revealSpecial();
        mainText.fadeInText("Add a special character at the end of the equation");
        return false;
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        let res = false;
        res |= mainText.update(dt);
        res |= input.update(dt);
        return res;
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        specialCharacter.setAnimation("change-color", animationTime, renderer.getHexFillColor());
        return false;
    })
    renderer.addSeparator();
    renderer.addJob(dt => {
        return specialCharacter.update(dt);
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        mainText.fadeOutText(0.0);
        mainText.fadeInText("Add it to the stack also");
        let copyOfSpecialCharacter = new AtomicElement(renderer, "⊥", "Special", parsedExpression.length,
            specialCharacter.getPosition(), renderer.getHexFillColor());
        renderer.addRandableObject(copyOfSpecialCharacter);
        st.addElementToStack(copyOfSpecialCharacter);
        return false;
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        let res = false;
        res |= mainText.update(dt);
        res |= st.update(dt);
        return res;
    });

    // Convert from infix to postfix
    renderer.addSeparator();
    renderer.addJob(dt => {
        mainText.fadeOutText(0.0);
        mainText.fadeInText("Prepare to convert from infix to postfix");
        return false;
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        return mainText.update(dt);
    });

    function addElementToStack(i) {
        renderer.addSeparator();
        renderer.addJob(dt => {
            mainText.fadeOutText(0.0);
            mainText.fadeInText("Move " + input.atomicElements[i].value + " to stack");
            input.atomicElements[i].setAnimation("change-color", animationTime, "#FF0000");
            return false;
        });
        renderer.addSeparator();
        renderer.addJob(dt => {
            let res = false;
            res |= mainText.update(dt);
            res |= input.update(dt);
            return res;
        });
        renderer.addSeparator();
        renderer.addJob(dt => {
            st.addElementToStack(input.atomicElements[i]);
            return false;
        });
        renderer.addSeparator();
        renderer.addJob(dt => {
            return st.update(dt);
        });
        renderer.addSeparator();
        renderer.addJob(dt => {
            input.atomicElements[i].setAnimation("change-color", animationTime, renderer.getHexFillColor());
            return false;
        });
        renderer.addSeparator();
        renderer.addJob(dt => {
            return input.update(dt);
        });
    }


    for (let i = 0; i < input.atomicElements.length; ++i) {
        if (input.atomicElements[i].isOperand()) {
            // Move from input to output
            renderer.addSeparator();
            renderer.addJob(dt => {
                mainText.fadeOutText(0.0);
                mainText.fadeInText("Move " + input.atomicElements[i].value + " to output");
                input.atomicElements[i].setAnimation("change-color", animationTime, "#FF0000");
                return false;
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                let res = false;
                res |= mainText.update(dt);
                res |= input.update(dt);
                return res;
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                input.atomicElements[i].setAnimation('move', animationTime, output.getNextElementPosition());
                output.addElement(input.atomicElements[i]);
                return false;
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                let res = false;
                res |= output.update(dt);
                return res;
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                input.atomicElements[i].setAnimation("change-color", animationTime, renderer.getHexFillColor());
                return false;
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                return output.update(dt);
            });
        } else if (input.atomicElements[i].isOpenBracket()) {
            addElementToStack(i);
        } else if (input.atomicElements[i].isClosedBracket()) {
            renderer.addSeparator();
            renderer.addJob(dt => {
                mainText.fadeOutText(0.0);
                mainText.fadeInText("Pop out everything from stack until ( is encountered");
                return false;
            });
            renderer.addSeparator();
            renderer.addJob(dt =>{
                return mainText.update(dt);
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                renderer.currentState = "set-state";
                return false;
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                if (renderer.currentState === "set-state") {
                    let head = st.getHead();
                    if (head.isSpecial() || head.isOpenBracket()) {
                        return false;
                    }
                    // prepare for next animation stuff
                    let element = st.pop();
                    let nextPosition = output.getNextElementPosition();
                    mainText.fadeOutText(0.0);
                    mainText.fadeInText("Pop " + head.value + " from stack and append to output");
                    element.setAnimation("move", animationTime, nextPosition, EXPLAIN_TEXT_SIZE);
                    output.addElement(element);
                    renderer.currentState = "animate-state";
                } else if (renderer.currentState === "animate-state") {
                    let res = false;
                    res |= mainText.update(dt);
                    res |= output.update(dt);
                    output.updateWidth();
                    res |= st.update(dt);
                    if (!res) {
                        renderer.currentState = "set-state";
                    }
                }
                return true;
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                mainText.fadeOutText(0.0);
                mainText.fadeInText("Remove brackets from input and stack.");
                return false;
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                return mainText.update(dt);
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                let head = st.getHead();
                if (head.isOpenBracket()) {
                    let el = st.pop();
                    el.setAnimation("move", animationTime, [9999, 9999]); // move away
                }
                input.atomicElements[i].setAnimation("move", animationTime, [9999, 9999]); // move away
                return false;
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                let res = false;
                res |= input.update(dt);
                res |= st.update(dt);
                return res;
            });
        } else if (input.atomicElements[i].isOperator()) {
            renderer.addSeparator();
            renderer.addJob(dt => {
                mainText.fadeOutText(0.0);
                mainText.fadeInText("Check if " + input.atomicElements[i].value + " can be added to the stack");
                return false;
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                return mainText.update(dt);
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                renderer.currentState = "set-state";
                return false;
            });
            renderer.addSeparator();
            renderer.addJob(dt => {
                if (renderer.currentState === "set-state") {
                    let head = st.getHead();
                    if (head.isSpecial() || precedence(input.atomicElements[i].value) > precedence(head.value)) {
                        return false;
                    }
                    // prepare for next animation stuff
                    let element = st.pop();
                    let nextPosition = output.getNextElementPosition();
                    mainText.fadeOutText(0.0);
                    mainText.fadeInText("Pop " + head.value + " from stack and append to output");
                    element.setAnimation("move", animationTime, nextPosition, EXPLAIN_TEXT_SIZE);
                    output.addElement(element);
                    renderer.currentState = "animate-state";
                } else if (renderer.currentState === "animate-state") {
                    let res = false;
                    res |= mainText.update(dt);
                    res |= output.update(dt);
                    output.updateWidth();
                    res |= st.update(dt);
                    if (!res) {
                        renderer.currentState = "set-state";
                    }
                }
                return true;
            });
            // add to stack
            addElementToStack(i);
        }
    }

    // Pop everything remaining from stack
    renderer.addSeparator();
    renderer.addJob(dt => {
        mainText.fadeOutText(0.0);
        mainText.fadeInText("Pop everything that's left in stack and append to output");
        return false;
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        return mainText.update(dt);
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        renderer.currentState = "set-state";
        return false;
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        if (renderer.currentState === "set-state") {
            let head = st.getHead();
            if (head.isSpecial()) {
                return false;
            }
            // prepare for next animation stuff
            let element = st.pop();
            let nextPosition = output.getNextElementPosition();
            mainText.fadeOutText(0.0);
            mainText.fadeInText("Pop " + head.value + " from stack and append to output");
            element.setAnimation("move", animationTime, nextPosition, EXPLAIN_TEXT_SIZE);
            output.addElement(element);
            renderer.currentState = "animate-state";
        } else if (renderer.currentState === "animate-state") {
            let res = false;
            res |= mainText.update(dt);
            res |= output.update(dt);
            output.updateWidth();
            res |= st.update(dt);
            if (!res) {
                renderer.currentState = "set-state";
            }
        }
        return true;
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        mainText.fadeOutText(0.0);
        mainText.fadeInText("Now the stack and input are containing the same thing.");
        input.hideSpecial();
        st.hideWhatIsLeftInTheStack();
        return false;
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        let res = false;
        res |= mainText.update(dt);
        res |= input.update(dt);
        res |= st.update(dt);
        return res;
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        mainText.fadeOutText(0.0);
        mainText.fadeInText("Done");
        return false;
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        return mainText.update(dt);
    });

    // Move output to input
    renderer.addSeparator();
    renderer.addJob(dt => {
        mainText.fadeOutText(0.0);
        mainText.fadeInText("Now prepare to calculate value.");
        return false;
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        return mainText.update(dt);
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        mainText.fadeOutText(0.0);
        mainText.fadeInText("Make the output from previous part input for this part");
        input.clearAtomics();
        for (let i = 0; i < output.atomicElements.length; ++i) {
            let element = output.atomicElements[i];
            element.setAnimation("move", animationTime, input.getNextElementPosition());
            input.addElement(element);
        }
        output.clearAtomics();
        return false;
    });
    renderer.addSeparator();
    renderer.addJob(dt => {
        let res = false;
        res |= mainText.update(dt);
        res |= input.update(dt);
        res |= output.update(dt);
        return res;
    });
}

window.onload = init();
