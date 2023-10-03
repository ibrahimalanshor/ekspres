import { RouterHandler, RouterMethod } from '../router/router.types';

export interface RouterGroupHandler<T = any> {
  path: string;
  method: RouterMethod;
  handler: RouterHandler<T>;
}
