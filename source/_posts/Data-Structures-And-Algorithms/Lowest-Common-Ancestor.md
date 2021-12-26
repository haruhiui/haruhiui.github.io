---
title: Lowest Common Ancestor
date: 2021-12-23 18:54:47
categories: 
  - Data Structures and Algorithms
tags: 
  - Data Structures and Algorithms
  - Lowest Common Ancestor
---

# LCA

一个树的 Lowest Common Ancestor 最近公共祖先。

这篇文章主要目的是在于寻找解决类似 LCA 问题的统一方法。!!就图一乐!!

# 两个结点都存在

LeetCode 模板题：[236. 二叉树的最近公共祖先](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/)

```python lc236.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        def findLca(root, p, q):
            if root in (None, p, q): return root
            l, r = findLca(root.left, p, q), findLca(root.right, p, q)
            return root if (l and r) else (l or r)
        return findLca(root, p, q)
```

迭代写法可以参考：[Iterative Solutions in Python/C++](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/discuss/65245/Iterative-Solutions-in-PythonC%2B%2B)

# 两个结点不一定存在

上面这道题保证 p 和 q 一定存在于这棵树中，如果其中之一不存在的话，需要用其他方法。

比如这道题 [1644. 二叉树的最近公共祖先 II](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree-ii/) 就是可能不存在的情况。

第一种写法，我愿称之为万能的混沌法。利用 Python 中函数可以返回多个值的特性，全都交给递归函数去做。情况很难写全。

这道题三个返回值分别表示 p 是否在子树中、q 是否在子树中、如果都 p 和 q 都有的话它们的 lca。

```python lc1644-1.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        def recur(root, p, q):
            if not root: return False, False, None
            l, r = recur(root.left, p, q), recur(root.right, p, q)
            if l[0] and l[1]: return l
            if r[0] and r[1]: return r
            if l[0] and r[1]: return True, True, root
            if r[0] and l[1]: return True, True, root

            if (l[0] or r[0]) and root == q: return True, True, root
            if (l[1] or r[1]) and root == p: return True, True, root

            if l[0] or l[1]: return l
            if r[0] or r[1]: return r

            return root == p, root == q, None

        return recur(root, p, q)[2]
```

第二种方法，利用递归外变量，就不用全都让递归函数返回了。我把这种方法称为 nonlocal+recur。

利用好 nonlocal 变量，只要返回一个值就可以达到目的。很容易就可以区分开哪一个该使用 nonlocal 表示、哪一个用 recur 返回：只改变一次的用 nonlocal，每次都不同的用参数传递或者在 recur 中返回。

这道题中 nonlocal 变量表示 lca 本身，recur 返回值是这课子树有没有 p 或 q。lca 只会被修改一次。

```python lc1644-2.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        lca = None

        def findLca(root, p, q):
            nonlocal lca
            if not root: return None
            l, r = findLca(root.left, p, q), findLca(root.right, p, q)
            if l and r: lca = root
            if (l or r) and (root == p or root == q): lca = root
            return l or r or root == p or root == q

        findLca(root, p, q)
        return lca
```

后面我们经常会看到混沌法和 nonlocal+recur 这两种方法。

# 多个结点都一定在

[1676. 二叉树的最近公共祖先 IV](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree-iv/)

因为结点一定存在，所以不需要让递归函数返回结点是否存在，直接返回结果即可。也用不到 nonlocal 变量。

```python lc1676-1.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', nodes: 'List[TreeNode]') -> 'TreeNode':
        def findLca(root, nodes):
            if root in nodes + [None]: return root
            l, r = findLca(root.left, nodes), findLca(root.right, nodes)
            if l and r: return root
            return l or r
        return findLca(root, nodes)
```

# 所有深度最深的叶结点 lca

[1123. 最深叶节点的最近公共祖先](https://leetcode-cn.com/problems/lowest-common-ancestor-of-deepest-leaves/) 这道题只是找所有最深的叶结点的 lca。最深的叶结点可能只有一个，可能有两个，也可能有多个。

先来最正常的方法，可以先找到所有深度最深的叶结点保存下来，然后逐个找 lca。

```python lc1123-1.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def lcaDeepestLeaves(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        
        lca = root
        def getLca(root, p, q):
            nonlocal lca
            if not root: return None
            l, r = getLca(root.left, p, q), getLca(root.right, p, q)
            if l and r: lca = root
            if (l or r) and (root == p or root == q): lca = root
            return l or r or root == p or root == q
        
        deepestLeaves = []
        maxDepth = 0
        def recur(root, depth):
            nonlocal maxDepth, deepestLeaves
            if not root: return
            if depth == maxDepth:
                deepestLeaves.append(root)
            if depth > maxDepth: 
                maxDepth = depth
                deepestLeaves = [root]
            recur(root.left, depth + 1)
            recur(root.right, depth + 1)
            
        recur(root, 0)
        lca = deepestLeaves.pop()
        while deepestLeaves:
            getLca(root, lca, deepestLeaves.pop())
        
        return lca
```

现在看上面这段简直是黑历史，为什么不直接用多个结点找 LCA 的模板呢。

不过太麻烦了，试试用混沌法做一下。

```python lc1123-2.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def lcaDeepestLeaves(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        def recur(root):
            if not root: return -1, None
            l, r = recur(root.left), recur(root.right)
            
            if l[0] < r[0]: return r[0] + 1, r[1]
            if l[0] > r[0]: return l[0] + 1, l[1]
            if l[0] == r[0]: return l[0] + 1, root
        
        return recur(root)[1]
```

对这道题来说，混沌法还算可以，不是特别混沌。

也可以用 nonlocal+recur：使用两个 nonlocal 变量，lca 和 depth，depth 表示当前知道的最深的深度。recur 函数接收两个参数，root 和 root 的深度 d，返回 root 子树最深的深度。

```python lc1123-3.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def lcaDeepestLeaves(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        lca = root
        depth = 0
        
        def recur(root, d):
            nonlocal lca, depth
            if not root: return d - 1
            depth = max(depth, d)
            l, r = recur(root.left, d + 1), recur(root.right, d + 1)
            if l == r == depth: lca = root
            return max(l, r)

        recur(root, 0)
        return lca
```

# 通过 LCA 求其他

## 两个结点间距离

求其他的问题，最经典的是求任意两个结点之间的距离：[1740. 找到二叉树中的距离](https://leetcode-cn.com/problems/find-distance-in-a-binary-tree/)

首先上一个正常的方法。先找到它们的 lca，然后从 lca 开始 dfs。

```python lc1740-2.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def findDistance(self, root: Optional[TreeNode], p: int, q: int) -> int:
        def findLca(root, p, q):
            if not root or root.val == p or root.val == q: return root
            l, r = findLca(root.left, p, q), findLca(root.right, p, q)
            if l and r: return root
            else: return l if l else r
        
        lca = findLca(root, p, q)
        ans = 0
        stk = [(lca, 0)]
        found = 0

        while stk and found < 2:
            node, depth = stk.pop()
            if not node: continue
            if node.val in (p, q):
                ans += depth
                found += 1
            stk.append((node.left, depth + 1))
            stk.append((node.right, depth + 1))

        return ans
```

然后用混沌法做一下。可以让第一个值表示是否找到了 p，第二个值表示是否找到了 q，最后一个值表示 p 和 q 之间的距离，或者已经找到的 p、q 之一与当前结点的距离。

```python lc1740-1.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def findDistance(self, root: Optional[TreeNode], p: int, q: int) -> int:
        def recur(root, p, q):
            if not root: return False, False, 0
            l, r = recur(root.left, p, q), recur(root.right, p, q)
            c = (root.val == p, root.val == q, 0)

            # print(root.val, l, r, c)
            if l[0] and l[1]: return l
            if r[0] and r[1]: return r
            if c[0] and c[1]: return c
            if (l[0] and r[1]) or (r[0] and l[1]): return True, True, l[2] + r[2] + 2
            if (l[0] and c[1]) or (c[0] and l[1]): return True, True, l[2] + 1
            if (r[0] and c[1]) or (c[0] and r[1]): return True, True, r[2] + 1

            if l[0] or r[0]: return True, False, max(l[2], r[2]) + 1
            if l[1] or r[1]: return False, True, max(l[2], r[2]) + 1
            return c

        return recur(root, p, q)[2]
```

要返回三个值，递归函数表示很累。

再用 nonlocal+recur 做一下。这道题中 recur 返回的值和 nonlocal 变量，分别表示目标结点距离当前结点的距离、两个目标结点之间的距离。

```python lc1740-3.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def findDistance(self, root: Optional[TreeNode], p: int, q: int) -> int:
        dist = 0
        def recur(root, p, q):
            nonlocal dist
            if not root: return -1
            l, r = recur(root.left, p, q), recur(root.right, p, q)
            if l != -1 and r != -1: dist = l + r + 2
            if (l != -1 or r != -1) and (root.val == p or root.val == q): dist = max(l, r) + 1
            if l != -1 or r != -1: return max(l, r) + 1
            if root.val == p or root.val == q: return 0
            return -1
            
        recur(root, p, q)
        return dist
```

## 一个结点到另一个结点的方向

[2096. 从二叉树一个节点到另一个节点每一步的方向](https://leetcode-cn.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another/)

正常的解法：先找这两个结点的 lca，然后从 lca 开始，使用 dfs，分别找从 lca 到这两个点的路径即可。参考自 [Discuss [Python3] lca](https://leetcode.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another/discuss/1612179/Python3-lca)。

```python lc2096-1.py
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

第二种混沌法。不是很想写出来，因为实在太混沌了。但是想想本文的目的就是图一乐，还是放出来吧。

```python lc2096-2.py
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

第三种 nonlocal+recur ……

```python lc2096-3.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def getDirections(self, root: Optional[TreeNode], startValue: int, destValue: int) -> str:
        ppath, qpath, ans = "", "", ""
        def recur(root, p, q):
            nonlocal ppath, qpath, ans
            if not root: return False
            l, r = recur(root.left, p, q), recur(root.right, p, q)
            if l and r:
                if l == p: ans = ppath + "UR" + qpath
                else: ans = ppath + "UL" + qpath
            elif l:
                if l == p: ppath = ppath + "U"
                if l == q: qpath = "L" + qpath
                if l == p and root.val == q: ans = ppath
                if l == q and root.val == p: ans = qpath
            elif r:
                if r == p: ppath = ppath + "U"
                if r == q: qpath = "R" + qpath
                if r == p and root.val == q: ans = ppath
                if r == q and root.val == p: ans = qpath
            
            if l == p or r == p or root.val == p: return p
            if l == q or r == q or root.val == q: return q
            return 0
        
        recur(root, startValue, destValue)
        return ans
```

写完这些我只想说，平平淡淡用正常的 lca+dfs 方法不好吗，这都什么玩意。!!累了毁灭吧!!

