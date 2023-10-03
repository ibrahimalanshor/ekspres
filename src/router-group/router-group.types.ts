export interface RouteGroupHandler {
  path: string;
  method: 'get' | 'post' | 'patch' | 'delete';
}
