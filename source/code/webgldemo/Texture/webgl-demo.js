
class Camera {
    aspect = 4/3;
    near = 0.1;
    far = 100.0;

    position = [0, 0, 0];
    front = [0, 0, -1];
    worldUp = [0, 1, 0];
 
    // assign and update by ourselves
    up = [0, 1, 0];
    right = [1, 0, 0];

    // movement
    forwardSpeed = 0;
    rightSpeed = 0;
    worldUpSpeed = 0;

    constructor(aspect, near, far) {
        this.aspect = aspect;
        this.near = near;
        this.far = far;
    }

    // set
    setProperty(aspect, near, far) {
        this.aspect, this.near, this.far = aspect, near, far;
    }
    setPosition(pos) {
        vec3.normalize(this.position, pos);
    }
    setFront(front) {
        vec3.normalize(this.front, front);
    }
    setFrontByTarget(target) {
        if (vec3.equals(target, this.position)) return;
        vec3.sub(this.front, target, this.position);
        vec3.normalize(this.front, this.front);
    }
    setFrontByUpAndRight(upScale, rightScale) {
        vec3.scaleAndAdd(this.front, this.front, this.up, upScale);
        vec3.scaleAndAdd(this.front, this.front, this.right, rightScale);
        vec3.normalize(this.front, this.front);
    }

    setSpeed(fs, rs, wus) {
        this.forwardSpeed = fs || 0;
        this.rightSpeed = rs || 0;
        this.worldUpSpeed = wus || 0;
    }

    // view matrix and projection matrix
    view(out) {
        const frontPosition = mat4.create();
        vec3.add(frontPosition, this.position, this.front)
        mat4.lookAt(out, this.position, frontPosition, this.up);
    }
    perspective(out) {
        mat4.perspective(out, glMatrix.toRadian(45), this.aspect, this.near, this.far);
    }

    // update
    update(deltaTime) {
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
    }
};

class Control {
    // camera direction
    static rightDirScale = 0.001;
    static upDirScale = 0.001;

    // camera movement
    static moveScale = 0.005;
    static forwardMoveEnabled = true;
    static rightMoveEnabled = true;
    static worldUpMoveEnabled = true;

    // keyboard down
    static _wDown = false;
    static _sDown = false;
    static _dDown = false;
    static _aDown = false;
    static _shiftDown = false;
    static _spaceDown = false;

    constructor(canvas, camera) {
        if (Control._instance) {
            return Control._instance;
        }
        Control._instance = this;

        Control.canvas = canvas;
        Control.camera = camera;
    }

    init(canvas, camera) {
        if (!Control.canvas && !canvas) return;
        if (!Control.camera && !camera) return;
        Control.canvas = canvas || Control.canvas;
        Control.camera = camera || Control.camera;

        Control.canvas.onclick = Control.onClick;
        document.addEventListener("pointerlockchange", Control.onPointerLockChange, false);
    }

    fini() {
        Control.canvas.onclick = null;
        document.removeEventListener("pointerlockchange", Control.onPointerLockChange, false);
        
        Control.canvas = null;
        Control.camera = null;
    }

    static onPointerLockChange(e) {
        if (!Control.canvas) return;
        if (document.pointerLockElement === Control.canvas) {
            document.addEventListener("mousemove", Control.onMouseMove, false);
            document.addEventListener("keydown", Control.onKeyDown, false);
            document.addEventListener("keyup", Control.onKeyUp, false);
        } else {
            document.removeEventListener("mousemove", Control.onMouseMove, false);
            document.removeEventListener("keydown", Control.onKeyDown, false);
            document.removeEventListener("keyup", Control.onKeyUp, false);
        }
    }
    static onClick(e) {
        e.target.requestPointerLock(); // canvas lock mouse
    }

    static onMouseMove(e) {
        let x = e.movementX, y = e.movementY; // up: y < 0, right: x > 0
        Control.camera.setFrontByUpAndRight(-y * Control.upDirScale, x * Control.rightDirScale);
    }
    static onKeyDown(e) {
        if (e.keyCode == 87) Control._wDown = true;
        if (e.keyCode == 83) Control._sDown = true;
        if (e.keyCode == 68) Control._dDown = true;
        if (e.keyCode == 65) Control._aDown = true;
        if (e.keyCode == 16) Control._shiftDown = true;
        if (e.keyCode == 32) Control._spaceDown = true;

        let forwardSpeed = Control.forwardMoveEnabled && (Number(Control._wDown) - Number(Control._sDown)) * Control.moveScale || 0;
        let rightSpeed = Control.rightMoveEnabled && (Number(Control._dDown) - Number(Control._aDown)) * Control.moveScale || 0;
        let worldUpSpeed = Control.worldUpMoveEnabled && (Number(Control._spaceDown) - Number(Control._shiftDown)) * Control.moveScale || 0;
        if (Control.camera.forwardSpeed != forwardSpeed || 
            Control.camera.rightSpeed != rightSpeed || 
            Control.camera.worldUpSpeed != worldUpSpeed) 
        {
            Control.camera.setSpeed(forwardSpeed, rightSpeed, worldUpSpeed);
        }
    }
    static onKeyUp(e) {
        if (e.keyCode == 87) Control._wDown = false;
        if (e.keyCode == 83) Control._sDown = false;
        if (e.keyCode == 68) Control._dDown = false;
        if (e.keyCode == 65) Control._aDown = false;
        if (e.keyCode == 16) Control._shiftDown = false;
        if (e.keyCode == 32) Control._spaceDown = false;

        let forwardSpeed = Control.forwardMoveEnabled && (Number(Control._wDown) - Number(Control._sDown)) * Control.moveScale || 0;
        let rightSpeed = Control.rightMoveEnabled && (Number(Control._dDown) - Number(Control._aDown)) * Control.moveScale || 0;
        let worldUpSpeed = Control.worldUpMoveEnabled && (Number(Control._spaceDown) - Number(Control._shiftDown)) * Control.moveScale || 0;
        if (Control.camera.forwardSpeed != forwardSpeed ||
            Control.camera.rightSpeed != rightSpeed || 
            Control.camera.worldUpSpeed != worldUpSpeed) 
        {
            Control.camera.setSpeed(forwardSpeed, rightSpeed, worldUpSpeed);
        }
    }
};

class webglUtils {
    // Initialize a shader program
    static initShaderProgram(gl, vsSource, fsSource) {
        const vertexShader = webglUtils.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = webglUtils.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

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
    static loadShader(gl, type, source) {
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

    //
    // Initialize a texture and load an image.
    // When the image finished loading copy it into the texture.
    //
    static loadTexture(gl, url) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
    
        // Because images have to be download over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    width, height, border, srcFormat, srcType,
                    pixel);
    
        const image = new Image();
        image.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

            // WebGL1 has different requirements for power of 2 images
            // vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if (webglUtils.isPowerOf2(image.width) && webglUtils.isPowerOf2(image.height)) {
                // Yes, it's a power of 2. Generate mips.
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                // No, it's not a power of 2. Turn of mips and set
                // wrapping to clamp to edge
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        };
        image.src = url;

        return texture;
    }

    static isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }
};

class Cube {
    // static properties for objects
    static positions = [
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
    static textureCoordinates = [
        // Front
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Back
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Top
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Bottom
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Right
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Left
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
    ];
    static indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];
    // static properties for webgl
    static programInfo;
    static positionBuffer;
    static textureCoordBuffer;
    static indexBuffer;
    static defaultTexture;

    static vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying highp vec2 vTextureCoord;

        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vTextureCoord = aTextureCoord;
        }
    `;
    static fsSource = `
        uniform sampler2D uSampler;

        varying highp vec2 vTextureCoord;

        void main(void) {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
        }
    `;

    // properties for this object
    modelMatrix = mat4.create();
    texture;

    constructor(gl, modelMatrix, textureName) {
        if (!Cube.programInfo) {
            const shaderProgram = webglUtils.initShaderProgram(gl, Cube.vsSource, Cube.fsSource);
            Cube.programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                    textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                    modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                    uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
                },
            };
        }

        if (modelMatrix) mat4.copy(this.modelMatrix, modelMatrix);

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Cube.positions), gl.STATIC_DRAW);

        this.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Cube.textureCoordinates), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Cube.indices), gl.STATIC_DRAW);

        if (!Cube.defaultTexture) {
            Cube.defaultTexture = webglUtils.loadTexture(gl, "cubetexture.png"); // "blocktexture.png"
        }
        if (!textureName || textureName === "cubetexture.png") {
            this.texture = Cube.defaultTexture;
        } else {
            this.texture = webglUtils.loadTexture(gl, textureName);
        }
    }

    setModelMatrix(modelMatrix) {
        mat4.copy(this.modelMatrix, modelMatrix);
    }
    transform(modelMatrix) {
        mat4.mul(this.modelMatrix, modelMatrix, this.modelMatrix);
    }

    beforeRender(gl) {
        // tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.vertexAttribPointer(
                Cube.programInfo.attribLocations.vertexPosition, // index
                3, // size
                gl.FLOAT, // type
                false, // normalized,
                0, // stride
                0 // offset
            );
            gl.enableVertexAttribArray(Cube.programInfo.attribLocations.vertexPosition);
        }
    
        // tell WebGL how to pull out the texture coordinates from the texture coordinate buffer into the textureCoord attribute
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
            gl.vertexAttribPointer(
                Cube.programInfo.attribLocations.textureCoord,
                2, // numComponents
                gl.FLOAT, // type
                false, // normalized
                0, // stride
                0 // offset
            );
            gl.enableVertexAttribArray(Cube.programInfo.attribLocations.textureCoord);
        }
    
        // tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    
        // tell WebGL to use our program
        gl.useProgram(Cube.programInfo.program);
        
        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(Cube.programInfo.uniformLocations.uSampler, 0);
    }

    render(gl, camera) {
        const projectionMatrix = mat4.create();
        camera.perspective(projectionMatrix);
        const modelViewMatrix = mat4.create();
        camera.view(modelViewMatrix);
        mat4.mul(modelViewMatrix, modelViewMatrix, this.modelMatrix);
    
        // set the shader uniforms
        gl.uniformMatrix4fv(
            Cube.programInfo.uniformLocations.projectionMatrix, // location
            false, // transpose
            projectionMatrix // data
        );
        gl.uniformMatrix4fv(
            Cube.programInfo.uniformLocations.modelViewMatrix, // location
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
};

function main() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl");
    if (!gl) {
        alert("Unable to initialize WebGL.");
        return;
    }

    let camera = new Camera(canvas.clientWidth / canvas.clientHeight, 0.01, 10000.0);
    let control = new Control(canvas, camera);
    control.init();

    let modelMatrix = mat4.create();
    mat4.translate(modelMatrix, mat4.create(), [0, 0, -6]);
    let cube1 = new Cube(gl, modelMatrix);
    
    mat4.translate(modelMatrix, mat4.create(), [0, -105, 0]);
    mat4.scale(modelMatrix, modelMatrix, [100, 100, 100]);
    let cube2 = new Cube(gl, modelMatrix, "blocktexture.png");
    
    // recreate a texture coordinates and reload
    let newTextureCoordinates = [];
    for (let i = 0; i < Cube.textureCoordinates.length; i++) {
        newTextureCoordinates[i] = Cube.textureCoordinates[i] * 10.0;
    }
    cube2.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube2.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newTextureCoordinates), gl.STATIC_DRAW);

    const objects = [cube1, cube2];

    // draw scene
    var lastTime = 0;
    function render(currTime) {
        const deltaTime = currTime - lastTime;
        lastTime = currTime;
            
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything 
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear

        objects.forEach(element => {
            element.beforeRender(gl);
            element.render(gl, camera);
        });

        camera.update(deltaTime);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


main();