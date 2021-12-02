#
# @lc app=leetcode.cn id=39 lang=python3
#
# [39] 组合总和
#

# @lc code=start
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
# @lc code=end

