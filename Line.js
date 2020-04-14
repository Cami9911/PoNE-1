"use strict"

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

}