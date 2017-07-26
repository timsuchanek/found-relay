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

var _elementType = require('prop-types-extra/lib/elementType');

var _elementType2 = _interopRequireDefault(_elementType);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RelayPropTypes = require('react-relay/lib/RelayPropTypes');

var _RelayPropTypes2 = _interopRequireDefault(_RelayPropTypes);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _QuerySubscription = require('./QuerySubscription');

var _QuerySubscription2 = _interopRequireDefault(_QuerySubscription);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  match: _propTypes2.default.shape({
    route: _propTypes2.default.shape({
      render: _propTypes2.default.func
    }).isRequired
  }).isRequired,
  Component: _elementType2.default,
  hasComponent: _propTypes2.default.bool.isRequired,
  querySubscription: _propTypes2.default.instanceOf(_QuerySubscription2.default).isRequired
};

var childContextTypes = {
  relay: function() {return null}
};

var SnapshotRenderer = function (_React$Component) {
  (0, _inherits3.default)(SnapshotRenderer, _React$Component);

  function SnapshotRenderer(props, context) {
    (0, _classCallCheck3.default)(this, SnapshotRenderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props, context));

    _this.onUpdate = function (readyState) {
      _this.setState({ readyState: readyState });
    };

    var querySubscription = props.querySubscription;


    _this.state = {
      readyState: querySubscription.readyState
    };

    _this.selectionReference = querySubscription.retain();
    return _this;
  }

  SnapshotRenderer.prototype.getChildContext = function getChildContext() {
    return {
      relay: this.props.querySubscription.relayContext
    };
  };

  SnapshotRenderer.prototype.componentDidMount = function componentDidMount() {
    this.subscribe(this.props.querySubscription);
  };

  SnapshotRenderer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var querySubscription = nextProps.querySubscription;
    var readyState = querySubscription.readyState;


    if (querySubscription !== this.props.querySubscription) {
      this.onUpdate(readyState);

      this.selectionReference.dispose();
      this.selectionReference = querySubscription.retain();

      this.subscribe(querySubscription);
    } else if (readyState !== this.state.readyState) {
      this.onUpdate(readyState);
    }
  };

  SnapshotRenderer.prototype.componentWillUnmount = function componentWillUnmount() {
    this.selectionReference.dispose();
  };

  SnapshotRenderer.prototype.subscribe = function subscribe(querySubscription) {
    querySubscription.subscribe(this.onUpdate);
  };

  SnapshotRenderer.prototype.render = function render() {
    var _props = this.props,
        match = _props.match,
        Component = _props.Component,
        hasComponent = _props.hasComponent,
        ownProps = (0, _objectWithoutProperties3.default)(_props, ['match', 'Component', 'hasComponent']);

    delete ownProps.querySubscription;

    var route = match.route;
    var readyState = this.state.readyState;
    var props = readyState.props;


    if (!route.render) {
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(hasComponent, 'Route with query %s has no render method or component.', route.query().name) : void 0;

      if (!Component || !props) {
        return null;
      }

      return _react2.default.createElement(Component, (0, _extends3.default)({}, match, ownProps, props));
    }

    return route.render((0, _extends3.default)({}, readyState, {
      match: match,
      Component: Component,
      props: props && (0, _extends3.default)({}, match, ownProps, props),
      ownProps: ownProps
    }));
  };

  return SnapshotRenderer;
}(_react2.default.Component);

SnapshotRenderer.propTypes = propTypes;
SnapshotRenderer.childContextTypes = childContextTypes;

exports.default = SnapshotRenderer;
module.exports = exports['default'];
