#
# @lc app=leetcode.cn id=212 lang=python3
#
# [212] 单词搜索 II
#

# @lc code=start
class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        class Trie: 
            def __init__(self): 
                self.children = [None] * 26 
                self.end = False 

            def insert(self, word): 
                node = self 
                for c in word: 
                    c = ord(c) - ord('a') 
                    if not node.children[c]: node.children[c] = Trie() 
                    node = node.children[c] 
                node.end = True 
            
        m, n = len(board), len(board[0]) 
        root = Trie() 
        ans = set() 
        for word in words: 
            root.insert(word) 

        def dfs(x, y, node, cur): 
            c = board[x][y] 
            if c == '.': return 
            node = node.children[ord(c) - ord('a')] 
            if not node: return 
            if node.end: 
                ans.add(cur + c) 

            board[x][y] = '.' 
            for x1, y1 in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)): 
                if 0 <= x1 < m and 0 <= y1 < n: 
                    dfs(x1, y1, node, cur + c) 
            board[x][y] = c 

        for x in range(m): 
            for y in range(n): 
                dfs(x, y, root, "") 
        return list(ans) 
# @lc code=end

