---
title: Weekly Contest 275
date: 2022-01-09 17:19:00
categories:
  - LeetCode
tags:
  - LeetCode
---

# 1 - [2133. Check if Every Row and Column Contains All Numbers](https://leetcode.com/problems/check-if-every-row-and-column-contains-all-numbers/)

```python
class Solution:
    def checkValid(self, matrix: List[List[int]]) -> bool:
        n = len(matrix)
        
        for i in range(n):
            l = [False] * n
            for j in range(n):
                l[matrix[i][j] - 1] = True
            if not all(l): return False
        
        for j in range(n):
            l = [False] * n
            for i in range(n):
                l[matrix[i][j] - 1] = True
            if not all(l): return False
        return True
```

上面的写法不太好看。下面看一个好看的：

```python
class Solution:
    def checkValid(self, matrix: List[List[int]]) -> bool:
        n = len(matrix)
        for a, b in zip(matrix, zip(*matrix)):
            if len(set(a)) != n or len(set(b)) != n:
                return False
        return True
```

参考自[Use HashSet to check each row / column.](https://leetcode.com/problems/check-if-every-row-and-column-contains-all-numbers/discuss/1677019/JavaPython-3-Use-HashSet-to-check-each-row-column.)使用序列解包 + zip 可以非常方便地获取列，再用一次 zip 让行和列一起考虑，表示行的 a 是列表，表示列的 b 是元组。

# 2 - [2134. Minimum Swaps to Group All 1's Together II](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/)

先提供一种会 TLE 的写法：

```python
class Solution:
    def minSwaps(self, nums: List[int]) -> int:
        ones = sum(nums)
        n = len(nums)
        if n == 1 or ones == 0: return 0
        
        nums = nums + nums
        deq = deque(nums[:ones])
        ans = ones - sum(deq)
        for i in range(ones, 2 * n):
            deq.popleft()
            deq.append(nums[i])
            ans = min(ans, ones - sum(deq))
        return ans
```

上面是 n^2 复杂度。这种题都要看数据范围，能优化就优化。一般来说 1e9 以内应该都可以，所以 1e5 的数据就表示不能用 n^2 的算法。

```python
class Solution:
    def minSwaps(self, nums: List[int]) -> int:
        n = len(nums)
        ones = sum(nums)
        cur = sum(nums[:ones])
        ans = ones - cur
        nums = nums + nums
        
        for i in range(ones, 2 * n):
            if nums[i - ones]: cur -= 1
            if nums[i]: cur += 1
            ans = min(ans, ones - cur)
        return ans
```

# 3 - [2135. Count Words Obtained After Adding a Letter](https://leetcode.com/problems/count-words-obtained-after-adding-a-letter/)

```python
class Solution:
    def wordCount(self, startWords: List[str], targetWords: List[str]) -> int:
        d = defaultdict(set)
        for word in startWords:
            d[len(word)].add(tuple(sorted(word)))
        
        print(d[4])
        ans = 0
        for word in targetWords:
            n = len(word)
            for i in range(len(word)):
                if tuple(sorted(word[:i] + word[i+1:])) in d[n-1]:
                    ans += 1
                    break
        return ans
```

上面的还可以吧。使用 [bitmask](https://leetcode.com/problems/count-words-obtained-after-adding-a-letter/discuss/1676852/Python3-bitmask) 的写法：

```python
class Solution:
    def wordCount(self, startWords: List[str], targetWords: List[str]) -> int:
        seen = set()
        for word in startWords: 
            m = 0
            for ch in word: m ^= 1 << ord(ch)-97
            seen.add(m)
            
        ans = 0 
        for word in targetWords: 
            m = 0 
            for ch in word: m ^= 1 << ord(ch) - 97
            for ch in word: 
                if m ^ (1 << ord(ch)-97) in seen: 
                    ans += 1
                    break 
        return ans 
```

# 4 - [2136. Earliest Possible Day of Full Bloom](https://leetcode.com/problems/earliest-possible-day-of-full-bloom/)

```python
class Solution:
    def earliestFullBloom(self, plantTime: List[int], growTime: List[int]) -> int:
        n = len(plantTime)
        growTime = [(x, i) for i, x in enumerate(growTime)]
        growTime.sort(key=lambda x: (-x[0], x[1]))
        
        bloomTime = [0] * n
        days = 0
        for t, i in growTime:
            days += plantTime[i]
            bloomTime[i] = days + t
        return max(bloomTime)
```

按照 growTime 从大到小贪心种植即可。[贪心及其证明 ——灵茶山艾府](https://leetcode-cn.com/problems/earliest-possible-day-of-full-bloom/solution/tan-xin-ji-qi-zheng-ming-by-endlesscheng-hfwe/)

```python
class Solution:
    def earliestFullBloom(self, plantTime: List[int], growTime: List[int]) -> int:
        a = list(zip(plantTime, growTime))
        a.sort(key=lambda x: -x[1])
        ans, day = 0, 0
        for p in a:
            day += p[0]
            ans = max(ans, day + p[1])
        return ans
```

不愧是大佬，好短好快。

