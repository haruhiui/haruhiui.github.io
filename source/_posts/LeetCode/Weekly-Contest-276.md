title: Weekly Contest 275



# [2138. Divide a String Into Groups of Size k](https://leetcode.com/problems/divide-a-string-into-groups-of-size-k/)

```python
class Solution:
    def divideString(self, s: str, k: int, fill: str) -> List[str]:
        n = len(s)
        ans = []
        for i in range(n // k + 1):
            ans.append(s[i*k:(i+1)*k])
        if len(ans[-1]) == 0:
            ans.pop()
        if len(ans[-1]) != k:
            ans[-1] = ans[-1] + fill * (k - len(ans[-1]))
        return ans
```





# [2139. Minimum Moves to Reach Target Score](https://leetcode.com/problems/minimum-moves-to-reach-target-score/)

```python
class Solution:
    def minMoves(self, target: int, maxDoubles: int) -> int:
        inc = 0
        dou = 0
        while target != 1:
            if target % 2 == 1:
                inc += 1
                target -= 1
            else:
                if dou < maxDoubles:
                    dou += 1
                    target //= 2
                else:
                    inc += target - 1
                    target = 1
        return inc + dou
```





# [2140. Solving Questions With Brainpower](https://leetcode.com/problems/solving-questions-with-brainpower/)

一个错误的写法：

```python
class Solution:
    def mostPoints(self, questions: List[List[int]]) -> int:
        n = len(questions)
        ans = 0
        dp = [0] * n
        for i, (p, b) in enumerate(questions):
            ans = max(ans, dp[i] + p)
            dp[i] = ans
            if i + b + 1 < n:
                dp[i + b + 1] = max(dp[i + b + 1], ans)
        return ans
```







[灵茶山艾府](https://leetcode-cn.com/u/endlesscheng/) [](https://leetcode-cn.com/problems/solving-questions-with-brainpower/solution/dao-xu-dp-by-endlesscheng-2qkc/)





# [2141. Maximum Running Time of N Computers](https://leetcode.com/problems/maximum-running-time-of-n-computers/)





[](https://leetcode-cn.com/problems/maximum-running-time-of-n-computers/solution/liang-chong-jie-fa-er-fen-da-an-pai-xu-t-grd8/)