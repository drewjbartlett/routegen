import routeGen from '../src/index';

describe('routeGen', () => {
  it('constructor test', () => {
    const routes = routeGen();

    expect(routes).toBeTruthy();
  });

  it('applies a baseUrl', () => {
    const routes = routeGen({
      baseUrl: 'http://myapi.com/api',
    });
    const expected = 'http://myapi.com/api/bar';

    routes.set('foo', '/bar');

    expect(routes.generate('foo')).toEqual(expected);
  });

  describe('set/generate', () => {
    it('should add and retrieve a route', () => {
      const routes = routeGen();
      const expected = '/api/foo/bar';

      routes.set('foo', expected);

      expect(routes.generate('foo')).toEqual(expected);
    });
  });

  describe('prefix', () => {
    it('should add a path prefix', () => {
      const routes = routeGen();
      const expected = '/auth/foo/bar';

      routes.prefix(
        {
          path: '/auth/foo',
        },
        {
          foo: '/bar',
        },
      );

      expect(routes.generate('foo')).toEqual(expected);
    });

    it('should add a name prefix', () => {
      const routes = routeGen();
      const expected = 'auth_foo';

      routes.prefix(
        {
          name: 'auth',
        },
        {
          foo: '/bar',
        },
      );

      expect(routes.generate(expected)).toBeDefined();
    });

    it('should add a name and path prefix', () => {
      const routes = routeGen();
      const expectedName = 'auth_foo';
      const expectedPath = '/auth/foo/bar';

      routes.prefix(
        {
          path: '/auth/foo',
          name: 'auth',
        },
        {
          foo: '/bar',
        },
      );

      expect(routes.generate(expectedName)).toEqual(expectedPath);
    });
  });

  describe('all()', () => {
    it('should return all routes', () => {
      const routes = routeGen();

      routes.set('foo', '/bar');
      routes.set('bar', '/foo/bar');

      expect(routes.all().length).toBe(2);
    });
  });

  describe('generate()', () => {
    const routes = routeGen();

    routes.set('foo', '/api/foo/bar');
    routes.set('foo_bar', '/bar/{id}');
    routes.set('foo_bar_baz', '/bar/{id}/{name}/foo');
    routes.set('foo_to_append', '/api/foo/append');

    it('should generate a route with no params', () => {
      const expected = '/api/foo/bar';

      expect(routes.generate('foo')).toEqual(expected);
    });

    it('should generate a route with a single params', () => {
      const expected = '/bar/1';

      expect(routes.generate('foo_bar', { id: 1 })).toEqual(expected);
    });

    it('should generate a route with multiple params', () => {
      const expected = '/bar/134/drew/foo';

      expect(routes.generate('foo_bar_baz', { id: 134, name: 'drew' })).toEqual(expected);
    });

    it('should append query string params to the url if there are no params set', () => {
      const expected = '/api/foo/append?id=1';

      expect(routes.generate('foo_to_append', { id: 1 })).toEqual(expected);
    });

    it('should append query params when interpolated params are passed before them', () => {
      const expected = '/bar/1?name=drew';

      expect(routes.generate('foo_bar', { id: 1 }, { name: 'drew' })).toEqual(expected);
    });
  });

  describe('_stringifyParams', () => {
    const routes = routeGen();

    routes.set('foo_to_append', '/api/foo/append');

    it('should stringify multiple params', () => {
      const expected = '/api/foo/append?id=1&bar=baz';

      expect(routes.generate('foo_to_append', { id: 1, bar: 'baz' })).toEqual(expected);
    });
  });

  describe('_getUrlParams', () => {
    it('should returns the url params interpolated in a string', () => {
      const routes = routeGen();

      expect(routes._getUrlParams('/foo/{id}')).toEqual(['id']);
    });

    it('should returns the url params interpolated in a string for multiple params', () => {
      const routes = routeGen();

      expect(routes._getUrlParams('/foo/{id}/{foo}')).toEqual(['id', 'foo']);
    });
  });

  describe('_replaceURLParams', () => {
    it('should replace the url params from a url and an object', () => {
      const routes = routeGen();

      expect(routes._replaceURLParams('/foo/{id}', { id: 1 }, {})).toEqual('/foo/1');
    });

    it('should replace the url params from a url and an object', () => {
      const routes = routeGen();

      expect(routes._replaceURLParams('/foo/{id}/{foo}', { id: 1, foo: 'bar' }, {})).toEqual('/foo/1/bar');
    });
  });

  describe('lock()', () => {
    const routes = routeGen();

    routes.set('foo_bar', '/foo/bar');
    routes.set('foo_bar_baz', '/foo/bar/{id}');

    const locked = routes.lock();

    it('should not have access to set() or prefix()', () => {
      expect(locked.set).toBeUndefined();
      expect(locked.prefix).toBeUndefined();
    });

    it('should have access to the public api', () => {
      expect(locked.generate).not.toBeUndefined();
      expect(locked.all).not.toBeUndefined();
    });

    it('should be able to generate a route', () => {
      expect(locked.generate('foo_bar')).toEqual('/foo/bar');
    });

    it('should be able to generate an interpolated route', () => {
      expect(locked.generate('foo_bar_baz', { id: 123 })).toEqual('/foo/bar/123');
    });
  });
});
