
[shoka原网站](https://shoka.lostyu.me/)

[ReverseSacle的网站](https://www.reversesacle.com/) 

[lavenderdh的网站](https://www.lavenderdh.cn/)

[DreamStaro的网站](https://seachen.cn/)

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


