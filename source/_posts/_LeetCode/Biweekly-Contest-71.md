---
title: Biweekly Contest 71
date: 2022-02-06 08:56:45
categories:
  - LeetCode
tags:
  - LeetCode
---

## 1 - [2160. Minimum Sum of Four Digit Number After Splitting Digits](https://leetcode.com/problems/minimum-sum-of-four-digit-number-after-splitting-digits/)

```python
class Solution:
    def minimumSum(self, num: int) -> int:
        digits = [num // 1000 % 10, num // 100 % 10, num // 10 % 10, num % 10]
        ans = float("inf")
        for i in range(4):
            for j in range(i + 1, 4):
                ans = min(ans, sum(digits) - digits[i] - digits[j] + digits[i] * 10 + digits[j] * 10)
        return ans
```

```python
class Solution:
    def minimumSum(self, num: int) -> int:
        num = sorted(str(num))
        return int(num[0]) * 10 + int(num[1]) * 10 + int(num[2]) + int(num[3])
```

## 2 - [2161. Partition Array According to Given Pivot](https://leetcode.com/problems/partition-array-according-to-given-pivot/)

```python
class Solution:
    def pivotArray(self, nums: List[int], pivot: int) -> List[int]:
        less, equal, greater = [], [], []
        for x in nums:
            if x < pivot:
                less.append(x)
            elif x == pivot:
                equal.append(x)
            else:
                greater.append(x)
        return less + equal + greater
```

## 3 - [2162. Minimum Cost to Set Cooking Time](https://leetcode.com/problems/minimum-cost-to-set-cooking-time/)

```python
class Solution:
    def minCostSetTime(self, startAt: int, moveCost: int, pushCost: int, targetSeconds: int) -> int:
        x, y = targetSeconds // 60, targetSeconds % 60
        if x == 100: x -= 1; y += 60
        
        def pushTo(num):
            curPos = startAt
            curCost = 0
            for c in str(num):
                c = int(c)
                if curPos != c:
                    curCost += moveCost
                curPos = c
                curCost += pushCost
            return curCost
        
        ans = pushTo(x * 100 + y)
        if 0 <= y <= 39 and 1 <= x <= 99:
            ans = min(ans, pushTo((x - 1) * 100 + y + 60))
        return ans
```

一开始以为是每位单独设置的那种，看了半天原来是数字键盘那种。

要注意分钟等于 100 的时候。

## 4 - [2163. Minimum Difference in Sums After Removal of Elements](https://leetcode.com/problems/minimum-difference-in-sums-after-removal-of-elements/)

```python
from heapq import *

class Solution:
    def minimumDifference(self, nums: List[int]) -> int:
        n = len(nums) // 3
        
        max_heap = list(map(lambda x: -x, nums[:n]))
        heapify(max_heap)
        max_values = [0] * (n + 1)
        max_values[0] = -sum(max_heap)
        for i in range(n):
            if nums[n+i] < -max_heap[0]:
                max_values[i+1] = max_values[i] + heappop(max_heap) + nums[n+i]
                heappush(max_heap, -nums[n+i])
            else:
                max_values[i+1] = max_values[i]
        
        min_heap = nums[2*n:]
        heapify(min_heap)
        min_values = [0] * (n + 1)
        min_values[0] = sum(min_heap)
        for i in range(n):
            if nums[2*n-1-i] > min_heap[0]:
                min_values[i+1] = min_values[i] - heappop(min_heap) + nums[2*n-1-i]
                heappush(min_heap, nums[2*n-1-i])
            else:
                min_values[i+1] = min_values[i]
                
        return min(x - y for x, y in zip(max_values, min_values[::-1]))
            
# nums[0:n], nums[n:2*n], num[2*n:3*n]
```

长度为 3n 的数组，移除 n 个数之后分为前 n 个和后 n 个，求最小的前 n 个和与后 n 个和的差。

简单来说就是暴力。