---
title: Weekly Contest 280
date: 2022-02-13 18:54:12
categories:
  - LeetCode
tags:
  - LeetCode
---

## 1 - [2169. Count Operations to Obtain Zero](https://leetcode.com/problems/count-operations-to-obtain-zero/)

```python
class Solution:
    def countOperations(self, num1: int, num2: int) -> int:
        cnt = 0
        while num1 and num2:
            num1, num2 = max(num1, num2), min(num1, num2)
            num1 = num1 - num2
            cnt += 1
        return cnt
```

## 2 - [2170. Minimum Operations to Make the Array Alternating](https://leetcode.com/problems/minimum-operations-to-make-the-array-alternating/)

```python
class Solution:
    def minimumOperations(self, nums: List[int]) -> int:
        n = len(nums)
        if n <= 1: return 0
        if n == 2: return 1 if nums[0] == nums[1] else 0
        ctr0 = Counter(nums[i] for i in range(n) if i % 2 == 0)
        ctr1 = Counter(nums[i] for i in range(n) if i % 2 == 1)
        
        ans = 0
        mc0 = ctr0.most_common(2)
        mc1 = ctr1.most_common(2)
        # print(mc0, mc1)
        if mc0[0][0] != mc1[0][0]: ans = (n // 2 + n % 2 - mc0[0][1]) + (n // 2 - mc1[0][1])
        else:
            a = (n // 2 + n % 2 - (mc0[1][1] if len(mc0) >= 2 else 0)) + (n // 2 - mc1[0][1])
            b = (n // 2 + n % 2 - mc0[0][1]) + (n // 2 - (mc1[1][1] if len(mc1) >= 2 else 0))
            ans = min(a, b)
        return ans
```

这道题 WA 了两发，一次是 mc 可能只包含一个，另一个是对于 `2 2` 这种两个相同的。

## 3 - [2171. Removing Minimum Number of Magic Beans](https://leetcode.com/problems/removing-minimum-number-of-magic-beans/)

```python
class Solution:
    def minimumRemoval(self, beans: List[int]) -> int:
        beans.sort()
        n = len(beans)
        cur = sum(beans) - n * beans[0]
        ans = cur
        for i in range(1, n):
            cur = cur + beans[i-1] - (n - i) * (beans[i] - beans[i-1])
            ans = min(ans, cur)
            # print(cur, ans)
        return ans
```

找到上一个和下一个的关系就很简单。

## 4 - [2172. Maximum AND Sum of Array](https://leetcode.com/problems/maximum-and-sum-of-array/)

首先两个 TLE 的解法：

```python
class Solution:
    def maximumANDSum(self, nums: List[int], numSlots: int) -> int:
        n, m = len(nums), numSlots
        ans = 0
        
        slots = [0] * m
        place = [-1] * n
        def recur(idx):
            nonlocal ans
            if idx == n:
                cur = sum((place[i] + 1) & nums[i] for i in range(n))
                ans = max(ans, cur)
                # print(place, slots, cur)
                return
            myslots = [i for i in range(m) if slots[i] <= 1]
            for i in myslots:
                slots[i] += 1
                place[idx] = i
                recur(idx + 1)
                slots[i] -= 1
        
        recur(0)
        return ans


class Solution:
    def maximumANDSum(self, nums: List[int], numSlots: int) -> int:
        n, m = len(nums), numSlots
        ans = 0
        for x in range(numSlots ** n):
            ctr = Counter()
            for i in range(n):
                ctr[x // (m ** i) % m] += 1
            if len(ctr) >= 1 and ctr.most_common(1)[0][1] > 2: continue
            
            cur = 0
            for i, num in enumerate(nums):
                slot = (x // (m ** i) % m) + 1
                cur += num & slot
            # print(x, cur)
            ans = max(ans, cur)
        return ans
```

[灵神](https://leetcode-cn.com/problems/maximum-and-sum-of-array/solution/zhuang-tai-ya-suo-dp-by-endlesscheng-5eqn/)的状压 dp：

```python
class Solution:
    def maximumANDSum(self, nums: List[int], numSlots: int) -> int:
        f = [0] * (1 << (numSlots * 2))
        for i, fi in enumerate(f):
            c = i.bit_count()
            if c >= len(nums):
                continue
            for j in range(numSlots * 2):
                if (i & (1 << j)) == 0:
                    s = i | (1 << j)
                    f[s] = max(f[s], fi + ((j // 2 + 1) & nums[c]))
        return max(f)
```

9400ms 左右，有时候会 TLE……

抄大佬的匈牙利算法：

```python
import numpy as np
from scipy.optimize import linear_sum_assignment

class Solution:
    def maximumANDSum(self, nums: List[int], ns: int) -> int:
        nums, slots, mx = nums + [0] * (2 * ns - len(nums)), [*range(1, ns + 1)] * 2, np.zeros((ns * 2, ns * 2))
        for (i, x), (j, sn) in product(enumerate(nums), enumerate(slots)): mx[i, j] = x & sn
        row, col = linear_sum_assignment(-mx)
        return int(mx[row, col].sum())
```

只有 200~500ms 的样子，恐怖如斯。

最后再贴一个[蒙特卡洛大师 Master of Monte Carlo](https://leetcode.com/problems/maximum-and-sum-of-array/discuss/1766744/Python-Super-EASY-random-solution-(Just-for-fun))的做法：

```python
class Solution:
    def maximumANDSum(self, nums: List[int], numSlots: int) -> int:
        ans = 0
        for i in range(1000): # guess enough times
            random.shuffle(nums) # try different orders randomly
            cur = 0
            counter = defaultdict(int)
            for n in nums:
                j = 0
                for i in range(1, numSlots+1):
                    if counter[i] < 2 and n & i > n & j: # Greedy
                        j = i
                counter[j] += 1
                cur += n & j
            ans = max(ans, cur)
    
        return ans    
```

……