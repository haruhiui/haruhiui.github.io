---
title: Weekly Contest 276
date: 2022-01-16 21:07:50
categories:
  - LeetCode
tags:
  - LeetCode
---

# 1 - [2138. Divide a String Into Groups of Size k](https://leetcode.com/problems/divide-a-string-into-groups-of-size-k/)

```python
class Solution:
    def divideString(self, s: str, k: int, fill: str) -> List[str]:
        n = len(s)
        ans = []
        for i in range(n // k + 1):
            ans.append(s[i*k:(i+1)*k])
        if len(ans[-1]) == 0:
            ans.pop()
        if len(ans[-1]) != k:
            ans[-1] = ans[-1] + fill * (k - len(ans[-1]))
        return ans
```

# 2 - [2139. Minimum Moves to Reach Target Score](https://leetcode.com/problems/minimum-moves-to-reach-target-score/)

```python
class Solution:
    def minMoves(self, target: int, maxDoubles: int) -> int:
        inc = 0
        dou = 0
        while target != 1:
            if target % 2 == 1:
                inc += 1
                target -= 1
            else:
                if dou < maxDoubles:
                    dou += 1
                    target //= 2
                else:
                    inc += target - 1
                    target = 1
        return inc + dou
```





# 3 - [2140. Solving Questions With Brainpower](https://leetcode.com/problems/solving-questions-with-brainpower/)

一个错误的写法：

```python
class Solution:
    def mostPoints(self, questions: List[List[int]]) -> int:
        n = len(questions)
        ans = 0
        dp = [0] * n
        for i, (p, b) in enumerate(questions):
            ans = max(ans, dp[i] + p)
            dp[i] = ans
            if i + b + 1 < n:
                dp[i + b + 1] = max(dp[i + b + 1], ans)
        return ans
```

写法一：

```python
class Solution:
    def mostPoints(self, questions: List[List[int]]) -> int:
        n = len(questions)
        dp = [0] * (n + 1)
        for i in range(n - 1, -1, -1):
            p, b = questions[i]
            j = i + b + 1
            dp[i] = max(dp[i + 1], p + (dp[j] if j < n else 0))
        return dp[0]
```

写法二：

```python
class Solution:
    def mostPoints(self, questions: List[List[int]]) -> int:
        n = len(questions)
        dp = [0] * (n + 1)
        for i, (p, b) in enumerate(questions):
            dp[i + 1] = max(dp[i + 1], dp[i])
            j = min(i + b + 1, n)
            dp[j] = max(dp[j], dp[i] + p)
        return dp[n]
```

参考链接：[两种 DP 做法：倒序填表 / 正序刷表](https://leetcode-cn.com/problems/solving-questions-with-brainpower/solution/dao-xu-dp-by-endlesscheng-2qkc/)

# 4 - [2141. Maximum Running Time of N Computers](https://leetcode.com/problems/maximum-running-time-of-n-computers/)

写法一：

```python
class Solution:
    def maxRunTime(self, n: int, batteries: List[int]) -> int:
        l, r = 0, sum(batteries) // n
        while l < r:
            x = (l + r + 1) // 2
            if n * x <= sum(min(b, x) for b in batteries): l = x
            else: r = x - 1
        return l
```

```python
class Solution:
    def maxRunTime(self, n: int, batteries: List[int]) -> int:
        batteries.sort(reverse=True)
        s = sum(batteries)
        for b in batteries:
            if b <= s // n: return s // n
            s -= b
            n -= 1
```

参考链接：[两种做法：二分答案 / 排序+贪心（附详细证明）](https://leetcode-cn.com/problems/maximum-running-time-of-n-computers/solution/liang-chong-jie-fa-er-fen-da-an-pai-xu-t-grd8/)

[灵茶山艾府](https://leetcode-cn.com/u/endlesscheng/)大佬真是太牛了。没想到也是浙大的。

这次周赛可以说是今年最糟糕的，足以载入黑历史了……加班到没时间刷题，爷累了。

