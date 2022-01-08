/*
1. bufferData indices: use Uint16Array
2. bindBuffer and bufferData indices: use ELEMENT_ARRAY_BUFFER
3. WebGL: INVALID_OPERATION: uniform1i: location not for current program: make sure that in your initialization you do gl.useProgram before you do any gl.uniform…. (https://stackoverflow.com/questions/14413713/webgl-invalid-operation-uniform1i-location-not-for-current-program)
4. uNormalMatrix: transpose(inverse(model))
*/


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
    static vertices = [
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
    static indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
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
    static vertexNormals = [
        // Front
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
    
        // Back
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
    
        // Top
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
    
        // Bottom
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
    
        // Right
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
    
        // Left
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ];

    // static properties for webgl
    static programInfo;
    
    static vertexBuffer;
    static indexBuffer;

    static textureCoordBuffer;
    static diffuseTexture;
    static specularTexture;
    
    static vertexNormalBuffer;

    // uNormalMatrix: transpose(inverse(model))
    static vsSource = `
        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform mat4 uNormalMatrix;

        attribute vec3 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec2 aTextureCoord;

        varying vec3 vFragPosition;
        varying vec3 vFragNormal;
        varying vec2 vTextureCoord;

        void main(void) {
            // varying and gl_Position
            vFragPosition = vec3(uModelMatrix * vec4(aVertexPosition, 1.0)); // calc in world space
            vFragNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
            // of course you can calculate frag position and normal in view space, in which we know view position
            vTextureCoord = aTextureCoord;
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
        }
    `;
    static fsSource = `
        precision highp float;

        struct Material {
            sampler2D diffuse;
            sampler2D specular;
            float shininess;
        };

        struct Light {
            vec3 position;
            vec3 intensity;
            vec3 ambient;
            vec3 diffuse;
            vec3 specular;
        };

        varying vec3 vFragPosition;
        varying vec3 vFragNormal;
        varying vec2 vTextureCoord;

        uniform vec3 uViewPosition;
        uniform Material uMaterial;
        uniform Light uLight;
        
        void main(void) {
            vec3 texDiffuse = texture2D(uMaterial.diffuse, vTextureCoord).rgb;
            vec3 texSpecular = texture2D(uMaterial.specular, vTextureCoord).rgb;
            vec3 norm = normalize(vFragNormal);
            vec3 lightDir = normalize(uLight.position - vFragPosition);
            vec3 viewDir = normalize(uViewPosition - vFragPosition);

            vec3 temp = uLight.position - vFragPosition;
            float radius2 = dot(temp, temp); // equals to pow(sqrt(temp, temp), 2)

            // ambient
            vec3 ambient = uLight.ambient * texDiffuse;
            
            // diffuse
            float diff = max(dot(norm, lightDir), 0.0);
            // vec3 diffuse = uLight.diffuse * diff * texDiffuse;
            vec3 diffuse = (uLight.intensity / radius2) * uLight.diffuse * diff * texDiffuse;

            // specular
            // vec3 reflectDir = reflect(-lightDir, norm);
            // float spec = pow(max(dot(viewDir, reflectDir), 0.0), uMaterial.shininess);
            vec3 halfDir = normalize(viewDir + lightDir);
            float spec = pow(max(dot(norm, halfDir), 0.0), uMaterial.shininess);
            // vec3 specular = uLight.specular * spec * texSpecular;
            vec3 specular = (uLight.intensity / radius2) * uLight.specular * spec * texSpecular;

            vec3 result = ambient + diffuse + specular;
            gl_FragColor = vec4(result, 1.0);
            // gl_FragColor = vec4(vec3(uLight.intensity / radius2), 1.0);
        }
    `;

    // properties for this object
    modelMatrix = mat4.create();
    textureCoordBuffer;
    diffuseTexture;
    specularTexture;

    constructor(gl, modelMatrix) {
        // set static vars
        if (!Cube.programInfo) {
            const shaderProgram = webglUtils.initShaderProgram(gl, Cube.vsSource, Cube.fsSource);
            Cube.programInfo = {
                program: shaderProgram,

                aVertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                aVertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
                aTextureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
                
                uModelMatrix: gl.getUniformLocation(shaderProgram, "uModelMatrix"),
                uViewMatrix: gl.getUniformLocation(shaderProgram, "uViewMatrix"),
                uProjectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                uNormalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),

                uViewPosition: gl.getUniformLocation(shaderProgram, "uViewPosition"),
                uMaterial: {
                    diffuse: gl.getUniformLocation(shaderProgram, "uMaterial.diffuse"),
                    specular: gl.getUniformLocation(shaderProgram, "uMaterial.specular"),
                    shininess: gl.getUniformLocation(shaderProgram, "uMaterial.shininess"),
                },
                uLight: {
                    position: gl.getUniformLocation(shaderProgram, "uLight.position"),
                    intensity: gl.getUniformLocation(shaderProgram, "uLight.intensity"),
                    ambient: gl.getUniformLocation(shaderProgram, "uLight.ambient"),
                    diffuse: gl.getUniformLocation(shaderProgram, "uLight.diffuse"),
                    specular: gl.getUniformLocation(shaderProgram, "uLight.specular"),
                },
            };
        }

        // position
        if (!Cube.vertexBuffer) {
            Cube.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, Cube.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Cube.vertices), gl.STATIC_DRAW);
        }
        if (!Cube.indexBuffer) {
            Cube.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cube.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Cube.indices), gl.STATIC_DRAW);
        }

        // texture coordinates
        if (!Cube.textureCoordBuffer) {
            Cube.textureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, Cube.textureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Cube.textureCoordinates), gl.STATIC_DRAW);
        }

        let defaultDiffuseTextureName = "resources/textures/container2.png";
        if (!Cube.diffuseTexture) {
            Cube.diffuseTexture = webglUtils.loadTexture(gl, defaultDiffuseTextureName); // "blocktexture.png"
        }
        let defaultSpecularTextureName = "resources/textures/container2_specular.png";
        if (!Cube.specularTexture) {
            Cube.specularTexture = webglUtils.loadTexture(gl, defaultSpecularTextureName); 
        }

        // normal
        if (!Cube.vertexNormalBuffer) {
            Cube.vertexNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, Cube.vertexNormalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Cube.vertexNormals), gl.STATIC_DRAW);
        }

        // for object
        if (modelMatrix) mat4.copy(this.modelMatrix, modelMatrix);
    }

    setModelMatrix(modelMatrix) {
        mat4.copy(this.modelMatrix, modelMatrix);
    }
    
    transform(mat) {
        mat4.mul(this.modelMatrix, mat, this.modelMatrix);
    }

    setDefaultTexture() {
        this.diffuseTexture = Cube.diffuseTexture;
        this.specularTexture = Cube.specularTexture;
        this.textureCoordBuffer = Cube.textureCoordBuffer;
    }
    setTexture(gl, diffuseTextureName, specularTextureName, textureCoordinates) {
        if (!gl) return;
        if (diffuseTextureName) {
            this.diffuseTexture = webglUtils.loadTexture(gl, diffuseTextureName);
        }
        if (specularTextureName) {
            this.specularTexture = webglUtils.loadTexture(gl, specularTextureName);
        }
        if (textureCoordinates) {
            this.textureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
        }
    }

    beforeRender(gl) {
        // tell WebGL how to pull out the vertices from the position buffer into the aVertexPosition attribute
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, Cube.vertexBuffer);
            // index, size, type, normalized, stride, offset
            gl.vertexAttribPointer(Cube.programInfo.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(Cube.programInfo.aVertexPosition);
        }

        // about vertex normal
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, Cube.vertexNormalBuffer);
            gl.vertexAttribPointer(Cube.programInfo.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(Cube.programInfo.aVertexNormal);
        }
    
        // tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cube.indexBuffer);
    
        // tell WebGL how to pull out the texture coordinates from the texture coordinate buffer into the textureCoord attribute
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer || Cube.textureCoordBuffer);
            // numComponents, type, normalized, stride, offset
            gl.vertexAttribPointer(Cube.programInfo.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(Cube.programInfo.aTextureCoord);
        }
    
        // tell WebGL to use our program
        gl.useProgram(Cube.programInfo.program);
        
        {
            // Tell WebGL we want to affect texture unit 0
            gl.activeTexture(gl.TEXTURE0);
            // Bind the texture to texture unit 0
            gl.bindTexture(gl.TEXTURE_2D, this.diffuseTexture || Cube.diffuseTexture);
            // Tell the shader we bound the texture to texture unit 0
            gl.uniform1i(Cube.programInfo.uMaterial.diffuse, 0);
        }

        {    
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.specularTexture || Cube.specularTexture);
            gl.uniform1i(Cube.programInfo.uMaterial.specular, 1);
        }
    }

    render(gl, camera, light) {
        light = light || Light;

        const projectionMatrix = mat4.create();
        camera.perspective(projectionMatrix);
        
        const viewMatrix = mat4.create();
        camera.view(viewMatrix);

        const modelMatrix = this.modelMatrix;

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
    
        // set the shader uniforms
        // location, transpose, data
        gl.uniformMatrix4fv(Cube.programInfo.uProjectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(Cube.programInfo.uViewMatrix, false, viewMatrix);
        gl.uniformMatrix4fv(Cube.programInfo.uModelMatrix, false, modelMatrix);
        gl.uniformMatrix4fv(Cube.programInfo.uNormalMatrix, false, normalMatrix);

        gl.uniform3fv(Cube.programInfo.uViewPosition, camera.position);
        gl.uniform1f(Cube.programInfo.uMaterial.shininess, 32.0);
        gl.uniform3fv(Cube.programInfo.uLight.position, light.position);
        gl.uniform3fv(Cube.programInfo.uLight.intensity, light.intensity);
        gl.uniform3fv(Cube.programInfo.uLight.ambient, light.ambient);
        gl.uniform3fv(Cube.programInfo.uLight.diffuse, light.diffuse);
        gl.uniform3fv(Cube.programInfo.uLight.specular, light.specular);
    
        // draw elements
        // mode, count, type, offset
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
};

class Sphere {

    static xSeg = 50;
    static ySeg = 50;
    static vertices;
    static indices;

    static programInfo;
    static vertexBuffer;
    static indexBuffer;

    static vsSource = `
        attribute vec4 aVertexPosition;
        
        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main(void) {
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
        }
    `;
    static fsSource = `
        void main(void) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `;

    xSeg;
    ySeg;
    vertices;
    indices;
    vertexBuffer = null;
    indexBuffer = null;

    modelMatrix = mat4.create();

    constructor(gl, modelMatrix, xSeg, ySeg) {
        if (!Sphere.vertices || !Sphere.indices) {
            Sphere.vertices = [];
            Sphere.indices = [];
            Sphere.setSphereShape(Sphere.xSeg, Sphere.ySeg, Sphere.vertices, Sphere.indices);
        }

        // shader program
        const shaderProgram = webglUtils.initShaderProgram(gl, Sphere.vsSource, Sphere.fsSource);
        Sphere.programInfo = {
            program: shaderProgram,

            aVertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),

            uModelMatrix: gl.getUniformLocation(shaderProgram, "uModelMatrix"),
            uViewMatrix: gl.getUniformLocation(shaderProgram, "uViewMatrix"),
            uProjectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
        }
        
        // vertex and index
        if (!Sphere.vertexBuffer) {
            Sphere.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, Sphere.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Sphere.vertices), gl.STATIC_DRAW);
        }
        if (!Sphere.indexBuffer) {
            Sphere.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Sphere.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Sphere.indices), gl.STATIC_DRAW); // Here is Uint16Array
        }

        this.xSeg = xSeg || Sphere.xSeg;
        this.ySeg = ySeg || Sphere.ySeg;

        if (this.xSeg != Sphere.xSeg || this.ySeg != Sphere.ySeg) {
            this.vertices = [];
            this.indices = [];
            Sphere.setSphereShape(this.xSeg, this.ySeg, this.vertices, this.indices);

            this.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        } else {
            this.vertices = Sphere.vertices;
            this.indices = Sphere.indices;
            this.vertexBuffer = Sphere.vertexBuffer;
            this.indexBuffer = Sphere.indexBuffer;
        }

        // for object
        if (modelMatrix) mat4.copy(this.modelMatrix, modelMatrix);
    }

    setShape(xSeg, ySeg) {
        xSeg = xSeg || this.xSeg;
        ySeg = ySeg || this.ySeg;
        if (this.xSeg == xSeg && this.ySeg == ySeg) return;

        this.xSeg = xSeg;
        this.ySeg = ySeg;
        Sphere.setSphereShape(xSeg, ySeg, this.vertices, this.indices);

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    setModelMatrix(modelMatrix) {
        mat4.copy(this.modelMatrix, modelMatrix);
    }

    transform(mat) {
        mat4.mul(this.modelMatrix, mat, this.modelMatrix);
    }

    beforeRender(gl) {
        // tell WebGL how to pull out the vertices from the position buffer into the aVertexPosition attribute
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer || Sphere.vertexBuffer);
            // index, size, type, normalized, stride, offset
            gl.vertexAttribPointer(Sphere.programInfo.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(Sphere.programInfo.aVertexPosition);
        }

        // tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer || Sphere.indexBuffer);
    
        // tell WebGL to use our program
        gl.useProgram(Sphere.programInfo.program);
    }

    render(gl, camera) {
        const projectionMatrix = mat4.create();
        camera.perspective(projectionMatrix);

        const viewMatrix = mat4.create();
        camera.view(viewMatrix);

        const modelMatrix = this.modelMatrix;

        gl.uniformMatrix4fv(Sphere.programInfo.uProjectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(Sphere.programInfo.uViewMatrix, false, viewMatrix);
        gl.uniformMatrix4fv(Sphere.programInfo.uModelMatrix, false, modelMatrix);

        // mode, count, type, offset
        gl.drawElements(gl.TRIANGLES, this.xSeg * this.ySeg * 6, gl.UNSIGNED_SHORT, 0);
    }

    static setSphereShape(xSeg, ySeg, vertices, indices) {
        if (!vertices || !indices) return;

        for (let y = 0; y <= ySeg; y++) {
            for (let x = 0; x <= xSeg; x++) {
                let xSegment = x / xSeg;
                let ySegment = y / ySeg;
                let xPosition = Math.sin(ySegment * Math.PI) * Math.cos(xSegment * 2.0 * Math.PI);
                let yPosition = Math.cos(ySegment * Math.PI);
                let zPosition = Math.sin(ySegment * Math.PI) * Math.sin(xSegment * 2.0 * Math.PI);

                vertices.push(xPosition);
                vertices.push(yPosition);
                vertices.push(zPosition);
            }
        }
        for (let i = 0; i < ySeg; i++) {
            for (let j = 0; j < xSeg; j++) {
                indices.push(i * (xSeg + 1) + j);
                indices.push((i + 1) * (xSeg + 1) + j);
                indices.push((i + 1) * (xSeg + 1) + j + 1);

                indices.push(i * (xSeg + 1) + j);
                indices.push((i + 1) * (xSeg + 1) + j + 1);
                indices.push(i * (xSeg + 1) + j + 1);
            }
        }
    }
};

class Light {
    static position = [0, 10, 0];
    static intensity = [100, 100, 100];
    static ambient = [0.2, 0.2, 0.2];
    static diffuse = [1, 1, 1];
    static specular = [1, 1, 1];

    position;
    intensity;
    ambient;
    diffuse;
    specular;

    constructor(position, intensity, ambient, diffuse, specular) {
        this.position = position || Light.position;
        this.intensity = intensity || Light.intensity;
        this.ambient = ambient || Light.ambient;
        this.diffuse = diffuse || Light.diffuse;
        this.specular = specular || Light.specular;
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

    let objects = [];

    let modelMatrix = mat4.create();
    mat4.translate(modelMatrix, mat4.create(), [0, 0, -6]);
    let cube1 = new Cube(gl, modelMatrix);
    objects.push(cube1);

    mat4.translate(modelMatrix, mat4.create(), [0, 0, -30]);
    let cube2 = new Cube(gl, modelMatrix);
    objects.push(cube2);
    
    mat4.translate(modelMatrix, mat4.create(), [10, 0, 20]);
    mat4.rotate(modelMatrix, modelMatrix, 30.0 * Math.PI / 180.0, [1, 1, 1]);
    mat4.scale(modelMatrix, modelMatrix, [2, 2, 2]);
    let cube3 = new Cube(gl, modelMatrix);
    objects.push(cube3);

    mat4.translate(modelMatrix, mat4.create(), [-5, 0, 3]);
    mat4.rotate(modelMatrix, modelMatrix, 60.0 * Math.PI / 180.0, [0, 1, 1]);
    mat4.scale(modelMatrix, modelMatrix, [2, 1, 1]);
    let cube4 = new Cube(gl, modelMatrix);
    objects.push(cube4);

    mat4.translate(modelMatrix, mat4.create(), [0, -2, 0]);
    mat4.scale(modelMatrix, modelMatrix, [100, 1, 100]);
    let floor = new Cube(gl, modelMatrix);
    // recreate a texture coordinates and reload
    let newTextureCoordinates = [];
    for (let i = 0; i < Cube.textureCoordinates.length; i++) {
        newTextureCoordinates[i] = Cube.textureCoordinates[i] * 10.0;
    }
    floor.setTexture(gl, "resources/textures/blocktexture.png", "resources/textures/blocktexture.png", newTextureCoordinates);
    objects.push(floor);

    mat4.translate(modelMatrix, mat4.create(), [0, 10, 0]);
    let lightSphere = new Sphere(gl, modelMatrix);
    objects.push(lightSphere);

    let light = new Light(lightSphere.position, null, [0.2, 0.2, 0.2], [1, 1, 1], [1, 1, 1]);

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
            element.render(gl, camera, light);
        });

        camera.update(deltaTime);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


main();