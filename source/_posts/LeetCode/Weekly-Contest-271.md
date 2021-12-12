---
title: Weekly Contest 271
date: 2021-12-12 13:45:16
categories: 
  - LeetCode
tags: 
  - LeetCode 
---

# Weekly Contest 271 (2021/12/12)

## 1 - [2103. Rings and Rods](https://leetcode.com/problems/rings-and-rods/)

```python
class Solution:
    def countPoints(self, rings: str) -> int:
        n = len(rings) // 2
        d = defaultdict(set)
        for i in range(n):
            d[rings[2*i+1]].add(rings[2*i])
        
        ans = 0
        for k, v in d.items():
            if len(v) == 3:
                ans += 1
        return ans
```

## 2 - [2104. Sum of Subarray Ranges](https://leetcode.com/problems/sum-of-subarray-ranges/)

```python
class Solution:
    def subArrayRanges(self, nums: List[int]) -> int:
        n = len(nums)
        minMat = [[0] * n for _ in range(n)]
        maxMat = [[0] * n for _ in range(n)]
        for i in range(n):
            minMat[i][i] = nums[i]
            maxMat[i][i] = nums[i]
            
        ans = 0
        for length in range(2, n+1):
            for start in range(0, n-length+1):
                end = start + length - 1
                minMat[start][end] = min(minMat[start][end-1], nums[end])
                maxMat[start][end] = max(maxMat[start][end-1], nums[end])
                ans += maxMat[start][end] - minMat[start][end]
        return ans
```

O(n^2) 的算法，听说还有 O(n) 的算法。

## 3 - [2105. Watering Plants II](https://leetcode.com/problems/watering-plants-ii/)

```python
class Solution:
    def minimumRefill(self, plants: List[int], capacityA: int, capacityB: int) -> int:
        n = len(plants)
        canA, canB = capacityA, capacityB
        iA, iB = 0, n-1
        ans = 0
        while iA < iB:
            if canA < plants[iA]: canA = capacityA; ans += 1
            if canB < plants[iB]: canB = capacityB; ans += 1
            canA -= plants[iA]; canB -= plants[iB]
            iA += 1; iB -= 1
        if iA == iB:
            if max(canA, canB) < plants[iA]: ans += 1
            
        return ans
```

单纯的模拟。

## 4 - [2106. Maximum Fruits Harvested After at Most K Steps](https://leetcode.com/problems/maximum-fruits-harvested-after-at-most-k-steps/)

```python
class Solution:
    def maxTotalFruits(self, fruits: List[List[int]], startPos: int, k: int) -> int:
        d = Counter();r = 1;left = Counter();right = Counter()
        for i,j in fruits:  d[i] = j
        ans = d[startPos]

        for i in range(startPos+1,startPos+k+1):
            right[i-startPos] = right[i-1-startPos] + d[i]
            
        for i in range(startPos - 1,startPos-k-2,-1):
            left[r] = left[r-1] + d[i];r+=1
            
        for i in range(1,k+1):
            ans = max(ans,max(right[i] + left[k - 2*i],left[i] + right[k - 2*i]) + d[startPos])
            
        return ans
```

是这样想的，就是没写出来。


