---
title: Weekly Contest 278
date: 2022-02-03 13:33:20
categories:
  - LeetCode
tags:
  - LeetCode
---

# 1 - [2154. Keep Multiplying Found Values by Two](https://leetcode.com/problems/keep-multiplying-found-values-by-two/)

```python
class Solution:
    def findFinalValue(self, nums: List[int], original: int) -> int:
        while original in nums:
            original *= 2
        return original
```

贴一个[灵茶山艾府大佬](https://leetcode-cn.com/problems/keep-multiplying-found-values-by-two/solution/ha-xi-biao-mo-ni-by-endlesscheng-ipk3/)的时间 O(n) 空间 O(1) 的方法：

```cpp
class Solution {
public:
    int findFinalValue(vector<int> &nums, int original) {
        int mask = 0;
        for (int num : nums) {
            if (num % original == 0) {
                int k = num / original; // 倍数
                if ((k & (k - 1)) == 0) { // 倍数是 2 的幂次
                    mask |= k;
                }
            }
        }
        mask = ~mask; // 取反后，找最低位的 1（lowbit = mask & -mask）
        return original * (mask & -mask);
    }
};
```

# 2 - [2155. All Divisions With the Highest Score of a Binary Array](https://leetcode.com/problems/all-divisions-with-the-highest-score-of-a-binary-array/)

```python
class Solution:
    def maxScoreIndices(self, nums: List[int]) -> List[int]:
        left, right = 0, sum(nums)
        maxScore = right
        ans = [0]
        for i in range(len(nums)):
            if nums[i] == 0: left += 1
            else: right -= 1
                
            if left + right > maxScore:
                maxScore = left + right
                ans = [i + 1]
            elif left + right == maxScore:
                ans.append(i + 1)
        return ans
```

# 3 - [2156. Find Substring With Given Hash Value](https://leetcode.com/problems/find-substring-with-given-hash-value/)

```python
class Solution:
    def subStrHash(self, s: str, power: int, modulo: int, k: int, hashValue: int) -> str:
        n = len(s)
        ans = hv = 0
        mk = (power ** k) % modulo
        
        for i in range(n - 1, -1, -1):
            hv = (hv * power + ord(s[i]) - 97 + 1) % modulo
            if i + k < n:
                hv = (hv - ((ord(s[i + k]) - 97 + 1) * mk)) % modulo
            if hv == hashValue:
                ans = i
        return s[ans: ans+k]
```

倒着滑的滑动窗口。在比赛中尝试正着滑 TLE 了。

# 4 - [2157. Groups of Strings](https://leetcode.com/problems/groups-of-strings/)

首先来一个比赛时候的 77/97 的 TLE 写法：

```python
class Solution:
    def groupStrings(self, words: List[str]) -> List[int]:
        n = len(words)
        masks = [sum([1 << (ord(c) - ord('a')) for c in word]) for word in words]
        d = defaultdict(list)
        for i in range(n):
            d[len(words[i])].append(i)
        
        def getRoot(uf, x):
            while uf[x] != -1:
                x = uf[x]
            return x
        
        def union(uf, a, b):
            ra = getRoot(uf, a)
            rb = getRoot(uf, b)
            if ra != rb:
                uf[ra] = rb

        uf = [-1] * n
        for k, lst in d.items():
            for i in range(len(lst)):
                a = lst[i]
                for j in range(i + 1, len(lst)):
                    b = lst[j]
                    c = masks[a] ^ masks[b]
                    c2 = (c & (c - 1))
                    if c == 0 or (c2 & (c2 - 1)) == 0:
                        union(uf, a, b)

            if k + 1 in d:
                lst2 = d[k + 1]
                for a in lst:
                    for b in lst2:
                        c = masks[a] ^ masks[b]
                        if c == 0 or (c & (c - 1)) == 0:
                            union(uf, a, b)

        roots = defaultdict(list)
        for x in range(n):
            roots[getRoot(uf, x)].append(x)
        return [len(roots.keys()), len(max(roots.values(), key=len))]
```

以下参考自 [[Python] carefull dfs with bitmasks explained.](https://leetcode.com/problems/groups-of-strings/discuss/1730113/Python-carefull-dfs-with-bitmasks-explained.)

```python
class Solution:
    def groupStrings(self, w):
        M = {sum(1<<(ord(i) - ord("a")) for i in word): j for j, word in enumerate(w)}

        G = defaultdict(list)
        masks = defaultdict(list)
        for idx, word in enumerate(w):
            vals = [ord(i) - ord("a") for i in word]
            mask = sum(1<<i for i in vals)
            for i in vals:
                masks[mask - (1<<i) + (1<<26)].append(idx)
                if mask - (1<<i) not in M: continue
                idx2 = M[mask - (1<<i)]
                G[idx] += [idx2]
                G[idx2] += [idx]
        
        for x in masks.values():
            for a, b in zip(x, x[1:]):
                G[a] += [b]
                G[b] += [a]

        V, comps, r = set(), 0, 0
        for u in range(len(w)):
            if u in V: continue
            compsize, q = 1, [u]
            V.add(u)
            while q:
                u = q.pop()
                for v in G[u]:
                    if v in V: continue
                    compsize += 1
                    V.add(v)
                    q += [v]
            r = max(r, compsize)
            comps += 1
        return [comps, r]
```

!!昨天做了噩梦。实习转正失败，说明我和wy之间肯定有一个以上的sb，是谁我不好说!!