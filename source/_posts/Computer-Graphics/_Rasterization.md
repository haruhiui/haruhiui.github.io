---
title: Rasterization
date: 2021-12-04 14:36:19
math: true 
categories: 
  - Computer Graphics 
tags: 
  - Computer Graphics 
  - Rasterization
typora-root-url: Rasterization
---

**本文不保证完全正确。**

**本文还在编写中。**



Rasterization 光栅化

## Sampling 采样

![image-20211204151512538](image-20211204151512538.png)

当点在边界上时，要么不做处理，要么特殊处理。

### Bounding Box

采样时没有必要对所有的像素进行计算，可以使用一个 Bounding Box 来把三角形围起来，然后只在这个范围里面进行计算。



## Antialiasing

如果采样频率比信号变化频率低，可能产生很多副作用，如锯齿、摩尔纹（空间上采样）、车轮效应（时间上采样）等。

模糊后再采样：边缘一定范围的像素会变成对应模糊后的颜色。先采样再模糊的效果是错误的。

Filtering：滤波，去掉特定频率。

傅里叶变换：从时域变到频域。可以看到在不同的频率是什么样的，频谱。

图像的边界表示高频部分，变化缓慢的地方表示低频部分。

Filtering = Convolution = Averaging 

Convolution Theorem：两个信号时域的卷积等于这两个信号频域的乘积。一个 3x3 的都是 1 的滤波器主要都是低频信号，是过滤低频信号的低通滤波器。

Sampling = Repeating Frequency Contents 采样就是重复频域上的内容。走样就是重复的内容相互叠加了。

反走样：

1. 增加采样频率。
2. 反走样：先把信号高频信息拿掉再采样。

### MSAA (Antialiasing by Supersampling)

对一个像素采样时把它划分为多个小像素，得到小像素的值后再平均。

并没有提高分辨率，只是近似计算了三角形在每个像素覆盖率。

FXAA：在图象层面上操作，把锯齿换成没有锯齿的。

TAA：复用上一帧的在这一帧上。

super resolution / super sampling：超采样，从低分辨率得到高分辨率，概念不同但是本质相同。可以用 DLSS。

