---
title: Python Basics
date: 2021-12-26 21:48:57
math: true 
categories: 
  - Programming Languages
  - Python
tags: 
  - Programming Languages
  - Python
---

# 命名空间和作用域

[Python3 命名空间和作用域](https://www.runoob.com/python3/python3-namespace-scope.html)

一般有三种命名空间：

- **内置名称（built-in names）**， Python 语言内置的名称，比如函数名 abs、char 和异常名称 BaseException、Exception 等等。
- **全局名称（global names）**，模块中定义的名称，记录了模块的变量，包括函数、类、其它导入的模块、模块级的变量和常量。
- **局部名称（local names）**，函数中定义的名称，记录了函数的变量，包括函数的参数和局部定义的变量。（类中定义的也是）

有四种作用域：

- **L（Local）**：最内层，包含局部变量，比如一个函数/方法内部。
- **E（Enclosing）**：包含了非局部(non-local)也非全局(non-global)的变量。比如两个嵌套函数，一个函数（或类） A 里面又包含了一个函数 B ，那么对于 B 中的名称来说 A 中的作用域就为 nonlocal。
- **G（Global）**：当前脚本的最外层，比如当前模块的全局变量。
- **B（Built-in）**： 包含了内建的变量/关键字等，最后被搜索。

顺序规则： **L –> E –> G –> B**。

