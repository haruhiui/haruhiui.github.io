---
title: Transformation
date: 2022-01-01 12:45:50
math: true 
categories: 
  - Computer Graphics 
tags: 
  - Computer Graphics 
  - Transformation 
typora-root-url: Transformation
---



# Rotation & Scaling

![image-20211203195037113](image-20211203195037113.png)

A 是一个旋转矩阵，坐标轴 xyz 经过它的操作就变成了 uvw。上图可以看到 **A 在 xyz 坐标系下的坐标就是 uvw**！！！所以 A 肯定是由正交单位向量组组成的，所以 A 是一个正交矩阵。因为**正交矩阵的逆等于它的转置**，所以我们可以用它的转置来方便的替代它的逆，**旋转矩阵是正交矩阵**这个性质我们之后会用到。

看到这里再回头看 GAMES101 里闫老师说的旋转矩阵，简直就是高维知识支配低维。

![image-20211203195407835](image-20211203195407835.png)

要进行缩放，左乘一个对角矩阵即可。



# Translation & Homogeneous Coordinate

齐次坐标简单，在二维情况下用二维坐标或者在三维情况下用三维坐标，都是无法简洁的表示平移操作的，需要额外加上一个向量才行，所以我们在二维情况下用三维坐标、在三维情况下用四维坐标来表示各种操作，就可以把平移操作结合到其他操作中去。所有的仿射变换都可以写成一个齐次坐标矩阵的形式。
$$
\begin{bmatrix} 
1& 0& 0& x_t\\
0& 1& 0& y_t\\
0& 0& 1& z_t\\
0& 0& 0& 1\\
\end{bmatrix}
\begin{bmatrix}
x\\
y\\
z\\
1\\
\end{bmatrix}
=
\begin{bmatrix}
x + x_t\\
y + y_t\\
z + z_t\\
1\\
\end{bmatrix}
$$
新增的维度并不是被浪费掉的，我们一般让这个维度变成 1，这个之后我们会用于透视投影上。

变换的合成：可以把多个矩阵相乘得到一个矩阵，表示合成后的变换。顺序很重要，操作的顺序是矩阵从右到左的顺序。有多种不同操作时要按照**缩放、旋转、平移**的顺序进行。



# MVP Transformation

## Model Transformation

Model 变换没啥可说的，将缩放、旋转、平移组合起来，作用到一个物体上，就可以把这个物体从物体的局部坐标放到世界坐标下。也就是通过 Model 矩阵来变换物体的大小、姿态、位置。
$$
M_{model} = M_{translation} M_{rotation} M_{scaling}
$$
Viewing Transformation 一般指视图变换，包含 View Transformation 相机的变换和 Projection Transformation 投影变换。

## View/Camrea Transformation

对于相机来说，有三个值需要确定，相机的位置、相机的指向的方向、相机的上方向。一般总是约定相机位置 e 在原点、上向量 t 是 y 轴、前向量 g 是 -z。

![image-20211204122307281](image-20211204122307281.png)

上图是计算 $M_{view}$​ 的过程，这个矩阵的作用是把相机移动到原点并且把上向量 t 对准 y 轴、前向量对准 -z 轴。过程是先把相机平移到世界坐标的原点，这个矩阵 $T_{view}$ 很好找，然后旋转。

计算旋转矩阵时利用了**正交矩阵的逆等于其转置**的性质。我们从相机坐标变换到 xyz 坐标比较麻烦，但是反过来从 xyz 变换到相机坐标就比较简单，就是相机坐标的坐标轴向量合起来就是这个旋转矩阵 $R_{view}^{-1}$​ 。之后利用性质把这个矩阵转置一下就是 $R_{view}$​ 。

我们把相机移动到世界重心，把其他物体也进行类似变换的话，相机和其他物体的相对位置没有改变，所以从相机看过去的结果也完全相同。把相机移动到了世界中央，方便之后的投影。

也叫 ModelView Transformation。

## Projection Transformation 投影变换

投影变换分为两种，正交投影和透视投影。

![image-20211227152623849](image-20211227152623849.png "tiger book 4th p140")

### Orthographic Projection 正交投影

投影时可以直接扔掉 z 坐标。更加规范的做法是：把一个 `[l, r] * [b, t] * [f, n]` （n > f 因为沿着 -z 看，近平面的坐标大于远平面）映射到一个正立方体 `[-1, 1]^3` 上，操作表示为 $M_{ortho}$​​。下面的矩阵很容易推导，先移动后缩放即可。
$$
M_{ortho} = 
\begin{bmatrix}
\frac{2}{r-l}& 0& 0& 0\\
0& \frac{2}{t-b}& 0& 0\\
0& 0& \frac{2}{n-f}& 0\\
0& 0& 0& 1\\
\end{bmatrix}
\begin{bmatrix}
1& 0& 0& -\frac{r+l}{2}\\
0& 1& 0& -\frac{t+b}{2}\\
0& 0& 1& -\frac{n+f}{2}\\
0& 0& 0& 1\\
\end{bmatrix}
=
\begin{bmatrix}
\frac{2}{r-l}& 0& 0& \frac{l+r}{l-r}\\
0& \frac{2}{t-b}& 0& \frac{b+t}{b-t}\\
0& 0& \frac{2}{n-f}& \frac{f+n}{f-n}\\
0& 0& 0& 1\\
\end{bmatrix}
$$
上面的推导假设的是右手坐标系，适用于 OpenGL，如果是 DirectX 的左手坐标系，推荐看参考链接。

### Perspective Projection 透视投影

透视投影符合透视规律，会近大远小。

透视投影看到的是一个四棱柱 Frustum，要做的分为两步，首先把 Frustum 挤压到正立方体 Cuboid，操作是 $M_{persp \rarr ortho}$，然后再进行一个正交投影 $M_{ortho}$ 。最后的 $M_{persp} = M_{ortho} M_{persp \rarr ortho}$ 。

可以使用 field-of-view (fov) （垂直的可视角度）和 aspect ratio （宽高比）来表示一个视锥。
$$
M_{persp} = M_{ortho} M_{persp \rarr ortho} =
\begin{bmatrix}
\frac{2}{r-l}& 0& 0& \frac{l+r}{l-r}\\
0& \frac{2}{t-b}& 0& \frac{b+t}{b-t}\\
0& 0& \frac{2}{n-f}& \frac{f+n}{f-n}\\
0& 0& 0& 1\\
\end{bmatrix}
\begin{bmatrix}
1& 0& 0& 0\\
0& 1& 0& 0\\
0& 0& \frac{f+n}{n}& -f\\
0& 0& \frac{1}{n}& 0\\
\end{bmatrix}
\\
=
\begin{bmatrix}
\frac{2}{r-l}& 0& \frac{l+r}{n(l-r)}& 0\\
0& \frac{2}{t-b}& \frac{b+t}{n(b-t)}& 0\\
0& 0& \frac{n+f}{n(n-f)}& \frac{2f}{f-n}\\
0& 0& \frac{1}{n}& 0\\
\end{bmatrix}
=
\begin{bmatrix}
\frac{2n}{r-l}& 0& \frac{l+r}{l-r}& 0\\
0& \frac{2n}{t-b}& \frac{b+t}{b-t}& 0\\
0& 0& \frac{n+f}{n-f}& \frac{2nf}{f-n}\\
0& 0& 1& 0\\
\end{bmatrix}
$$
如果用 fov 和 ratio 表示：
$$

=
\begin{bmatrix}
\frac{\cot{\frac{\theta}{2}}}{ratio}& 0& 0& 0\\
0& \cot{\frac{\theta}{2}}& 0& 0\\
0& 0& \frac{n+f}{n-f}& -\frac{2nf}{n-f}\\
0& 0& 1& 0\\
\end{bmatrix}
, where
\left \{
\begin{array}{c}
FovY = \theta \Rarr \tan{\frac{\theta}{2}} = \frac{t}{n}\\
ratio = \frac{r}{t}
\end{array}
\right.
$$
同样是右手系。如果想看 $M_{persp \rarr ortho}$ 的详细推导可以看参考链接。

## Canonical Cube to Screen

MVP 转换，依次进行完之后都被映射到 `[-1, 1]^3` 内。

视口变换：把 `[-1, 1]^3` 变到屏幕空间，宽 width，高 height，操作为 $M_{viewport}$​。
$$
M_{viewport} = 
\begin{bmatrix}
\frac{width}{2}& 0& 0& \frac{width}{2}\\
0& \frac{height}{2}& 0& \frac{height}{2}\\
0& 0& 1& 0\\
0& 0& 0& 1\\
\end{bmatrix}
$$



# 使用 glMatirx 测试

[glMatrix](https://glmatrix.net/): Javascript Matrix and Vector library for High Performance WebGL apps.

```javascript testGlMatrixTransformation.js
import {glMatrix, mat4, vec3, vec2} from "gl-matrix"

function main() {
    let mat = mat4.create();
    printMat(mat);

    mat4.translate(mat, mat, [1, 2, 3]);
    printMat(mat);
    
    mat4.scale(mat, mat4.create(), [2, 2, 2]);
    printMat(mat);

    mat4.ortho(mat, 1, 2, 3, 4, 5, 6);
    printMat(mat);

    mat4.perspective(mat, glMatrix.toRadian(90), 2, 1, 5);
    printMat(mat);

    // normal M_{view} is identity
    mat4.lookAt(
        mat, // output
        [0, 0, 0], // eye position
        [0, 0, -1], // look at object position
        [0, 1, 0] // up
    );
    printMat(mat);

    // test T_{view}
    mat4.lookAt(
        mat,
        [1, 2, 3],
        [1, 2, 0],
        [0, 1, 0]
    );
    printMat(mat);

    // test
    mat4.lookAt(
        mat,
        [0, 0, 0],
        [0, 0, 1],
        [0, 1, 0]
    );
    printMat(mat);
}

function printMat(mat) {
    let s = "[\n";
    for (let i = 0; i < 4; i++) {
        s += "    " + mat[i] + " " + mat[i + 4] + " " + mat[i + 8] + " " + mat[i + 12] + "\n";
    }
    s += "]";
    console.log(s);
}

main();

```

结果如下：

```powershell
PS D:\Home\Studio\WebGL> node "testGlMatrixTransformation.js"
[
    1 0 0 0
    0 1 0 0
    0 0 1 0
    0 0 0 1
]
[
    1 0 0 1
    0 1 0 2
    0 0 1 3
    0 0 0 1
]
[
    2 0 0 0
    0 2 0 0
    0 0 2 0
    0 0 0 1
]
[
    2 0 0 -3
    0 2 0 -7
    0 0 -2 -11
    0 0 0 1
]
[
    0.5 0 0 0
    0 1 0 0
    0 0 -1.5 -2.5
    0 0 -1 0
]
[
    1 0 0 0
    0 1 0 0
    0 0 1 0
    0 0 0 1
]
[
    1 0 0 -1
    0 1 0 -2
    0 0 1 -3
    0 0 0 1
]
[
    -1 0 0 0
    0 1 0 0
    0 0 -1 0
    0 0 0 1
]
```

上面代码有几个小细节：
1. OpenGL 的矩阵填充时是按照列填充的，所以输出时是按照列输出的，也就是说程序中的行其实是矩阵的列。[WebGL 矩阵 vs 数学中的矩阵](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-matrix-vs-math.html)
2. `mat4.ortho` 和 `mat.perspective` 的 `near` 和 `far` 的意义好像是离相机的距离大小，所以和上面推导出来的结果差一个负号。
3. `lookAt` 的输出结果可以注意以下，分为平移和旋转，旋转用文章开头的说法解释的话是可以肉眼看出来的。



# WebGL 实现相机

无论在任何地方，相机都是最基本的组成元素。

:::info
下方是相机实现效果，点击后，鼠标控制相机方向，wasd控制相机移动。
:::

{% iframe "../../code/webgldemo/Camera/index.html" 700 500 %}

全部代码：[codepen链接](https://codepen.io/haruhiui/pen/vYeRggd)。最主要的相机和鼠标控制代码如下：

```javascript
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
```

这里不多说 WebGL 的使用方法，我也是刚开始学，如果想了解推荐 [MDN WebGL 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial) 和 [WebGL Fundamental](https://webglfundamentals.org/webgl/lessons/zh_cn/)。

单就上面的代码来说，有以下几个小细节：
1. 相机 up 和 right 向量的计算。要注意 worldUp 和 up 是不同的，一个是世界的上向量，一个是相机的上向量。先用 front 和 worldUp 叉乘计算 right，然后用 right 和 front 叉乘计算 up。至于为什么要区分 up 和 worldUp，因为转动相机的时候一定要给 front 加上与其相垂直的部分，而不能加世界上的 y 轴和 x 轴。
2. 鼠标锁定：canvas 上鼠标锁定，可以参考 [Pointer Lock API](https://developer.mozilla.org/zh-CN/docs/Web/API/Pointer_Lock_API)。
3. 键盘触发事件间隔：一般来说为了防止误触，连续按下的第一次和第二次之间时间间隔会比较长，而且后序相邻两次触发间隔也都不是很短，如果在 onkeydown 时移动相机效果非常不好。所以给相机增加自己的运动方法，在每帧都更新相机的信息。onkeydown 和 onkeyup 时只更改相机的运动状态即可。[remove keydown delay in javascript](https://stackoverflow.com/questions/14448981/remove-keydown-delay-in-javascript)

:::default
下面顺便记录一下 hexo 下使用内嵌 `iframe` 的方法。
:::

[Hexo 官方文档之 Tag Plugins](https://hexo.io/docs/tag-plugins.html) 里面有两种方法，使用 `iframe` 和 `raw`。

```markdown
&#123;% iframe "../../code/webgldemo/Camera/index.html" 700 500 %&#125;

// 或者：
&#123;% raw %&#125;
<div>
<iframe src="../../code/webgldemo/Camera/index.html" width=700 height=500 frameborder="0">
</iframe>
</div>
&#123;% endraw %&#125;
```

（hexo 代码内的代码还会渲染，所以写的时候还得用 `&#125;` 转义大括号……）

嵌入 `iframe` 的时候代码组织：在 `source` 目录下新建目录 `code`，并且在 `_config.yml` 的 `skip_render` 下添加 `code` 文件夹。可参考 [Hexo博客添加自定义HTML页面](https://blog.csdn.net/qq_40922859/article/details/100877777)。

最后说说感想，这篇文章前前后后写了十几天，从 2021 写到 2022，想的最多的还是之前听闫令琪老师说的，科学和技术是两个不同的东西。还有最初在 OSTEP 上看到的 "I see and I forget, I hear and I remember, I do and I understand."



参考资料：

* [图形学基础 - 变换 - 投影](https://zhuanlan.zhihu.com/p/359128442)

* [图形学随笔：MVP变换—投影变换](https://zhuanlan.zhihu.com/p/386900078)

* [GAMES101](https://sites.cs.ucsb.edu/~lingqi/teaching/games101.html)

* [GAMES103](http://games-cn.org/games103/)

* [The Perspective and Orthographic Projection Matrix](https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/orthographic-projection-matrix)

* [MDN WebGL 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial)

* [WebGL Fundamental](https://webglfundamentals.org/webgl/lessons/zh_cn/)

* [LookAt、Viewport、Perspective矩阵](https://zhuanlan.zhihu.com/p/66384929)


