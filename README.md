# routeGen

[![npm](https://img.shields.io/npm/v/routegen.svg?style=flat-square)](https://www.npmjs.com/package/routegen)
[![npm](https://img.shields.io/travis/drewjbartlett/routegen.svg?branch=master&style=flat-square)](https://www.npmjs.com/package/routegen)

Define your API and SPA routes in one place. Use them anywhere.

### The Problem

Defining your routes at "magic strings" is messy never a good idea, especially as your app grows. You might have something like this: 

```js
// foo.js
http.get(`/user/${userId}`).then(...)
http.post(`/some-service/create-something`).then(...)

// and then again in bar.js
http.get(`/user/${userId}`).then(...)
http.post(`/some-service/create-something`).then(...)
```
And what if you decide to change your routes? You need to update them all over the place. What if you mistype a route in one place? It can break things and get messy. `routeGen` fixes all these issues. 

### The Solution / Basic Usage

Rather than have the "magic strings" all over the place, you can define them in one place and use them everywhere. Need to inerpolate a value into a url? No problem. You can even disable redefining routes after they're exported with the magic `lock()` method. Grouping certain routes with a prefix and namespace is a breeze with the `prefix()` method. `routeGen` is simple, useful and incredibly lightweight at only 1.6kb.

```js
// routes.js
import routeGen from 'routegen';

// all routes will be prefixed with the baseUrl
const routes = routeGen({
  baseUrl: 'http://myapi.test/api',
});

routes.set('login', '/auth/login'); 
routes.set('get_user_by_id', '/user/{id}');

export default routes;
```

```js
// some-other-file.js
import http from 'utils/http';
import routes from './routes';

http.post(routes.generate('login'), { data }); // POST => http://myapi.test/api/auth/login
http.generate(routes.generate('get_user_by_id', { id: 1 })); // GET => http://myapi.test/api/user/1
```

### An example with axios

```js
import axios from 'axios';
import routes from './routes';

axios.post(routes.generate('login'), { data }); // POST => http://myapi.test/api/auth/login
axios.generate(routes.generate('get_user_by_id', { id: 1 })); // GET => http://myapi.test/api/user/1
```

___

### Installation 

```bash
npm i routegen --save
```

___

### API

### routeGen({...})

To define sets of routes, simply call import `routegen` and call it as a function. The only parameter it accepts is an object with a `baseUrl`.

```js
import routeGen from 'routegen';

const routes = routeGen({
  baseUrl: 'http://myapi.test/api',
});
```

You may also define multiple sets of routes: 

```js
import routeGen from 'routegen';

const apiRoutes = routeGen({
  baseUrl: 'http://myapi.test/api',
});

const spaRoutes = routeGen({
  baseUrl: 'http://mysite.test/dasbhboard',
});

```

#### set(k, v)

Pretty straight forward. Set a new route.

```js
routes.set('get_users', '/users');
routes.set('get_user_by_id', '/users/{id}');
```

#### generate(key, data = {})

Retrieve a value from the routes. 

```js
const routes = routeGen();

routes.set('foo_bar', '/foo/bar');

routes.generate('foo_bar'); // => /foo/bar
```

Some routes require an interpolated value. For instance, getting a user by id. You can define a route that accepts params and retrieve it with `generate()`.

```js
const routes = routeGen();

routes.set('get_user_by_id', '/user/{id}');

routes.generate('get_user_by_id', { id: 1 }); // GET => /user/1
```

#### lock()

If you'd like to define your routes in one place and disallow setting any new routes once exported, you may call the `lock()` method.

```js
const routes = routeGen();

routes.set('foo_bar', '/foo/bar');
routes.set('foo_bar_baz', '/foo/bar/{id}');

export default routes.lock();
```

Calling `lock()` returns an api with access only to `generate()`, and `all()`. So, the above example could not be modified once imported.
 
#### prefix({ path, name })
 
You may have times where you want to prefix routes with a namespace and/or a path. `prefix()` allows for just that.

```js
import routeGen from 'routegen';

const routes = routeGen();

routes.prefix({ path: '/auth', name: 'auth' }, {
  login: '/login',
  logout: '/logout',
  register: '/register',
});

routes.generate('auth_login') // /auth/login
routes.generate('auth_logout') // /auth/logout
routes.generate('auth_register') // /auth/register
```

#### all()

If you need a way to retrieve all the routes at once, you may call `all()`. 

```js
routes.all().forEach(route => ...)
```
