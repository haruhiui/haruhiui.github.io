---
title: The Rendering Equation
date: 2021-12-26 22:41:36
math: true 
categories: 
  - Computer Graphics 
tags: 
  - Computer Graphics 
  - The Rendering Equation
typora-root-url: The-Rendering-Equation
---

**本文不保证完全正确**

**本文还在编写中**

# Radiometry 辐射度量学

Energy：能量。

Power：功率或辐射通量，单位时间的能量。

![image-20211227161505503](image-20211227161505503.png)

Radiant Intensity：辐射强度，**单位立体角**上由点光源**发出**的辐射通量（功率）。

Irradiance：辐照度，**单位面积** **入射** 到一个表面一点的辐射通量（功率）。

Radiance：辐射，是描述光在环境中的分布的基本量。指一个表面在**每单位立体角、每单位投影面积**上所发射(emitted)、反射(reflected)、透射(transmitted)或接收(received)的**辐射通量（功率）**。

Radiance 辐射包含入射和出射。



# BRDF

BRDF 指 Bidirectional Reflectance Distribution Function 双向反射分布函数。

定义从某个方向进来并且反射到某个方向的能量是多少。

要注意这里可以理解为光线先打到物体表面，被物体吸收之后又从表面发射出去，不同于单纯的反射，入射角和出射角可以是不同的。

下图中 L 是 radiance ，E 是 irradiance，那个等式也就是 radiance 和 irradiance 的关系。$\frac{1}{sr}$​ 是单位。

![image-20211227162908726](image-20211227162908726.png)

BRDF：

![image-20211227162807588](image-20211227162807588.png)



# The Rendering Equation

首先反射方程：一个表面发射到某个方向的 radiance 等于从所有方向入射、反射到这个方向的 radiance 的和。

这本身其实是一个递归的，因为从其他物体出射 radiance 都有可能称为自己入射的 radiance。

![image-20211227163121405](image-20211227163121405.png)

渲染方程就是在反射方程的基础上添加了物体发出的光线：

![image-20211227163421237](image-20211227163421237.png)







参考资料：

[0110君的学习笔记](https://zhuanlan.zhihu.com/p/139468429)
