---
title: Weekly Contest 284
date: 2022-03-15 16:35:49
categories:
  - LeetCode
tags:
  - LeetCode
---

## 1 - [2200. 找出数组中的所有 K 近邻下标](https://leetcode-cn.com/problems/find-all-k-distant-indices-in-an-array/)

```python
class Solution:
    def findKDistantIndices(self, nums: List[int], key: int, k: int) -> List[int]:
        n = len(nums)
        # idxs = [i for i in range(n) if nums[i] == key]
        res = []
        for i in range(n):
            for j in range(max(0, i - k), min(n, i + k + 1)):
                if nums[j] == key:
                    res.append(i)
                    break
        return res
```

## 2 - [2201. 统计可以提取的工件](https://leetcode-cn.com/problems/count-artifacts-that-can-be-extracted/)

```python
class Solution:
    def digArtifacts(self, n: int, artifacts: List[List[int]], dig: List[List[int]]) -> int:
        g = [[0] * n for _ in range(n)]
        for i, (r1, c1, r2, c2) in enumerate(artifacts, start=1):
            for r in range(r1, r2 + 1):
                for c in range(c1, c2 + 1):
                    g[r][c] = i
        # print(g)
        for r, c in dig:
            g[r][c] = 0
        d = {}
        for r in range(n):
            for c in range(n):
                if g[r][c]:
                    d[g[r][c]] = 1
        # print(g)
        return len(artifacts) - len(d)
```

## 3 - [2202. K 次操作后最大化顶端元素](https://leetcode-cn.com/problems/maximize-the-topmost-element-after-k-moves/)

```python
class Solution:
    def maximumTop(self, nums: List[int], k: int) -> int:
        if k % 2 == 1 and len(nums) == 1: return -1
        if k > len(nums): return max(nums)
        elif k == len(nums): return max(nums[:-1])
        else: return max(max(nums[:k-1]) if k - 1 > 0 else 0, nums[k])
```

这道题真是有点意思，nums[k] 有可能不能，nums[k+1] 一定有可能……

## 4 - [2203. 得到要求路径的最小带权子图](https://leetcode-cn.com/problems/minimum-weighted-subgraph-with-the-required-paths/)

```python
class Solution:
    def minimumWeight(self, n: int, edges: List[List[int]], src1: int, src2: int, dest: int) -> int:
        def dijkstra(s, g):
            nonlocal n
            dist = [inf] * n
            dist[s] = 0
            pq = [(0, s)]
            while pq:
                d, x = heappop(pq)
                if dist[x] < d: continue
                for y, wt in g[x]:
                    new_d = dist[x] + wt
                    if new_d < dist[y]:
                        dist[y] = new_d
                        heappush(pq, (new_d, y))
            return dist
                
        g = [[] for _ in range(n)]
        rg = [[] for _ in range(n)]
        for a, b, c in edges:
            g[a].append((b, c))
            rg[b].append((a, c))
        
        d1 = dijkstra(src1, g)
        d2 = dijkstra(src2, g)
        d3 = dijkstra(dest, rg)
        res = min(sum(d) for d in zip(d1, d2, d3))
        return res if res < inf else -1
```

这道题更有意思。简单的 dijkstra 是不够的，从 src1 和 src2 找一遍正图，再从 target 找一遍反图，遍历所有的点看最小的距离。因为这最小子图肯定是包含完整的两条路径，只不过这两条路径之间可能有重复的地方，遍历是为了遍历这个交点。