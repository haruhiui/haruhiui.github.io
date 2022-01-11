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

[300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)

总的来说，有两种方法，一种是 DP，另一种还是 DP。

第一种 DP：

```python len-LIS-1.py
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        n = len(nums)
        dp = [1] * n
        for i in range(n):
            for j in range(i):
                if nums[i] > nums[j]:
                    dp[i] = max(dp[i], dp[j] + 1)
        return max(dp)
```

更加精简的写法：

```python len-LIS-2.py
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        n = len(nums)
        dp = [1] * n
        for i in range(n):
            dp[i] = max(dp[j] + 1 if nums[i] > nums[j] else dp[i] for j in range(i + 1))
        return max(dp)
```

暴力 DP 的时间和空间复杂度分别是 `O(N^2)` 和 `O(N)`。

第二种 DP，是带二分的 DP：

```python len-LIS-3.py
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        n = len(nums)
        tails = [] # tails[i]: last number of LIS whose length is i + 1
        for i in range(n):
            low, high = 0, len(tails) # bisect num in tails[low: high]
            while low < high:
                mid = (low + high) // 2
                if tails[mid] < nums[i]: low = mid + 1
                else: high = mid
            if low == len(tails): tails.append(nums[i])
            else: tails[low] = nums[i]
        return len(tails)
```

使用 bisect 模块：

```python len-LIS-4.py
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        n = len(nums)
        tails = []
        for i in range(n):
            pos = bisect_left(tails, nums[i])
            if pos == len(tails): tails.append(nums[i])
            else: tails[pos] = nums[i]
        return len(tails)
```

带二分的 DP 的时间复杂度和空间复杂度分别是 `O(NlogN)` 和 `O(N)`。

只是添加一个二分，时间上就进步了差不多 1e2，恐怖如斯。

# 练习题

## [1964. Find the Longest Valid Obstacle Course at Each Position](https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position/)

既然数据范围是 1e5，那么 n^2 的算法肯定会超时的。

```python
class Solution:
    def longestObstacleCourseAtEachPosition(self, obstacles: List[int]) -> List[int]:
        n = len(obstacles)
        ans = [1] * n
        for i in range(n):
            for j in range(i):
                if obstacles[i] >= obstacles[j]:
                    ans[i] = max(ans[i], ans[j] + 1)
        return ans
```

要知道算法中定义的 tails 的意义是长度为多少的 LIS 的最后一个数字。二分找到的 pos + 1 就表示以当前这个数为结尾的情况下 LIS 的长度。

```python
class Solution:
    def longestObstacleCourseAtEachPosition(self, obstacles: List[int]) -> List[int]:
        tails, ans = [], []
        for a in obstacles:
            pos = bisect_right(tails, a)
            if pos == len(tails): tails.append(a)
            else: tails[pos] = a
            ans.append(pos + 1)
        return ans
```

## [2111. Minimum Operations to Make the Array K-Increasing](https://leetcode.com/problems/minimum-operations-to-make-the-array-k-increasing/)

```python
class Solution:
    def kIncreasing(self, arr: List[int], k: int) -> int:
        ans = 0
        for i in range(k):
            tails = []
            for x in arr[i::k]:
                j = bisect_right(tails, x)
                if j == len(tails): tails.append(x)
                else: tails[j] = x
            ans += len(arr[i::k]) - len(tails)
        return ans
```

## [1713. Minimum Operations to Make a Subsequence](https://leetcode.com/problems/minimum-operations-to-make-a-subsequence/)

这道题乍一看可能和 LIS 没什么关系。实际上要想找插入的最少次数，就可以找在 arr 中的 target 的最长的子序列，从而转到在 arr 中的 target 数组的下标的 LIS ……

```python
class Solution:
    def minOperations(self, target: List[int], arr: List[int]) -> int:
        m, n = len(target), len(arr)
        mapping = {num: i for i, num in enumerate(target)}
        nums = [mapping[x] for x in arr if x in mapping]
        
        tails = []
        for x in nums:
            pos = bisect_left(tails, x)
            if pos == len(tails): tails.append(x)
            tails[pos] = x
            
        return m - len(tails)
```

## [354. Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)

这道题乍一看是二维问题，是不是要用什么高深的二维技巧呢。实际上我们对第一维进行排序，不就只剩下一个维度要处理了嘛hhhh……

```python
class Solution:
    def maxEnvelopes(self, envelopes: List[List[int]]) -> int:
        n = len(envelopes)
        envelopes.sort(key=lambda x: (x[0], -x[1]))
        tails = []
        for w, h in envelopes:
            pos = bisect_left(tails, h)
            if pos == len(tails): tails.append(h)
            else: tails[pos] = h
        return len(tails)
```

至于为什么要对第二个维度进行从大到小的排序而不是从小到大排序，只是为了防止找的 LIS 中出现同一个宽度的。

