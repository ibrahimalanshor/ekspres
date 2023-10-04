# ekspres

Listen

```ts
import { App } from 'ekspres';

const app = new App();

app.setPort(3000);
app.listen((port: number) => console.log(`App running at ${port}`));
```

Get Server

```ts
import { App } from 'ekspres';

const app = new App();

console.log(app.getServer()); // http.Server
```

Middleware

```ts
import { App } from 'ekspres';

const app = new App();

app.setMiddlewares([
  (req, res, next) => {
    console.log('middleware 1');
    next();
  },
  (req, res, next) => {
    console.log('middleware 2');
    next();
  },
]);
```

Route

```ts
import { App, Router } from 'ekspres';

const app = new App();
const testRoute = new Router()
  .setPath('/')
  .setMethod('get')
  .handle(async () => 'Ok')
  .make();

app.setRoutes([testRoute]);
```

Route Group

```ts
import { App, RouterGroup } from 'ekspres';

const app = new App();
const testRoute = new RouterGroup()
  .handle({
    path: '/',
    method: 'Get',
    handler: async () => 'Ok',
  })
  .handle({
    path: '/',
    method: 'post',
    handler: async () => 'Ok',
  })
  .make();

app.setRoutes([testRoute]);
```

Throw Http Error

```ts
import { App, Router, HttpError } from 'ekspres'

const app = new App
const testRoute = new Router()
    .setPath('/')
    .setMethod('get')
    .handle(async () => {
        throw new HttpError(
          {
            name: 'Forbidden',
            message: 'You dont have access',
          },
          403,
        ),
    })
    .make()

app.setRoutes([
    testRoute
])
```

Query Middleware

```ts
import { App, Router, createQueryMiddleware } from 'ekspres'

const app = new App();

app.setRoutes([
  new Router()
    .setPath('/')
    .setMethod('get')
    .addMiddlewares([createQueryMiddleware().forAll])
    .handle(async (context) => context?.req.query)
    .make(),
  new Router()
    .setPath('/')
    .setMethod('get')
    .addMiddlewares([createQueryMiddleware().forSingle])
    .handle(async (context) => context?.req.query)
    .make();
]);
```

Request Validator

```ts
import { App, Router, Request, createRequestValidator } from 'ekspres';

const app = new App();
const router = new Router();

class CreateUserRequest extends Request {
  schema(): Schema {
    return Joi.object({
      email: Joi.string().email().required(),
    });
  }
}

app.setRoutes([
  router
    .setPath('/')
    .setMethod('post')
    .addMiddlewares([createRequestValidator(CreateUserRequest)])
    .handle(async (context) => context.body)
    .make(),
]);
```
