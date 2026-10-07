import { describe, expect, it } from "bun:test";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { ParseDataOptions } from "astro/loaders";
import { createE2eFixtureContext, enableE2ePost } from "./e2eFixtures";

describe("enableE2ePost", () => {
  const draft = { title: "示例", draft: true };
  const base = "/repo/src/posts";

  it("正式构建保留示例草稿且不修改输入", () => {
    expect(enableE2ePost(draft, `${base}/theme-demo/hello-world.md`, base, false)).toBe(draft);
    expect(draft.draft).toBe(true);
  });

  it("测试构建只启用示例目录下的文章", () => {
    expect(enableE2ePost(draft, `${base}/theme-demo/hello-world.md`, base, true)).toEqual({
      title: "示例",
      draft: false,
    });
    expect(draft.draft).toBe(true);
    expect(enableE2ePost(draft, `${base}/theme-demo/nested/index.mdx`, base, true).draft).toBe(
      false,
    );
  });

  it("支持 Windows 路径", () => {
    expect(
      enableE2ePost(
        draft,
        "D:\\repo\\src\\posts\\theme-demo\\hello-world.md",
        "D:\\repo\\src\\posts",
        true,
      ).draft,
    ).toBe(false);
  });

  it("保留真实文章及其他目录的草稿", () => {
    for (const filePath of [
      `${base}/real/draft.md`,
      `${base}/theme-demo-other/post.md`,
      `${base}/real/theme-demo/post.md`,
      "/other/theme-demo/post.md",
    ]) {
      expect(enableE2ePost(draft, filePath, base, true)).toBe(draft);
    }
  });

  it("缺少来源路径时保留草稿", () => {
    expect(enableE2ePost(draft, undefined, base, true)).toBe(draft);
  });
});

describe("createE2eFixtureContext", () => {
  it("模式切换改变未修改文章的缓存摘要并恢复正式草稿", async () => {
    const digests: string[] = [];
    const drafts: unknown[] = [];
    const context = {
      config: { root: pathToFileURL(`${process.cwd()}${path.sep}`) },
      generateDigest: (data: Record<string, unknown> | string) => JSON.stringify(data),
      parseData: async <TData extends Record<string, unknown>>(
        props: ParseDataOptions<TData>,
      ): Promise<TData> => props.data,
    };

    async function loadContext(enabled: boolean) {
      const fixtureContext = createE2eFixtureContext(context, enabled);
      digests.push(fixtureContext.generateDigest("unchanged content"));
      const data = await fixtureContext.parseData({
        id: "theme-demo/hello-world",
        filePath: path.resolve("src/posts/theme-demo/hello-world.md"),
        data: { draft: true },
      });
      drafts.push(data.draft);
    }
    await loadContext(false);
    await loadContext(true);
    await loadContext(false);
    expect(digests[0]).not.toBe(digests[1]);
    expect(digests[0]).toBe(digests[2]);
    expect(drafts).toEqual([true, false, true]);
  });
});
