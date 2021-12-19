---
title: Binary Tree Traversal
date: 2021-12-17 22:51:44
categories: 
  - Data Structures and Algorithms
tags: 
  - Data Structures and Algorithms
  - Binary Tree Traversal
---



Binary Tree Traversal 二叉树遍历。

前序、中序、后序遍历用到的数据结构都是栈，使用 Python 的 `list` 来表示栈，有 `append()` 和 `pop()` 方法，都是 `O(1)` 时间。需要注意的是 list 的带参数的 `pop(i)` 复杂度是 `O(n)` 。（所以一般如果要用队列的话最好不要用 `list` 而是用 `collections.deque()` 的 `append()` 和 `popleft()` 来达到 `O(1)` 。）

# 前序遍历

LeetCode 模板题：[144. 二叉树的前序遍历](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)

顺序是**根左右**。

递归版：

```python preorder-recur.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root: return []
        return [root.val] + self.preorderTraversal(root.left) + self.preorderTraversal(root.right)
```

迭代算法的思路是使用一个栈，每次操作从栈顶弹出一个结点来操作，把结点的值放到结果列表中，再依次压入右结点、左结点。

迭代版：

```python preorder-iter-1.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root: return []
        ans = []
        stk = [root]
        while stk:
            node = stk.pop()
            ans.append(node.val)
            if node.right: stk.append(node.right)
            if node.left: stk.append(node.left)
        return ans
```



# 中序遍历

LeetCode 模板题：[94. 二叉树的中序遍历](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

顺序是**左右根**。

```python inorder-recur.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root: return []
        return self.inorderTraversal(root.left) + [root.val] + self.inorderTraversal(root.right)
```

迭代算法的思路是从根节点开始，将每个考察到的结点压入栈中，然后走向他的左结点，直到左节点为空时停止，弹出栈顶的结点并将这个结点的值放到结果列表中，之后考察其右节点，继续循环。

```python inorder-iter-1.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root: return []
        ans, stk, node = [], [], root
        while node or stk:
            while node:
                stk.append(node)
                node = node.left
            node = stk.pop()
            ans.append(node.val)
            node = node.right
        return ans
```

中序遍历的这种写法很容易推广到前序和后序，之后会说这样的统一写法。



# 后序遍历

LeetCode 模板题：[145. 二叉树的后序遍历](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/)

顺序是**左右根**。

递归版：

```python postorder-recur.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root: return []
        return self.postorderTraversal(root.left) + self.postorderTraversal(root.right) + [root.val]
```

迭代算法的思路有两种。

一种是观察后序遍历和先序遍历的联系，后序是**左右根**，先序是**根左右**，可以很轻易的稍微改一改先序的程序，使之输出**根右左**，然后把结果反转一下就是最终结果**左右根**。

另一种是记录之前访问到的最前面的右结点 lastVisit ，访问到一个结点时，如果上一个访问到的就是这个结点的右结点，则可以把这个结点的值放入结果列表，并且更新栈和 lastVisit 。如果不是，则访问它的右结点即可。

下面分别是这两种方法。反转根右左：

```python postorder-iter-1.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root: return []
        ans = []
        stk = [root]
        while stk:
            node = stk.pop()
            ans.append(node.val)
            if node.left: stk.append(node.left)
            if node.right: stk.append(node.right)
        return ans[::-1]
```

记录上一个右结点：

```python postorder-iter-2.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root: return []
        ans = []
        stk = []
        node = lastVisit = root
        while node or stk:
            while node:
                stk.append(node)
                node = node.left
            if stk[-1].right and stk[-1].right != lastVisit:
                node = stk[-1].right
            else:
                ans.append(stk[-1].val)
                lastVisit = stk[-1]
                stk.pop()
        return ans
```



# 前序中序后序统一写法

话不多说，直接把代码放到一起。

前序遍历：

```python preorder-iter-2.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root: return []
        ans, stk, node = [], [], root
        while node or stk:
            while node:
                ans.append(node.val)
                stk.append(node)
                node = node.left
            node = stk.pop()
            node = node.right
        return ans
```

中序遍历：

```python inorder-iter-1.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root: return []
        ans, stk, node = [], [], root
        while node or stk:
            while node:
                stk.append(node)
                node = node.left
            node = stk.pop()
            ans.append(node.val)
            node = node.right
        return ans
```

后序遍历：

```python postorder-iter-3.py
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root: return []
        ans, stk, node = [], [], root
        while node or stk:
            while node:
                ans.append(node.val)
                stk.append(node)
                node = node.right
            node = stk.pop()
            node = node.left
        return ans[::-1]
```

三种算法都可以用相似的方式实现出来，这就是前序中序后序统一写法，方便记忆。





