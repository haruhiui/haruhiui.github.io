---
title: Basics 
date: 2021-12-02 20:51:12
categories: 
  - Programming Languages
  - Cpp
tags: 
  - Programming Languages
  - Cpp
---

C++ Basics 

# built-in 

## string 

[C++ string详解，C++字符串详解](http://c.biancheng.net/view/2236.html)

```cpp TestString.cpp 
#include <iostream> 

using namespace std; 

int main() 
{
    // construction 
    string s1; 
    string s2 = "cpp2"; 
    string s3("cpp3"); 
    string s4 = "cpp4"; 
    string s5(s4); 
    string s6(4, 'c'); 

    // get 
    s1 = string("cpp basics"); 
    for (int i = 0; i < s1.length(); i++) {
        cout << s1[i] << " "; 
    }
    cout << endl; 
    for (auto c : s1) {
        cout << c << " "; 
    }
    cout << endl; 
 
    // +, += 
    s1 = string("first"); 
    s1 += " second"; 
    cout << s1 << endl; 

    // insert 
    s2 = string("to insert"); 
    s1.insert(6, s2); 
    cout << s1 << endl; 

    // erase 
    s1.erase(6, string("to insert").length()); 
    cout << s1 << endl; 

    // substr 
    cout << s1.substr(6, s1.length() - 6) << endl; 

    // find 
    cout << s1.find("first") << endl; 
    cout << s1.find("first", 6) << endl; 

    return 0; 
}
```

# STL 

STL 分为容器、迭代器、算法。

容器分为：
* 顺序容器
* 关联容器
* 无序关联容器

## 顺序容器

### vector 

[C++ vector使用方法](https://www.w3cschool.cn/cpp/cpp-i6da2pq0.html)

```cpp 
#include <iostream> 
#include <vector> 

using namespace std; 

void printVector(vector<int> vec) 
{
    for (auto i : vec) {
        cout << i << " "; 
    }
    cout << endl; 
}

int main() 
{
    // construction 
    vector<int> v1; 
    vector<int> v2(3); // empty 
    vector<int> v3(3, 5); 
    vector<int> v4 {1, 2, 3, 4}; 
    vector<int> v5(v4); 
    vector<int> v6(v4.begin(), v4.end()); 
    vector<int> v7 = v4; 

    for (auto v : vector<vector<int>> {v1, v2, v3, v4, v5, v6, v7}) {
        // printVector(v); 
    }

    // add 
    v1 = vector<int> {1, 2, 3, 4, 5}; 
    v1.push_back(6); 
    v1.insert(v1.begin(), 0); 
    v1.insert(v1.end(), 2, 6); 
    v2 = vector<int> {2, 3, 4}; 
    v1.insert(v1.begin(), v2.begin(), v2.end()); 
    printVector(v1); // 2 3 4 0 1 2 3 4 5 6 6 6

    // delete 
    v1 = vector<int> {1, 2, 3, 4, 5}; 
    v1.pop_back(); 
    v1.erase(v1.begin()); 
    v1.erase(next(v1.begin()), prev(v1.end())); 
    printVector(v1); // 2 4 (so it will still do delete when first == last) 
    v1.clear(); 

    // traverse 
    v1 = vector<int> {1, 2, 3, 4, 5}; 
    for (vector<int>::iterator it = v1.begin(); it != v1.end(); ++it) {
        cout << *it << " "; 
    }
    cout << endl; 
    for (int i : v1) {
        cout << i << " "; 
    }
    cout << v1.front() << " " << v1.back() << endl; 

    // size 
    cout << v1.empty() << endl; 
    cout << v1.size() << " " << v1.capacity() << " " << v1.max_size() << endl; 

    // other 
    v2 = vector<int> {2, 3, 4}; 
    v1.swap(v2); 
    printVector(v1); // 2 3 4 
    printVector(v2); // 1 2 3 4 5 
    v1.assign(v2.begin(), v2.end()); 
    printVector(v1); // 1 2 3 4 5 
}
```

### stack 

[C++ stack(STL stack)用法详解](http://c.biancheng.net/view/478.html)

```cpp TestStack.spp 
#include <iostream> 
#include <stack> 

using namespace std; 

int main() 
{
    stack<int> s; 
    s.push(1); 
    s.push(2); 
    s.push(3); 
    cout << s.top() << endl; 
    
    s.pop(); 
    cout << s.size() << endl; 

    cout << s.empty() << endl; 
}
```

## 迭代器

1. begin
2. end
3. advance
4. next
5. prev
6. inserter

## 算法

1. **sort(first_iterator, last_iterator)** – To sort the given vector.
2. **reverse(first_iterator, last_iterator)** – To reverse a vector.
3. **max_element (first_iterator, last_iterator)** – To find the maximum element of a vector.
4. **min_element (first_iterator, last_iterator)** – To find the minimum element of a vector.
5. **accumulate(first_iterator, last_iterator, initial value of sum)** – Does the summation of vector elements
6. **all_of**
7. **any_of**
8. **none_of**
9. **copy_n**
10. **iota**
11. **partition(beg, end, condition)**
12. **is_partitioned(beg, end, condition)**
13. **stable_partition(beg, end, condition)**
14. **partition_point(beg, end, condition)**
15. **partition_copy(beg, end, beg1, beg2, condition)**


