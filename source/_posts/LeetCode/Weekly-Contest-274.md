---
title: Weekly Contest 274
date: 2022-01-02 13:49:14
categories:
  - LeetCode
tags:
  - LeetCode
---

# Weekly Contest 274

## [2124. Check if All A's Appears Before All B's](https://leetcode.com/problems/check-if-all-as-appears-before-all-bs/)

```python
class Solution:
    def checkString(self, s: str) -> bool:
        return "ba" not in s
```

## [2125. Number of Laser Beams in a Bank](https://leetcode.com/problems/number-of-laser-beams-in-a-bank/)

```python
class Solution:
    def numberOfBeams(self, bank: List[str]) -> int:
        ans = pre = 0
        for s in bank:
            c = s.count('1')
            if c:
                ans += pre * c
                pre = c
        return ans
```

## [2126. Destroying Asteroids](https://leetcode.com/problems/destroying-asteroids/)

```python
class Solution:
    def asteroidsDestroyed(self, mass: int, asteroids: List[int]) -> bool:
        asteroids.sort()
        for num in asteroids:
            if num > mass: return False
            mass += num
        return True
```

## [2127. Maximum Employees to Be Invited to a Meeting](https://leetcode.com/problems/maximum-employees-to-be-invited-to-a-meeting/)

```python
class Solution:
    def maximumInvitations(self, favorite: List[int]) -> int:
        n = len(favorite)
        g = [[] for _ in range(n)]
        rg = [[] for _ in range(n)]  # 图 g 的反图
        deg = [0] * n  # 图 g 上每个节点的入度
        for v, w in enumerate(favorite):
            g[v].append(w)
            rg[w].append(v)
            deg[w] += 1

        # 拓扑排序，剪掉图 g 上的所有树枝
        q = deque(i for i, d in enumerate(deg) if d == 0)
        while q:
            v = q.popleft()
            for w in g[v]:
                deg[w] -= 1
                if deg[w] == 0:
                    q.append(w)

        # 寻找图 g 上的基环
        ring = []
        vis = [False] * n
        def dfs(v: int):
            vis[v] = True
            ring.append(v)
            for w in g[v]:
                if not vis[w]:
                    dfs(w)

        # 通过反图 rg 寻找树枝上最深的链
        max_depth = 0
        def rdfs(v: int, fa: int, depth: int):
            nonlocal max_depth
            max_depth = max(max_depth, depth)
            for w in rg[v]:
                if w != fa:
                    rdfs(w, v, depth + 1)

        max_ring_size, sum_list_size = 0, 0
        for i, b in enumerate(vis):
            if not b and deg[i]:  # 遍历基环上的点（拓扑排序后入度不为 0）
                ring = []
                dfs(i)
                if len(ring) == 2:  # 基环大小为 2
                    v, w = ring
                    max_depth = 0
                    rdfs(v, w, 1)
                    sum_list_size += max_depth  # 累加 v 这一侧的最长链的长度
                    max_depth = 0
                    rdfs(w, v, 1)
                    sum_list_size += max_depth  # 累加 w 这一侧的最长链的长度
                else:
                    max_ring_size = max(max_ring_size, len(ring))  # 取所有基环的最大值
                    
        return max(max_ring_size, sum_list_size)
```

参考自：[内向基环树：拓扑排序+分类讨论+DFS](https://leetcode-cn.com/problems/maximum-employees-to-be-invited-to-a-meeting/solution/nei-xiang-ji-huan-shu-tuo-bu-pai-xu-fen-c1i1b/)
