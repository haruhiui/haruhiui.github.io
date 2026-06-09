import { defineConfig } from "./toolkit/themeConfig";

export default defineConfig({
  siteName: "haruhiui",

  brand: {
    title: "haruhiui",
    subtitle: "約束タワーで待ってて",
    logo: "Starlight",
  },

  sidebar: {
    author: "haruhiui",
    description: "約束タワーで待ってて",
    social: {
      github: {
        url: "https://github.com/haruhiui",
        icon: "i-ri-github-fill",
        color: "#191717",
      },
    },
  },

  footer: {
    since: 2021,
    icon: {
      name: "sakura rotate",
      color: "#ffc0cb",
    },
    icp: {
      enable: false,
    },
  },

  tagCloud: {
    startColor: "#72cecf",
    endColor: "#ffbac3",
  },

  home: {
    selectedCategories: [
      { name: "Computer-Graphics" },
      { name: "Data-Structures-and-Algorithms" },
      { name: "_Programming-Languages" },
    ],
  },

  friends: {
    title: "友链",
    description: "小伙伴们",
    links: [
      {
        url: "https://c01dkit.github.io",
        title: "c01dkit",
        desc: "喜欢玩 pwn，人菜瘾大",
        author: "c01dkit",
        avatar: "https://s-sh-3008-c01dkit.oss.dogecdn.com/assets/images/profile.png",
        color: "#806d9e",
      },
    ],
  },

  copyright: {
    license: "CC-BY-NC-SA-4.0",
    show: true,
  },
});
