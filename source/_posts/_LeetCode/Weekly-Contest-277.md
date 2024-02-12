---
title: Weekly Contest 277
date: 2022-01-23 13:56:15
categories:
  - LeetCode
tags:
  - LeetCode
---

# 1 - [2148. Count Elements With Strictly Smaller and Greater Elements](https://leetcode.com/problems/count-elements-with-strictly-smaller-and-greater-elements/)

```python
class Solution:
    def countElements(self, nums: List[int]) -> int:
        return sum(1 for x in nums if x != min(nums) and x != max(nums))
```

# 2 - [2149. Rearrange Array Elements by Sign](https://leetcode.com/problems/rearrange-array-elements-by-sign/)

```python
class Solution:
    def rearrangeArray(self, nums: List[int]) -> List[int]:
        pos = [x for x in nums if x > 0]
        neg = [x for x in nums if x < 0]
        ans = []
        for x in zip(pos, neg):
            ans.extend(x)
        return ans
```

# 3 - [2150. Find All Lonely Numbers in the Array](https://leetcode.com/problems/find-all-lonely-numbers-in-the-array/)

```python
class Solution:
    def findLonely(self, nums: List[int]) -> List[int]:
        ctr = Counter(nums)
        ans = []
        for k, v in ctr.items():
            if v == 1 and not ctr[k-1] and not ctr[k+1]:
                ans.append(k)
        return ans
```

# 4 - [2151. Maximum Good People Based on Statements](https://leetcode.com/problems/maximum-good-people-based-on-statements/)

鉴于数据范围，可以考虑直接暴力。

```python
class Solution:
    def maximumGood(self, statements: List[List[int]]) -> int:
        n = len(statements)
        ans = 0
        for s in range(2 ** n):
            state = [(s >> i) & 1 for i in range(n)]
            if all(state[i] == 0 or all(statements[i][j] == 2 or state[j] == statements[i][j] for j in range(n)) for i in range(n)):
                ans = max(ans, sum(state))
        return ans
```

也可以 DFS。

```python
class Solution:
    def maximumGood(self, smts: List[List[int]]) -> int:
        n, ans = len(smts), 0
        def valid(cur):
            return all(cur[i] == 0 or all(smts[i][j] == 2 or smts[i][j] == cur[j] for j in range(n)) for i in range(n))
        def dfs(cur, i, cnt):
            nonlocal ans
            if i == n:
                if valid(cur):
                    ans = max(ans, cnt)
                return
            cur.append(0)
            dfs(cur, i+1, cnt)
            cur[-1] = 1
            dfs(cur, i+1, cnt+1)
            cur.pop()
        
        dfs([], 0, 0)
        return ans
```

要注意坏人可以说真话，也可以说假话，而且不一定都撒谎，可以对一个人的评价是假的而对另一个人的评价是真的，所以如果是坏人就根本不用管。

这次前三题八分钟搞定，最后一题没做出来。一开始想 dfs，总是写错，想不清楚一个人对其他所有人的评价、一个人对另一个人的评价这些。后来看群里聊天说暴力可以就尝试暴力，然后 WA 一发不知道为什么，想来想去，结束后才想清楚坏人可以对一个人评价是假、对另一个人评价是真，不一定都要真或者都要假。