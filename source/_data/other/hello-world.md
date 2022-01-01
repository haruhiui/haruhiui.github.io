---
title: Hello World
---
Welcome to [Hexo](https://hexo.io/)! This is your very first post. Check [documentation](https://hexo.io/docs/) for more info. If you get any problems when using Hexo, you can find the answer in [troubleshooting](https://hexo.io/docs/troubleshooting.html) or you can ask me on [GitHub](https://github.com/hexojs/hexo/issues).

## Quick Start

### Create a new post

``` bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

``` bash
$ hexo generate
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

``` bash
$ hexo deploy
```

More info: [Deployment](https://hexo.io/docs/one-command-deployment.html)

<!-- 
theme shoka: 
https://shoka.lostyu.me/

https://shoka.lostyu.me/computer-science/note/theme-shoka-doc/
https://shoka.lostyu.me/computer-science/note/theme-shoka-doc/dependents/
https://shoka.lostyu.me/computer-science/note/theme-shoka-doc/config/
https://shoka.lostyu.me/computer-science/note/theme-shoka-doc/display/
https://shoka.lostyu.me/computer-science/note/theme-shoka-doc/special/

other: 
https://yushuaigee.gitee.io/2020/12/31/%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E5%85%8D%E8%B4%B9%E6%90%AD%E5%BB%BA%E8%87%AA%E5%B7%B1%E7%9A%84%E5%8D%9A%E5%AE%A2(%E4%B8%80)%E2%80%94%E2%80%94%E6%9C%AC%E5%9C%B0%E6%90%AD%E5%BB%BAhexo%E6%A1%86%E6%9E%B6/

 -->

[shoka原网站](https://shoka.lostyu.me/)

[ReverseSacle的帮助网站](https://www.reversesacle.com/) 

[自定义permalink](https://donnadie.top/hexo-optimization-permalink/) 我自己用 :title/ 就好了。

[本地和网页都正常显示图片](http://www.itomtan.com/2017/09/29/the-problem-when-use-post-asset-folder/) 使用 typora-root-url 定义资源文件夹。还有一个小问题：复制图片时 typora 会在链接前面加一个 / ，网页中不能显示，需要自己手动删掉。

[不蒜子统计访问次数](http://busuanzi.ibruce.info/) 在 themes\shoka\layout\_partials\footer.njk 中 class count 里添加：

```

    <span class="post-meta-divider">|</span>
    <span class="post-meta-item-icon">
      <i class="ic i-eye"></i>
    </span>
    <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
    <span id="busuanzi_container_site_pv">
      <span id="busuanzi_value_site_pv"></span>次
    </span> 
```

除了 pv 模式还有 uv 模式。[](http://ibruce.info/2015/04/04/busuanzi/)