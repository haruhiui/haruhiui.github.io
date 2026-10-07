import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Loader, LoaderContext, ParseDataOptions } from "astro/loaders";
import { resolveFolderCategories } from "./folderCategories";

export function enableE2ePost<TData extends Record<string, unknown>>(
  data: TData,
  filePath: string | undefined,
  postsBasePath: string,
  enabled: boolean,
): TData {
  if (
    !enabled ||
    !filePath ||
    resolveFolderCategories(filePath, postsBasePath)[0] !== "theme-demo"
  ) {
    return data;
  }

  return { ...data, draft: false };
}

export function withE2eFixtures(loader: Loader, enabled: boolean): Loader {
  return {
    ...loader,
    name: `${loader.name}-e2e-fixtures`,
    async load(context: LoaderContext) {
      await loader.load(createE2eFixtureContext(context, enabled));
    },
  };
}

type FixtureContext = Pick<LoaderContext, "generateDigest" | "parseData"> & {
  config: { root: URL };
};

export function createE2eFixtureContext<TContext extends FixtureContext>(
  context: TContext,
  enabled: boolean,
): TContext {
  const postsBasePath = path.resolve(fileURLToPath(context.config.root), "src/posts");

  return {
    ...context,
    // 切换构建模式时重新解析内容，避免正式构建复用已启用的示例草稿。
    generateDigest(data) {
      return context.generateDigest({ data, e2eFixtures: enabled });
    },
    parseData<TData extends Record<string, unknown>>(
      props: ParseDataOptions<TData>,
    ): Promise<TData> {
      return context.parseData({
        ...props,
        data: enableE2ePost(props.data, props.filePath, postsBasePath, enabled),
      });
    },
  };
}
