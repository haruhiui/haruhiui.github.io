---
title: Weekly Contest 272
date: 2021-12-19 14:40:32
categories: 
  - LeetCode
tags: 
  - LeetCode 
---

# Weekly Contest 272 

## 1 - [2108. Find First Palindromic String in the Array](https://leetcode.com/problems/find-first-palindromic-string-in-the-array/)

```python lc2108-1.py
class Solution:
    def firstPalindrome(self, words: List[str]) -> str:
        for word in words:
            if word == word[::-1]: return word
        return ""
```

## 2 - [2109. Adding Spaces to a String](https://leetcode.com/problems/adding-spaces-to-a-string/)

```python lc2109-1.py
class Solution:
    def addSpaces(self, s: str, spaces: List[int]) -> str:
        news = s[:spaces[0]]
        for i in range(1, len(spaces)):
            news += " " + s[spaces[i-1]: spaces[i]]
        news += " " + s[spaces[-1]:]
        return news
```

比赛时要是写成 `news = news + " " + s[spaces[i-1]: spaces[i]]` 有可能会 TLE ，别问我怎么知道的。

## 3 - [2110. Number of Smooth Descent Periods of a Stock](https://leetcode.com/problems/number-of-smooth-descent-periods-of-a-stock/)

```python lc2110-1.py
class Solution:
    def getDescentPeriods(self, prices: List[int]) -> int:
        n = len(prices)
        dp = [1] * n
        for i in range(1, n):
            if prices[i] == prices[i - 1] - 1:
                dp[i] = dp[i - 1] + 1
        return sum(dp)
```

## 4 - [2111. Minimum Operations to Make the Array K-Increasing](https://leetcode.com/problems/minimum-operations-to-make-the-array-k-increasing/)

```python lc2111-1.py
class Solution:
    def kIncreasing(self, arr: List[int], k: int) -> int:
        n, ans = len(arr), 0
        
        for off in range(k):
            m, tailsLen = (n - off + k - 1) // k, 0
            tails = [0] * m
            
            for i in range(m):
                num = arr[off + i * k]
                pos = bisect_right(tails, num, 0, tailsLen)
                tails[pos] = num
                if pos == tailsLen: tailsLen += 1
            
            ans += m - tailsLen
        return ans
```

要注意改变最少个数个，既可以增加一个数也可以减小一个数，所以要求出一个最长的非递减子序列，用序列长度减去这个最长非递减子序列长度，得到的就是最少要改变的个数。

LIS 最长递增子序列长度问题，可以参考模板题 [LeetCode 300](https://leetcode.com/problems/longest-increasing-subsequence/)。

LIS 长度问题有两种解法，一种是 DP，另一种还是 DP，不过第二种是用二分查找优化过的。第一种时间复杂度 `O(N^2)` ，第二种时间复杂度 `O(NlogN)` 。上面用的是第二种加二分的。

考虑到数据范围是 `1e5` ，所以用 `O(N^2)` 的解法肯定会 TLE。下面放一个用第一种方法 TLE 的：

```python lc2111-2.py
class Solution:
    def kIncreasing(self, arr: List[int], k: int) -> int:
        n, ans = len(arr), 0
        
        for off in range(k):
            m = (n - off + k - 1) // k
            dp = [1] * m
            
            for i in range(m):
                for j in range(i):
                    if arr[off + j * k] <= arr[off + i * k]:
                        dp[i] = max(dp[i], dp[j] + 1)

            ans += m - max(dp)
        return ans
```

还是基础不足，当时这题想到了 LIS 却不知道怎么 LIS 长度怎么算，还是现学的方法才 ak ……

!!今年只剩不到两个星期可活了。!!
