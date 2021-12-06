---
title: Other 
date: 2021-12-02 18:51:08
categories: 
  - Data Structures and Algorithms
tags: 
  - Data Structures and Algorithms
  - Other 
---

## 博弈论

### [292. Nim 游戏](https://leetcode-cn.com/problems/nim-game/)

只要 n 不能被 4 整除即可。

```python lc292-1.py
class Solution:
    def canWinNim(self, n: int) -> bool:
        return n % 4 != 0 
```

### [810. 黑板异或游戏](https://leetcode-cn.com/problems/chalkboard-xor-game/)

> 说到异或我想到之前面试时面试官问的一道题，这里顺便说一下：一个数组里只有一个数字单独出现了一次，其他数字都出现了两次，如何找出这个数字。
> 对一个数异或偶数次结果都是0，所以把这个数组所有元素进行异或的结果就是单独的数字。
> 那么如果这个数组有两个不同的、只出现了一次的数字，该怎么找出来？
> ……不知道。
> 之后面试官说可以先异或所有元素的到一个数字，这个数字含有 1 的位表示要找的两个数在这一位上不同。所以就可以把数组按照这一位上是否是 1 来分成两部分，这两部分一定各包含一个要找的数。

感谢 [宫水三叶](https://leetcode-cn.com/problems/chalkboard-xor-game/solution/gong-shui-san-xie-noxiang-xin-ke-xue-xi-ges7k/) 大佬的讲解：如果序列 nums 本身异或和为 00，天然符合「先手必胜态」的条件，答案返回 True ；如果序列 nums 异或和不为 00，但序列长度为偶数，那么最终会出现「后手必败态」，推导出先手必胜，答案返回 True。

```python lc810-1.py
class Solution:
    def xorGame(self, nums: List[int]) -> bool:
        return len(nums) % 2 == 0 or reduce(xor, nums) == 0 
```

### [877. 石子游戏](https://leetcode-cn.com/problems/stone-game/)

仍然感谢 [宫水三叶](https://leetcode-cn.com/problems/stone-game/solution/gong-shui-san-xie-jing-dian-qu-jian-dp-j-wn31/) 大佬的解答。

解法一放到 dp 里也可以。

```python lc877-1.py
class Solution:
    def stoneGame(self, piles: List[int]) -> bool:
        n = len(piles) 
        dp = [[0] * (n + 1) for _ in range(n + 1)] 
        for l in range(1, n + 1): 
            for s in range(n): 
                if s + l < n + 1: 
                    a = piles[s] - dp[s + 1][s + l] 
                    b = piles[s + l - 1] - dp[s][s + l - 1] 
                    dp[s][s + l] = max(a, b) 
        return dp[0][n] > 0 
```

```python lc877-2.py 
class Solution:
    def stoneGame(self, piles: List[int]) -> bool:
        return True 
```

先手：这个游戏，我有必胜法。





