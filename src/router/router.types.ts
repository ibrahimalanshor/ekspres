import { Request, Response } from 'express';

export type RouterMethod = 'get' | 'post' | 'patch' | 'delete';
export interface RouterContext {
  req: Request;
  res: Response;
}
export type RouterHandler<T> = (context?: RouterContext) => Promise<T>;
