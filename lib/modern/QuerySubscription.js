'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuerySubscription = function () {
  function QuerySubscription(environment, operation, cacheConfig) {
    var _this = this;

    (0, _classCallCheck3.default)(this, QuerySubscription);

    this.onChange = function (snapshot) {
      _this.updateReadyState(snapshot);

      if (_this.listener) {
        _this.listener(_this.readyState);
      }
    };

    this.retry = function () {
      _this.dispose();
      _this.fetch();
    };

    this.environment = environment;
    this.operation = operation;
    this.cacheConfig = cacheConfig;

    this.fetchPromise = null;
    this.selectionReference = null;
    this.pendingRequest = null;
    this.rootSubscription = null;

    this.readyState = {
      error: null,
      props: null,
      retry: null
    };

    this.listener = null;

    this.relayContext = {
      environment: this.environment,
      variables: this.operation.variables
    };
  }

  QuerySubscription.prototype.fetch = function fetch() {
    var _this2 = this;

    if (!this.fetchPromise) {
      this.fetchPromise = new _promise2.default(function (resolve) {
        var snapshot = void 0;

        _this2.selectionReference = _this2.retain();

        _this2.pendingRequest = _this2.environment.streamQuery({
          operation: _this2.operation,
          cacheConfig: _this2.cacheConfig,

          onNext: function onNext() {
            if (snapshot) {
              return;
            }

            snapshot = _this2.environment.lookup(_this2.operation.fragment);
            _this2.updateReadyState(snapshot);
            _this2.rootSubscription = _this2.environment.subscribe(snapshot, _this2.onChange);

            resolve();
          },

          onCompleted: function onCompleted() {
            _this2.pendingRequest = null;
          },

          onError: function onError(error) {
            _this2.readyState = {
              error: error,
              props: null,
              retry: _this2.retry
            };
            _this2.pendingRequest = null;

            resolve();
          }
        });
      });
    }

    return this.fetchPromise;
  };

  QuerySubscription.prototype.updateReadyState = function updateReadyState(snapshot) {
    this.readyState = {
      error: null,
      props: snapshot.data,
      retry: this.retry
    };
  };

  QuerySubscription.prototype.subscribe = function subscribe(listener) {
    !!this.listener ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'QuerySubscription already has a listener.') : (0, _invariant2.default)(false) : void 0;

    this.listener = listener;
  };

  QuerySubscription.prototype.retain = function retain() {
    return this.environment.retain(this.operation.root);
  };

  QuerySubscription.prototype.dispose = function dispose() {
    if (this.selectionReference) {
      this.selectionReference.dispose();
    }

    if (this.pendingRequest) {
      this.pendingRequest.dispose();
    }

    if (this.rootSubscription) {
      this.rootSubscription.dispose();
    }
  };

  return QuerySubscription;
}();

exports.default = QuerySubscription;
module.exports = exports['default'];