---
title: Biweekly Contest 68
date: 2021-12-26 12:30:32
categories: 
  - LeetCode
tags: 
  - LeetCode 
---

# Biweekly Contest 68

## [5946. 句子中的最多单词数](https://leetcode-cn.com/problems/maximum-number-of-words-found-in-sentences/)

```python lc5946-1.py
class Solution:
    def mostWordsFound(self, sentences: List[str]) -> int:
        ans = 0
        for st in sentences:
            ans = max(ans, len(st.split()))
        return ans
```

## [5947. 从给定原材料中找到所有可以做出的菜](https://leetcode-cn.com/problems/find-all-possible-recipes-from-given-supplies/)

```python lc5947-1.py
class Solution:
    def findAllRecipes(self, recipes: List[str], ingredients: List[List[str]], supplies: List[str]) -> List[str]:
        n = len(recipes)
        ans = []
        changed = True
        while changed:
            changed = False
            for i in range(n):
                if recipes[i] in ans:
                    continue
                ingredient = ingredients[i]
                for j in range(len(ingredient)):
                    if ingredient[j] not in supplies:
                        break
                if ingredient[j] in supplies:
                    changed = True
                    supplies.append(recipes[i])
                    ans.append(recipes[i])
        return ans
```

## [5948. 判断一个括号字符串是否有效](https://leetcode-cn.com/problems/check-if-a-parentheses-string-can-be-valid/)

```python lc5948-1.py
class Solution:
    def canBeValid(self, s: str, locked: str) -> bool:
        n, l, r = len(s), 0, 0
        if n % 2 == 1: return False
        for i in range(n):
            if locked[i] == '1' and s[i] == ')':
                r += 1
                if (i + 1 - r < r): return False
        for i in range(n - 1, -1, -1):
            if locked[i] == '1' and s[i] == '(':
                l += 1
                if (n - i - l < l): return False
        return True
```

判断括号是否有效的问题，需要：

* 从前向后遍历时，左括号的数量时刻大于等于右括号的数量。

* 从后向前遍历时，右括号的数量时刻大于等于左括号的数量。

## [5949. 一个区间内所有数乘积的缩写](https://leetcode-cn.com/problems/abbreviating-the-product-of-a-range/)

```python lc5949-1.py
class Solution:
    def abbreviateProduct(self, left: int, right: int) -> str:
        suf, e = 1, 0
        for i in range(left, right+1):
            suf *= i
            while suf%10==0: # 确定末尾0的个数e及suf
                suf //= 10 
                e += 1
            suf = suf%(10**12) # 至多12位余数, 即最多保留后缀0前的倒数12位数
        
        if suf<10**10: return '%se%s' % (suf, e)
        
        pre = 0
        for i in range(left, right+1): pre += log10(i)
        pre = pre%1+4
        pre = int(10**pre)
        return '%s...%se%s' % (pre, str(suf)[-5:], e)
```

参考自 [评论](https://leetcode-cn.com/problems/abbreviating-the-product-of-a-range/comments/1300546)