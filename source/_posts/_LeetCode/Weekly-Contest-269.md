---
title: Weekly Contest 269
date: 2021-11-28 17:37:40
categories: 
  - LeetCode
tags: 
  - LeetCode 
---

# Weekly Contest 269 (2021/11/28)

## 1 - [2089. Find Target Indices After Sorting Array](https://leetcode.com/contest/weekly-contest-269/problems/find-target-indices-after-sorting-array/)

给出一个数组和一个数字，要求先对数组排序，之后以升序返回数组中给定数字的下标。

```python lc2089-1.py
class Solution:
    def targetIndices(self, nums: List[int], target: int) -> List[int]:
        nums.sort()
        return [i for i in range(len(nums)) if nums[i] == target]
```



## 2 - [2090. K Radius Subarray Averages](https://leetcode.com/contest/weekly-contest-269/problems/k-radius-subarray-averages/)

定义以 `i` 为中心的 `k-radius average` ：`sum(nums[i-k: i+k+1]) if i-k >= 0 and i+k < len(nums) else -1` ，给出一个数组和数字 `k` ，返回数组中每个数字的 `k-radius average` 组成的数组。

```python lc2090-1.py
class Solution:
    def getAverages(self, nums: List[int], k: int) -> List[int]:
        n = len(nums) 
        ans = [] 
        curSum = -1 
        for i in range(n): 
            if i-k >= 0 and i+k < n: 
                curSum = curSum - nums[i-k-1] + nums[i+k] if curSum != -1 else sum(nums[i-k:i+k+1]) 
                ans.append(curSum // (2*k+1)) 
            else: 
                ans.append(-1)
        return ans 
```

或者可以学习大佬用的前缀和：

```python lc2090-2.py
class Solution:
    def getAverages(self, nums: List[int], k: int) -> List[int]:
        n = len(nums)
        pre = [0] * (n + 1)
        for i in range(n):
            pre[i + 1] = pre[i] + nums[i]
        ans = [-1] * n
        for i in range(n):
            if i - k >= 0 and i + k < n:
                ans[i] = (pre[i + k + 1] - pre[i - k]) // (k * 2 + 1)
        return ans
```

因为没有优化而WA一次。



## 3 - [2091. Removing Minimum and Maximum From Array](https://leetcode.com/contest/weekly-contest-269/problems/removing-minimum-and-maximum-from-array/)

给出一个数组，每次可以从头或者从尾部弹出一个数字，需要弹出数组的最大值和最小值，总共需要多少次操作。题目给出的数组最大最小值都是唯一的。

```python lc2091-1.py
class Solution:
    def minimumDeletions(self, nums: List[int]) -> int:
        n = len(nums) 
        i1, i2 = nums.index(max(nums)), nums.index(min(nums))
        i1, i2 = min(i1, i2), max(i1, i2)
        return min(max(i1 + 1, i2 + 1), i1 + 1 + (n - i2), max(n - i1, n - i2))
```

有三种可能，前前、前后、后后，要注意他们的计算方式，选择最小的那个即可。因为没有考虑到后后的情况而WA了一次。



## 4 - [2092. Find All People With Secret](https://leetcode.com/contest/weekly-contest-269/problems/find-all-people-with-secret/)

给出人数 `n` 、数组 `meetings` 和第一个知道秘密的人 `firstPerson` ，一开始下标为 `0` 的人把秘密告诉 `firstPerson` ，之后通过 `meetings` 传递秘密，秘密的传递是瞬间的，返回最后所有知道秘密的人组成的数组，顺序任意。

思路是把 `meetings` 按照时刻排序，然后遍历处于相同时刻的会议组成一个个集合，如果有人知道秘密，秘密就在这个集合里传播。可以想到用并查集解决。

做的过程中出现两个思路上的问题，一个是秘密瞬时传播，同一时刻开会的都会知道。

```python lc2091-wa-1.py
class Solution:
    def findAllPeople(self, n: int, meetings: List[List[int]], firstPerson: int) -> List[int]:
        meetings.sort(key=lambda x: x[2]) 
        know = {0, firstPerson}
        for m in meetings: 
            if m[0] in know or m[1] in know: 
                know.add(m[0]) 
                know.add(m[1]) 
        return sorted(list(know))
```

结果WA。而且周赛第四题要是能这么短就写完做梦都要笑醒。WA之后想到用 `union find` ，先来个简单粗暴点的。

```python lc2092-tle-1.py
class Solution:
    def findAllPeople(self, n: int, meetings: List[List[int]], firstPerson: int) -> List[int]:
        def getRoot(li, i): 
            while li[i][0] != i: 
                i = li[i][0] 
            return i 
        
        def union(li, i, j): 
            r1, r2 = getRoot(li, i), getRoot(li, j) 
            li[r2][0] = r1 
            li[r1][1].update(li[r2][1])
        
        meetings.sort(key=lambda x: x[2]) 
        arr = [[i, {i}] for i in range(n)] 
        time = 0 
        know = {0, firstPerson} 
        for m in meetings: 
            if m[2] != time: 
                for x in know.copy(): 
                    know.update(arr[getRoot(arr, x)][1]) 
                arr = [[i, {i}] for i in range(n)]
                time = m[2] 
            union(arr, m[0], m[1]) 
        
        print(arr) 
        for x in know.copy(): 
            know.update(arr[getRoot(arr, x)][1]) 
        return list(know)
```

结果TLE。每个时刻都创造一个 `arr = [[i, {i}] for i in range(n)]` ，首先范围上 `2 <= n < 10^5`，其次每个时刻开会的人可能只有很少一部分，最后TLE是必然。

比赛后写的AC代码如下。有两个优化：并查集的路径压缩，用的时间是不用路径压缩的一半；还有使用字典表示并查集而不是用数组。

代码部分参考自 [Python | Sort + DSU, detailed explanation](https://leetcode.com/problems/find-all-people-with-secret/discuss/1599808/Python-or-Sort-%2B-DSU-detailed-explanation) 。

```python lc2092-1.py
class Solution:
    def findAllPeople(self, n: int, meetings: List[List[int]], firstPerson: int) -> List[int]:
        
        def get_root(parents, x): 
            if parents[x] != x: 
                parents[x] = get_root(parents, parents[x]) # path compression 
            return parents[x] 
        
        def union(parents, x, y): 
            x, y = get_root(parents, x), get_root(parents, y)
            if x == y: return 
            parents[y] = x 
            
        
        time2meets = defaultdict(list) 
        for x, y, t in meetings: 
            time2meets[t].append((x, y)) 
        time2meets = sorted(time2meets.items()) 
        
        know = {0, firstPerson} 
        for time, meets in time2meets: 
            uf = defaultdict(int) # no need to use [i for i in range(n)] 
            for x, y in meets: 
                uf[x], uf[y] = x, y 
            for x, y in meets: 
                union(uf, x, y) 
            
            groups = defaultdict(set) 
            for x in uf.keys(): 
                groups[get_root(uf, x)].add(x) 
            
            for group in groups.values(): 
                if not group.isdisjoint(know): 
                    know.update(group) 
        
        return list(know) 
```

最后成绩是三题，二题WA一次，三题TLE一次。
