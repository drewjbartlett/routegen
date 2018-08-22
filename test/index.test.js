import routeGen from '../src/index';

describe('routes generator', () => {
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

    expect(routes.get('foo')).toEqual(expected);
  });

  describe('set/get', () => {
    it('should add and retrieve a route', () => {
      const routes = routeGen();
      const expected = '/api/foo/bar';

      routes.set('foo', expected);

      expect(routes.get('foo')).toEqual(expected);
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

      expect(routes.get('foo')).toEqual(expected);
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

      expect(routes.get(expected)).toBeDefined();
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

      expect(routes.get(expectedName)).toEqual(expectedPath);
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
    it('should generate a route with params', () => {
      const routes = routeGen();

      routes.set('foo', '/bar/{id}');

      expect(routes.generate('foo', { id: 1 })).toEqual('/bar/1');
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

      expect(routes._replaceURLParams('/foo/{id}', { id: 1 })).toEqual('/foo/1');
    });

    it('should replace the url params from a url and an object', () => {
      const routes = routeGen();

      expect(routes._replaceURLParams('/foo/{id}/{foo}', { id: 1, foo: 'bar' })).toEqual('/foo/1/bar');
    });
  });
});
