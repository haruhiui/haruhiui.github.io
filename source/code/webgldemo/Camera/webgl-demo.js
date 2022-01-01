
const camera = {
    position: [0, 0, 0],
    front: [0, 0, -1],
    worldUp: [0, 1, 0],
 
    // assign and update by ourselves
    up: [0, 1, 0],
    right: [1, 0, 0],

    // movement
    forwardSpeed: 0,
    rightSpeed: 0,
    worldUpSpeed: 0,

    // set/change
    setPosition: function(pos) {
        vec3.normalize(this.position, pos);
    },
    setFront: function(front) {
        if (vec3.equals(front, [0, 0, 0])) return;
        vec3.normalize(this.front, front);
    },
    setFrontByTarget: function(target) {
        if (vec3.equals(target, this.position)) return;
        vec3.sub(this.front, target, this.position);
        vec3.normalize(this.front, this.front);
    },
    setFrontByUpAndRight: function(upScale, rightScale) {
        vec3.scaleAndAdd(this.front, this.front, this.up, upScale);
        vec3.scaleAndAdd(this.front, this.front, this.right, rightScale);
        vec3.normalize(this.front, this.front);
    },

    setSpeed(fs, rs, wus) {
        this.forwardSpeed = fs || 0;
        this.rightSpeed = rs || 0;
        this.worldUpSpeed = wus || 0;
    },

    // view matrix
    view: function(out) {
        const frontPosition = mat4.create();
        vec3.add(frontPosition, this.position, this.front);
        mat4.lookAt(out, this.position, frontPosition, this.up);
    },

    // update
    update: function(deltaTime) {
        // update up and right
        let newRight = vec3.create();
        vec3.cross(newRight, this.front, this.worldUp);
        if (!vec3.equals(newRight, [0, 0, 0])) vec3.normalize(this.right, newRight);

        let newUp = vec3.create();
        vec3.cross(newUp, this.right, this.front);
        if (!vec3.equals(newUp, [0, 0, 0])) vec3.normalize(this.up, newUp);

        // move by speed
        if (this.forwardSpeed) {
            vec3.scaleAndAdd(this.position, this.position, this.front, this.forwardSpeed * deltaTime);
        }
        if (this.rightSpeed) {
            vec3.scaleAndAdd(this.position, this.position, this.right, this.rightSpeed * deltaTime);
        }
        if (this.worldUpSpeed) {
            vec3.scaleAndAdd(this.position, this.position, this.worldUp, this.worldUpSpeed * deltaTime);
        }
    },
};

const mouseControl = {
    mouseDown: false,
    canvas: null,

    // camera direction
    rightDirScale: 0.001,
    upDirScale: 0.001,

    // camera movement
    moveScale: 0.005,

    wDown: false,
    sDown: false,
    dDown: false,
    aDown: false,

    onClick: function(e) {
        e.target.requestPointerLock(); // lock mouse
        // canvas.mozRequestPointerLock
    },

    onMouseMove: function(e) {
        let x = e.movementX, y = e.movementY; // up: y < 0, right: x > 0
        camera.setFrontByUpAndRight(-y * mouseControl.upDirScale, x * mouseControl.rightDirScale);
    },
    onKeyDown: function(e) {
        if (e.keyCode == 87) mouseControl.wDown = true;
        if (e.keyCode == 83) mouseControl.sDown = true;
        if (e.keyCode == 68) mouseControl.dDown = true;
        if (e.keyCode == 65) mouseControl.aDown = true;

        let forwardSpeed = (Number(mouseControl.wDown) - Number(mouseControl.sDown)) * mouseControl.moveScale;
        let rightSpeed = (Number(mouseControl.dDown) - Number(mouseControl.aDown)) * mouseControl.moveScale;
        if (camera.forwardSpeed != forwardSpeed || camera.rightSpeed != rightSpeed) {
            camera.setSpeed(forwardSpeed, rightSpeed, 0);
        }
    },
    onKeyUp: function(e) {
        if (e.keyCode == 87) mouseControl.wDown = false;
        if (e.keyCode == 83) mouseControl.sDown = false;
        if (e.keyCode == 68) mouseControl.dDown = false;
        if (e.keyCode == 65) mouseControl.aDown = false;

        let forwardSpeed = (Number(mouseControl.wDown) - Number(mouseControl.sDown)) * mouseControl.moveScale;
        let rightSpeed = (Number(mouseControl.dDown) - Number(mouseControl.aDown)) * mouseControl.moveScale;
        if (camera.forwardSpeed != forwardSpeed || camera.rightSpeed != rightSpeed) {
            camera.setSpeed(forwardSpeed, rightSpeed, 0);
        }
    },

    initMouseControl: function(canvas) {
        this.canvas = canvas;
        canvas.onclick = this.onClick;
        document.addEventListener("pointerlockchange", function() {
            if (canvas && document.pointerLockElement === canvas) {
                // document.mozPointerLockElement
                document.addEventListener("mousemove", mouseControl.onMouseMove, false);
                document.addEventListener("keydown", mouseControl.onKeyDown, false);
                document.addEventListener("keyup", mouseControl.onKeyUp, false);
            } else {
                document.removeEventListener("mousemove", mouseControl.onMouseMove, false);
                document.removeEventListener("keydown", mouseControl.onKeyDown, false);
                document.removeEventListener("keyup", mouseControl.onKeyUp, false);
            }
        }, false);
        // mozpointerlockchange
    },
};


main();

function main() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert("Unable to initialize WebGL.");
        return;
    }

    mouseControl.initMouseControl(canvas);

    // vertex shader program 
    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
    `;

    // fragment shader program
    const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
    `;

    // shader program and program info
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
    };

    // buffers
    const buffers = initBuffers(gl);

    // draw scene
    var lastTime = 0;
    function render(currTime) {
        const deltaTime = currTime - lastTime;
        lastTime = currTime;
        drawScene(gl, programInfo, buffers, deltaTime);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

// initialize the buffers
function initBuffers(gl) {
    const positions = [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ];

    // create a buffer and set data
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const faceColors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
        [1.0,  0.0,  0.0,  1.0],    // Back face: red
        [0.0,  1.0,  0.0,  1.0],    // Top face: green
        [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
        [1.0,  0.0,  1.0,  1.0],    // Left face: purple
    ];
    let colors = [];
    for (let i = 0; i < faceColors.length; i++) {
        const c = faceColors[i];
        colors = colors.concat(c, c, c, c);
    }

    // create buffer and set data
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];
    
    // create buffer and set data
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
    };
}

// draw the scene
function drawScene(gl, programInfo, buffers, deltaTime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything 
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear

    const projectionMatrix = mat4.create();
    mat4.perspective(
        projectionMatrix, // output matrix
        glMatrix.toRadian(45), // filed of view
        gl.canvas.clientWidth / gl.canvas.clientHeight, // aspect
        0.1, // near
        100.0 // far
    );

    const modelViewMatrix = mat4.create();
    camera.view(modelViewMatrix);
    camera.update(deltaTime);

    mat4.translate(
        modelViewMatrix, // output matrix
        modelViewMatrix, // input matrix
        [0.0, 0.0, -6.0] // translate 
    );

    // tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition, // index
            3, // size
            gl.FLOAT, // type
            false, // normalized,
            0, // stride
            0 // offset
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    // tell WebGL how to pull out the colors from the color buffer into the vertexColor attribute
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor, // index
            4, // size
            gl.FLOAT, // type
            false, // normalized
            0, // stride
            0 // offset
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }

    // tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // tell WebGL to use our program
    gl.useProgram(programInfo.program);

    // set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix, // location
        false, // transpose
        projectionMatrix // data
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix, // location
        false, // transpose
        modelViewMatrix // data
    );

    // draw elements
    gl.drawElements(
        gl.TRIANGLES, // mode
        36, // count
        gl.UNSIGNED_SHORT, // type
        0 // offset
    );
}

// Initialize a shader program
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

// Create a shader
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}


