---
title: Biweekly Contest 69
date: 2022-01-09 00:10:53
categories: 
  - LeetCode
tags: 
  - LeetCode 
---

# 1 - [2129. Capitalize the Title](https://leetcode.com/problems/capitalize-the-title/)

```python
class Solution:
    def capitalizeTitle(self, title: str) -> str:
        li = []
        for s in title.split():
            if len(s) <= 2: li.append(s.lower())
            else: li.append(s[0].upper() + s[1:].lower())
        return " ".join(li)
```

# 2 - [2130. Maximum Twin Sum of a Linked List](https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list/)

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def pairSum(self, head: Optional[ListNode]) -> int:
        li = []
        while head:
            li.append(head.val)
            head = head.next
        
        n = len(li)
        ans = 0
        for i in range(n // 2):
            ans = max(ans, li[i] + li[n - 1 - i])
        return ans
```

上面的写法效率有点差，还有快慢指针的写法。[参考链接](https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list/discuss/1675353/O(n)-Easy-Solution)

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def pairSum(self, head: Optional[ListNode]) -> int:
        half, ans = [], 0
        slow = fast = head
        while fast:
            half.append(slow.val)
            slow = slow.next
            fast = fast.next.next
        for x in reversed(half):
            ans = max(ans, x + slow.val)
            slow = slow.next
        return ans
```

# 3 - [2131. Longest Palindrome by Concatenating Two Letter Words](https://leetcode.com/problems/longest-palindrome-by-concatenating-two-letter-words/)

```python
class Solution:
    def longestPalindrome(self, words: List[str]) -> int:
        n = len(words)
        c = Counter(words)
        ans = 0
        mid = 0
        
        for w in words:
            c[w] = c[w[::-1]] = min(c[w], c[w[::-1]])
            if not c[w]: continue
            if w == w[::-1]:
                ans += (c[w] // 2) * 4
                mid = 2 if c[w] % 2 == 1 else mid
            else:
                ans += c[w] * 4
            c[w] = c[w[::-1]] = 0
        return ans + mid
```

# 4 - [2132. Stamping the Grid](https://leetcode.com/problems/stamping-the-grid/)

先来一个错误的做法：

```python
class Solution:
    def possibleToStamp(self, grid: List[List[int]], sh: int, sw: int) -> bool:
        m, n = len(grid), len(grid[0])
        
        for i in range(m):
            zeros = 0
            for j in range(n):
                if grid[i][j] == 1:
                    if 0 < zeros < sw: return False
                    zeros = 0
                else:
                    zeros += 1
            if 0 < zeros < sw: return False
        
        for j in range(n):
            zeros = 0
            for i in range(m):
                if grid[i][j] == 1:
                    if 0 < zeros < sh: return False
                    zeros = 0
                else:
                    zeros += 1
            if 0 < zeros < sh: return False
        
        return True
```

要判断所有的 0 能否都能被覆盖，是不是只要看每行连续的 0 的个数比邮票的宽度更大、每列连续的 0 的个数比邮票的高度更大就行了呢？当然不是。比如下面这个用例：

```ps
[[0,0,0,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,1],[0,0,0,1,1]]
2
2
```

正确的做法是二维前缀和。[题解链接](https://leetcode-cn.com/problems/stamping-the-grid/solution/wu-nao-zuo-fa-er-wei-qian-zhui-he-er-wei-zwiu/)

```python
class Solution:
    def possibleToStamp(self, grid: List[List[int]], stampHeight: int, stampWidth: int) -> bool:
        m, n = len(grid), len(grid[0])
        sum = [[0] * (n + 1) for _ in range(m + 1)]
        diff = [[0] * (n + 1) for _ in range(m + 1)]
        for i, row in enumerate(grid):
            for j, v in enumerate(row):  # grid 的二维前缀和
                sum[i + 1][j + 1] = sum[i + 1][j] + sum[i][j + 1] - sum[i][j] + v

        for i, row in enumerate(grid):
            for j, v in enumerate(row):
                if v == 0:
                    x, y = i + stampHeight, j + stampWidth  # 注意这是矩形右下角横纵坐标都 +1 后的位置
                    if x <= m and y <= n and sum[x][y] - sum[x][j] - sum[i][y] + sum[i][j] == 0:
                        diff[i][j] += 1
                        diff[i][y] -= 1
                        diff[x][j] -= 1
                        diff[x][y] += 1  # 更新二维差分

        # 还原二维差分矩阵对应的计数矩阵，这里用滚动数组实现
        cnt, pre = [0] * (n + 1), [0] * (n + 1)
        for i, row in enumerate(grid):
            for j, v in enumerate(row):
                cnt[j + 1] = cnt[j] + pre[j + 1] - pre[j] + diff[i][j]
                if cnt[j + 1] == 0 and v == 0:
                    return False
            cnt, pre = pre, cnt
        return True
```


