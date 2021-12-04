---
title: Math
date: 2021-12-02 21:03:55
math: true 
categories: 
  - Computer Graphics 
tags: 
  - Computer Graphics 
  - Math 
typora-root-url: Math
---

[markdown 公式编辑](https://www.jianshu.com/p/25f0139637b7) 备忘

内容部分来自 [GAMES101](http://games-cn.org/intro-graphics/) 和 [GAMES103](http://games-cn.org/games103/) 

**本文不保证完全正确。**

**本文还在编写中。**



## Vector 

### norm 范数

学习资料：[线性代数-范数(2) 向量范数](https://zhuanlan.zhihu.com/p/85305655)

p-norm 定义：
$$
\begin{Vmatrix} x \end{Vmatrix} = ( \sum_{i=1}^n |x_i|^p ) ^{1/p}, p > 1
$$
常见的 1-norm 就是$\begin{Vmatrix} x \end{Vmatrix}_2 = \sqrt{ \sum_{i=1}^n x_i^2}$ ，2-norm 就是 $\begin{Vmatrix} x \end{Vmatrix}_1 = \sum_{i=1}^n |x_i|$，而 $\infty$-norm 则是 $\begin{Vmatrix} x \end{Vmatrix} _\infty = \max_i{|x_i|}$ 

### dot 点乘

两个向量点乘，可以写成前一个向量的转置成后一个向量：$\bf a \cdot b = a^T b = \it x_a x_b + y_a y_b + z_a z_b$ 

### cross 叉乘

向量的叉乘也可以使用叉乘矩阵来表示成一个矩阵和向量乘积的形式：$\bf a \times b = A^* b$​ 

* 定义三角形法向量、计算面积。

  ![image-cross_normal_area](image-cross_normal_area.png)

* 判断点和三角形的相对位置：

  ![image-cross_inside_outside](image-cross_inside_outside.png)

* Barycentric Coordinates 计算重心坐标：

  ![image-barycentric_coordinates](image-barycentric_coordinates.png) 

* Gouraud Shading 

  ![image-barycentric_coordinates_gouraud_shading](image-barycentric_coordinates_gouraud_shading.png) 

  重心坐标提供了 Gouraud Shading 的做法，也就是从三角形的三个顶点的颜色值计算得到三角形内任意一点的颜色值。

* Tetrahedral 四面体 

  ![image-20211203192140102](image-20211203192140102.png)

  可以利用四面体的三条边进行点乘、叉乘的操作来计算四面体的体积。

  ![image-20211203192332999](image-20211203192332999.png)
  
  同样，用相同的方法来计算任意一点对于这个四面体的重心坐标。

* 计算直线与平面交点

  ![image-20211203192552792](image-20211203192552792.png)

  可以利用四面体体积为零来计算直线和三角形所在平面的交点。



## Matrix

### Defination

Symmetric 对称矩阵：以主对角线为对称轴，各元素对应相等的矩阵。$A^T = A$

Diagonal 对角矩阵：主对角线之外的元素都为零的矩阵。

Orthogonal 正交矩阵：其转置等于其逆的矩阵。（图形学中的旋转矩阵是正交矩阵）

叉乘矩阵：叉乘矩阵可以将两个向量的相乘转换为矩阵与向量的相乘。

反对称矩阵： `A^T = -A` ，则A是反对称矩阵。主对角线上的元素全为零，而关于主对角线对称的元素反号。



矩阵的迹：nxn 矩阵对角线上的元素和。

矩阵的秩：线性无关的纵列的极大数。类似的，行秩是线性无关的行的极大数。

矩阵的特征值和特征矩阵：A 是 n 阶矩阵，如果存在数 m 和非零 n 维向量 x，使得 Ax=mx 成立，那么 m 是 A 的一个特征值or本征值，x 是 A 的一个特征向量。

[线性代数精华——矩阵的特征值与特征向量](https://zhuanlan.zhihu.com/p/104980382)

![image-20211203193322384](image-20211203193322384.png)

任意矩阵 A，则 $A^TA$ 是一个对称矩阵，因为它的转置等于它自己：$(A^T A)^T = A^T A$​

![image-20211203193740116](image-20211203193740116.png)

正交矩阵由互相正交的单位向量组成。（上图小写 a 表示纵向的三维向量，互相正交）（个人感觉把正交矩阵定义为 列（行）向量组是单位正交向量组的矩阵是正交矩阵 更顺口，不过反正和 $A^TA = I$ 是等价的）。







## Transformation

### 旋转矩阵、缩放矩阵

![image-20211203195037113](image-20211203195037113.png)

A 是一个旋转矩阵，坐标轴 xyz 经过它的操作就变成了 uvw，也就是说 **A 在 xyz 坐标系下的坐标就是 uvw**！！！所以 A 肯定是由正交单位向量组组成的，所以 A 是一个正交矩阵。因为正交矩阵的逆等于它的转置，所以我们可以用它的转置来方便的替代它的逆，**旋转矩阵是正交矩阵**这个性质我们之后会用到。

看到这里再回头看 GAMES101 里闫老师说的旋转矩阵，简直就是高维知识支配低维。有时间整理下原来的旋转矩阵。

![image-20211203195407835](image-20211203195407835.png)

要进行缩放，左乘一个对角矩阵即可。

![image-20211203195553697](image-20211203195553697.png)

上图说奇异值分解，一个矩阵可以分解为 一个正交矩阵 * 对角矩阵 * 另一个正交矩阵的转置。背后的原理俺也不懂。

![image-20211203195853539](image-20211203195853539.png)

上图说特征值分解，还是没看懂。

### 齐次坐标

齐次坐标简单，在二维情况下用二维坐标或者在三维情况下用三维坐标，都是无法简洁的表示平移操作的，需要额外加上一个向量才行，所以我们在二维情况下用三维坐标、在三维情况下用四维坐标来表示各种操作，就可以把平移操作结合到其他操作中去。所有的仿射变换都可以写成一个齐次坐标矩阵的形式。

新增的维度并不是被浪费掉的，我们一般让这个维度变成 1，这个之后我们会用于透视投影上。

变换的合成：可以把多个矩阵相乘得到一个矩阵，表示合成后的变换。顺序很重要，操作的顺序是矩阵从右到左的顺序。有多种不同操作时要按照缩放、旋转、平移的顺序进行。

### Viewing Transformation 视图变换

#### View/Camrea Transformation 相机的变换

总是约定相机位置 e 在原点、上向量 t 是 y 轴、前向量 g 是 -z。

![image-20211204122307281](image-20211204122307281.png)

上图是计算 $M_{view}$​ 的过程，这个矩阵的作用是把相机移动到原点并且把上向量 t 对准 y 轴、前向量对准 -z 轴。过程是先把相机平移到世界坐标的原点，这个矩阵 $T_{view}$ 很好找，然后旋转。

计算旋转矩阵时利用了正交矩阵的逆等于其转置的性质。我们从相机坐标变换到 xyz 坐标比较麻烦，但是反过来从 xyz 变换到相机坐标就比较简单，上面也说过了，就是相机坐标的坐标轴向量合起来就是这个旋转矩阵 $R_{view}^{-1}$​ 。之后利用性质把这个矩阵转置一下就是 $R_{view}$​ 。

我们把相机移动到世界重心，把其他物体也进行类似变换的话，相机和其他物体的相对位置没有改变，所以从相机看过去的结果也完全相同。把相机移动到了世界中央，方便之后的投影。

也叫 ModelView Transformation。

#### Projection Transformation 投影变换

* Orthographic Projection 正交投影

  投影时可以直接扔掉 z 坐标。更加规范的做法是：把一个 `[l, r] * [b, t] * [f, n]` （n > f 因为沿着 -z 看，近平面的坐标大于远平面）映射到一个正立方体 `[-1, 1]^3` 上，操作表示为 $M_{ortho}$。

* Perspective Projection 透视投影

  透视投影符合透视规律，会近大远小。

  透视投影看到的是一个四棱柱 Frustum，要做的分为两步，首先把 Frustum 挤压到正立方体 Cuboid，操作是 $M_{persp \rarr ortho}$，然后再进行一个正交投影 $M_{ortho}$ 。最后的 $M_{persp} = M_{ortho} M_{persp \rarr ortho}$ 。
  
  可以使用 field-of-view (fov) （垂直的可视角度）和 aspect ratio （宽高比）来表示一个视锥。

GAMES101 老师讲的这个推导方法是一个思路，感觉有点复杂，之后看看有没有更简单的方式。

### Canonical Cube to Screen

指 Model、View、Projection transformation，依次进行完之后都被映射到 `[-1, 1]^3` 内。

视口变换：把 `[-1, 1]^3` 变到屏幕空间，操作为 $M_{viewport}$。

![image-20211204145458091](image-20211204145458091.png)



## Linear Solver 









