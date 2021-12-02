---
title: Binary Search
date: 2021-11-28 16:43:59
categories: 
  - Data Structures And Algorithms
tags: 
  - Data Structures And Algorithms
  - Binary Search
---

## 不同的写法

为什么要研究几种不同的写法？说到底只是闲的无聊罢了。

### 写法一

翻译自 [Variants of Binary Search](https://www.geeksforgeeks.org/variants-of-binary-search/) 。

```python binary_search_1.py
def contains(nums, low, high, key): 
    ans = False  
    while low <= high: 
        mid = (low + high) // 2 
        if nums[mid] < key: 
            low = mid + 1 
        elif nums[mid] > key: 
            high = mid - 1 
        elif nums[mid] == key: 
            return True 
    return False 

def first(nums, low, high, key): 
    ans = -1 
    while low <= high: 
        mid = (low + high + 1) // 2 
        if nums[mid] < key: 
            low = mid + 1; 
        elif nums[mid] > key: 
            high = mid - 1 
        elif nums[mid] == key: 
            ans = mid 
            high = mid - 1 
    return ans

def last(nums, low, high, key): 
    ans = -1 
    while low <= high: 
        mid = (low + high + 1) // 2 
        if nums[mid] < key: 
            low = mid + 1 
        elif nums[mid] > key: 
            high = mid - 1 
        elif nums[mid] == key: 
            ans = mid; 
            low = mid + 1; 
    return ans 

def leastgreater(nums, low, high, key): 
    ans = -1 
    while low <= high: 
        mid = (low + high + 1) // 2 
        if nums[mid] < key: 
            low = mid + 1 
        elif nums[mid] > key: 
            ans = mid 
            high = mid - 1 
        elif nums[mid] == key: 
            low = mid + 1 
    return ans 

def greatestlesser(nums, low, high, key): 
    ans = -1 
    while low <= high: 
        mid = (low + high + 1) // 2 
        if nums[mid] < key: 
            ans = mid 
            low = mid + 1 
        elif nums[mid] > key: 
            high = mid - 1 
        elif nums[mid] == key: 
            high = mid - 1 
    return ans 
```

没啥好说的，很好理解。

### 写法二

写法二来自于 `Python` 模块：[`bisect`](https://docs.python.org/3/library/bisect.html#module-bisect) — Array bisection algorithm

`bisect` 模块目的是维护一个有序数组，在向有序数组中插入元素时可以用来得到应该用来插入的下标之后自己 `insert` ，也可以直接使用对应的插入方法得到插入后的结果。有下面四种不同的方法，

* `bisect_left` 
* `bisect` 和 `bisect_right` 
* `insort_left` 
* `insort` 和 `insort_right` 

一般都是左闭右开风格，也就是传递的参数**包括 `low`** 但**不包括 `high`** ，返回的结果是连续的 `key` 中的**第一个**或者是**最后一个加一**。 `bisect_left` 在 `key` 不存在时等效于 `greatestlesser` ，在 `key` 存在时等效于 `first`； `bisect_right` 无论 `key` 存不存在都等效于 `leastgreater`。

`bisect_left` 和 `bisect_right` 的实现和下面类似：

```python bisect.py
def bisect_left(nums, low, high, key): 
    while low < high: 
        mid = (low + high) // 2 
        if nums[mid] < key: low = mid + 1 
        else: high = mid 
    return low 

def bisect_right(nums, low, high, key): 
    while low < high: 
        mid = (low + high) // 2 
        if nums[mid] <= key: low = mid + 1 
        else: high = mid 
    return low 
```

（顺便一提，要看 `Python` 模块源码可以把模块 `import` 进来之后打印模块的 `__file__` 属性，就可以看到源码文件了。）

（或者也可以看 [TheAlgorithms/Python](https://github.com/TheAlgorithms/Python) 的 binary search 实现。都是一样的。）

下面把一开始的五种方法叫做写法一，`bisect` 的写法叫做写法二。写法一好理解一些，不过更推荐写法二。

关于这两种写法，直接接触写法二可能经常会疑惑，建议先把写法一的五种区别看懂，然后做题时考虑需要用写法一的具体哪一个，然后实现可以用写法二。

另外一般情况下都不会直接使用 `nums[mid]` 作为标准比较的，一般还会把用 `mid` 经过一系列运算得到的结果和一个值比较。

### 复杂的问题往往只需要最简单的代码

这子标题，您给翻译翻译？

既然 Python 里有使用二分的方法，那么除了维护有序数组，可不可以利用这个方法解决其他需要二分的问题？

当然可以， `bisect` 模块的 `bisect_left` 和 `bisect_right` 方法，它们虽然是创造出来用于维护有序数组的，我们还是可以通过利用 Python 的特性和对于问题的精确把握来解决。俗话说的好，复杂的问题往往只需要最简单的代码……

话不多说，先看一个。[LC 1898. Maximum Number of Removable Characters](https://leetcode.com/problems/maximum-number-of-removable-characters/)

```python lc1898-1.py
class Solution:
    def maximumRemovals(self, s: str, p: str, removable: List[int]) -> int:
        class A: 
            def __getitem__(self, k): 
                banned = set(removable[: k+1]) 
                ss = iter(c for i, c in enumerate(s) if i not in banned) 
                return not all(c in ss for c in p) # 
        return bisect_left(A(), True, 0, len(removable)) 
```

上面的代码有四个知识点：

1. `iter` 方法获取一个迭代器，要注意这个迭代器要在 `all` 方法外面初始化，否则如果写成 `all(c in iter(...) for c in p)` 则对每个 `c` 都会形成一个新的迭代器。
2. `all` 方法判断所有都满足才返回 `True` 。 `all(c in ss for c in p)` ，迭代器只能往前走，`c in ss` 会一直让迭代器往前直到找到 `c` 或者到达末尾。对于 `p` 中的每个字母都进行一下再 `all` 一下，效果就是判断 `p` 是不是 `s` 的子序列（注意子序列 subsequence 和子串 substring 的不同）。
3. `bisect_left` 是 `Python` 的二分搜索方法，来自 `bisect` 模块。读者可以自己搜索用法。
4. `bisect_left` 的第一个参数是数组，为什么可以传一个对象完成任务？只要有 `__getitem__` 方法就能通过中括号 `[]` 的方式取值。

类似的，所有的二分搜索问题，如果不是直接的数组，都可以借助这样的方法来写（大概吧）。

## 亿点点练习题

下面来亿点练习题。英文苦手可以去 [leetcode-cn](https://leetcode-cn.com/) 找相关题目。

### [LC 378. Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) 

给出从左上角到右下角非递减的矩阵，返回矩阵中的第 `k` 小的元素。

```python lc378-1.py
class Solution:
    def kthSmallest(self, matrix: List[List[int]], k: int) -> int:
        n = len(matrix) 
        count = lambda val: sum([1 if matrix[i // n][i % n] <= val else 0 for i in range(n * n)]) 
        low, high = matrix[0][0], matrix[-1][-1] 
        while low < high: 
            mid = (low + high) // 2 
            if count(mid) < k: 
                low = mid + 1 
            else: 
                high = mid 
        return low 
```

这道题二分搜索肯定不是最优的，只是以这道题为例练习二分。

首先考虑 `count` 函数，用来统计小于等于 `val` 的值的个数。这样相当于做一个从 元素 到 小于等于这个元素的元素个数 的映射，我们要找的就是刚好是 `k` 的时候，也就是 `first` ，而 `k` 一定存在且只有一个，也就和 `last` 和 `bisect_left` 都是等效的。

### [LC 668. Kth Smallest Number in Multiplication Table](https://leetcode.com/problems/kth-smallest-number-in-multiplication-table/)

给出一张 `m*n` 的乘法表和一个正整数 `k`，返回表中第 `k` 小的数字。

```python lc668-1.py
class Solution:
    def findKthNumber(self, m: int, n: int, k: int) -> int:
        if m > n: m, n = n, m 
        count = lambda val: sum(min(val // r, n) for r in range(1, m + 1)) 
        left, right = 1, m * n 
        while left < right: 
            mid = (left + right) // 2 
            if count(mid) < k: left = mid + 1 
            else: right = mid 
        return left 
```

同样先考虑 `count` 函数，也是用来统计小于等于 `val` 的值的个数。`k` 一定存在且只有一个，仍然是 `first == last == bisect_left`。

### [LC 704. Binary Search](https://leetcode.com/problems/binary-search/)

给出一个递增的数组和一个数字，找出这个数字在数组中的下标，如果不存在则返回 -1。

```python lc704-1.py
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        low, high = 0, len(nums) 
        while low < high: 
            mid = (low + high) // 2 
            if nums[mid] < target: low = mid + 1 
            else: high = mid 
        return low if low < len(nums) and nums[low] == target else -1 
```

这个不用自己定义 `mid` 的操作函数，直接用 `nums[mid]` 就可以。这里的 `target` 不一定存在，所以用 `bisect_left` 结束之后要判断一下 `nums[low]` 是不是 `target`，不是的话返回 `-1` 。

这个可以直接用 `bisect_left`，就没啥可说的了。

### [LC 719. Find K-th Smallest Pair Distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance/)

给出一个数组 nums 和数字 k，返回所有数对之间的第 k 个最小距离（距离定义为数对的两个数的绝对差值）。

```python lc719-1.py
class Solution:
    def smallestDistancePair(self, nums: List[int], k: int) -> int:
        def count_le(dist): 
            cnt, i, j = 0, 0, 0 
            while i < n or j < n: 
                while j < n and nums[j] - nums[i] <= dist: 
                    j += 1 
                cnt += j - i - 1 
                i += 1 
            return cnt 
        
        nums.sort() 
        n = len(nums) 
        low, high = 0, nums[-1] - nums[0] + 1 
        while low < high: 
            mid = (low + high) // 2 
            if count_le(mid) < k: low = mid + 1 
            else: high = mid 
        return low 
```

没想到吧，这个题也能用二分。

`count_le` 计算小于等于 `dist` 的个数，映射过去的值域可能是 `[1, ..., k-1, k, k+1, ...]`，既然结果一定有 `k` 那么用 `bisect_left` 即可。

### [LC 1898. Maximum Number of Removable Characters](https://leetcode.com/problems/maximum-number-of-removable-characters/submissions/)

到了上面说的 1898 了。给出两个字符串 s 和 p ，还有一个数组 removable 表示要从 s 中移除的下标。在保持 p 是 s 的子序列的情况下，求可以移除的最大数目。

```python lc1898-2.py
class Solution:
    def maximumRemovals(self, s: str, p: str, removable: List[int]) -> int:
        def sub_seq(r): 
            j = 0 
            for i in range(len(s)): 
                if i not in r and j < len(p) and s[i] == p[j]: 
                    j += 1 
            return j == len(p) 
        
        low, high = 0, len(removable) 
        while low < high: 
            mid = (low + high) // 2 
            if sub_seq(set(removable[: mid+1])): low = mid + 1 
            else: high = mid 
        return low 
```

这里定义的对 `mid` 的处理，是判断 [p] 是不是 [s] 的子序列，可以想到这个函数是一个从 [removable] 到 `[True, ..., True, False, ... False]` 的映射，`True` 可能有零个或多个，`False` 也可能有一个或多个。那么我们要找的是 `first False` 还是 `last True` 呢？  

找哪个都行，只不过找 `first False` 比较方便使用 `bisect_left`，所以就找这个了。只要传递一个 `set(removable[: mid+1])`，也就是传入了前 `mid + 1` 个，最后的结果是这样的：`removable[: mid]` 的结果是 `True` 而 `removable[: mid+1]` 的结果是 `False`，所以结果就是最多有 `mid` 个，不用任何处理返回 `low` 即可。

回过头看上面的 `1898-1.py`，还需要注意的是 `bisect_left` 的内部实现，是比大小的。`True` 一般看成 `1`，而 `False` 一般看成 `0`，所以要是直接 `all(c in ss for c in p)` 的话，映射过去的值域将是这样的：`[1, ..., 1, 0, ..., 0]`，但是 `bisect_left` 需要的是递增的数组，所以结果是错误的，所以要 `not all(c in ss for c in p)`，然后找 `first True`。

### [LC 2064. Minimized Maximum of Products Distributed to Any Store](https://leetcode.com/problems/minimized-maximum-of-products-distributed-to-any-store/)

先放一个用内建的，之后再更新。

```python lc2064-2.py 
class Solution:
    def minimizedMaximum(self, n: int, quantities: List[int]) -> int:
        class A: 
            def __getitem__(self, x): 
                return sum(1 + (q - 1) // x for q in quantities) <= n 
        return bisect_left(A(), True, 1, max(quantities) + 1) 
```

### [LC 2071. Maximum Number of Tasks You Can Assign](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign/)

有 n 个任务和 m 个工人，还有 pills 片吃下能够增加工人 strength 力量的药片，一个工人最多只能吃一片药，问最多能够完成几项任务。（什么资本家）

```python lc2071-1.py
class Solution:
    def maxTaskAssign(self, tasks: List[int], workers: List[int], pills: int, strength: int) -> int:
        n, m = len(tasks), len(workers) 
        tasks.sort() 
        workers.sort() 

        def helper(x): 
            if x == 0: return True # be careful when x == 0 
            p, ti, q = pills, 0, deque() 
            for w in workers[-x:]: 
                while ti < x and tasks[ti] <= w + strength: 
                    q.append(tasks[ti]) 
                    ti += 1 
                if not q: return False 
                if q[0] <= w: q.popleft() 
                elif not p: return False 
                else: p -= 1; q.pop() 
            return True 
        
        low, high = 0, min(n, m) + 1 
        while low < high: 
            mid = (low + high) // 2 
            if helper(mid): low = mid + 1 
            else: high = mid 
        return max(0, low - 1)
```

可能是我目前为止做的最痛苦的一道，写完就感觉爽了。

首先要想清楚映射函数的值域，前面都是 True，后面都是 False。其次要想清楚传入的值的意义，是说看看能不能完成 x 个任务，那么是要计算 first False 还是 last True呢？要求的是最多能完成多少个任务，所以是 last True，这个感觉很容易想歪。

最后要看映射函数怎么写，可以说是贪心的思想。按照力量从小到大遍历工人，如果有不吃药就能做的任务，就做能做的中需求最小的，如果必须要吃药才有能做的，就做能做的中需求最大的。还有一个点是 workers[-x:] 选择最后 x 个人，要小心 `x == 0` 的情况。

再仔细想想，这个题需要把大问题拆分为两个小问题，还是很有意思的。

其实上面还是借鉴的下面一个大佬的写法。

```python lc2071-2.py
class Solution:
    def maxTaskAssign(self, tasks: List[int], workers: List[int], pills: int, strength: int) -> int:
        tasks.sort(); workers.sort() 
        class A: 
            def __getitem__(self, x): 
                p, ti, tbd = pills, 0, deque() 
                for w in workers[-x:]:
                    while ti < x and tasks[ti] <= w + strength: 
                        tbd.append(tasks[ti]) 
                        ti += 1 
                    if not tbd: return True 
                    if tbd[0] <= w: tbd.popleft() 
                    elif not p: return True 
                    else: p -= 1; tbd.pop() 
                return False 
        return max(0, bisect_left(A(), True, 0, 1 + min(len(tasks), len(workers))) - 1)
```

还有一个大佬的 c++ 内存池写法，暂时留下以后看。

```cpp lc2071-3.cpp
auto set_pmr = []{
    static byte buffer [1 << 30]; 
    static pmr::monotonic_buffer_resource pool {data(buffer), size(buffer)}; 
    set_default_resource(&pool); 
    return 0; 
}(); 

class Solution {
public: 
    int maxTaskAssign(vector<int>& tasks, vector<int>& workers, int pills, int strength) {
        sort(begin(tasks), end(tasks)); 
        sort(begin(workers), end(workers), greater<>()); 
        int l = 0, r = size(tasks); 
        auto check = [&](auto x, auto cnt) {
            if (x > size(workers)) return false; 
            pmr::multiset<int> st(begin(workers), begin(workers) + x); 
            for (int i = x - 1; i >= 0; i--) {
                auto pos = st.lower_bound(tasks[i]); 
                if (pos != end(st)) st.erase(pos); 
                else if (cnt) {
                    pos = st.lower_bound(tasks[i] - strength); 
                    if (pos != end(st)) st.erase(pos), cnt--; 
                    else return false; 
                }
                else return false; 
            }
            return true; 
        }; 
        while (l < r) {
            auto mid = (l + r + 1) >> 1; 
            if (check(mid, pills)) l = mid; 
            else r = mid - 1; 
        }
        return l; 
    }
}; 
```