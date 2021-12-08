---
title: Linked List
date: 2021-12-02 18:51:08
categories: 
  - Data Structures and Algorithms
tags: 
  - Data Structures and Algorithms
  - Linked List 
---

Linked List 链表。

面试时要是有链表相关题目，需要问清楚是单链表还是双链表、有没有可能有环。

## 亿点点练习题

### [206. Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)

最基础的反转链表。

```python lc206-1.py
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        pre, cur, suc = None, head, head.next if head else None 
        while cur: 
            cur.next = pre 
            pre, cur, suc = cur, suc, suc.next if suc else None 
        return pre
```

```cpp lc206-2.cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        if (!head) return head; 
        ListNode* pre = nullptr; 
        while (head) tie(head->next, pre, head) = tuple(pre, head, head->next); 
        return pre; 
    }
};
```

### [92. Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/) 

反转对应区间的链表。用常规做法很容易出错，可以设想每一步的操作都是把当前节点放到已反转的链表的最前面。

```python lc92-1.py
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
        dummy = ListNode(-1, head) 
        pre, cur = dummy, head
        for _ in range(left - 1): 
            pre, cur = pre.next, cur.next 
        for _ in range(right - left): 
            tmp = cur.next 
            cur.next = tmp.next 
            tmp.next = pre.next 
            pre.next = tmp 
        return dummy.next 
```

### [25. Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/)

按照 k 个一组反转链表。一直不觉得这道题有 hard 的程度。

```python lc25-1.py
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        hair = ListNode(-1, head) 
        cnt = 0 
        pre, cur = hair, head 
        while True: 
            if cnt > 0 and cnt % k == 0: 
                while cur.next != head: 
                    tmp = cur.next 
                    cur.next = tmp.next 
                    tmp.next = pre.next 
                    pre.next = tmp 
                pre = cur 
                cur = cur.next 
            if not head: break 
            head = head.next 
            cnt += 1 
        return hair.next 
```

```cpp lc25-2.cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode *hair = new ListNode(0, head); 
        int cnt = 0; 
        ListNode *pre = hair, *cur = head; 
        while (1) {
            
            if (cnt > 0 && cnt % k == 0) {
                while (cur->next != head) {
                    ListNode *tmp = cur->next; 
                    cur->next = tmp->next; 
                    tmp->next = pre->next;
                    pre->next = tmp; 
                }
                pre = cur; 
                cur = cur->next; 
            }
            if (!head) break; 
            head = head->next; 
            cnt++; 
        }
        return hair->next; 
    }
};
```

* 要注意 `if` 判断时有一个 `cnt > 0`，要不然一开始 `cnt == 0` 时就会进入。
* 相比写成 `while head`，外层循环写成 `while True` 有一个好处，当最后 `head == None and cnt > 0 and cnt % k == 0` 时仍然要进行一次反转，`while True` 仍然会进行处理，处理完在用 `if not head: break` 跳出。否则还要再外循环外面加上一个判断处理这个情况。

发现类似的思路很清晰，在做链表反转的时候想成这个过程：不断把下一个结点提到最前面。

```python reverse_linked_list.py 
def reverseList(head, foot): 
    hair = ListNode(-1, head) 
    pre, cur = hair, head 
    while cur.next != foot: 
        tmp = cur.next 
        cur.next = tmp.next 
        tmp.next = pre.next 
        pre.next = tmp 
    # 这里 pre == hair, cur.next == foot 
    return hair.next 
```

循环中的这四个表达式非常好记。

### [2074. Reverse Nodes in Even Length Groups](https://leetcode.com/problems/reverse-nodes-in-even-length-groups/)

之前的周赛题，将链表结点分组，每组结点个数从 1 开始递增，要是有偶数个结点的话就将这组结点反转。

先贴一个之前写的代码：

```python lc2074-1.py
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseLength(self, head, length): 
        if not head: return None 
        prev, curr, succ = head, head, head.next 
        for i in range(1, length): 
            if not succ: break 
            curr = succ 
            succ = succ.next 
            curr.next = prev 
            prev = curr 
        head.next = succ 
        return curr 
    
    def countGroup(self, head, group): 
        cnt = 0 
        while head and cnt < group: 
            cnt += 1 
            head = head.next 
        return cnt 
    
    def reverseEvenLengthGroups(self, head: Optional[ListNode]) -> Optional[ListNode]:
        group = 1 
        groupCnt = 0 
        curr = head 
        while curr:  
            groupCnt += 1 
            if group == groupCnt: 
                if self.countGroup(curr.next, group + 1) % 2 == 0: 
                    curr.next = self.reverseLength(curr.next, group + 1) 
                group += 1 
                groupCnt = 0 
            curr = curr.next
        # if lastGroupEnd and groupCnt % 2 == 1 and group % 2 == 1: 
        #     lastGroupEnd.next = self.reverseLength(lastGroupEnd.next, groupCnt + 1) 
        return head 
```

现在看来不用这么麻烦。用类似于上面一题的方法可以写得很短。

```python lc2074-2.py 
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseEvenLengthGroups(self, head: Optional[ListNode]) -> Optional[ListNode]:
        hair = ListNode(0, head) 
        pre, cur = hair, head 
        cnt, group = 0, 1  
        while True: 
            
            if cnt > 0 and cnt % group == 0 or (not head and cnt % 2 == 0): 
                if group % 2 == 0 or (not head and cnt % 2 == 0): 
                    while cur.next != head: 
                        tmp = cur.next 
                        cur.next = tmp.next 
                        tmp.next = pre.next 
                        pre.next = tmp 
                while cur != head: 
                    pre = cur 
                    cur = cur.next 
                # pre, cur = last_head, head
                # this is wrong because the previous node of head has changed when we do the reverse 
                cnt = 0 
                group += 1 
            
            if not head: break 
            head = head.next 
            cnt += 1 
        return hair.next 
```

这种写法要注意：
* pre 和 cur 的更新，这道题里要不要反转和 pre、cur 的更新是分开的，要注意他们的更新方式。
* 最后一组如果是偶数个也要反转，所以要在 if 中加个特殊判断。

### [143. Reorder List](https://leetcode.com/problems/reorder-list/)

用数组存起来先……

```python lc143-1.py
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        """
        Do not return anything, modify head in-place instead.
        """
        nodes = [] 
        while head: 
            nodes.append(head) 
            head = head.next 
        first, last = 0, len(nodes) - 1 
        while first < last: 
            nodes[first].next = nodes[last] 
            nodes[last].next = nodes[first + 1] 
            first += 1 
            last -= 1 
        nodes[first].next = None
        return head
```

如果要用常量空间可以先找到中点，把后半段反转，然后再把这两段每隔一个合并。

```python lc143-2.py
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        """
        Do not return anything, modify head in-place instead.
        """
        if not head: 
            return head 
        fast, slow = head, head 
        while fast and fast.next and fast.next.next: 
            fast, slow = fast.next.next, slow.next 
        cur, pre, slow.next = slow.next, None, None 
        while cur: 
            cur.next, pre, cur = pre, cur, cur.next 
        while head and pre: 
            head.next, pre.next, head, pre = pre, head.next, head.next, pre.next 
```

