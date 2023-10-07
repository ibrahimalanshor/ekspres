export type RouterMethod = 'get' | 'post' | 'patch' | 'delete';
export interface RouterContext {
  query: Record<string, any>;
  body: Record<string, any>;
  params: Record<string, any>;
}
export type RouterHandler<T> = (context: RouterContext) => Promise<T>;
