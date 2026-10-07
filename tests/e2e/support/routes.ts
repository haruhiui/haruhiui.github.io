export const ROUTES = {
  home: "/",
  page2: "/page/2/",
  page3: "/page/3/",
  moments: "/moments/",
  tags: "/tags/",
  categories: "/categories/",
} as const;

export const POSTS = {
  helloWorld: "/posts/theme-demo/hello-world/",
  gettingStarted: "/posts/theme-demo/getting-started/",
  encryptedTest: "/posts/theme-demo/encrypted-test/",
  imageZoomTest: "/posts/theme-demo/image-zoom-test/",
  noteMdxDemo: "/posts/theme-demo/note-mdx-demo/",
  postMigrationTest: "/posts/theme-demo/post-migration-test/",
} as const;

export const SEARCH_TERMS = {
  publicPostTitle: "Hello World!",
  encryptedPostTitle: "加密文章测试",
  encryptedOnlyText: "AES-GCM",
} as const;
