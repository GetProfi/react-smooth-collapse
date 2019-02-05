'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _kefir = require('kefir');

var _kefir2 = _interopRequireDefault(_kefir);

var _kefirBus = require('kefir-bus');

var _kefirBus2 = _interopRequireDefault(_kefirBus);

var _getTransitionTimeMs = require('./getTransitionTimeMs');

var _getTransitionTimeMs2 = _interopRequireDefault(_getTransitionTimeMs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SmoothCollapse = function (_React$Component) {
  (0, _inherits3.default)(SmoothCollapse, _React$Component);

  function SmoothCollapse(props) {
    (0, _classCallCheck3.default)(this, SmoothCollapse);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SmoothCollapse.__proto__ || (0, _getPrototypeOf2.default)(SmoothCollapse)).call(this, props));

    _this._resetter = (0, _kefirBus2.default)();

    _this.state = {
      hasBeenVisibleBefore: props.expanded || _this._visibleWhenClosed(),
      fullyClosed: !props.expanded,
      height: props.expanded ? 'auto' : props.collapsedHeight,
      overflow: ''
    };
    return _this;
  }

  (0, _createClass3.default)(SmoothCollapse, [{
    key: '_visibleWhenClosed',
    value: function _visibleWhenClosed(props) {
      if (!props) props = this.props;
      return parseFloat(props.collapsedHeight) !== 0;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._resetter.emit(null);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (!this.props.expanded && nextProps.expanded) {
        this._resetter.emit(null);

        // In order to expand, we need to know the height of the children, so we
        // need to setState first so they get rendered before we continue.

        this.setState({
          fullyClosed: false,
          hasBeenVisibleBefore: true
        }, function () {
          // Set the collapser to the target height instead of auto so that it
          // animates correctly. Then switch it to 'auto' after the animation so
          // that it flows correctly if the page is resized.
          var targetHeight = _this2.refs.inner.clientHeight + 'px';
          _this2.setState({
            height: targetHeight,
            overflow: 'hidden'
          });

          // Wait until the transitionend event, or until a timer goes off in
          // case the event doesn't fire because the browser doesn't support it
          // or the element is hidden before it happens. The timer is a little
          // longer than the transition is supposed to take to make sure we don't
          // cut the animation early while it's still going if the browser is
          // running it just a little slow.
          _kefir2.default.fromEvents(_this2.refs.main, 'transitionend').merge(_kefir2.default.later((0, _getTransitionTimeMs2.default)(nextProps.heightTransition) * 1.1 + 500)).takeUntilBy(_this2._resetter).take(1).onValue(function () {
            _this2.setState({
              height: 'auto',
              overflow: ''
            }, function () {
              if (_this2.props.onChangeEnd) {
                _this2.props.onChangeEnd();
              }
            });
          });
        });
      } else if (this.props.expanded && !nextProps.expanded) {
        this._resetter.emit(null);

        this.setState({
          height: this.refs.inner.clientHeight + 'px'
        }, function () {
          _this2.refs.main.clientHeight; // force the page layout
          _this2.setState({
            height: nextProps.collapsedHeight,
            overflow: 'hidden'
          });

          // See comment above about previous use of transitionend event.
          _kefir2.default.fromEvents(_this2.refs.main, 'transitionend').merge(_kefir2.default.later((0, _getTransitionTimeMs2.default)(nextProps.heightTransition) * 1.1 + 500)).takeUntilBy(_this2._resetter).take(1).onValue(function () {
            _this2.setState({
              fullyClosed: true,
              overflow: ''
            });
            if (_this2.props.onChangeEnd) {
              _this2.props.onChangeEnd();
            }
          });
        });
      } else if (!nextProps.expanded && this.props.collapsedHeight !== nextProps.collapsedHeight) {
        this.setState({
          hasBeenVisibleBefore: this.state.hasBeenVisibleBefore || this._visibleWhenClosed(nextProps),
          height: nextProps.collapsedHeight,
          overflow: 'hidden'
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var visibleWhenClosed = this._visibleWhenClosed();
      var _state = this.state,
        height = _state.height,
        fullyClosed = _state.fullyClosed,
        hasBeenVisibleBefore = _state.hasBeenVisibleBefore,
        overflow = _state.overflow;

      var innerEl = hasBeenVisibleBefore ? _react2.default.createElement(
        'div',
        { ref: 'inner', style: { overflow: overflow } },
        this.props.children
      ) : null;

      return _react2.default.createElement(
        'div',
        {
          ref: 'main',
          style: {
            height: height,
            overflow: '',
            display: fullyClosed && !visibleWhenClosed ? 'none' : null,
            transition: 'height ' + this.props.heightTransition
          }
        },
        innerEl
      );
    }
  }]);
  return SmoothCollapse;
}(_react2.default.Component);

SmoothCollapse.propTypes = {
  expanded: _propTypes2.default.bool.isRequired,
  onChangeEnd: _propTypes2.default.func,
  collapsedHeight: _propTypes2.default.string,
  heightTransition: _propTypes2.default.string
};
SmoothCollapse.defaultProps = {
  collapsedHeight: '0',
  heightTransition: '.25s ease'
};
exports.default = SmoothCollapse;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJTbW9vdGhDb2xsYXBzZSIsInByb3BzIiwiX3Jlc2V0dGVyIiwic3RhdGUiLCJoYXNCZWVuVmlzaWJsZUJlZm9yZSIsImV4cGFuZGVkIiwiX3Zpc2libGVXaGVuQ2xvc2VkIiwiZnVsbHlDbG9zZWQiLCJoZWlnaHQiLCJjb2xsYXBzZWRIZWlnaHQiLCJvdmVyZmxvdyIsInBhcnNlRmxvYXQiLCJlbWl0IiwibmV4dFByb3BzIiwic2V0U3RhdGUiLCJ0YXJnZXRIZWlnaHQiLCJyZWZzIiwiaW5uZXIiLCJjbGllbnRIZWlnaHQiLCJmcm9tRXZlbnRzIiwibWFpbiIsIm1lcmdlIiwibGF0ZXIiLCJoZWlnaHRUcmFuc2l0aW9uIiwidGFrZVVudGlsQnkiLCJ0YWtlIiwib25WYWx1ZSIsIm9uQ2hhbmdlRW5kIiwidmlzaWJsZVdoZW5DbG9zZWQiLCJpbm5lckVsIiwiY2hpbGRyZW4iLCJkaXNwbGF5IiwidHJhbnNpdGlvbiIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsImJvb2wiLCJpc1JlcXVpcmVkIiwiZnVuYyIsInN0cmluZyIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7SUFrQnFCQSxjOzs7QUFlbkIsMEJBQVlDLEtBQVosRUFBMEI7QUFBQTs7QUFBQSxzSkFDbEJBLEtBRGtCOztBQUFBLFVBZDFCQyxTQWMwQixHQWRkLHlCQWNjOztBQUV4QixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsNEJBQXNCSCxNQUFNSSxRQUFOLElBQWtCLE1BQUtDLGtCQUFMLEVBRDdCO0FBRVhDLG1CQUFhLENBQUNOLE1BQU1JLFFBRlQ7QUFHWEcsY0FBUVAsTUFBTUksUUFBTixHQUFpQixNQUFqQixHQUEwQkosTUFBTVEsZUFIN0I7QUFJWEMsZ0JBQVU7QUFKQyxLQUFiO0FBRndCO0FBUXpCOzs7O3VDQUVr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QixDQUZ6QjtBQUdaTCxrQkFBUUssVUFBVUosZUFITjtBQUlaQyxvQkFBVTtBQUpFLFNBQWQ7QUFNRDtBQUNGOzs7NkJBRVE7QUFDUCxVQUFNa0Isb0JBQW9CLEtBQUt0QixrQkFBTCxFQUExQjtBQURPLG1CQUV1RCxLQUFLSCxLQUY1RDtBQUFBLFVBRUFLLE1BRkEsVUFFQUEsTUFGQTtBQUFBLFVBRVFELFdBRlIsVUFFUUEsV0FGUjtBQUFBLFVBRXFCSCxvQkFGckIsVUFFcUJBLG9CQUZyQjtBQUFBLFVBRTJDTSxRQUYzQyxVQUUyQ0EsUUFGM0M7O0FBR1AsVUFBTW1CLFVBQVV6Qix1QkFDZDtBQUFBO0FBQUEsVUFBSyxLQUFJLE9BQVQsRUFBaUIsT0FBTyxFQUFDTSxrQkFBRCxFQUF4QjtBQUNLLGFBQUtULEtBQU4sQ0FBaUI2QjtBQURyQixPQURjLEdBSVosSUFKSjs7QUFNQSxhQUNFO0FBQUE7QUFBQTtBQUNFLGVBQUksTUFETjtBQUVFLGlCQUFPO0FBQ0x0QiwwQkFESyxFQUNHRSxrQkFESDtBQUVMcUIscUJBQVV4QixlQUFlLENBQUNxQixpQkFBakIsR0FBc0MsTUFBdEMsR0FBOEMsSUFGbEQ7QUFHTEksb0NBQXNCLEtBQUsvQixLQUFMLENBQVdzQjtBQUg1QjtBQUZUO0FBUUdNO0FBUkgsT0FERjtBQVlEOzs7RUF0SXlDLGdCQUFNSSxTOztBQUE3QmpDLGMsQ0FJWmtDLFMsR0FBWTtBQUNqQjdCLFlBQVUsb0JBQVU4QixJQUFWLENBQWVDLFVBRFI7QUFFakJULGVBQWEsb0JBQVVVLElBRk47QUFHakI1QixtQkFBaUIsb0JBQVU2QixNQUhWO0FBSWpCZixvQkFBa0Isb0JBQVVlO0FBSlgsQztBQUpBdEMsYyxDQVVadUMsWSxHQUE2QjtBQUNsQzlCLG1CQUFpQixHQURpQjtBQUVsQ2Msb0JBQWtCO0FBRmdCLEM7a0JBVmpCdkIsYyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEtlZmlyIGZyb20gJ2tlZmlyJztcbmltcG9ydCBrZWZpckJ1cyBmcm9tICdrZWZpci1idXMnO1xuXG5pbXBvcnQgZ2V0VHJhbnNpdGlvblRpbWVNcyBmcm9tICcuL2dldFRyYW5zaXRpb25UaW1lTXMnO1xuXG5leHBvcnQgdHlwZSBQcm9wcyA9IHtcbiAgZXhwYW5kZWQ6IGJvb2xlYW47XG4gIG9uQ2hhbmdlRW5kPzogPygpID0+IHZvaWQ7XG4gIGNvbGxhcHNlZEhlaWdodDogc3RyaW5nO1xuICBoZWlnaHRUcmFuc2l0aW9uOiBzdHJpbmc7XG59O1xudHlwZSBTdGF0ZSA9IHtcbiAgaGFzQmVlblZpc2libGVCZWZvcmU6IGJvb2xlYW47XG4gIGZ1bGx5Q2xvc2VkOiBib29sZWFuO1xuICBoZWlnaHQ6IHN0cmluZztcbn07XG50eXBlIERlZmF1bHRQcm9wcyA9IHtcbiAgY29sbGFwc2VkSGVpZ2h0OiBzdHJpbmc7XG4gIGhlaWdodFRyYW5zaXRpb246IHN0cmluZztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNtb290aENvbGxhcHNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgX3Jlc2V0dGVyID0ga2VmaXJCdXMoKTtcbiAgcHJvcHM6IFByb3BzO1xuICBzdGF0ZTogU3RhdGU7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZXhwYW5kZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgb25DaGFuZ2VFbmQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIGNvbGxhcHNlZEhlaWdodDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBoZWlnaHRUcmFuc2l0aW9uOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHM6IERlZmF1bHRQcm9wcyA9IHtcbiAgICBjb2xsYXBzZWRIZWlnaHQ6ICcwJyxcbiAgICBoZWlnaHRUcmFuc2l0aW9uOiAnLjI1cyBlYXNlJ1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaGFzQmVlblZpc2libGVCZWZvcmU6IHByb3BzLmV4cGFuZGVkIHx8IHRoaXMuX3Zpc2libGVXaGVuQ2xvc2VkKCksXG4gICAgICBmdWxseUNsb3NlZDogIXByb3BzLmV4cGFuZGVkLFxuICAgICAgaGVpZ2h0OiBwcm9wcy5leHBhbmRlZCA/ICdhdXRvJyA6IHByb3BzLmNvbGxhcHNlZEhlaWdodCxcbiAgICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICAgIH07XG4gIH1cblxuICBfdmlzaWJsZVdoZW5DbG9zZWQocHJvcHM6ID9Qcm9wcykge1xuICAgIGlmICghcHJvcHMpIHByb3BzID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gcGFyc2VGbG9hdChwcm9wcy5jb2xsYXBzZWRIZWlnaHQpICE9PSAwO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5fcmVzZXR0ZXIuZW1pdChudWxsKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBQcm9wcykge1xuICAgIGlmICghdGhpcy5wcm9wcy5leHBhbmRlZCAmJiBuZXh0UHJvcHMuZXhwYW5kZWQpIHtcbiAgICAgIHRoaXMuX3Jlc2V0dGVyLmVtaXQobnVsbCk7XG5cbiAgICAgIC8vIEluIG9yZGVyIHRvIGV4cGFuZCwgd2UgbmVlZCB0byBrbm93IHRoZSBoZWlnaHQgb2YgdGhlIGNoaWxkcmVuLCBzbyB3ZVxuICAgICAgLy8gbmVlZCB0byBzZXRTdGF0ZSBmaXJzdCBzbyB0aGV5IGdldCByZW5kZXJlZCBiZWZvcmUgd2UgY29udGludWUuXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmdWxseUNsb3NlZDogZmFsc2UsXG4gICAgICAgIGhhc0JlZW5WaXNpYmxlQmVmb3JlOiB0cnVlXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIC8vIFNldCB0aGUgY29sbGFwc2VyIHRvIHRoZSB0YXJnZXQgaGVpZ2h0IGluc3RlYWQgb2YgYXV0byBzbyB0aGF0IGl0XG4gICAgICAgIC8vIGFuaW1hdGVzIGNvcnJlY3RseS4gVGhlbiBzd2l0Y2ggaXQgdG8gJ2F1dG8nIGFmdGVyIHRoZSBhbmltYXRpb24gc29cbiAgICAgICAgLy8gdGhhdCBpdCBmbG93cyBjb3JyZWN0bHkgaWYgdGhlIHBhZ2UgaXMgcmVzaXplZC5cbiAgICAgICAgY29uc3QgdGFyZ2V0SGVpZ2h0ID0gYCR7dGhpcy5yZWZzLmlubmVyLmNsaWVudEhlaWdodH1weGA7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGhlaWdodDogdGFyZ2V0SGVpZ2h0LFxuICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXYWl0IHVudGlsIHRoZSB0cmFuc2l0aW9uZW5kIGV2ZW50LCBvciB1bnRpbCBhIHRpbWVyIGdvZXMgb2ZmIGluXG4gICAgICAgIC8vIGNhc2UgdGhlIGV2ZW50IGRvZXNuJ3QgZmlyZSBiZWNhdXNlIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBpdFxuICAgICAgICAvLyBvciB0aGUgZWxlbWVudCBpcyBoaWRkZW4gYmVmb3JlIGl0IGhhcHBlbnMuIFRoZSB0aW1lciBpcyBhIGxpdHRsZVxuICAgICAgICAvLyBsb25nZXIgdGhhbiB0aGUgdHJhbnNpdGlvbiBpcyBzdXBwb3NlZCB0byB0YWtlIHRvIG1ha2Ugc3VyZSB3ZSBkb24ndFxuICAgICAgICAvLyBjdXQgdGhlIGFuaW1hdGlvbiBlYXJseSB3aGlsZSBpdCdzIHN0aWxsIGdvaW5nIGlmIHRoZSBicm93c2VyIGlzXG4gICAgICAgIC8vIHJ1bm5pbmcgaXQganVzdCBhIGxpdHRsZSBzbG93LlxuICAgICAgICBLZWZpci5mcm9tRXZlbnRzKHRoaXMucmVmcy5tYWluLCAndHJhbnNpdGlvbmVuZCcpXG4gICAgICAgICAgLm1lcmdlKEtlZmlyLmxhdGVyKGdldFRyYW5zaXRpb25UaW1lTXMobmV4dFByb3BzLmhlaWdodFRyYW5zaXRpb24pKjEuMSArIDUwMCkpXG4gICAgICAgICAgLnRha2VVbnRpbEJ5KHRoaXMuX3Jlc2V0dGVyKVxuICAgICAgICAgIC50YWtlKDEpXG4gICAgICAgICAgLm9uVmFsdWUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIGhlaWdodDogJ2F1dG8nLFxuICAgICAgICAgICAgICBvdmVyZmxvdzogJycsXG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlRW5kKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZUVuZCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmV4cGFuZGVkICYmICFuZXh0UHJvcHMuZXhwYW5kZWQpIHtcbiAgICAgIHRoaXMuX3Jlc2V0dGVyLmVtaXQobnVsbCk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBoZWlnaHQ6IGAke3RoaXMucmVmcy5pbm5lci5jbGllbnRIZWlnaHR9cHhgXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMucmVmcy5tYWluLmNsaWVudEhlaWdodDsgLy8gZm9yY2UgdGhlIHBhZ2UgbGF5b3V0XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGhlaWdodDogbmV4dFByb3BzLmNvbGxhcHNlZEhlaWdodCxcbiAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU2VlIGNvbW1lbnQgYWJvdmUgYWJvdXQgcHJldmlvdXMgdXNlIG9mIHRyYW5zaXRpb25lbmQgZXZlbnQuXG4gICAgICAgIEtlZmlyLmZyb21FdmVudHModGhpcy5yZWZzLm1haW4sICd0cmFuc2l0aW9uZW5kJylcbiAgICAgICAgICAubWVyZ2UoS2VmaXIubGF0ZXIoZ2V0VHJhbnNpdGlvblRpbWVNcyhuZXh0UHJvcHMuaGVpZ2h0VHJhbnNpdGlvbikqMS4xICsgNTAwKSlcbiAgICAgICAgICAudGFrZVVudGlsQnkodGhpcy5fcmVzZXR0ZXIpXG4gICAgICAgICAgLnRha2UoMSlcbiAgICAgICAgICAub25WYWx1ZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgZnVsbHlDbG9zZWQ6IHRydWUsXG4gICAgICAgICAgICAgIG92ZXJmbG93OiAnJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZUVuZCkge1xuICAgICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlRW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKCFuZXh0UHJvcHMuZXhwYW5kZWQgJiYgdGhpcy5wcm9wcy5jb2xsYXBzZWRIZWlnaHQgIT09IG5leHRQcm9wcy5jb2xsYXBzZWRIZWlnaHQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBoYXNCZWVuVmlzaWJsZUJlZm9yZTpcbiAgICAgICAgICB0aGlzLnN0YXRlLmhhc0JlZW5WaXNpYmxlQmVmb3JlIHx8IHRoaXMuX3Zpc2libGVXaGVuQ2xvc2VkKG5leHRQcm9wcyksXG4gICAgICAgIGhlaWdodDogbmV4dFByb3BzLmNvbGxhcHNlZEhlaWdodCxcbiAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgdmlzaWJsZVdoZW5DbG9zZWQgPSB0aGlzLl92aXNpYmxlV2hlbkNsb3NlZCgpO1xuICAgIGNvbnN0IHtoZWlnaHQsIGZ1bGx5Q2xvc2VkLCBoYXNCZWVuVmlzaWJsZUJlZm9yZSwgb3ZlcmZsb3d9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBpbm5lckVsID0gaGFzQmVlblZpc2libGVCZWZvcmUgP1xuICAgICAgPGRpdiByZWY9XCJpbm5lclwiIHN0eWxlPXt7b3ZlcmZsb3d9fT5cbiAgICAgICAgeyAodGhpcy5wcm9wczphbnkpLmNoaWxkcmVuIH1cbiAgICAgIDwvZGl2PlxuICAgICAgOiBudWxsO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPVwibWFpblwiXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0LCBvdmVyZmxvdyxcbiAgICAgICAgICBkaXNwbGF5OiAoZnVsbHlDbG9zZWQgJiYgIXZpc2libGVXaGVuQ2xvc2VkKSA/ICdub25lJzogbnVsbCxcbiAgICAgICAgICB0cmFuc2l0aW9uOiBgaGVpZ2h0ICR7dGhpcy5wcm9wcy5oZWlnaHRUcmFuc2l0aW9ufWBcbiAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICB7aW5uZXJFbH1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==