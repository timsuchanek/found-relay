'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncGenerator2 = require('babel-runtime/helpers/asyncGenerator');

var _asyncGenerator3 = _interopRequireDefault(_asyncGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _ResolverUtils = require('found/lib/ResolverUtils');

var _isPromise = require('is-promise');

var _isPromise2 = _interopRequireDefault(_isPromise);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _QuerySubscription = require('./QuerySubscription');

var _QuerySubscription2 = _interopRequireDefault(_QuerySubscription);

var _ReadyStateRenderer = require('./ReadyStateRenderer');

var _ReadyStateRenderer2 = _interopRequireDefault(_ReadyStateRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Resolver = function () {
  function Resolver(environment) {
    (0, _classCallCheck3.default)(this, Resolver);

    this.environment = environment;

    this.lastQueries = [];
    this.lastRouteVariables = [];
    this.lastQuerySubscriptions = [];
  }

  Resolver.prototype.resolveElements = function () {
    var _ref = _asyncGenerator3.default.wrap(_regenerator2.default.mark(function _callee(match) {
      var routeMatches, Components, queries, cacheConfigs, routeVariables, querySubscriptions, fetches, earlyComponents, earlyData, fetchedComponents;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              routeMatches = (0, _ResolverUtils.getRouteMatches)(match);
              Components = (0, _ResolverUtils.getComponents)(routeMatches);
              queries = (0, _ResolverUtils.getRouteValues)(routeMatches, function (route) {
                return route.getQuery;
              }, function (route) {
                return route.query;
              });
              cacheConfigs = (0, _ResolverUtils.getRouteValues)(routeMatches, function (route) {
                return route.getCacheConfig;
              }, function (route) {
                return route.cacheConfig;
              });
              routeVariables = this.getRouteVariables(routeMatches);
              querySubscriptions = this.updateQuerySubscriptions(queries, routeVariables, cacheConfigs);
              fetches = querySubscriptions.map(function (querySubscription) {
                return querySubscription && querySubscription.fetch();
              });

              if (!Components.some(_isPromise2.default)) {
                _context.next = 13;
                break;
              }

              _context.next = 10;
              return _asyncGenerator3.default.await(_promise2.default.all(Components.map(_ResolverUtils.checkResolved)));

            case 10:
              _context.t0 = _context.sent;
              _context.next = 14;
              break;

            case 13:
              _context.t0 = Components;

            case 14:
              earlyComponents = _context.t0;
              _context.next = 17;
              return _asyncGenerator3.default.await(_promise2.default.all(fetches.map(_ResolverUtils.checkResolved)));

            case 17:
              earlyData = _context.sent;
              fetchedComponents = void 0;

              if (!(!earlyComponents.every(_ResolverUtils.isResolved) || !earlyData.every(_ResolverUtils.isResolved))) {
                _context.next = 29;
                break;
              }

              _context.next = 22;
              return this.createElements(routeMatches, earlyComponents, querySubscriptions);

            case 22:
              _context.next = 24;
              return _asyncGenerator3.default.await(_promise2.default.all(Components));

            case 24:
              fetchedComponents = _context.sent;
              _context.next = 27;
              return _asyncGenerator3.default.await(_promise2.default.all(fetches));

            case 27:
              _context.next = 30;
              break;

            case 29:
              fetchedComponents = earlyComponents;

            case 30:
              _context.next = 32;
              return this.createElements(routeMatches, fetchedComponents, querySubscriptions);

            case 32:
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

  Resolver.prototype.getRouteVariables = function getRouteVariables(routeMatches) {
    var variables = null;

    return routeMatches.map(function (routeMatch) {
      var route = routeMatch.route;

      // We need to always run this to make sure we don't miss route params.

      variables = (0, _extends3.default)({}, variables, routeMatch.routeParams);
      if (route.prepareVariables) {
        variables = route.prepareVariables(variables, routeMatch);
      }

      return variables;
    });
  };

  Resolver.prototype.updateQuerySubscriptions = function updateQuerySubscriptions(queries, routeVariables, cacheConfigs) {
    var _this = this;

    var _environment$unstable = this.environment.unstable_internal,
        createOperationSelector = _environment$unstable.createOperationSelector,
        getOperation = _environment$unstable.getOperation;


    var querySubscriptions = queries.map(function (query, i) {
      if (!query) {
        return null;
      }

      var variables = routeVariables[i];

      if (_this.lastQueries[i] === query && (0, _isEqual2.default)(_this.lastRouteVariables[i], variables)) {
        // Match the logic in <QueryRenderer> for not refetching.
        var lastQuerySubscription = _this.lastQuerySubscriptions[i];
        _this.lastQuerySubscriptions[i] = null;
        return lastQuerySubscription;
      }

      return new _QuerySubscription2.default(_this.environment, createOperationSelector(getOperation(query), variables), cacheConfigs[i]);
    });

    this.lastQuerySubscriptions.forEach(function (querySubscription) {
      if (querySubscription) {
        querySubscription.dispose();
      }
    });

    this.lastQueries = queries;
    this.lastRouteVariables = routeVariables;
    this.lastQuerySubscriptions = querySubscriptions;

    return querySubscriptions;
  };

  Resolver.prototype.createElements = function createElements(routeMatches, Components, querySubscriptions) {
    return routeMatches.map(function (match, i) {
      var route = match.route;


      var Component = Components[i];
      var querySubscription = querySubscriptions[i];

      var isComponentResolved = (0, _ResolverUtils.isResolved)(Component);

      // Handle non-Relay routes.
      if (!querySubscription) {
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
        route.prerender((0, _extends3.default)({}, querySubscription.readyState, { match: match }));
      }

      return _react2.default.createElement(_ReadyStateRenderer2.default, {
        match: match,
        Component: isComponentResolved ? Component : null,
        hasComponent: Component != null,
        querySubscription: querySubscription
      });
    });
  };

  return Resolver;
}();

exports.default = Resolver;
module.exports = exports['default'];