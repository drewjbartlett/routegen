'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('routes generator', function () {
  it('constructor test', function () {
    var routes = (0, _index2.default)();

    expect(routes).toBeTruthy();
  });

  it('applies a baseUrl', function () {
    var routes = (0, _index2.default)({
      baseUrl: 'http://myapi.com/api'
    });
    var expected = 'http://myapi.com/api/bar';

    routes.set('foo', '/bar');

    expect(routes.get('foo')).toEqual(expected);
  });

  describe('set/get', function () {
    it('should add and retrieve a route', function () {
      var routes = (0, _index2.default)();
      var expected = '/api/foo/bar';

      routes.set('foo', expected);

      expect(routes.get('foo')).toEqual(expected);
    });
  });

  describe('prefix', function () {
    it('should add a path prefix', function () {
      var routes = (0, _index2.default)();
      var expected = '/auth/foo/bar';

      routes.prefix({
        path: '/auth/foo'
      }, {
        foo: '/bar'
      });

      expect(routes.get('foo')).toEqual(expected);
    });

    it('should add a name prefix', function () {
      var routes = (0, _index2.default)();
      var expected = 'auth_foo';

      routes.prefix({
        name: 'auth'
      }, {
        foo: '/bar'
      });

      expect(routes.get(expected)).toBeDefined();
    });

    it('should add a name and path prefix', function () {
      var routes = (0, _index2.default)();
      var expectedName = 'auth_foo';
      var expectedPath = '/auth/foo/bar';

      routes.prefix({
        path: '/auth/foo',
        name: 'auth'
      }, {
        foo: '/bar'
      });

      expect(routes.get(expectedName)).toEqual(expectedPath);
    });
  });

  describe('all()', function () {
    it('should return all routes', function () {
      var routes = (0, _index2.default)();

      routes.set('foo', '/bar');
      routes.set('bar', '/foo/bar');

      expect(routes.all().length).toBe(2);
    });
  });

  describe('generate()', function () {
    it('should generate a route with params', function () {
      var routes = (0, _index2.default)();

      routes.set('foo', '/bar/{id}');

      expect(routes.generate('foo', { id: 1 })).toEqual('/bar/1');
    });
  });

  describe('_getUrlParams', function () {
    it('should returns the url params interpolated in a string', function () {
      var routes = (0, _index2.default)();

      expect(routes._getUrlParams('/foo/{id}')).toEqual(['id']);
    });

    it('should returns the url params interpolated in a string for multiple params', function () {
      var routes = (0, _index2.default)();

      expect(routes._getUrlParams('/foo/{id}/{foo}')).toEqual(['id', 'foo']);
    });
  });

  describe('_replaceURLParams', function () {
    it('should replace the url params from a url and an object', function () {
      var routes = (0, _index2.default)();

      expect(routes._replaceURLParams('/foo/{id}', { id: 1 })).toEqual('/foo/1');
    });

    it('should replace the url params from a url and an object', function () {
      var routes = (0, _index2.default)();

      expect(routes._replaceURLParams('/foo/{id}/{foo}', { id: 1, foo: 'bar' })).toEqual('/foo/1/bar');
    });
  });
});