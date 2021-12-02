---
title: DFS
date: 2021-12-02 18:50:30 
categories: 
  - Data Structures And Algorithms
tags: 
  - Data Structures And Algorithms
  - DFS
---

## 练习

### [37. 解数独](https://leetcode-cn.com/problems/sudoku-solver/)

```python lc37-1.py 
class Solution:
    def solveSudoku(self, board: List[List[str]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
        rows = [[False] * 9 for _ in range(9)] 
        cols = [[False] * 9 for _ in range(9)] 
        cell = [[False] * 9 for _ in range(9)]
        cell_i = lambda i, j: (i // 3) * 3 + (j // 3)
        for i in range(9): 
            for j in range(9): 
                if board[i][j] == '.': continue 
                n = int(board[i][j]) - 1 
                rows[i][n] = cols[j][n] = cell[cell_i(i, j)][n] = True 
        
        def dfs(x, y): 
            if x == 9: return True 
            if y == 9: return dfs(x + 1, 0)
            if board[x][y] != '.': return dfs(x, y + 1) 
            for i in range(9): 
                if not rows[x][i] and not cols[y][i] and not cell[cell_i(x, y)][i]: 
                    rows[x][i] = cols[y][i] = cell[cell_i(x, y)][i] = True 
                    board[x][y] = str(i + 1) 
                    if dfs(x, y + 1): return True 
                    rows[x][i] = cols[y][i] = cell[cell_i(x, y)][i] = False 
                    board[x][y] = '.'
            return False 
        
        dfs(0, 0) 
```

### [39. 组合总和](https://leetcode-cn.com/problems/combination-sum/)

```python lc39-1.py
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        ans = [] 

        def dfs(cur, t): 
            if t < 0: return 
            if t == 0: ans.append(cur); return 
            for x in candidates: 
                if (len(cur) > 0 and cur[-1] or 0) <= x <= t: dfs(cur + [x], t - x)
        
        dfs([], target) 
        return ans 
```

题目说如果两个结果中每个所选数字的数量都相同，那么这两个结果等价。也就是说不要求顺序，每一个结果都是 set 而非 list，只不过用 list 存放；是组合而非排列。

中间的条件 `(len(cur) > 0 and cur[-1] or 0) <= x <= t` 保证产生的序列是递增的，这样选择的是唯一的。

### [40. 组合总和 II](https://leetcode-cn.com/problems/combination-sum-ii/)

```python lc40-tle-1.py
class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        ans = set() 
        n = len(candidates) 
        candidates.sort() 

        def dfs(cur, idx, t): 
            if t == 0: ans.add(tuple(cur)); return 
            if t < 0 or idx >= n: return 
            for i in range(idx, n): 
                x = candidates[i] 
                if x <= t: dfs(cur + [x], i + 1, t - x) 
        
        dfs([], 0, target) 
        return [list(x) for x in ans]
```

上面的写法对于这个用例会 TLE：`[1] * x, 30`。需要先想清楚这个 dfs 执行过程中产生的树是什么样子的，然后剪枝。

感谢 [liweiwei1419](https://leetcode-cn.com/problems/combination-sum-ii/solution/hui-su-suan-fa-jian-zhi-python-dai-ma-java-dai-m-3/) 大佬提供的剪枝思路。简单来说就是同层的相同的都给剪掉，不同层的相同的当然不用管。

```python lc40-1.py
class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        ans = set() 
        n = len(candidates) 
        candidates.sort() 

        def dfs(cur, idx, t): 
            if t == 0: ans.add(tuple(cur)); return 
            if t < 0 or idx >= n: return 
            for i in range(idx, n): 
                if i > idx and candidates[i] == candidates[i - 1]: continue 
                x = candidates[i] 
                if x <= t: dfs(cur + [x], i + 1, t - x) 
        
        dfs([], 0, target) 
        return [list(x) for x in ans]
```


