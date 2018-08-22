// @ts-check

export default (config = {}) => {
  const _routes = new Map();
  const _config = Object.assign({
    baseUrl: '',
  }, config);

  const _getUrlParams = url => {
    let mappedParams = url.match(/{\s*[\w\.]+\s*}/g); // eslint-disable-line

    // if we have mappedParams, strip off the {}
    if (mappedParams !== null) {
        return mappedParams.map(x => x.match(/[\w\.]+/)[0]); // eslint-disable-line
    }

    return [];
  };

  /**
   * This replaces any interpolated params with items passed in via the routeParams object
   *
   * @param {string} url
   * @param {Object} urlParams
   * @return {string}
   */
  const _replaceURLParams = (url, urlParams) => {
    const routeParams = _getUrlParams(url);
    let mappedUrl = url;

    // only do this if we have route params && params to replace
    if (routeParams.length && Object.keys(urlParams).length !== 0) {
      // replace each occurrence of the param with the value passed in
      routeParams.forEach(param => {
        mappedUrl = mappedUrl.replace(`{${param}}`, urlParams[param]);
      });
    }

    return mappedUrl;
  };

  const _get = k => `${_config.baseUrl}${_routes.get(k)}`;

  /**
   * Generate a route from a key and url params to interpolate
   *
   * @param {string} k
   * @param {Object} params
   * @return {string}
   */
  const generate = (k, params = {}) => _replaceURLParams(_get(k), params);

  /**
   * Set a new route with a key and value
   *
   * @param {string} k
   * @param {string} v
   */
  const set = (k, v) => {
    _routes.set(k, v);
  };

  /**
   * Prefix a set of routes
   *
   * @param {Object} prefixes
   * @param {string} prefixes.path
   * @param {string} prefixes.name
   * @param {Object} newRoutes
   */
  const prefix = (prefixes = { path: '', name: '' }, newRoutes) => {
    const name = prefixes.name ? `${prefixes.name}_` : '';
    const path = prefixes.path ? `${prefixes.path}` : '';

    Object.keys(newRoutes).forEach(k => {
      set(`${name}${k}`, `${path}${newRoutes[k]}`);
    });
  };

  /**
   * Retrieve all the routes
   *
   * @return {array}
   */
  const all = () => {
    const routes = [];

    _routes.forEach((value, key) => {
      routes.push({ key, value });
    });

    return routes;
  };

  /**
   * Lock the routes so there's no abililty call set
   *
   * @return {Object}
   */
  const lock = () => ({
    generate,
    all,
  });

  return {
    generate,
    set,
    prefix,
    all,
    lock,

    // for testing purposes
    _get,
    _getUrlParams,
    _replaceURLParams,
  };
};
