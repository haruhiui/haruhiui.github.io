---
title: Biweekly Contest 70
date: 2022-01-23 12:49:21
categories: 
  - LeetCode
tags: 
  - LeetCode 
---

# 1 - [2144. Minimum Cost of Buying Candies With Discount](https://leetcode.com/problems/minimum-cost-of-buying-candies-with-discount/)

```python
class Solution:
    def minimumCost(self, cost: List[int]) -> int:
        return sum(x for i, x in enumerate(sorted(cost, reverse=True)) if (i + 1) % 3 != 0)
```

# 2 - [2145. Count the Hidden Sequences](https://leetcode.com/problems/count-the-hidden-sequences/)

```python
class Solution:
    def numberOfArrays(self, differences: List[int], lower: int, upper: int) -> int:
        nums = list(accumulate(differences, initial=0))
        return max((upper - lower) - (max(nums) - min(nums)) + 1, 0)
```

# 3 - [2146. K Highest Ranked Items Within a Price Range](https://leetcode.com/problems/k-highest-ranked-items-within-a-price-range/)

```python
class Solution:
    def highestRankedKItems(self, grid: List[List[int]], pricing: List[int], start: List[int], k: int) -> List[List[int]]:
        m, n = len(grid), len(grid[0])
        sr, sc = start
        low, high = pricing
        
        ans = []
        deq = deque([[sr, sc, 0]])
        visited = [[False] * n for _ in range(m)]
        
        while deq:
            r, c, d = deq.popleft()
            if visited[r][c]: continue
            visited[r][c] = True
            nxts = [[a, b, d+1] for a, b in [[r-1, c], [r+1, c], [r, c-1], [r, c+1]] if 0 <= a < m and 0 <= b < n and grid[a][b] >= 1 and not visited[a][b]]
            if low <= grid[r][c] <= high: ans.append([r, c, d])
            deq.extend(nxts)
        
        return [[a, b] for a, b, c in sorted(ans, key=lambda x: (x[2], grid[x[0]][x[1]], x[0], x[1]))[:k]]
```

上面的有点慢。

# 4 - [2147. Number of Ways to Divide a Long Corridor]https://leetcode.com/problems/number-of-ways-to-divide-a-long-corridor/

```python
class Solution:
    def numberOfWays(self, corridor: str) -> int:
        a = [i for i, c in enumerate(corridor) if c == 'S']
        ans = 1
        for i in range(1, len(a) - 1, 2):
            ans = (ans * (a[i+1] - a[i])) % int(1e9 + 7)
        return ans * (len(a) % 2 == 0 and len(a) >= 2)
```

这次第三题 WA 五次，第四题 WA 六次。srds 还是 ak 了……

第三题犯过的错有：没计算距离；把距离计算成和起点的绝对距离而不是走过的距离；起点的价格符合条件时没把起点加到结果里；没有及时记录 WA 例子而又 WA 一发看用例；选出前 k 个应该把所有的都计算出来然后排序选前 k 个而不是在 bfs 过程中只找 k 个。

第四题的错有：'P'、'S' 和 'S' 的个数小于 2、个数是奇数等特殊情况；一开始把乘法想成了加法；开头和结尾的 'P' 并不需要特殊考虑。