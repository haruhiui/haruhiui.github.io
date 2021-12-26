---
title: Length of LIS 
date: 2021-12-20 23:45:40
categories: 
  - Data Structures and Algorithms
tags: 
  - Data Structures and Algorithms
  - Length of LIS
---

# Length of LIS 

LIS: Longest Increasing Subsequence 最长递增子序列。Length of LIS 就是求一个数组中最长子序列的长度。

LeetCode 模板题：[300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)

总的来说，有两种方法，一种是 DP，另一种还是 DP。

第一种 DP：

```python len-LIS-1.py
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        if not nums: return 0
        n = len(nums)
        dp = [0] * n # dp[i]: length of LIS for nums[:i+1]
        for i in range(n):
            for j in range(i):
                if nums[j] < nums[i]: # <= if not strictly increasing
                    dp[i] = max(dp[i], dp[j] + 1)
        return max(dp)
```

更加精简的写法：

```python len-LIS-2.py
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        if not nums: return 0
        n = len(nums)
        dp = [1] * n # dp[i]: length of LIS for nums[:i+1]
        for i in range(1, n):
            dp[i] = max(dp[j] + 1 if nums[i] > nums[j] else 1 for j in range(i))
        return max(dp)
```

暴力 DP 的时间和空间复杂度分别是 `O(N^2)` 和 `O(N)`。

第二种 DP，是带二分的 DP：

```python len-LIS-3.py
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        n, ans = len(nums), 0
        tails = [0] * n # tails[i]: last number of LIS whose length is i + 1
        for num in nums:
            low, high = 0, ans # bisect num in tails[low: high]
            while low < high:
                mid = (low + high) // 2
                if tails[mid] < num: low = mid + 1 # <= if not strictly increasing
                else: high = mid
            tails[low] = num
            if low == ans: ans += 1
        return ans
```

使用 bisect 模块：

```python len-LIS-4.py
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        n, tailsLen = len(nums), 0
        tails = [0] * n # tails[i]: last number of LIS whose length is i + 1
        for num in nums:
            pos = bisect_left(tails, num, 0, tailsLen) # bisect_right if not strictly increasing
            tails[pos] = num
            if pos == tailsLen: tailsLen += 1
        return tailsLen
```

带二分的 DP 的时间复杂度和空间复杂度分别是 `O(NlogN)` 和 `O(N)`。

只是添加一个二分，时间上就进步了差不多 1e2，恐怖如斯。