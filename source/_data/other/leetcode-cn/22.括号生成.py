#
# @lc app=leetcode.cn id=22 lang=python3
#
# [22] 括号生成
#

# @lc code=start
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        ans = set() 

        def dfs(cur_s, left, right): 
            if right == left == n: ans.add(cur_s) 
            elif left == n: dfs(cur_s + ")", left, right + 1) 

            if right <= left < n: dfs(cur_s + "(", left + 1, right) 
            if right < left < n: dfs(cur_s + ")", left, right + 1) 

        dfs("", 0, 0)
        return list(ans)  

# @lc code=end

