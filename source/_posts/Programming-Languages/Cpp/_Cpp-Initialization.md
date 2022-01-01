---
title: Cpp Initialization
date: 2021-12-26 21:48:57
math: true 
categories: 
  - Programming Languages
  - Cpp
tags: 
  - Programming Languages
  - Cpp
---

**本文不保证完全正确**

**本文还在编写中**

C++ 中变量初始化、对象构造、静态创建和动态创建、类成员初始化方式

# 变量初始化

参考自 [cplusplus: Variables and types](https://www.cplusplus.com/doc/tutorial/variables/)

有三种变量初始化方式：
- c-like initialization: `type identifier = initial_value;` 如 `int x = 0;`
- constructor initialization: `type identifier (initial_value);` 如 `int x(0);`
- uniform initialization: `type identifier {initial_value};` 如 `int x{0};`

对于内置类型，常见的都是第一种初始化方式。

# 对象构造

## 构造函数种类

* 默认构造函数
* 有参数的初始化构造函数
* 拷贝构造函数
* 移动构造函数
* 委托构造函数
* 转换构造函数

先抛开这些构造函数种类不谈，光看上面说的变量初始化方式，应该也可以猜到对于对象来说，起码有三种初始化方式。

```cpp
#include <iostream>
using namespace std;

int main()
{
    string s0;
    string s1 = "qwer";
    string s2("asdf");
    string s3{"zxcv"};
    cout << s0 << " " << s1 << " " << s2 << " " << s3 << endl;
}

/*
output:
 qwer asdf zxcv
*/
```

`s0` 使用默认构造函数构造。

对于 `s1`，**在没有任何优化的情况下**，首先用有参数的构造函数构造 `string("qwer")`，之后调用拷贝构造函数将 `s1` 拷贝为 `"qwer"`。一般会有编译器优化，会直接调用将一个 `const char*` 作为参数的构造函数构造 `s1`。

对于 `s2`，直接调用将一个 `const char*` 作为参数的构造函数。

对于 `s3`，调用的是将一个 `initializer_list` 作为参数的构造函数。相当于 `{"zxcv"}` 会产生一个 `initializer_list`。

下面可以看一个自己实现的 MyString 类。

```cpp MyString-1.cpp
#include <iostream>
#include <initializer_list>

using namespace std;

class MyString 
{
public:
    string s;
    MyString() { this->s = ""; cout << "default ctor " << this->s << endl; }
    MyString(const char *s) { this->s = s; cout << "const char init ctor " << this->s << endl; }
    MyString(initializer_list<string> s) { this->s = *s.begin(); cout << "init_list ctor " << this->s << endl; }
};

int main()
{
    MyString ms0;
    MyString ms1 = "qwer";
    MyString ms2("asdf");
    MyString ms3{"zxcv"};
}

/* 
output:
default ctor 
const char init ctor qwer
const char init ctor asdf
init_list ctor zxcv
*/
```

上面的编译结果可以说明要支持三种构造方法要写的函数。那么对于等号直接赋值的方式，它是不是真的先创建了一个对象，然后调用拷贝构造呢？可以看下面。

## 拷贝构造

```cpp MyString-2.cpp
// to cancel elide 
// g++ -std=c++11 MyString-2.cpp -fno-elide-constructors

#include <iostream>
#include <initializer_list>

using namespace std;

class MyString 
{
public:
    string s;
    MyString() { this->s = ""; cout << "default ctor " << this->s << endl; }
    MyString(const char *s) { this->s = s; cout << "const char init ctor " << this->s << endl; }
    MyString(initializer_list<string> s) { this->s = *s.begin(); cout << "init_list ctor " << this->s << endl; }

    MyString(const MyString& ms) { this->s = ms.s; cout << "copy ctor " << this->s << endl; }
};

int main()
{
    MyString ms0;
    MyString ms1 = "qwer";
    MyString ms2("asdf");
    MyString ms3{"zxcv"};
}

/* 
output (without -fno-elide-constructors):
default ctor 
const char init ctor qwer
const char init ctor asdf
init_list ctor zxcv
*/
/* 
output (with -fno-elide-constructors):
default ctor 
const char init ctor qwer
copy ctor qwer
const char init ctor asdf
init_list ctor zxcv
*/
```

光是增加一个拷贝构造函数肯定是不够的，还需要在编译时告诉编译器不要使用拷贝优化，可以使用 `-fno-elide-constructors`。

## 拷贝优化

[What are copy elision and return value optimization?](https://stackoverflow.com/questions/12953127/what-are-copy-elision-and-return-value-optimization)

NRVO(Named Return Value Optimization) 和 RVO(Return Value Optimization)：区别在于返回的是否是命名过的对象。（这里存疑。）没有 NRVO 和 RVO 时，返回一个局部对象，会有三个阶段：局部对象、栈上暂时存放的返回对象(?)、caller 内将 callee 的返回对象赋给最终的变量。

下面的程序可以很清楚的说明问题。对编译命令加上 `-fno-elide-constructors` 可以取消编译器的拷贝优化。

```cpp copy_elision.cpp 
// to cancel elide 
// g++ -std=c++11 copy_elision.cpp -fno-elide-constructors

#include <iostream>
#include <initializer_list>

using namespace std;

class MyString 
{
public:
    string s;
    MyString() { this->s = ""; cout << "default ctor " << this->s << endl; }
    MyString(const char *s) { this->s = s; cout << "const char init ctor " << this->s << endl; }
    MyString(initializer_list<string> s) { this->s = *s.begin(); cout << "init_list ctor " << this->s << endl; }

    MyString(const MyString& obj) { this->s = obj.s; cout << "copy ctor " << this->s << endl; }
    MyString(MyString&& obj) { this->s = obj.s; cout << "move ctor " << this->s << endl; }
};

MyString namedFunc(MyString& obj) {
    MyString ret = obj;
    return ret;
}

MyString func(MyString& obj) {
    return MyString(obj);
}

int main()
{
    MyString ms1("qwer");
    MyString ms2(ms1);
    cout << endl;
    
    MyString ms3 = namedFunc(ms1);
    cout << endl;
    MyString ms4 = func(ms1);
}
/*
output (without -fno-elide-constructors):
const char init ctor qwer
copy ctor qwer

copy ctor qwer

copy ctor qwer
*/
/*
output (with -fno-elide-constructors):
const char init ctor qwer
copy ctor qwer

copy ctor qwer
move ctor qwer
move ctor qwer

copy ctor qwer
move ctor qwer
move ctor qwer
*/
```

## 移动构造

## 委托构造和转换构造

## 对象静态创建、动态创建

* 静态创建：对象分配在栈中，先移动栈顶指针，再调用构造函数。
* 动态创建：对象分配在堆中，new 操作符先找到合适大小空间并分配，然后调用构造函数。

如何禁用类的某种创建方式？

1. 让对象不能静态创建：将析构函数设置为私有。
    
    编译器在为类对象分配栈空间时，会先检查类的析构函数的访问性，其实不光是析构函数，只要是非静态的函数，编译器都会进行检查。如果类的析构函数是私有的，则编译器不会在栈空间上为类对象分配内存。
    
    由于栈的创建和释放都需要由系统完成的，所以若是无法调用构造或者析构函数，自然会报错。

    （不过这样以来可能无法被继承，所以也可以把构造函数和析构函数都设置成protected，然后用子类来动态创建）
    
2. 让对象不能动态创建：让new操作符无法使用，即将new操作符重载并设置为私有。重载new的同时最好也重载delete。

[C++ 如何让类对象只在堆或栈上创建](https://blog.csdn.net/qq_30835655/article/details/68938861)

在 tx 的一次面试中被问到这个问题，我当时当场蒙蔽。

# 类成员初始化方式

* 赋值初始化：在函数体内进行赋值初始化，是在所有的数据成员被分配内存空间后才进行的。
* 列表初始化：在冒号后使用初始化列表进行初始化，给数据成员分配内存空间时就进行初始化。
* 列表初始化更快，因为C++的赋值操作对于复杂类型是可能产生临时对象的，对于内置类型则没有差别。
* 必须要用列表初始化的时候：
  * 当初始化一个引用成员时
  * 当初始化一个常量成员时
  * 当调用一个基类的构造函数，而它拥有一组参数时
  * 当调用一个成员类的构造函数，而它拥有一组参数时

[64. 成员初始化列表的概念，为什么用它会快一些？](https://interviewguide.cn/#/Doc/Knowledge/C++/%E5%9F%BA%E7%A1%80%E8%AF%AD%E6%B3%95/%E5%9F%BA%E7%A1%80%E8%AF%AD%E6%B3%95?id=64%e3%80%81%e6%88%90%e5%91%98%e5%88%9d%e5%a7%8b%e5%8c%96%e5%88%97%e8%a1%a8%e7%9a%84%e6%a6%82%e5%bf%b5%ef%bc%8c%e4%b8%ba%e4%bb%80%e4%b9%88%e7%94%a8%e5%ae%83%e4%bc%9a%e5%bf%ab%e4%b8%80%e4%ba%9b%ef%bc%9f)

一个疑问：为什么赋值初始化不是调用拷贝构造而是赋值？

