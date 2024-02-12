---
title: Cloth
date: 2021-12-03 22:39:38
math: true 
categories: 
  - Computer Graphics 
  - Simulation
tags: 
  - Computer Graphics 
  - Simulation
  - Cloth 
typora-root-url: Cloth 
---

布料

## Physics-Based Cloth Simulation 

### A Mass-Spring System 

单个弹簧模型：

![image-20211203225654688](image-20211203225654688.png)

还有多个弹簧的，也差不多，在连接点把能量或力求个和就行。

Structured Spring Networks: 

* Horizonal and Vertical 水平和竖直的弹簧：横向纵向的形变。

* Diagonal 对角线上的弹簧：防止沿着对角线拉伸。可以简化。

* Bending 跨越一个点的弹簧：防止沿着某个方向弯曲。

Unstructured Spring Networks: 

* Edges：边。

* Bending：对每个边都可以有，用来抵抗弯曲。

Topological Construction 从顶点数据和索引数据中构造弹簧：

* Edges：构造 triple list: {(p1, p2, t1), (p1, p3, t1), (p2, p3, t1), ... }，之后排序，两个三角形共用的边会相邻，只要排除掉相邻的边就能得到 Edges 弹簧。

* Bending：从 triple list 重复的边中得到三角形剩下的点连起来。

Explicit Integration 

![image-20211203232024703](image-20211203232024703.png)

只需要把弹簧的力的计算过程加入到点系统的力的计算过程中即可。上图一个不准确的地方是应该先把所有的 fi 计算出来保存，之后再遍历顶点进行操作。

显示积分可能产生 overshooting，弹簧的劲度系数过大。

Implicit Integration 



### Bending and Locking Issues 





### A Co-Rotational Method 





