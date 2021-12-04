---
title: Trie 
date: 2021-12-02 20:51:12
categories: 
  - Data Structures And Algorithms
tags: 
  - Data Structures And Algorithms
  - Trie 
---

## Trie 前缀树。

借鉴自 宫水三叶 大佬的 [【设计数据结构】实现 Trie (前缀树)](https://mp.weixin.qq.com/s?__biz=MzU4NDE3MTEyMA==&mid=2247488490&idx=1&sn=db2998cb0e5f08684ee1b6009b974089&chksm=fd9cb8f5caeb31e3f7f67dba981d8d01a24e26c93ead5491edb521c988adc0798d8acb6f9e9d&token=1006889101&lang=zh_CN#rd)。

Trie 树（又叫「前缀树」或「字典树」）是一种用于快速查询「某个字符串/字符前缀」是否存在的数据结构。

其核心是使用「边」来代表有无字符，使用「点」来记录是否为「单词结尾」以及「其后续字符串的字符是什么」。

### [208. 实现 Trie (前缀树)](https://leetcode-cn.com/problems/implement-trie-prefix-tree/)

实现 Trie 类：
* Trie() 初始化前缀树对象。
* void insert(String word) 向前缀树中插入字符串 word 。
* boolean search(String word) 如果字符串 word 在前缀树中，返回 true（即，在检索之前已经插入）；否则，返回 false 。
* boolean startsWith(String prefix) 如果之前已经插入的字符串 word 的前缀之一为 prefix ，返回 true ；否则，返回 false 。

总的来说，这三种操作都是三步。
* 第一步从起点开始。
* 第二步遍历字符串，在没有下一个 node 的时候根据方法的不同进行不同的操作，insert 创造新结点，search return False，startsWith return False，然后要更新 node。
* 第三步根据方法的返回结果或进行操作，insert 指出这个最后的 node 是叶结点、search 返回当前 node 是不是叶结点，startsWith 返回当前 node 是不是空的。

```python lc208-1.py
class Trie:

    def __init__(self):
        N = 100009
        self.index = 1 
        self.ends = [0] * N 
        self.trie = [[0] * 26 for _ in range(N)] 

    def insert(self, word: str) -> None:
        node = 0 
        for c in word: 
            i = ord(c) - ord('a') 
            if self.trie[node][i] == 0: 
                self.trie[node][i] = self.index 
                self.index += 1 
            node = self.trie[node][i] 
        self.ends[node] += 1 

    def search(self, word: str) -> bool:
        node = 0 
        for c in word: 
            i = ord(c) - ord('a') 
            if self.trie[node][i] == 0: return False 
            node = self.trie[node][i] 
        return self.ends[node] != 0 

    def startsWith(self, prefix: str) -> bool:
        node = 0 
        for c in prefix: 
            i = ord(c) - ord('a') 
            if self.trie[node][i] == 0: return False 
            node = self.trie[node][i] 
        return True 


# Your Trie object will be instantiated and called as such:
# obj = Trie()
# obj.insert(word)
# param_2 = obj.search(word)
# param_3 = obj.startsWith(prefix)
```

开始直接创造十万个 node……之后连接。或者可以下面这样模拟结点。

```python lc208-2.py 
class Trie:
    def __init__(self):
        self.children = [None] * 26 
        self.end = False 

    def insert(self, word: str) -> None:
        node = self 
        for c in word: 
            c = ord(c) - ord('a') 
            if not node.children[c]: node.children[c] = Trie()
            node = node.children[c] 
        node.end = True 

    def search(self, word: str) -> bool:
        node = self 
        for c in word: 
            c = ord(c) - ord('a') 
            if not node.children[c]: return False 
            node = node.children[c] 
        return node.end 

    def startsWith(self, prefix: str) -> bool:
        node = self 
        for c in prefix: 
            c = ord(c) - ord('a') 
            if not node.children[c]: return False 
            node = node.children[c] 
        return True if node else False  


# Your Trie object will be instantiated and called as such:
# obj = Trie()
# obj.insert(word)
# param_2 = obj.search(word)
# param_3 = obj.startsWith(prefix)
```

### [211. 添加与搜索单词 - 数据结构设计](https://leetcode-cn.com/problems/design-add-and-search-words-data-structure/)

使用 Trie 前缀树，在 search 的时候需要一小部分 dfs。

```python lc201-1.py
class WordDictionary:
    def __init__(self):
        self.children = [None] * 26 
        self.end = False 

    def addWord(self, word: str) -> None:
        node = self 
        for c in word: 
            c = ord(c) - ord('a') 
            if not node.children[c]: node.children[c] = WordDictionary() 
            node = node.children[c] 
        node.end = True 

    def search(self, word: str) -> bool:
        if not word: return self.end 
        if word[0] == '.': 
            for i in range(26): 
                if self.children[i]: 
                    if self.children[i].search(word[1:]): return True 
        else: 
            i = ord(word[0]) - ord('a') 
            if self.children[i]: return self.children[i].search(word[1:]) 
        return False 


# Your WordDictionary object will be instantiated and called as such:
# obj = WordDictionary()
# obj.addWord(word)
# param_2 = obj.search(word)
```

### [212. 单词搜索 II](https://leetcode-cn.com/problems/word-search-ii/) 

第一反应不知道怎么做，听说可以用 Trie 之后第二反应是遍历 board 能够组成的字符串把它们都放到 Trie 里，这样肯定存不下。换个思路需要把 words 都存到 Trie 里。

* 要注意 dfs 传入的参数，不仅有当前形成的字符串，还有当前走到了哪一个结点。
* board 中可能有不止一个满足相同的 word，所以一开始使用 set 自动去重。

```python lc212-1.py 
# @lc code=start
class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        class Trie: 
            def __init__(self): 
                self.children = [None] * 26 
                self.end = False 

            def insert(self, word): 
                node = self 
                for c in word: 
                    c = ord(c) - ord('a') 
                    if not node.children[c]: node.children[c] = Trie() 
                    node = node.children[c] 
                node.end = True 
            
        m, n = len(board), len(board[0]) 
        root = Trie() 
        ans = set() 
        for word in words: 
            root.insert(word) 

        def dfs(x, y, node, cur): 
            c = board[x][y] 
            if c == '.': return 
            node = node.children[ord(c) - ord('a')] 
            if not node: return 
            if node.end: 
                ans.add(cur + c) 

            board[x][y] = '.' 
            for x1, y1 in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)): 
                if 0 <= x1 < m and 0 <= y1 < n: 
                    dfs(x1, y1, node, cur + c) 
            board[x][y] = c 

        for x in range(m): 
            for y in range(n): 
                dfs(x, y, root, "") 
        return list(ans) 
```

