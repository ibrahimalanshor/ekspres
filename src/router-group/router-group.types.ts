import { RouterHandler, RouterMethod } from '../router/router.types';

export interface RouteGroupHandler<T = any> {
  path: string;
  method: RouterMethod;
  handler: RouterHandler<T>;
}
