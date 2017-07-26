'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classic = require('react-relay/classic');

var _classic2 = _interopRequireDefault(_classic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  match: _propTypes2.default.shape({
    route: _propTypes2.default.shape({
      render: _propTypes2.default.func
    }).isRequired
  }).isRequired,
  Component: _classic2.default.PropTypes.Container,
  environment: _classic2.default.PropTypes.Environment,
  queryConfig: _classic2.default.PropTypes.QueryConfig.isRequired,
  readyState: _propTypes2.default.object.isRequired,
  runQueries: _propTypes2.default.func
};

var RelayRouteRenderer = function (_React$Component) {
  (0, _inherits3.default)(RelayRouteRenderer, _React$Component);

  function RelayRouteRenderer(props, context) {
    (0, _classCallCheck3.default)(this, RelayRouteRenderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props, context));

    _this.retry = function () {
      if (_this.pendingRequest) {
        _this.pendingRequest.abort();
        _this.pendingRequest = null;
      }

      var runQueries = _this.props.runQueries;

      if (!runQueries) {
        return;
      }

      var request = runQueries(function (readyState) {
        if (_this.pendingRequest !== request) {
          return;
        }

        if (readyState.aborted || readyState.done || readyState.error) {
          _this.pendingRequest = null;
        }

        _this.setState({ readyState: readyState });
      });

      _this.pendingRequest = request;
    };

    _this.state = {
      readyState: props.readyState
    };

    // We don't need a separate lastRequest here like in Relay.Renderer because
    // actual updates will give us a new ready state anyway. The below code
    // maintains an invariant that there is only a pending request if
    // runQueries is defined.
    _this.pendingRequest = null;
    return _this;
  }

  RelayRouteRenderer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.runQueries !== this.props.runQueries) {
      if (this.pendingRequest) {
        this.pendingRequest.abort();
        this.pendingRequest = null;
      }
    }

    // It's impossible for readyState to change while a defined runQueries
    // stays the same, so the above check will ensure that any pending request
    // is appropriately aborted.
    if (nextProps.readyState !== this.state.readyState) {
      // Should be safe to do a synchronous state check here, since this isn't
      // in the context of a batched event handler.
      this.setState({ readyState: nextProps.readyState });
    }
  };

  RelayRouteRenderer.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.pendingRequest) {
      this.pendingRequest.abort();
    }
  };

  RelayRouteRenderer.prototype.render = function render() {
    // We need to explicitly pull out ownProps here to inject them into the
    // actual Relay container rather than the Relay.ReadyStateRenderer, when
    // we get cloned with props like children.
    var _props = this.props,
        match = _props.match,
        Component = _props.Component,
        environment = _props.environment,
        queryConfig = _props.queryConfig,
        ownProps = (0, _objectWithoutProperties3.default)(_props, ['match', 'Component', 'environment', 'queryConfig']);


    delete ownProps.readyState;
    delete ownProps.runQueries;

    var route = match.route;

    // The render function must be bound here to correctly trigger updates in
    // Relay.ReadyStateRenderer.

    function render(renderArgs) {
      var props = renderArgs.props;


      if (!route.render) {
        if (!props) {
          return undefined;
        }

        return _react2.default.createElement(Component, (0, _extends3.default)({}, match, ownProps, props));
      }

      return route.render((0, _extends3.default)({}, renderArgs, {
        match: match,
        Component: Component,
        props: props && (0, _extends3.default)({}, match, ownProps, props),
        ownProps: ownProps
      }));
    }

    return _react2.default.createElement(_classic2.default.ReadyStateRenderer, {
      Container: Component,
      environment: environment,
      queryConfig: queryConfig,
      readyState: this.state.readyState,
      render: render,
      retry: this.retry
    });
  };

  return RelayRouteRenderer;
}(_react2.default.Component);

RelayRouteRenderer.propTypes = propTypes;

exports.default = RelayRouteRenderer;
module.exports = exports['default'];