


C++ 中对象构造、静态创建和动态创建、类成员初始化方式

### 构造函数种类

* 默认构造函数
* 有参数的初始化构造函数
* 拷贝构造函数
* 移动构造函数
* 委托构造函数
* 转换构造函数

### 对象拷贝、拷贝优化

[What are copy elision and return value optimization?](https://stackoverflow.com/questions/12953127/what-are-copy-elision-and-return-value-optimization)

NRVO(Named Return Value Optimization) 和 RVO(Return Value Optimization)：区别在于返回的是否是命名过的对象。没有 NRVO 和 RVO 时，返回一个局部对象，会有三个阶段：局部对象、栈上暂时存放的返回对象、caller 最终得到的对象。

下面的程序可以很清楚的说明问题。对编译命令加上 `-fno-elide-constructors` 可以取消编译器的 RVO 优化。

```cpp copy_elision.cpp 
// to cancel elide 
// g++ -std=c++11 copy_elision.cpp -fno-elide-constructors 

#include <iostream>  
using namespace std;

class ABC  
{  
public:   
    const char *a; 
    ABC() { cout<<"Default Constructor"<<endl; }  
    ABC(const char *ptr) { cout<<"Init Constructor"<<endl; }  
    ABC(ABC &obj) { cout<<"copy constructor"<<endl;}  
    ABC(ABC&& obj) { cout<<"Move constructor"<<endl; }  
    ~ABC() { cout<<"Destructor"<<endl; }  
};
ABC fun123() { ABC obj; return obj; }  
ABC xyz123() { return ABC(); }  

int main()  
{  
    ABC abc;  
    cout << endl; 
    ABC obj1(fun123()); // NRVO  
    cout << endl; 
    ABC obj2(xyz123()); // RVO, not NRVO 
    cout << endl; 
    ABC xyz = "Stack Overflow"; // RVO  
    cout << endl; 
    return 0;  
}
```

### 对象静态创建、动态创建

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

### 类成员初始化方式

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

