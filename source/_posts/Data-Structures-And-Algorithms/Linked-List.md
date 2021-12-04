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

