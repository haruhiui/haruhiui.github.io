---
title: Cpp Initialization
date: 2022-01-18 20:36:15
math: true 
categories: 
  - Programming Languages
  - Cpp
tags: 
  - Programming Languages
  - Cpp
---

**本文还在编写中**

**本文不保证完全正确**，欢迎评论区留言讨论。

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
* 带参数初始化构造函数
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

/*output:
qwer asdf zxcv
*/
```

`s0` 使用默认构造函数构造。

对于 `s1`，**在没有任何优化的情况下**，首先用有参数的构造函数构造 `string("qwer")`，之后调用拷贝构造函数将 `s1` 拷贝为 `string("qwer")`。一般会有编译器优化，会直接调用将一个 `const char*` 作为参数的构造函数构造 `s1`。

对于 `s2`，直接调用将一个 `const char*` 作为参数的构造函数。

对于 `s3`，调用的是将一个 `initializer_list` 作为参数的构造函数。相当于 `{"zxcv"}` 会产生一个 `initializer_list`。

下面看一个自己实现的类：

```cpp
#include <iostream> 
using namespace std; 

struct Sct {
    int i;
    string s;
    // Sct(): i(0), s("") { cout << "default ctor" << endl; }
    // Sct(string s, int i): i(i), s(s) { cout << "init ctor" << endl; }
};

class Person {
public:
    string name;
    int age;
    double height;
    Person *partner;

    // Person(): name(""), age(0), height(0), partner(nullptr) { cout << "default ctor" << endl; }
    // Person(int a, double h, string n, Person *p): name(n), age(a), height(h), partner(p) { cout << "init ctor" << endl; }
};

int main() {
    Sct s0;
    // Sct s1 = Sct("s1", 1);
    // Sct s3("s3", 1);
    // Sct s4{"s4", 1};
    Sct s5{1, "s5"};

    Person p0;
    // Person p1 = Person(18, 160.0, "p1", nullptr);
    // Person p2(18, 160.0, "p2", nullptr);
    // Person p3{18, 160.0, "p3", nullptr};
    Person p4{"p4", 20, 170.0, nullptr};
}
```

在自己没有写构造函数时，可以使用默认构造函数，或者使用大括号的初始化方式。大括号初始化要求大括号内参数的**顺序**和结构体或类内变量的**定义顺序相同**。

```cpp
#include <iostream> 
using namespace std; 

struct Sct {
    int i;
    string s;
    Sct(): i(0), s("") { cout << "default ctor" << endl; }
    Sct(string s, int i): i(i), s(s) { cout << "init ctor" << endl; }
};

class Person {
public:
    string name;
    int age;
    double height;
    Person *partner;

    Person(): name(""), age(0), height(0), partner(nullptr) { cout << "default ctor" << endl; }
    Person(int a, double h, string n, Person *p): name(n), age(a), height(h), partner(p) { cout << "init ctor" << endl; }
};

int main() {
    Sct s0;
    Sct s1 = Sct("s1", 1);
    Sct s3("s3", 1);
    Sct s4{"s4", 1};
    // Sct s5{1, "s5"};

    Person p0;
    Person p1 = Person(18, 160.0, "p1", nullptr);
    Person p2(18, 160.0, "p2", nullptr);
    Person p3{18, 160.0, "p3", nullptr};
    // Person p4{"p4", 20, 170.0, nullptr};
}

```

自己实现了其他的构造函数但是要是没有实现默认构造函数，则不能使用默认的构造方式。

实现了带参数的构造方法，则小括号和大括号的构造方式都可以使用，只不过参数的顺序是构造方法的参数顺序。

经常见到的是第二种调用构造方法的初始化方式。下面的内容包括拷贝构造和拷贝赋值运算符、移动构造和移动赋值运算符、大括号构造和初始化列表。

## 拷贝构造

拷贝构造也叫复制构造。

先验证一下对于初始化时使用等号直接赋值的方式，在没有任何优化的情况下，确实是先创建了一个对象然后调用了拷贝构造函数。

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
    MyString(const MyString& ms) { this->s = ms.s; cout << "copy ctor " << this->s << endl; }
};

int main()
{
    MyString ms0;
    MyString ms1 = "qwer";
    MyString ms2("asdf");
    MyString ms3{"zxcv"};
}

/*output (without -fno-elide-constructors):
default ctor 
const char init ctor qwer
const char init ctor asdf
const char init ctor zxcv
*/
/*output (with -fno-elide-constructors):
default ctor 
const char init ctor qwer
copy ctor qwer
const char init ctor asdf
const char init ctor zxcv
*/
```

光是增加一个拷贝构造函数肯定是不够的，还需要在编译时告诉编译器不要使用拷贝优化，可以使用 `-fno-elide-constructors`。

上面禁止了拷贝优化之后就可以看到先调用了一次带参数的构造函数，然后再调用拷贝构造函数。下面说一下拷贝优化。

### 拷贝优化

参考链接：[What are copy elision and return value optimization?](https://stackoverflow.com/questions/12953127/what-are-copy-elision-and-return-value-optimization)

拷贝优化在 RVO 和 NRVO 出更加明显。一般来说，没有拷贝优化时，从函数中返回一个局部对象，会有三个阶段：局部对象 A、临时的返回对象 B、caller 内将 callee 产生的临时返回对象 B 赋给最终的变量 C。

下面的程序可以很清楚的说明问题。对编译命令加上 `-fno-elide-constructors` 可以取消编译器的拷贝优化。

```cpp copy_elision.cpp 
// to cancel elide 
// g++ -std=c++11 copy_elision.cpp -fno-elide-constructors

#include <iostream>
using namespace std;

class MyString 
{
public:
    string s;
    MyString() { this->s = ""; cout << "default ctor " << this->s << endl; }

    MyString(const char *s) { this->s = s; cout << "const char init ctor " << this->s << endl; }
    MyString(const MyString& obj) { this->s = obj.s; cout << "copy ctor " << this->s << endl; }
    // MyString(MyString&& obj) { this->s = obj.s; cout << "move ctor " << this->s << endl; }
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
/*output (without -fno-elide-constructors):
const char init ctor qwer
copy ctor qwer

copy ctor qwer

copy ctor qwer
*/
/*output (with -fno-elide-constructors, without move ctor):
const char init ctor qwer
copy ctor qwer

copy ctor qwer
copy ctor qwer
copy ctor qwer

copy ctor qwer
copy ctor qwer
copy ctor qwer
*/
/*output (with -fno-elide-constructors, with move ctor):
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

可以看到上面的代码中给函数传递参数的过程中也会发生一次拷贝构造。

细心的同学会发现，对于函数返回的对象的拷贝，优先调用的是 `MyString(MyString&& obj)` 这个函数；而给函数传参一直都是拷贝构造函数。我们会在后面了解到右值和移动构造函数。

### 拷贝赋值运算符

初始化时使用等号直接赋值和赋值运算符非常容易搞混。说到底还是声明和赋值是两个不同的东西。

```cpp
#include <iostream>
using namespace std;

class MyString 
{
public:
    string s;
    MyString() { this->s = ""; cout << "default ctor " << this->s << endl; }

    MyString(const char *s) { this->s = s; cout << "const char init ctor " << this->s << endl; }
    void operator=(const MyString& ms) { this->s = ms.s; cout << "operator =, " << ms.s << endl; }
};

int main()
{
    MyString ms0;
    MyString ms1 = "qwer";
    ms0 = ms1;
}

/*output
default ctor 
const char init ctor qwer
operator =, qwer
*/
```

`ms1` 使用构造函数构造，`ms0` 在最后的赋值调用的是拷贝赋值运算符。

自己实现构造函数和重写赋值运算符时要注意自己实现**深拷贝**。如果使用的是 vector 等类型则使用默认的赋值运算符也可以，但是有用到指针类型并且想深拷贝则必须要重写赋值运算符。

## 移动构造

参考链接：[C++11移动构造函数详解](http://c.biancheng.net/view/7847.html)

上面说的 `MyString(MyString&& obj)`，这个就是移动构造方法。

```cpp
#include <iostream>
using namespace std;

class A {
public:
    int *p;
    A(): p(nullptr) { cout << "ctor" << endl; }
    A(int *p): p(p) { cout << "init ctor" << endl; }
    A(const A& a): p(a.p) { cout << "copy ctor" << endl; }
    A(A&& a): p(a.p) { a.p = nullptr; cout << "move ctor" << endl; }
};

A getA(int *p) {
    return A(p);
}

int main()
{
    int i = 2333;
    A a = getA(&i);
}
/*output (without -fno-elide-constructors)
init ctor
*/
/*output (with -fno-elide-constructors)
init ctor
move ctor
move ctor
*/
```

移动构造函数就是移动语义的具体实现。所谓移动语义，指的就是以移动而非深拷贝的方式初始化含有指针成员的类对象。简单的理解，移动语义指的就是将其他对象（通常是临时对象）拥有的内存资源“移为已用”。

当移动构造函数存在时优先调用移动构造函数。

### 移动赋值运算符

拷贝构造函数对应的是拷贝构造运算符，移动构造函数则对应移动赋值运算符。

```cpp
#include <iostream>
using namespace std;

class A {
public:
    int *p;
    A(): p(nullptr) { cout << "ctor" << endl; }
    A(int *p): p(p) { cout << "init ctor" << endl; }
    A(const A& a): p(a.p) { cout << "copy ctor" << endl; }
    A(A&& a): p(a.p) { a.p = nullptr; cout << "move ctor" << endl; }

    void operator=(const A& a) { this->p = a.p; cout << "copy =" << endl; }
    void operator=(A&& a) { this->p = a.p; a.p = nullptr; cout << "move =" << endl; }
};

A getA(int *p) {
    return A(p);
}

int main()
{
    int i = 2333;
    A a = getA(&i);
    cout << endl;
    A b;
    b = getA(&i);
}

/*output (without -fno-elide-constructors)
init ctor

ctor
init ctor
move =
*/
/*output (with -fno-elide-constructors)
init ctor
move ctor
move ctor

ctor
init ctor
move ctor
move =
*/
```

顺便一提用 const 修饰移动构造函数的参数好像也是可以的，不过这样就不能改变这个参数对象内的值。

## 委托构造

参考链接：[委托构造函数](https://docs.microsoft.com/zh-cn/cpp/cpp/delegating-constructors?view=msvc-170)

（待更新）

## 转换构造

参考链接：[C++转换构造函数：将其它类型转换为当前类的类型](http://c.biancheng.net/view/2339.html)

（待更新）

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

一个疑问：为什么赋值初始化不是调用拷贝构造而是赋值？因为声明和赋值是两个东西哒。

参考链接：

* [C++ 中的几种构造函数](https://blog.csdn.net/qq_36391075/article/details/109358925)

* [C++ 20标准下，有哪几种构造函数类型？](https://www.zhihu.com/question/389188159)

* [C++11移动构造函数详解](http://c.biancheng.net/view/7847.html)

* [委托构造函数](https://docs.microsoft.com/zh-cn/cpp/cpp/delegating-constructors?view=msvc-170)
