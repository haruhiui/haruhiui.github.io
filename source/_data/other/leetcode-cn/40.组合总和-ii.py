#
# @lc app=leetcode.cn id=40 lang=python3
#
# [40] 组合总和 II
#

# @lc code=start
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
# @lc code=end

