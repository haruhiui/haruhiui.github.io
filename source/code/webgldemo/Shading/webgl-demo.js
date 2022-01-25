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
    forwardMove = 0;
    rightMove = 0;
    worldUpMove = 0;
    staticMoveSpeed = 0;

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

    setMove(fs, rs, wus, sms) {
        this.forwardMove = fs || 0;
        this.rightMove = rs || 0;
        this.worldUpMove = wus || 0;
        this.staticMoveSpeed = sms || 0;
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
        if (this.staticMoveSpeed) { // 以固定的速度移动，否则相机朝上时按w并按空格会比较快
            let dir = vec3.create();
            vec3.scaleAndAdd(dir, dir, this.front, this.forwardMove);
            vec3.scaleAndAdd(dir, dir, this.right, this.rightMove);
            vec3.scaleAndAdd(dir, dir, this.worldUp, this.worldUpMove);
            vec3.normalize(dir, dir);
            vec3.scaleAndAdd(this.position, this.position, dir, this.staticMoveSpeed * deltaTime);
        } else {
            let delta = vec3.create();
            vec3.scaleAndAdd(delta, delta, this.front, this.forwardMove * deltaTime);
            vec3.scaleAndAdd(delta, delta, this.right, this.rightMove * deltaTime);
            vec3.scaleAndAdd(delta, delta, this.worldUp, this.worldUpMove * deltaTime);
            vec3.add(this.position, this.position, delta);
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
    static staticMoveMode = true;

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

        window.onresize = Control.onResize;
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

        let forwardMove = Control.forwardMoveEnabled && (Number(Control._wDown) - Number(Control._sDown)) * Control.moveScale || 0;
        let rightMove = Control.rightMoveEnabled && (Number(Control._dDown) - Number(Control._aDown)) * Control.moveScale || 0;
        let worldUpMove = Control.worldUpMoveEnabled && (Number(Control._spaceDown) - Number(Control._shiftDown)) * Control.moveScale || 0;
        if (Control.camera.forwardMove != forwardMove || 
            Control.camera.rightMove != rightMove || 
            Control.camera.worldUpMove != worldUpMove)
        {
            Control.camera.setMove(forwardMove, rightMove, worldUpMove, Control.staticMoveMode && Control.moveScale);
        }
    }
    static onKeyUp(e) {
        if (e.keyCode == 87) Control._wDown = false;
        if (e.keyCode == 83) Control._sDown = false;
        if (e.keyCode == 68) Control._dDown = false;
        if (e.keyCode == 65) Control._aDown = false;
        if (e.keyCode == 16) Control._shiftDown = false;
        if (e.keyCode == 32) Control._spaceDown = false;

        let forwardMove = Control.forwardMoveEnabled && (Number(Control._wDown) - Number(Control._sDown)) * Control.moveScale || 0;
        let rightMove = Control.rightMoveEnabled && (Number(Control._dDown) - Number(Control._aDown)) * Control.moveScale || 0;
        let worldUpMove = Control.worldUpMoveEnabled && (Number(Control._spaceDown) - Number(Control._shiftDown)) * Control.moveScale || 0;
        if (Control.camera.forwardMove != forwardMove ||
            Control.camera.rightMove != rightMove || 
            Control.camera.worldUpMove != worldUpMove)
        {
            Control.camera.setMove(forwardMove, rightMove, worldUpMove, Control.staticMoveMode && Control.moveScale);
        }
    }

    static onResize(e) {
        location.reload();
        // 对于改变窗口大小后强制刷新导致相机不是改变窗口大小前的位置的问题暂时无法解决
    }
};

// Learned from webgl-fundamentals: https://github.com/gfxfundamentals/webgl-fundamentals/blob/master/webgl/resources/webgl-utils.js
class webglUtils {
    // resize canvas
    static resizeCanvas(canvas) {
        let displayWidth = canvas.clientWidth;
        let displayHeight = canvas.clientHeight;

        if (canvas.width != displayWidth || canvas.height != displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }
    }

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

    // Initialize a texture and load an image. When the image finished loading copy it into the texture.
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
            // let isPowerOf2 = function(x) { return (x & (x - 1)) == 0; }
            let isPowerOf2 = (x) => { return (x & (x - 1)) == 0; }
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
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

    /**
     * Returns the corresponding bind point for a given sampler type
     */
    static getBindPointForSamplerType(gl, type) {
        if (type === gl.SAMPLER_2D)   return gl.TEXTURE_2D;        // eslint-disable-line
        if (type === gl.SAMPLER_CUBE) return gl.TEXTURE_CUBE_MAP;  // eslint-disable-line
        return undefined;
    }

    /**
     * Creates setter functions for all uniforms of a shader
     * program.
     *
     * @see {@link module:webgl-utils.setUniforms}
     *
     * @param {WebGLProgram} program the program to create setters for.
     * @returns {Object.<string, function>} an object with a setter by name for each uniform
     * @memberOf module:webgl-utils
     */
    static createUniformSetters(gl, program) {
        let textureUnit = 0;

        /**
         * Creates a setter for a uniform of the given program with it's
         * location embedded in the setter.
         * @param {WebGLProgram} program
         * @param {WebGLUniformInfo} uniformInfo
         * @returns {function} the created setter.
         */
        function createUniformSetter(program, uniformInfo) {
            const location = gl.getUniformLocation(program, uniformInfo.name);
            const type = uniformInfo.type;
            // Check if this uniform is an array
            const isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]');
            if (type === gl.FLOAT && isArray) {
                return function(v) {
                    gl.uniform1fv(location, v);
                };
            }
            if (type === gl.FLOAT) {
                return function(v) {
                    gl.uniform1f(location, v);
                };
            }
            if (type === gl.FLOAT_VEC2) {
                return function(v) {
                    gl.uniform2fv(location, v);
                };
            }
            if (type === gl.FLOAT_VEC3) {
                return function(v) {
                    gl.uniform3fv(location, v);
                };
            }
            if (type === gl.FLOAT_VEC4) {
                return function(v) {
                    gl.uniform4fv(location, v);
                };
            }
            if (type === gl.INT && isArray) {
                return function(v) {
                    gl.uniform1iv(location, v);
                };
            }
            if (type === gl.INT) {
                return function(v) {
                    gl.uniform1i(location, v);
                };
            }
            if (type === gl.INT_VEC2) {
                return function(v) {
                    gl.uniform2iv(location, v);
                };
            }
            if (type === gl.INT_VEC3) {
                return function(v) {
                    gl.uniform3iv(location, v);
                };
            }
            if (type === gl.INT_VEC4) {
                return function(v) {
                    gl.uniform4iv(location, v);
                };
            }
            if (type === gl.BOOL) {
                return function(v) {
                    gl.uniform1iv(location, v);
                };
            }
            if (type === gl.BOOL_VEC2) {
                return function(v) {
                    gl.uniform2iv(location, v);
                };
            }
            if (type === gl.BOOL_VEC3) {
                return function(v) {
                    gl.uniform3iv(location, v);
                };
            }
            if (type === gl.BOOL_VEC4) {
                return function(v) {
                    gl.uniform4iv(location, v);
                };
            }
            if (type === gl.FLOAT_MAT2) {
                return function(v) {
                    gl.uniformMatrix2fv(location, false, v);
                };
            }
            if (type === gl.FLOAT_MAT3) {
                return function(v) {
                    gl.uniformMatrix3fv(location, false, v);
                };
            }
            if (type === gl.FLOAT_MAT4) {
                return function(v) {
                    gl.uniformMatrix4fv(location, false, v);
                };
            }
            if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
                const units = [];
                for (let ii = 0; ii < info.size; ++ii) {
                    units.push(textureUnit++);
                }
                return function(bindPoint, units) {
                    return function(textures) {
                        gl.uniform1iv(location, units);
                        textures.forEach(function(texture, index) {
                            gl.activeTexture(gl.TEXTURE0 + units[index]);
                            gl.bindTexture(bindPoint, texture);
                        });
                    };
                } (webglUtils.getBindPointForSamplerType(gl, type), units);
            }
            if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
                return function(bindPoint, unit) {
                    return function(texture) {
                        gl.uniform1i(location, unit);
                        gl.activeTexture(gl.TEXTURE0 + unit);
                        gl.bindTexture(bindPoint, texture);
                    };
                } (webglUtils.getBindPointForSamplerType(gl, type), textureUnit++);
            }
            throw ('unknown type: 0x' + type.toString(16)); // we should never get here.
        }

        const uniformSetters = { };
        const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (let ii = 0; ii < numUniforms; ++ii) {
            const uniformInfo = gl.getActiveUniform(program, ii);
            if (!uniformInfo) {
                break;
            }
            let name = uniformInfo.name;
            // remove the array suffix.
            if (name.substr(-3) === '[0]') {
                name = name.substr(0, name.length - 3);
            }
            const setter = createUniformSetter(program, uniformInfo);
            uniformSetters[name] = setter;
        }
        return uniformSetters;
    }

    /**
     * Set uniforms and binds related textures.
     *
     * Example:
     *
     *     let programInfo = createProgramInfo(
     *         gl, ["some-vs", "some-fs"]);
     *
     *     let tex1 = gl.createTexture();
     *     let tex2 = gl.createTexture();
     *
     *     ... assume we setup the textures with data ...
     *
     *     let uniforms = {
     *       u_someSampler: tex1,
     *       u_someOtherSampler: tex2,
     *       u_someColor: [1,0,0,1],
     *       u_somePosition: [0,1,1],
     *       u_someMatrix: [
     *         1,0,0,0,
     *         0,1,0,0,
     *         0,0,1,0,
     *         0,0,0,0,
     *       ],
     *     };
     *
     *     gl.useProgram(program);
     *
     * This will automatically bind the textures AND set the
     * uniforms.
     *
     *     setUniforms(programInfo.uniformSetters, uniforms);
     *
     * For the example above it is equivalent to
     *
     *     let texUnit = 0;
     *     gl.activeTexture(gl.TEXTURE0 + texUnit);
     *     gl.bindTexture(gl.TEXTURE_2D, tex1);
     *     gl.uniform1i(u_someSamplerLocation, texUnit++);
     *     gl.activeTexture(gl.TEXTURE0 + texUnit);
     *     gl.bindTexture(gl.TEXTURE_2D, tex2);
     *     gl.uniform1i(u_someSamplerLocation, texUnit++);
     *     gl.uniform4fv(u_someColorLocation, [1, 0, 0, 1]);
     *     gl.uniform3fv(u_somePositionLocation, [0, 1, 1]);
     *     gl.uniformMatrix4fv(u_someMatrix, false, [
     *         1,0,0,0,
     *         0,1,0,0,
     *         0,0,1,0,
     *         0,0,0,0,
     *       ]);
     *
     * Note it is perfectly reasonable to call `setUniforms` multiple times. For example
     *
     *     let uniforms = {
     *       u_someSampler: tex1,
     *       u_someOtherSampler: tex2,
     *     };
     *
     *     let moreUniforms {
     *       u_someColor: [1,0,0,1],
     *       u_somePosition: [0,1,1],
     *       u_someMatrix: [
     *         1,0,0,0,
     *         0,1,0,0,
     *         0,0,1,0,
     *         0,0,0,0,
     *       ],
     *     };
     *
     *     setUniforms(programInfo.uniformSetters, uniforms);
     *     setUniforms(programInfo.uniformSetters, moreUniforms);
     *
     * @param {Object.<string, function>|module:webgl-utils.ProgramInfo} setters the setters returned from
     *        `createUniformSetters` or a ProgramInfo from {@link module:webgl-utils.createProgramInfo}.
     * @param {Object.<string, value>} an object with values for the
     *        uniforms.
     * @memberOf module:webgl-utils
     */
    static setUniforms(setters, ...values) {
        setters = setters.uniformSetters || setters;
        for (const uniforms of values) {
            Object.keys(uniforms).forEach(function(name) {
                const setter = setters[name];
                if (setter) {
                    setter(uniforms[name]);
                }
            });
        }
    }
    
    /**
     * Creates setter functions for all attributes of a shader
     * program. You can pass this to {@link module:webgl-utils.setBuffersAndAttributes} to set all your buffers and attributes.
     *
     * @see {@link module:webgl-utils.setAttributes} for example
     * @param {WebGLProgram} program the program to create setters for.
     * @return {Object.<string, function>} an object with a setter for each attribute by name.
     * @memberOf module:webgl-utils
     */
    static createAttributeSetters(gl, program) {
        const attribSetters = {
        };

        function createAttribSetter(index) {
            return function(b) {
                if (b.value) {
                    gl.disableVertexAttribArray(index);
                    switch (b.value.length) {
                        case 4:
                            gl.vertexAttrib4fv(index, b.value);
                            break;
                        case 3:
                            gl.vertexAttrib3fv(index, b.value);
                            break;
                        case 2:
                            gl.vertexAttrib2fv(index, b.value);
                            break;
                        case 1:
                            gl.vertexAttrib1fv(index, b.value);
                            break;
                        default:
                            throw new Error('the length of a float constant value must be between 1 and 4!');
                    }
                } else {
                    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
                    gl.enableVertexAttribArray(index);
                    gl.vertexAttribPointer(
                        index, b.numComponents || b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0
                    );
                }
            };
        }

        const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let ii = 0; ii < numAttribs; ++ii) {
            const attribInfo = gl.getActiveAttrib(program, ii);
            if (!attribInfo) { break; }
            const index = gl.getAttribLocation(program, attribInfo.name);
            attribSetters[attribInfo.name] = createAttribSetter(index);
        }

        return attribSetters;
    }
    
    /**
     * Sets attributes and binds buffers (deprecated... use {@link module:webgl-utils.setBuffersAndAttributes})
     *
     * Example:
     *
     *     let program = createProgramFromScripts(
     *         gl, ["some-vs", "some-fs"]);
     *
     *     let attribSetters = createAttributeSetters(program);
     *
     *     let positionBuffer = gl.createBuffer();
     *     let texcoordBuffer = gl.createBuffer();
     *
     *     let attribs = {
     *       a_position: {buffer: positionBuffer, numComponents: 3},
     *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
     *     };
     *
     *     gl.useProgram(program);
     *
     * This will automatically bind the buffers AND set the
     * attributes.
     *
     *     setAttributes(attribSetters, attribs);
     *
     * Properties of attribs. For each attrib you can add
     * properties:
     *
     * *   type: the type of data in the buffer. Default = gl.FLOAT
     * *   normalize: whether or not to normalize the data. Default = false
     * *   stride: the stride. Default = 0
     * *   offset: offset into the buffer. Default = 0
     *
     * For example if you had 3 value float positions, 2 value
     * float texcoord and 4 value uint8 colors you'd setup your
     * attribs like this
     *
     *     let attribs = {
     *       a_position: {buffer: positionBuffer, numComponents: 3},
     *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
     *       a_color: {
     *         buffer: colorBuffer,
     *         numComponents: 4,
     *         type: gl.UNSIGNED_BYTE,
     *         normalize: true,
     *       },
     *     };
     *
     * @param {Object.<string, function>|model:webgl-utils.ProgramInfo} setters Attribute setters as returned from createAttributeSetters or a ProgramInfo as returned {@link module:webgl-utils.createProgramInfo}
     * @param {Object.<string, module:webgl-utils.AttribInfo>} attribs AttribInfos mapped by attribute name.
     * @memberOf module:webgl-utils
     * @deprecated use {@link module:webgl-utils.setBuffersAndAttributes}
     */
    static setAttributes(setters, attribs) {
        setters = setters.attribSetters || setters;
        Object.keys(attribs).forEach(function(name) {
            const setter = setters[name];
            if (setter) {
                setter(attribs[name]);
            }
        });
    }

    /**
     * Sets attributes and buffers including the `ELEMENT_ARRAY_BUFFER` if appropriate
     *
     * Example:
     *
     *     let programInfo = createProgramInfo(
     *         gl, ["some-vs", "some-fs"]);
     *
     *     let arrays = {
     *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
     *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
     *     };
     *
     *     let bufferInfo = createBufferInfoFromArrays(gl, arrays);
     *
     *     gl.useProgram(programInfo.program);
     *
     * This will automatically bind the buffers AND set the
     * attributes.
     *
     *     setBuffersAndAttributes(programInfo.attribSetters, bufferInfo);
     *
     * For the example above it is equivilent to
     *
     *     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
     *     gl.enableVertexAttribArray(a_positionLocation);
     *     gl.vertexAttribPointer(a_positionLocation, 3, gl.FLOAT, false, 0, 0);
     *     gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
     *     gl.enableVertexAttribArray(a_texcoordLocation);
     *     gl.vertexAttribPointer(a_texcoordLocation, 4, gl.FLOAT, false, 0, 0);
     *
     * @param {WebGLRenderingContext} gl A WebGLRenderingContext.
     * @param {Object.<string, function>} setters Attribute setters as returned from `createAttributeSetters`
     * @param {module:webgl-utils.BufferInfo} buffers a BufferInfo as returned from `createBufferInfoFromArrays`.
     * @memberOf module:webgl-utils
     */
    static setBuffersAndAttributes(gl, setters, buffers) {
        webglUtils.setAttributes(setters, buffers.attribs);
        if (buffers.indices) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        }
    }

    static makeTypedArray(array, name) {
        function isArrayBuffer(a) {
            return a.buffer && a.buffer instanceof ArrayBuffer;
        }

        if (isArrayBuffer(array)) {
            return array;
        }

        if (array.data && isArrayBuffer(array.data)) {
            return array.data;
        }

        if (Array.isArray(array)) {
            array = {
            data: array,
            };
        }

        if (!array.numComponents) {
            array.numComponents = guessNumComponentsFromName(name, array.length);
        }

        let type = array.type;
        if (!type) {
            if (name === 'indices') {
                type = Uint16Array;
            }
        }
        const typedArray = createAugmentedTypedArray(array.numComponents, array.data.length / array.numComponents | 0, type);
        typedArray.push(array.data);
        return typedArray;
    }

    static createBufferFromTypedArray(gl, array, type, drawType) {
        type = type || gl.ARRAY_BUFFER;
        const buffer = gl.createBuffer();
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, array, drawType || gl.STATIC_DRAW);
        return buffer;
    }

    static guessNumComponentsFromName(name, length) {
        let numComponents;
        if (name.indexOf('coord') >= 0) {
            numComponents = 2;
        } else if (name.indexOf('color') >= 0) {
            numComponents = 4;
        } else {
            numComponents = 3;  // position, normals, indices ...
        }

        if (length % numComponents > 0) {
            throw 'can not guess numComponents. You should specify it.';
        }

        return numComponents;
    }

    static getGLTypeForTypedArray(gl, typedArray) {
        if (typedArray instanceof Int8Array)    { return gl.BYTE; }            // eslint-disable-line
        if (typedArray instanceof Uint8Array)   { return gl.UNSIGNED_BYTE; }   // eslint-disable-line
        if (typedArray instanceof Int16Array)   { return gl.SHORT; }           // eslint-disable-line
        if (typedArray instanceof Uint16Array)  { return gl.UNSIGNED_SHORT; }  // eslint-disable-line
        if (typedArray instanceof Int32Array)   { return gl.INT; }             // eslint-disable-line
        if (typedArray instanceof Uint32Array)  { return gl.UNSIGNED_INT; }    // eslint-disable-line
        if (typedArray instanceof Float32Array) { return gl.FLOAT; }           // eslint-disable-line
        throw 'unsupported typed array type';
    }

    // This is really just a guess. Though I can't really imagine using
    // anything else? Maybe for some compression?
    static getNormalizationForTypedArray(typedArray) {
        if (typedArray instanceof Int8Array)    { return true; }  // eslint-disable-line
        if (typedArray instanceof Uint8Array)   { return true; }  // eslint-disable-line
        return false;
    }

    /**
     * Creates a set of attribute data and WebGLBuffers from set of arrays
     *
     * Given
     *
     *      let arrays = {
     *        position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
     *        texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
     *        normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
     *        color:    { numComponents: 4, data: [255, 255, 255, 255, 255, 0, 0, 255, 0, 0, 255, 255], type: Uint8Array, },
     *        indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
     *      };
     *
     * returns something like
     *
     *      let attribs = {
     *        a_position: { numComponents: 3, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
     *        a_texcoord: { numComponents: 2, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
     *        a_normal:   { numComponents: 3, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
     *        a_color:    { numComponents: 4, type: gl.UNSIGNED_BYTE, normalize: true,  buffer: WebGLBuffer, },
     *      };
     *
     * @param {WebGLRenderingContext} gl The webgl rendering context.
     * @param {Object.<string, array|typedarray>} arrays The arrays
     * @param {Object.<string, string>} [opt_mapping] mapping from attribute name to array name.
     *     if not specified defaults to "a_name" -> "name".
     * @return {Object.<string, module:webgl-utils.AttribInfo>} the attribs
     * @memberOf module:webgl-utils
     */
    static createAttribsFromArrays(gl, arrays, opt_mapping) {     
        function allButIndices(name) {
            return name !== 'indices';
        }
        function createMapping(obj) {
            const mapping = {};
            Object.keys(obj).filter(allButIndices).forEach(function(key) {
                mapping['a_' + key] = key;
            });
            return mapping;
        }

        const mapping = opt_mapping || createMapping(arrays);
        const attribs = {};
        Object.keys(mapping).forEach(function(attribName) {
            const bufferName = mapping[attribName];
            const origArray = arrays[bufferName];
            if (origArray.value) {
                attribs[attribName] = {
                    value: origArray.value,
                };
            } else {
                const array = webglUtils.makeTypedArray(origArray, bufferName);
                attribs[attribName] = {
                    buffer:        webglUtils.createBufferFromTypedArray(gl, array),
                    numComponents: origArray.numComponents || array.numComponents || webglUtils.guessNumComponentsFromName(bufferName),
                    type:          webglUtils.getGLTypeForTypedArray(gl, array),
                    normalize:     webglUtils.getNormalizationForTypedArray(array),
                };
            }
        });
        return attribs;
    }

    
    static getArray(array) {
        return array.length ? array : array.data;
    }

    static getNumComponents(array, arrayName) {
        return array.numComponents || array.size || guessNumComponentsFromName(arrayName, getArray(array).length);
    }

    /**
     * tries to get the number of elements from a set of arrays.
     */
    static positionKeys = ['position', 'positions', 'a_position'];
    static getNumElementsFromNonIndexedArrays(arrays) {
        let key;
        for (const k of webglUtils.positionKeys) {
            if (k in arrays) {
                key = k;
                break;
            }
        }
        key = key || Object.keys(arrays)[0];
        const array = arrays[key];
        const length = webglUtils.getArray(array).length;
        const numComponents = webglUtils.getNumComponents(array, key);
        const numElements = length / numComponents;
        if (length % numComponents > 0) {
            throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
        }
        return numElements;
    }

    /**
     * Creates a BufferInfo from an object of arrays.
     *
     * This can be passed to {@link module:webgl-utils.setBuffersAndAttributes} and to
     * {@link module:webgl-utils:drawBufferInfo}.
     *
     * Given an object like
     *
     *     let arrays = {
     *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
     *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
     *       normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
     *       indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
     *     };
     *
     *  Creates an BufferInfo like this
     *
     *     bufferInfo = {
     *       numElements: 4,        // or whatever the number of elements is
     *       indices: WebGLBuffer,  // this property will not exist if there are no indices
     *       attribs: {
     *         a_position: { buffer: WebGLBuffer, numComponents: 3, },
     *         a_normal:   { buffer: WebGLBuffer, numComponents: 3, },
     *         a_texcoord: { buffer: WebGLBuffer, numComponents: 2, },
     *       },
     *     };
     *
     *  The properties of arrays can be JavaScript arrays in which case the number of components
     *  will be guessed.
     *
     *     let arrays = {
     *        position: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0],
     *        texcoord: [0, 0, 0, 1, 1, 0, 1, 1],
     *        normal:   [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
     *        indices:  [0, 1, 2, 1, 2, 3],
     *     };
     *
     *  They can also by TypedArrays
     *
     *     let arrays = {
     *        position: new Float32Array([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]),
     *        texcoord: new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]),
     *        normal:   new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]),
     *        indices:  new Uint16Array([0, 1, 2, 1, 2, 3]),
     *     };
     *
     *  Or augmentedTypedArrays
     *
     *     let positions = createAugmentedTypedArray(3, 4);
     *     let texcoords = createAugmentedTypedArray(2, 4);
     *     let normals   = createAugmentedTypedArray(3, 4);
     *     let indices   = createAugmentedTypedArray(3, 2, Uint16Array);
     *
     *     positions.push([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]);
     *     texcoords.push([0, 0, 0, 1, 1, 0, 1, 1]);
     *     normals.push([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
     *     indices.push([0, 1, 2, 1, 2, 3]);
     *
     *     let arrays = {
     *        position: positions,
     *        texcoord: texcoords,
     *        normal:   normals,
     *        indices:  indices,
     *     };
     *
     * For the last example it is equivalent to
     *
     *     let bufferInfo = {
     *       attribs: {
     *         a_position: { numComponents: 3, buffer: gl.createBuffer(), },
     *         a_texcoods: { numComponents: 2, buffer: gl.createBuffer(), },
     *         a_normals: { numComponents: 3, buffer: gl.createBuffer(), },
     *       },
     *       indices: gl.createBuffer(),
     *       numElements: 6,
     *     };
     *
     *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.a_position.buffer);
     *     gl.bufferData(gl.ARRAY_BUFFER, arrays.position, gl.STATIC_DRAW);
     *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.a_texcoord.buffer);
     *     gl.bufferData(gl.ARRAY_BUFFER, arrays.texcoord, gl.STATIC_DRAW);
     *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.a_normal.buffer);
     *     gl.bufferData(gl.ARRAY_BUFFER, arrays.normal, gl.STATIC_DRAW);
     *     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);
     *     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrays.indices, gl.STATIC_DRAW);
     *
     * @param {WebGLRenderingContext} gl A WebGLRenderingContext
     * @param {Object.<string, array|object|typedarray>} arrays Your data
     * @param {Object.<string, string>} [opt_mapping] an optional mapping of attribute to array name.
     *    If not passed in it's assumed the array names will be mapped to an attribute
     *    of the same name with "a_" prefixed to it. An other words.
     *
     *        let arrays = {
     *           position: ...,
     *           texcoord: ...,
     *           normal:   ...,
     *           indices:  ...,
     *        };
     *
     *        bufferInfo = createBufferInfoFromArrays(gl, arrays);
     *
     *    Is the same as
     *
     *        let arrays = {
     *           position: ...,
     *           texcoord: ...,
     *           normal:   ...,
     *           indices:  ...,
     *        };
     *
     *        let mapping = {
     *          a_position: "position",
     *          a_texcoord: "texcoord",
     *          a_normal:   "normal",
     *        };
     *
     *        bufferInfo = createBufferInfoFromArrays(gl, arrays, mapping);
     *
     * @return {module:webgl-utils.BufferInfo} A BufferInfo
     * @memberOf module:webgl-utils
     */
    static createBufferInfoFromArrays(gl, arrays, opt_mapping) {
        const bufferInfo = {
            attribs: webglUtils.createAttribsFromArrays(gl, arrays, opt_mapping),
        };
        let indices = arrays.indices;
        if (indices) {
            indices = webglUtils.makeTypedArray(indices, 'indices');
            bufferInfo.indices = webglUtils.createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER);
            bufferInfo.numElements = indices.length;
        } else {
            bufferInfo.numElements = webglUtils.getNumElementsFromNonIndexedArrays(arrays);
        }

        return bufferInfo;
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
    static arraysAndMapping;
    
    static diffuseTexture;
    static specularTexture;

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
    bufferInfo;
    arraysAndMapping;
    diffuseTexture;
    specularTexture;

    constructor(gl, modelMatrix) {
        // set static vars
        if (!Cube.programInfo) {
            let shaderProgram = webglUtils.initShaderProgram(gl, Cube.vsSource, Cube.fsSource);
            let arrays = {
                position: {numComponents: 3, data: new Float32Array(Cube.vertices), },
                texcoord: {numComponents: 2, data: new Float32Array(Cube.textureCoordinates), },
                normal: {numComponents: 3, data: new Float32Array(Cube.vertexNormals), },
                indices: {numComponents: 3, data: new Uint16Array(Cube.indices), },
            };
            let mapping = {
                "aVertexPosition": "position",
                "aVertexNormal": "normal",
                "aTextureCoord": "texcoord",
            };

            Cube.arraysAndMapping = [arrays, mapping];
            Cube.programInfo = {
                program: shaderProgram,
                attribSetters: webglUtils.createAttributeSetters(gl, shaderProgram),
                uniformSetters: webglUtils.createUniformSetters(gl, shaderProgram),
                bufferInfo: webglUtils.createBufferInfoFromArrays(gl, arrays, mapping),
            }
        }

        let defaultDiffuseTextureName = "resources/textures/container2.png";
        if (!Cube.diffuseTexture) {
            Cube.diffuseTexture = webglUtils.loadTexture(gl, defaultDiffuseTextureName); // "blocktexture.png"
        }
        let defaultSpecularTextureName = "resources/textures/container2_specular.png";
        if (!Cube.specularTexture) {
            Cube.specularTexture = webglUtils.loadTexture(gl, defaultSpecularTextureName); 
        }

        this.arraysAndMapping = Cube.arraysAndMapping;
        this.bufferInfo = Cube.programInfo.bufferInfo;

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
            let [arrays, mapping] = this.arraysAndMapping || Cube.arraysAndMapping;
            let newArrays = {
                position: arrays.position,
                texcoord: {numComponents: 2, data: new Float32Array(textureCoordinates), },
                normal: arrays.normal,
                indices: arrays.indices,
            };
            this.arraysAndMapping = [newArrays, mapping];
            this.bufferInfo = webglUtils.createBufferInfoFromArrays(gl, newArrays, mapping);
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

        let uniforms = {
            uProjectionMatrix: projectionMatrix,
            uViewMatrix: viewMatrix,
            uModelMatrix: modelMatrix,
            uNormalMatrix: normalMatrix,

            uViewPosition: camera.position,

            "uMaterial.diffuse": this.diffuseTexture || Cube.diffuseTexture,
            "uMaterial.specular": this.specularTexture || Cube.specularTexture,
            "uMaterial.shininess": 32.0,
            
            "uLight.position": light.position,
            "uLight.intensity": light.intensity,
            "uLight.ambient": light.ambient,
            "uLight.diffuse": light.diffuse,
            "uLight.specular": light.specular,
        };

        gl.useProgram(Cube.programInfo.program);

        webglUtils.setBuffersAndAttributes(gl, Cube.programInfo.attribSetters, this.bufferInfo || Cube.programInfo.bufferInfo);
        webglUtils.setUniforms(Cube.programInfo.uniformSetters, uniforms);
    
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
    static arraysAndMapping;

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
    bufferInfo;
    arraysAndMapping;

    modelMatrix = mat4.create();

    constructor(gl, modelMatrix, xSeg, ySeg) {
        if (!Sphere.vertices || !Sphere.indices) {
            Sphere.vertices = [];
            Sphere.indices = [];
            Sphere.setSphereShape(Sphere.xSeg, Sphere.ySeg, Sphere.vertices, Sphere.indices);
        }

        // shader program
        if (!Sphere.programInfo) {
            let shaderProgram = webglUtils.initShaderProgram(gl, Sphere.vsSource, Sphere.fsSource);
            let arrays = {
                position: {numComponents: 3, data: new Float32Array(Sphere.vertices), },
                indices: {numComponents: 3, data: new Uint16Array(Sphere.indices), },
            }
            let mapping = {
                "aVertexPosition": "position",
            }

            Sphere.arraysAndMapping = [arrays, mapping];
            Sphere.programInfo = {
                program: shaderProgram,
                attribSetters: webglUtils.createAttributeSetters(gl, shaderProgram),
                uniformSetters: webglUtils.createUniformSetters(gl, shaderProgram),
                bufferInfo: webglUtils.createBufferInfoFromArrays(gl, arrays, mapping),
            }
        }

        this.xSeg = xSeg || Sphere.xSeg;
        this.ySeg = ySeg || Sphere.ySeg;

        if (this.xSeg != Sphere.xSeg || this.ySeg != Sphere.ySeg) {
            this.vertices = [];
            this.indices = [];
            this.setShape(this.xSeg, this.ySeg);
        } else {
            this.vertices = Sphere.vertices;
            this.indices = Sphere.indices;
            this.arraysAndMapping = Sphere.arraysAndMapping;
            this.bufferInfo = Sphere.programInfo.bufferInfo;
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

        let [arrays, mapping] = this.arraysAndMapping || Sphere.arraysAndMapping;
        let newArrays = {
            position: new Float32Array(this.vertices),
            indices: new Uint16Array(this.indices),
        }
        this.arraysAndMapping = [newArrays, mapping];
        this.bufferInfo = webglUtils.createBufferInfoFromArrays(gl, newArrays, mapping);
    }

    setModelMatrix(modelMatrix) {
        mat4.copy(this.modelMatrix, modelMatrix);
    }

    transform(mat) {
        mat4.mul(this.modelMatrix, mat, this.modelMatrix);
    }

    render(gl, camera) {
        const projectionMatrix = mat4.create();
        camera.perspective(projectionMatrix);

        const viewMatrix = mat4.create();
        camera.view(viewMatrix);

        const modelMatrix = this.modelMatrix;

        let uniforms = {
            uProjectionMatrix: projectionMatrix,
            uViewMatrix: viewMatrix,
            uModelMatrix: modelMatrix,
        }

        gl.useProgram(Sphere.programInfo.program);

        webglUtils.setBuffersAndAttributes(gl, Sphere.programInfo.attribSetters, this.bufferInfo || Sphere.programInfo.bufferInfo);
        webglUtils.setUniforms(Sphere.programInfo.uniformSetters, uniforms);

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
        webglUtils.resizeCanvas(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const deltaTime = currTime - lastTime;
        lastTime = currTime;
            
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything 
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear

        objects.forEach(element => {
            if (element.beforeRender) {
                element.beforeRender(gl);
            }
            element.render(gl, camera, light);
        });

        camera.update(deltaTime);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


main();