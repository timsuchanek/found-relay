'use strict';

exports.__esModule = true;

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncGenerator2 = require('babel-runtime/helpers/asyncGenerator');

var _asyncGenerator3 = _interopRequireDefault(_asyncGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _ResolverUtils = require('found/lib/ResolverUtils');

var _isPromise = require('is-promise');

var _isPromise2 = _interopRequireDefault(_isPromise);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classic = require('react-relay/classic');

var _classic2 = _interopRequireDefault(_classic);

var _checkRelayQueryData = require('react-relay/lib/checkRelayQueryData');

var _checkRelayQueryData2 = _interopRequireDefault(_checkRelayQueryData);

var _RelayRouteRenderer = require('./RelayRouteRenderer');

var _RelayRouteRenderer2 = _interopRequireDefault(_RelayRouteRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasOwnProperty = Object.prototype.hasOwnProperty;

// TODO: Should we disable Relay query caching for SSR? If so, we should cache
// query sets ourselves.

var PENDING_READY_STATE = {
  aborted: false,
  done: false,
  error: null,
  events: [],
  ready: false,
  stale: false
};

var STALE_READY_STATE = (0, _extends4.default)({}, PENDING_READY_STATE, {
  ready: true,
  stale: true
});

var DONE_READY_STATE = (0, _extends4.default)({}, PENDING_READY_STATE, {
  done: true,
  ready: true
});

var Resolver = function () {
  function Resolver(environment) {
    (0, _classCallCheck3.default)(this, Resolver);

    this.environment = environment;
  }

  Resolver.prototype.resolveElements = function () {
    var _ref = _asyncGenerator3.default.wrap(_regenerator2.default.mark(function _callee(match) {
      var routeMatches, routeIndices, Components, matchQueries, extraQueryNodes, forceFetches, routeParams, queryConfigs, extraQueries, earlyComponents, earlyReadyStates, fetchedComponents, routeRunQueries, fetchedReadyStates;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // TODO: Close over and abort earlier requests?

              routeMatches = (0, _ResolverUtils.getRouteMatches)(match);
              routeIndices = match.routeIndices;
              Components = (0, _ResolverUtils.getComponents)(routeMatches);
              matchQueries = (0, _ResolverUtils.getRouteValues)(routeMatches, function (route) {
                return route.getQueries;
              }, function (route) {
                return route.queries;
              });
              extraQueryNodes = (0, _ResolverUtils.getRouteValues)(routeMatches, function (route) {
                return route.getExtraQuery;
              }, function (route) {
                return route.extraQuery;
              });
              forceFetches = (0, _ResolverUtils.getRouteValues)(routeMatches, function (route) {
                return route.getForceFetch;
              }, function (route) {
                return route.forceFetch;
              });
              routeParams = this.getRouteParams(routeMatches);
              queryConfigs = this.getQueryConfigs(matchQueries, routeIndices, routeParams);
              extraQueries = this.getExtraQueries(extraQueryNodes, routeParams);

              if (!Components.some(_isPromise2.default)) {
                _context.next = 15;
                break;
              }

              _context.next = 12;
              return _asyncGenerator3.default.await(_promise2.default.all(Components.map(_ResolverUtils.checkResolved)));

            case 12:
              _context.t0 = _context.sent;
              _context.next = 16;
              break;

            case 15:
              _context.t0 = Components;

            case 16:
              earlyComponents = _context.t0;
              earlyReadyStates = this.getEarlyReadyStates(earlyComponents, queryConfigs, extraQueries, forceFetches);

              if (!earlyReadyStates.some(function (readyState) {
                return readyState && !readyState.done;
              })) {
                _context.next = 21;
                break;
              }

              _context.next = 21;
              return this.createElements(routeMatches, earlyComponents, queryConfigs, earlyReadyStates, null, // No retry here, as these will never be in error.
              extraQueries);

            case 21:
              if (!earlyComponents.every(_ResolverUtils.isResolved)) {
                _context.next = 25;
                break;
              }

              _context.t1 = earlyComponents;
              _context.next = 28;
              break;

            case 25:
              _context.next = 27;
              return _asyncGenerator3.default.await(_promise2.default.all(Components));

            case 27:
              _context.t1 = _context.sent;

            case 28:
              fetchedComponents = _context.t1;
              routeRunQueries = this.getRouteRunQueries(fetchedComponents, queryConfigs, extraQueries, forceFetches);
              _context.next = 32;
              return _asyncGenerator3.default.await(this.getFetchedReadyStates(routeRunQueries));

            case 32:
              fetchedReadyStates = _context.sent;
              _context.next = 35;
              return this.createElements(routeMatches, fetchedComponents, queryConfigs, fetchedReadyStates, routeRunQueries, extraQueries);

            case 35:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function resolveElements(_x) {
      return _ref.apply(this, arguments);
    }

    return resolveElements;
  }();

  Resolver.prototype.getRouteParams = function getRouteParams(routeMatches) {
    var params = null;

    return routeMatches.map(function (routeMatch) {
      var route = routeMatch.route;

      // We need to always run this to make sure we don't miss route params.

      params = (0, _extends4.default)({}, params, routeMatch.routeParams);
      if (route.prepareParams) {
        params = route.prepareParams(params, routeMatch);
      }

      return params;
    });
  };

  Resolver.prototype.getQueryConfigs = function getQueryConfigs(matchQueries, routeIndices, routeParams) {
    return matchQueries.map(function (queries, i) {
      if (!queries) {
        return null;
      }

      return {
        name: '__route_' + i + '_' + routeIndices[i],
        queries: queries,
        params: routeParams[i]
      };
    });
  };

  Resolver.prototype.getExtraQueries = function getExtraQueries(extraQueryNodes, routeParams) {
    return extraQueryNodes.map(function (extraQueryNode, i) {
      if (!extraQueryNode) {
        return null;
      }

      return _classic2.default.createQuery(extraQueryNode, routeParams[i]);
    });
  };

  Resolver.prototype.getEarlyReadyStates = function getEarlyReadyStates(earlyComponents, queryConfigs, extraQueries, forceFetches) {
    var recordStore = this.environment.getStoreData().getQueuedStore();

    return earlyComponents.map(function (Component, i) {
      var queryConfig = queryConfigs[i];
      var extraQuery = extraQueries[i];

      if (!queryConfig && !extraQuery) {
        return null;
      }

      if (!(0, _ResolverUtils.isResolved)(Component)) {
        return PENDING_READY_STATE;
      }

      // TODO: What about deferred queries?
      // We use checkRelayQueryData here because I want to batch all the Relay
      // requests. We can send out requests for resolved components, but that
      // runs the risk of the data we request now being out-of-sync with the
      // data we request later.
      if (queryConfig) {
        var querySet = _classic2.default.getQueries(Component, queryConfig);
        var hasQueryData = (0, _values2.default)(querySet).every(function (query) {
          return !query || (0, _checkRelayQueryData2.default)(recordStore, query);
        });

        if (!hasQueryData) {
          return PENDING_READY_STATE;
        }
      }

      if (extraQuery && !(0, _checkRelayQueryData2.default)(recordStore, extraQuery)) {
        return PENDING_READY_STATE;
      }

      return forceFetches[i] ? STALE_READY_STATE : DONE_READY_STATE;
    });
  };

  Resolver.prototype.getRouteRunQueries = function getRouteRunQueries(fetchedComponents, queryConfigs, extraQueries, forceFetches) {
    var _this = this;

    return fetchedComponents.map(function (Component, i) {
      var queryConfig = queryConfigs[i];
      var extraQuery = extraQueries[i];

      if (!queryConfig && !extraQuery) {
        return null;
      }

      var querySet = void 0;
      if (queryConfig) {
        querySet = _classic2.default.getQueries(Component, queryConfig);
      }

      if (extraQuery) {
        var _extends2;

        var extraQueryKey = '__extra';
        while (querySet && hasOwnProperty.call(querySet, extraQueryKey)) {
          extraQueryKey = '_' + extraQueryKey;
        }

        // Relay caches query sets, so it's very important to not modify the
        // query set in-place.
        querySet = (0, _extends4.default)({}, querySet, (_extends2 = {}, _extends2[extraQueryKey] = extraQuery, _extends2));
      }

      return function (onReadyStateChange) {
        return forceFetches[i] ? _this.environment.forceFetch(querySet, onReadyStateChange) : _this.environment.primeCache(querySet, onReadyStateChange);
      };
    });
  };

  Resolver.prototype.getFetchedReadyStates = function getFetchedReadyStates(routeRunQueries) {
    // TODO: What about deferred queries?
    return _promise2.default.all(routeRunQueries.map(function (runQueries) {
      if (!runQueries) {
        return null;
      }

      return new _promise2.default(function (resolve) {
        runQueries(function (readyState) {
          if (readyState.aborted || readyState.done || readyState.error) {
            resolve(readyState);
          }
        });
      });
    }));
  };

  Resolver.prototype.createElements = function createElements(routeMatches, Components, queryConfigs, readyStates, routeRunQueries, extraQueries) {
    var _this2 = this;

    return routeMatches.map(function (match, i) {
      var route = match.route;


      var Component = Components[i];
      var queryConfig = queryConfigs[i];
      var readyState = readyStates[i];
      var extraQuery = extraQueries[i];

      var extraData = _this2.getExtraData(extraQuery, readyState);
      var isComponentResolved = (0, _ResolverUtils.isResolved)(Component);

      // Handle non-Relay routes.
      if (!queryConfig) {
        if (route.prerender) {
          route.prerender((0, _extends4.default)({}, readyState, { match: match, extraData: extraData }));
        }

        if (route.render) {
          return route.render({
            match: match,
            Component: isComponentResolved ? Component : null,
            props: match
          });
        }

        if (!isComponentResolved) {
          return undefined;
        }

        return Component ? _react2.default.createElement(Component, match) : null;
      }

      if (route.prerender) {
        route.prerender((0, _extends4.default)({}, readyState, { match: match, extraData: extraData }));
      }

      if (!isComponentResolved) {
        // Can't render a RelayReadyStateRenderer here.
        if (route.render) {
          return route.render((0, _extends4.default)({}, readyState, {
            match: match,
            Component: null,
            props: null
          }));
        }

        return undefined;
      }

      // If there's a query config, then there must be a component.
      return _react2.default.createElement(_RelayRouteRenderer2.default, {
        match: match,
        Component: Component,
        environment: _this2.environment,
        queryConfig: queryConfig,
        readyState: readyState,
        runQueries: routeRunQueries && routeRunQueries[i]
      });
    });
  };

  Resolver.prototype.getExtraData = function getExtraData(extraQuery, readyState) {
    var _ref2;

    if (!extraQuery || !readyState.ready) {
      return null;
    }

    var identifyingArg = extraQuery.getIdentifyingArg();
    var queryData = this.environment.readQuery(extraQuery);
    var fieldData = identifyingArg && Array.isArray(identifyingArg.value) ? queryData : queryData[0];

    return _ref2 = {}, _ref2[extraQuery.getFieldName()] = fieldData, _ref2;
  };

  return Resolver;
}();

exports.default = Resolver;
module.exports = exports['default'];