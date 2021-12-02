#
# @lc app=leetcode.cn id=17 lang=python3
#
# [17] 电话号码的字母组合
#

# @lc code=start
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        d = {
            '2': {'a', 'b', 'c'}, 
            '3': {'d', 'e', 'f'}, 
            '4': {'g', 'h', 'i'}, 
            '5': {'j', 'k', 'l'}, 
            '6': {'m', 'n', 'o'}, 
            '7': {'p', 'q', 'r', 's'},
            '8': {'t', 'u', 'v'}, 
            '9': {'w', 'x', 'y', 'z'}, 
        }

        def dfs(s, digits): 
            if digits == "": return s 
            ret = set() 
            for x in s: 
                for y in d[digits[0]]: 
                    ret.add(x + y) 
            print(ret) 
            return dfs(ret, digits[1:])
        
        if digits == "": return [] 
        return list(dfs({""}, digits)) 
# @lc code=end

