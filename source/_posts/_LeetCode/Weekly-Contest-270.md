---
title: Weekly Contest 270
date: 2021-12-05 20:03:40
categories: 
  - LeetCode
tags: 
  - LeetCode 
---

# Weekly Contest (2021/12/5) 

## 1 - [2094. Finding 3-Digit Even Numbers](https://leetcode.com/problems/finding-3-digit-even-numbers/)

返回由 `digits` 中的数字组成的满足条件的三位数。

```python lc2094-1.py 
class Solution:
    def findEvenNumbers(self, digits: List[int]) -> List[int]:
        digits.sort() 
        n = len(digits) 
        ans = set() 
        for i, di in enumerate(digits): 
            if di == 0: continue 
            for j, dj in enumerate(digits): 
                if i == j: continue 
                for k, dk in enumerate(digits): 
                    if i == k or j == k: continue 
                    num = di * 100 + dj * 10 + dk 
                    if num % 2 == 0: ans.add(num) 
        return sorted(list(ans))
```

时间上不是很好，只有 10%。

下面看一个解答区的答案：

```python lc2094-2.py 
class Solution:
    def findEvenNumbers(self, digits: List[int]) -> List[int]:
        res, cnt = [], Counter(digits)
        for i in range(1, 10):
            for j in range(0, 10):
                for k in range(0, 10, 2):
                    if cnt[i] > 0 and cnt[j] > (i == j) and cnt[k] > (k == i) + (k == j):
                        res.append(i * 100 + j * 10 + k)
        return res
```

一举超过 80%。

上面 `cnt[i] > 0 and cnt[j] > (i == j) and cnt[k] > (k == i) + (k == j)` 兼具判断是否存在和判断次数的功能。

用 C++ 的解法实现真正的双百。

```cpp lc2094-3.cpp
class Solution {
public:
    vector<int> findEvenNumbers(vector<int>& digits) {
        vector<int> res; 
        int cnt[10] = {}; 
        for (auto d: digits) 
            cnt[d]++; 
        for (int i = 1; i < 10; i++) {
            for (int j = 0; cnt[i] > 0 && j < 10; j++) {
                for (int k = 0; cnt[j] > (i == j) && k < 10; k += 2) {
                    if (cnt[k] > (k == i) + (k == j)) 
                        res.push_back(i * 100 + j * 10 + k); 
                }
            }
        }
        return res; 
    }
};
```

## 2 - [2095. Delete the Middle Node of a Linked List](https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/)

可以使用快慢指针的方法。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def deleteMiddle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        hair = ListNode(0, head) 
        slow, fast = hair, head 
        cnt = 0 
        while fast.next: 
            if cnt % 2 == 0: 
                slow = slow.next 
            fast = fast.next 
            cnt += 1 
        slow.next = slow.next.next 
        return hair.next
```

类似的问题都有一个奇数时中间点偏向的问题，对应就是向上取整和向下取整。在快慢指针上可以表现为慢指针什么时候前进。

要注意：

- 要有一个 hair 指向 head，可能出现只有一个结点的情况。
- `slow` 前进的时机很重要，对应向上取整和向下取整。

一开始没有用 hair 而是直接返回的 head。没想到当只有一个结点时也要删除……因此 WA 一发。所以做链表的题最好都在前面加上一个 `dummy` 或 `hair` （因为 `head` 前面就是 `hair` ，跟群里大佬学的）。

## 3 - [2096. Step-By-Step Directions From a Binary Tree Node to Another](https://leetcode.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another/)

n 个结点，给出起始点和终点，返回从起始点到终点的操作，操作一共有三种：U、L、R 分别表示走向父结点、走向左子结点、走向右子结点。

一种很显然的方法是用递归做。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def getDirections(self, root: Optional[TreeNode], startValue: int, destValue: int) -> str:
        def recur(root): 
            # result: (start_found, dest_found, res_str) 
            if not root: return [False, False, ""] 
            cur = [root.val == startValue, root.val == destValue, ""] 
            l, r = recur(root.left), recur(root.right) 
            
            if l[0] and l[1]: return l 
            if r[0] and r[1]: return r 
            
            if l[0] and r[1]: return [True, True, l[2] + "UR" + r[2]] 
            if l[0] and cur[1]: return [True, True, l[2] + "U"] 
            if r[0] and l[1]: return [True, True, r[2] + "UL" + l[2]] 
            if r[0] and cur[1]: return [True, True, r[2] + "U"] 
            if cur[0] and l[1]: return [True, True, "L" + l[2]] 
            if cur[0] and r[1]: return [True, True, "R" + r[2]]
            
            if l[0]: l[2] += "U"; return l 
            if l[1]: l[2] = "L" + l[2]; return l 
            if r[0]: r[2] += "U"; return r 
            if r[1]: r[2] = "R" + r[2]; return r 
            return cur 
        
        return recur(root)[2]
```

很直观但是情况有点多。

下面再抄一个大佬的解法：

[[Python3] lca - LeetCode Discuss](https://leetcode.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another/discuss/1612179/Python3-lca)

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def getDirections(self, root: Optional[TreeNode], startValue: int, destValue: int) -> str:
        
        def lca(node): 
            """Return lowest common ancestor of start and dest nodes."""
            if not node or node.val in (startValue , destValue): return node 
            left, right = lca(node.left), lca(node.right)
            return node if left and right else left or right
        
        root = lca(root) # only this sub-tree matters
        
        def fn(val): 
            """Return path from root to node with val."""
            stack = [(root, "")]
            while stack: 
                node, path = stack.pop()
                if node.val == val: return path 
                if node.left: stack.append((node.left, path + "L"))
                if node.right: stack.append((node.right, path + "R"))
        
        path0 = fn(startValue)
        path1 = fn(destValue)
        return "U"*len(path0) + path1
```

先找 lca （最近公共祖先），然后用 dfs 找从 lca 到 start 和 dest 的路径。

## 4 - [2097. Valid Arrangement of Pairs](https://leetcode.com/problems/valid-arrangement-of-pairs/)

重新排列 pairs 使得 `pairs[i][0] == pairs[i-1][0] and pairs[i][1] == pairs[i+1][0]` 。可以抽象成求欧拉通路的问题。

这一题和 332 相似：

[Reconstruct Itinerary - LeetCode](https://leetcode.com/problems/reconstruct-itinerary/)

直接看群内大佬的做法，一开始的和精简后的：

[【感谢残酷群！】最短代码不解释](https://leetcode-cn.com/problems/valid-arrangement-of-pairs/solution/zui-duan-dai-ma-bu-jie-shi-by-freeyourmi-ybkb/)

```python lc2097-1.py
class Solution:
    def validArrangement(self, pairs: List[List[int]]) -> List[List[int]]:
        def dfs(curr):
            while vec[curr]:
                tmp = heapq.heappop(vec[curr])
                dfs(tmp)
            stack.append(curr)
        vec, c, stack = defaultdict(list), Counter(), []
        for depart, arrive in pairs:
            c[depart] += 1
            c[arrive] -= 1
            vec[depart].append(arrive)
        for key in vec:
            heapq.heapify(vec[key])
        for s, v in c.items():
            if v == 1: break
        dfs(s)
        return [[stack[i], stack[i - 1]] for i in range(len(stack) - 1, 0, -1)]
```

```python lc2097-2.py
class Solution:
    def validArrangement(self, pairs: List[List[int]]) -> List[List[int]]:
        def dfs(curr):
            while vec[curr]: dfs(vec[curr].pop())
            stack.append(curr)
        vec, c, stack = defaultdict(list), Counter(), []
        for u, v in pairs:
            c[u] += 1
            c[v] -= 1z
            vec[u].append(v)
        dfs(c.most_common(1)[0][0])
        return [[stack[i], stack[i - 1]] for i in range(len(stack) - 1, 0, -1)]
```

第二种会清晰很多。

算法正确性上：一开始找的是出度为 1 的节点，如果没有则要看 `most_common` 返回的是什么，总的来说无伤大雅。每次 dfs 时，进入一个节点肯定有办法出来，因为除了起始点和终止点之外都有偶数个边连接着。

这种算法被称为求解欧拉通路的 Hierholzer 算法。
