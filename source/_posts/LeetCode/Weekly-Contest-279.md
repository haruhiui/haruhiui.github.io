---
title: Weekly Contest 279
date: 2022-02-06 12:26:45
categories:
  - LeetCode
tags:
  - LeetCode
---

## 1 - [2164. Sort Even and Odd Indices Independently](https://leetcode.com/problems/sort-even-and-odd-indices-independently/)

```python
class Solution:
    def sortEvenOdd(self, nums: List[int]) -> List[int]:
        n1 = sorted(nums[::2])
        n2 = sorted(nums[1::2], reverse=True)
        ans = []
        for i in range(len(nums)):
            ans.append(n1[i//2] if i % 2 == 0 else n2[i//2])
        return ans
```

## 2 - [2165. Smallest Value of the Rearranged Number](https://leetcode.com/problems/smallest-value-of-the-rearranged-number/)

```python
class Solution:
    def smallestNumber(self, num: int) -> int:
        ctr = Counter(str(num) if num > 0 else str(-num))
        items = [[int(x), y] for x, y in ctr.items()]
        items.sort()
        ans = 0
        
        if num > 0:
            i = 0
            while i < len(items) and items[i][0] == 0: i += 1
            ans = items[i][0] * (10 ** (sum(y for x, y in items[:i])))
            items[i][1] -= 1
            while i < len(items):
                while items[i][1] > 0:
                    ans = ans * 10 + items[i][0]
                    items[i][1] -= 1
                i += 1
        else:
            items = items[::-1]
            i = 0
            while i < len(items):
                while items[i][1] > 0:
                    ans = ans * 10 + items[i][0]
                    items[i][1] -= 1
                i += 1
            ans = -ans
        return ans
```

感觉这道题作为第二题有点烦。

## 3 - [2166. Design Bitset](https://leetcode.com/problems/design-bitset/)

```python
class Bitset:

    def __init__(self, size: int):
        self.flipmask = (1 << size) - 1
        self.cnt = 0
        self.size = size
        self.bits = 0

    def fix(self, idx: int) -> None:
        if not self.bits & (1 << self.size - 1 - idx): self.cnt += 1
        self.bits = self.bits | (1 << (self.size - 1 - idx))

    def unfix(self, idx: int) -> None:
        if self.bits & (1 << (self.size - 1 - idx)): self.cnt -= 1
        self.bits = self.bits & (self.flipmask ^ (1 << (self.size - 1 - idx)))

    def flip(self) -> None:
        self.cnt = self.size - self.cnt
        self.bits = self.bits ^ self.flipmask

    def all(self) -> bool:
        return self.bits == self.flipmask

    def one(self) -> bool:
        return self.bits != 0

    def count(self) -> int:
        return self.cnt

    def toString(self) -> str:
        s = bin(self.bits)[2:] if self.bits > 0 else bin(self.bits)[3:]
        return "0" * (self.size - len(s)) + s


# Your Bitset object will be instantiated and called as such:
# obj = Bitset(size)
# obj.fix(idx)
# obj.unfix(idx)
# obj.flip()
# param_4 = obj.all()
# param_5 = obj.one()
# param_6 = obj.count()
# param_7 = obj.toString()
```

要确保所有操作都接近 O(1)，不然肯定会 TLE。重点是 cnt 和 flipmask 这两个变量。

## 4 - [2167. Minimum Time to Remove All Cars Containing Illegal Goods](https://leetcode.com/problems/minimum-time-to-remove-all-cars-containing-illegal-goods/)

求最小的移除所有有违规货物的车的代价。可以从头部或者尾部移除一辆车，代价是 1，也可以从中间移除任意一辆车，代价是 2。

```python
class Solution:
    def minimumTime(self, s: str) -> int:
        n = len(s)
        pre = [0] * (n + 2)
        suf = [0] * (n + 2)
        for i in range(n):
            pre[i + 1] = pre[i] if s[i] == '0' else min(pre[i] + 2, i + 1)
        pre[n + 1] = pre[n]
        for i in range(n - 1, -1, -1):
            suf[i + 1] = suf[i + 2] if s[i] == '0' else min(suf[i + 2] + 2, n - i)
        suf[0] = suf[1]
        return min(pre[i] + suf[i+1] for i in range(n + 1))
```

前后缀分解 + DP，和昨天双周赛的第四题有点相似。pre 和 suf 的前后都空出来一个表示不选的。

参考自 [前后缀分解 + DP](https://leetcode-cn.com/problems/minimum-time-to-remove-all-cars-containing-illegal-goods/solution/qian-hou-zhui-fen-jie-dp-by-endlesscheng-6u1b/)

```python
class Solution:
    def minimumTime(self, s):
        left, res, n = 0, len(s), len(s)
        for i,c in enumerate(s):
            left = min(left + (c == '1') * 2, i + 1)
            res = min(res, left + n - 1 - i)
        return res
```

参考自 [[Java/C++/Python] One-Pass, O(1) Space](https://leetcode.com/problems/minimum-time-to-remove-all-cars-containing-illegal-goods/discuss/1748704/JavaC%2B%2BPython-One-Pass-O(1)-Space)

emmm……佩服到五体投地。
