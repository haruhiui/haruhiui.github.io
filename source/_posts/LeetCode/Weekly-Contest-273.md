---
title: Weekly Contest 273
date: 2021-12-26 13:01:50
categories: 
  - LeetCode
tags: 
  - LeetCode 
---

# Weekly Contest 273

## [2119. A Number After a Double Reversal](https://leetcode.com/problems/a-number-after-a-double-reversal/)

```python lc2119-1.py
class Solution:
    def isSameAfterReversals(self, num: int) -> bool:
        s = str(num)
        s = s[::-1].lstrip('0')
        s = s[::-1]
        return int(s if s else '0') == num
```

## [2120. Execution of All Suffix Instructions Staying in a Grid](https://leetcode.com/problems/execution-of-all-suffix-instructions-staying-in-a-grid/)

简单的 O(m^2) 写法：

```python lc2120-1.py
class Solution:
    def executeInstructions(self, n: int, startPos: List[int], s: str) -> List[int]:
        m = len(s)
        ans = [0] * m
        for i in range(m):
            pos = startPos[:]
            for j in range(i, m):
                if s[j] == 'L': pos[1] -= 1
                if s[j] == 'R': pos[1] += 1
                if s[j] == 'U': pos[0] -= 1
                if s[j] == 'D': pos[0] += 1
                if 0 <= pos[0] < n and 0 <= pos[1] < n: ans[i] += 1
                else: break
        return ans
```

参考大佬的 O(m) 写法：[python O(m) solution,](https://leetcode.com/problems/execution-of-all-suffix-instructions-staying-in-a-grid/discuss/1647617/python-O(m)-solution)

```python lc2120-2.py
class Solution(object):
    def executeInstructions(self, n, startPos, s):
        """
        :type n: int
        :type startPos: List[int]
        :type s: str
        :rtype: List[int]
        """
        m = len(s)
        direc = {'U':[-1,0],'D':[1,0],'L':[0,-1],'R':[0,1]}
        upmost = startPos[0] + 1
        downmost = n - startPos[0]
        leftmost = startPos[1] + 1
        rightmost = n - startPos[1]
        curr_row,curr_col = 0,0    
        next_row,next_col = {0:m}, {0:m}
        ans = []
        
        for i in range(m-1,-1,-1):
            curr_row -= direc[s[i]][0]
            curr_col -= direc[s[i]][1]
            maxstep = m-i
            if curr_row - upmost in next_row:  
                maxstep = min(maxstep,  next_row[curr_row - upmost] - i - 1 )
            if curr_row + downmost in next_row:  
                maxstep = min(maxstep,  next_row[curr_row + downmost] - i - 1 )
            if curr_col - leftmost in next_col:  
                maxstep = min(maxstep,  next_col[curr_col - leftmost] - i - 1 )
            if curr_col + rightmost in next_col: 
                maxstep = min(maxstep,  next_col[curr_col + rightmost] - i - 1 )
            next_row[curr_row] = i
            next_col[curr_col] = i
            ans.append(maxstep)
            
        return ans[::-1]
```

## [2121. Intervals Between Identical Elements](https://leetcode.com/problems/intervals-between-identical-elements/)

推导一个公式即可。

```python lc2121-1.py
class Solution:
    def getDistances(self, arr: List[int]) -> List[int]:
        n = len(arr)
        nums = [(arr[i], i) for i in range(n)]
        nums.sort()
        ans = [0] * n
        
        lastNum = nums[0][0]
        start = end = 0
        while end < n and nums[end][0] == lastNum: end += 1
        
        for i in range(n):
            if nums[i][0] != lastNum:
                lastNum = nums[i][0]
                start = end
                while end < n and nums[end][0] == lastNum: end += 1
                idxs = nums[start:end]
            if i == start: 
                ans[nums[i][1]] = sum(abs(nums[i][1] - x[1]) for x in nums[start:end])
            else:
                ans[nums[i][1]] = ans[nums[i - 1][1]] + ((i - start) - (end - i)) * (nums[i][1] - nums[i - 1][1])
        return ans
```

评论区的更简洁，[[Python3] prefix sum](https://leetcode.com/problems/intervals-between-identical-elements/discuss/1647480/Python3-prefix-sum)

```python lc2121-2.py
class Solution:
    def getDistances(self, arr: List[int]) -> List[int]:
        loc = defaultdict(list)
        for i, x in enumerate(arr): loc[x].append(i)
        
        for k, idx in loc.items(): 
            prefix = list(accumulate(idx, initial=0))
            vals = []
            for i, x in enumerate(idx): 
                vals.append(prefix[-1] - prefix[i] - prefix[i+1] - (len(idx)-2*i-1)*x)
            loc[k] = deque(vals)
        
        return [loc[x].popleft() for x in arr]
```

## [2122. Recover the Original Array](https://leetcode.com/problems/recover-the-original-array/)

```python lc2122-1.py
class Solution:
    def recoverArray(self, nums: List[int]) -> List[int]:
        n = len(nums) // 2
        nums.sort()
        
        def helper(k):
            nonlocal nums, n, ans
            status = [0] * (2 * n)
            for i in range(2 * n):
                if status[i]: continue
                pos = bisect_left(nums, nums[i] + 2 * k)
                while pos < 2 * n and status[pos] and nums[pos] == nums[i] + 2 * k: pos += 1
                if pos >= 2 * n or nums[pos] != nums[i] + 2 * k: continue
                status[i] = status[pos] = 1
            return all(status)
        
        k = 0
        for i in range(1, n + 1):
            if nums[i] == nums[0] or (nums[i] - nums[0]) % 2 == 1: continue
            k = (nums[i] - nums[0]) // 2
            if helper(k): break
        # print(k)
        
        status = [0] * (2 * n)
        ans = []
        for i in range(2 * n):
            if status[i]: continue
            ans.append(nums[i] + k)
            pos = bisect_left(nums, nums[i] + 2 * k)
            while status[pos] and nums[pos] == nums[i] + 2 * k: pos += 1
            status[i] = status[pos] = 1
        
        return ans
```

先只放一个代码在这，之后补充。


