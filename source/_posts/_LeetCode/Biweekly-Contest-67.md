---
title: Biweekly Contest 67
date: 2021-12-11 23:58:04
categories: 
  - LeetCode
tags: 
  - LeetCode 
---

# Biweekly Contest 67 (2021/12/11)

## 1 - [5934. 找到和最大的长度为 K 的子序列](https://leetcode-cn.com/contest/biweekly-contest-67/problems/find-subsequence-of-length-k-with-the-largest-sum/)

```python
class Solution:
    def maxSubsequence(self, nums: List[int], k: int) -> List[int]:
        c = Counter(sorted(nums, key=lambda x: -x)[:k])
        ans = []
        for x in nums:
            if c[x]: 
                ans.append(x)
                c[x] -= 1
        return ans
```

## 2 - [5935. 适合打劫银行的日子](https://leetcode-cn.com/contest/biweekly-contest-67/problems/find-good-days-to-rob-the-bank/)

```python
class Solution:
    def goodDaysToRobBank(self, sec: List[int], time: int) -> List[int]:
        n = len(sec)
        ans = []
        k = time
        if 2*k >= n: return []
        
        ll = lr = k
        rl = rr = 2*k
        while ll > 0 and sec[ll] <= sec[ll-1]: ll -= 1
        while rl > 0 and sec[rl] >= sec[rl-1]: rl -= 1
        
        for i in range(k, n-k):
            if lr - ll >= k and rr - rl >= k: ans.append(i)
            if i == n-k-1: break
            lr += 1; rr += 1
            if sec[lr] > sec[lr-1]: ll = lr
            if sec[rr] < sec[rr-1]: rl = rr
            
        return ans
```

这道题 TLE 好多次，首先是这个双指针算法一开始没想到，其次想到之后一开始也有点写不出来，边界条件好长时间算不清楚。

不过这个双双指针解法是双百。

## 3 - [5936. 引爆最多的炸弹](https://leetcode-cn.com/contest/biweekly-contest-67/problems/detonate-the-maximum-bombs/)

```python
class Solution:
    def maximumDetonation(self, bombs: List[List[int]]) -> int:
        n = len(bombs)
        mat = [[False] * n for _ in range(n)]
        
        for i in range(n):
            b1 = bombs[i]
            for j in range(n):
                b2 = bombs[j]
                dist = (b1[0] - b2[0]) ** 2 + (b1[1] - b2[1]) ** 2
                if b1[2] ** 2 >= dist:
                    mat[i][j] = True
        
        for k in range(n):
            for i in range(n):
                for j in range(n):
                    mat[i][j] = mat[i][j] or (mat[i][k] and mat[k][j])
        
        return max(sum(x) for x in mat)
```

这道题倒是挺成功的。首先想到是连锁爆炸，先计算爆炸了一次每个炸弹能够炸到的个数，然后基于这个结果计算连锁一次爆炸能够扎到的个数，之后依次计算下去知道结果不再发生变化。

之后马上就可以想到，这不就可以用 floyd 算法来做嘛。 floyd 算法不仅可以用来求多源最短路，还可以类似这样的用来看每两个点之间是否连通。当然 floyd 算法肯定不是最优的。

类似的 floyd 用法还可以看 [1462. Course Schedule IV](https://leetcode.com/problems/course-schedule-iv/)。这里顺便贴上对应的解法。

```python lc1462-1.py
class Solution:
    def checkIfPrerequisite(self, numCourses: int, prerequisites: List[List[int]], queries: List[List[int]]) -> List[bool]:
        
        def floydWarshall(reachable, n): 
            for k in range(n): 
                for i in range(n): 
                    for j in range(n): 
                        reachable[i][j] = reachable[i][j] or (reachable[i][k] and reachable[k][j]) 
            return reachable 
        
        mat = [[False] * numCourses for _ in range(numCourses)] 
        for pre, suc in prerequisites: 
            mat[pre][suc] = True 
        floydWarshall(mat, numCourses) 
        return [mat[query[0]][query[1]] for query in queries] 
```

## 4 - [5937. 序列顺序查询](https://leetcode-cn.com/contest/biweekly-contest-67/problems/sequentially-ordinal-rank-tracker/)

```python
class SORTracker:

    def __init__(self):
        self.idx = 0
        self.arr = []

    def add(self, name: str, score: int) -> None:
        bisect.insort_right(self.arr, (-score, name))

    def get(self) -> str:
        self.idx += 1
        return self.arr[self.idx-1][1]


# Your SORTracker object will be instantiated and called as such:
# obj = SORTracker()
# obj.add(name,score)
# param_2 = obj.get()
```

这最后一题我不理解……或许主要因为 leetcode 的仁慈，没有卡数据。之后可以改用 SortedList 试试。




