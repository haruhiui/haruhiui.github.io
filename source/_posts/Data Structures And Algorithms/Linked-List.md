---
title: Linked List
date: 2021-12-02 18:51:08
categories: 
  - Data Structures And Algorithms
tags: 
  - Data Structures And Algorithms
  - Linked List 
---

Linked List 链表。

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
