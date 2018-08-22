'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _routes = new Map();
  var _config = Object.assign({
    baseUrl: ''
  }, config);

  var _getUrlParams = function _getUrlParams(url) {
    var mappedParams = url.match(/{\s*[\w\.]+\s*}/g);
    if (mappedParams !== null) {
      return mappedParams.map(function (x) {
        return x.match(/[\w\.]+/)[0];
      });
    }

    return [];
  };

  var _replaceURLParams = function _replaceURLParams(url, urlParams) {
    var routeParams = _getUrlParams(url);
    var mappedUrl = url;

    if (routeParams.length && Object.keys(urlParams).length !== 0) {
      routeParams.forEach(function (param) {
        mappedUrl = mappedUrl.replace('{' + param + '}', urlParams[param]);
      });
    }

    return mappedUrl;
  };

  var _get = function _get(k) {
    return '' + _config.baseUrl + _routes.get(k);
  };

  var generate = function generate(k) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _replaceURLParams(_get(k), params);
  };

  var set = function set(k, v) {
    _routes.set(k, v);
  };

  var prefix = function prefix() {
    var prefixes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { path: '', name: '' };
    var newRoutes = arguments[1];

    var name = prefixes.name ? prefixes.name + '_' : '';
    var path = prefixes.path ? '' + prefixes.path : '';

    Object.keys(newRoutes).forEach(function (k) {
      set('' + name + k, '' + path + newRoutes[k]);
    });
  };

  var all = function all() {
    var routes = [];

    _routes.forEach(function (value, key) {
      routes.push({ key: key, value: value });
    });

    return routes;
  };

  var lock = function lock() {
    return {
      generate: generate,
      all: all
    };
  };

  return {
    generate: generate,
    set: set,
    prefix: prefix,
    all: all,
    lock: lock,

    _get: _get,
    _getUrlParams: _getUrlParams,
    _replaceURLParams: _replaceURLParams
  };
};