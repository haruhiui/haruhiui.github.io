---
title: Binary Exponentiation 
date: 2021-12-26 23:01:03
categories: 
  - Data Structures and Algorithms
tags: 
  - Data Structures and Algorithms
  - Binary Exponentiation 
---

# Binary Exponentiation

Binary Exponentiation 快速幂算法，或者叫二进制取幂。

LeetCode 模板题：[50. Pow(x, n)](https://leetcode-cn.com/problems/powx-n/)

递归版：

```python bi-exp-recur.py
class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0: return 1 / self.myPow(x, -n)
        if n == 0: return 1
        if n == 1: return x
        return self.myPow(x * x, n // 2) * (x if n % 2 == 1 else 1)
```

迭代版：

```python bi-exp-iter-1.py
class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0: return 1 / self.myPow(x, -n)
        ans = 1
        while n:
            ans *= x if n % 2 == 1 else 1
            n //= 2
            x *= x
        return ans
```

实现非常简单。

最近经常用这样的语句：`A = expr and B or C`，表达在是否满足条件时把不同的值赋给 A。如果把上面的第六行替换成：`ans *= n % 2 == 1 and x or 1` 也会通过全部测试(2021/12/17 共 304 个测试用例)，但是其实是错的，当输入是 0 和 1 时，结果应该是 0 但是输出是 1。这就是因为 `n % 2 == 1 and x or 1` 的结果，当 `x == 0` 是不管怎样都是 `1`。

顺手写成了利用短路的形式，没想到还发现了一个 missing text case。已提交 issue。

这个故事告诉我们少用 `A = expr and B or C` 这种句式……
