#
# @lc app=leetcode.cn id=37 lang=python3
#
# [37] 解数独
#

# @lc code=start
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
# @lc code=end

