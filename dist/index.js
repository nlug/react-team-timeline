'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TimeLine = function (_React$Component) {
  (0, _inherits3.default)(TimeLine, _React$Component);

  function TimeLine() {
    (0, _classCallCheck3.default)(this, TimeLine);
    return (0, _possibleConstructorReturn3.default)(this, (TimeLine.__proto__ || (0, _getPrototypeOf2.default)(TimeLine)).apply(this, arguments));
  }

  (0, _createClass3.default)(TimeLine, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          title = _props.title,
          groups = _props.groups,
          items = _props.items,
          fromTime = _props.fromTime,
          toTime = _props.toTime,
          displayFrom = _props.displayFrom,
          timeStep = _props.timeStep,
          timeColFormat = _props.timeColFormat,
          onClickItem = _props.onClickItem;

      var itemFiltered = items.filter(function (item) {
        return item.endTime > fromTime && item.startTime < toTime;
      }).map(function (item) {
        var newItem = (0, _extends3.default)({}, item);
        if (newItem.startTime < fromTime) {
          newItem.startTime = (0, _moment2.default)(fromTime);
        }
        if (newItem.endTime > toTime) {
          newItem.endTime = (0, _moment2.default)(toTime);
        }
        return newItem;
      });
      var timelineContentProps = {
        title: title,
        groups: groups,
        items: itemFiltered,
        fromTime: fromTime,
        toTime: toTime,
        displayFrom: displayFrom,
        timeStep: timeStep,
        timeColFormat: timeColFormat,
        onClickItem: onClickItem
      };
      return _react2.default.createElement(
        'div',
        { className: 'timeline' },
        _react2.default.createElement(SideBar, { groups: groups }),
        _react2.default.createElement(TimelineContent, timelineContentProps)
      );
    }
  }]);
  return TimeLine;
}(_react2.default.Component);

var GroupItem = function GroupItem(_ref) {
  var title = _ref.title;
  return _react2.default.createElement(
    'div',
    { className: 'group-item' },
    title
  );
};

var SideBar = function (_React$Component2) {
  (0, _inherits3.default)(SideBar, _React$Component2);

  function SideBar() {
    (0, _classCallCheck3.default)(this, SideBar);
    return (0, _possibleConstructorReturn3.default)(this, (SideBar.__proto__ || (0, _getPrototypeOf2.default)(SideBar)).apply(this, arguments));
  }

  (0, _createClass3.default)(SideBar, [{
    key: 'render',
    value: function render() {
      var groups = this.props.groups;

      return _react2.default.createElement(
        'div',
        { className: 'side-bar' },
        _react2.default.createElement(
          'div',
          { className: 'sidebar-title' },
          'Sidebar Title'
        ),
        _react2.default.createElement(
          'div',
          { className: 'group-colunm' },
          groups.map(function (aGroup) {
            return _react2.default.createElement(GroupItem, (0, _extends3.default)({ key: aGroup.id }, aGroup));
          })
        )
      );
    }
  }]);
  return SideBar;
}(_react2.default.Component);

var TimelineContent = function (_React$Component3) {
  (0, _inherits3.default)(TimelineContent, _React$Component3);

  function TimelineContent(props) {
    (0, _classCallCheck3.default)(this, TimelineContent);
    return (0, _possibleConstructorReturn3.default)(this, (TimelineContent.__proto__ || (0, _getPrototypeOf2.default)(TimelineContent)).call(this, props));
  }

  (0, _createClass3.default)(TimelineContent, [{
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          groups = _props2.groups,
          items = _props2.items,
          title = _props2.title,
          timeColFormat = _props2.timeColFormat,
          timeStep = _props2.timeStep,
          onClickItem = _props2.onClickItem;

      var fromTime = Math.round(this.props.fromTime.unix() / 60);
      var toTime = Math.round(this.props.toTime.unix() / 60);
      var timeSpend = toTime - fromTime;
      var totalColunm = Math.round(timeSpend / timeStep);

      // Create col title
      var columns = [(0, _moment2.default)(new Date(fromTime * 60 * 1000))];
      for (var i = 1; i < totalColunm; i++) {
        var nextSlot = (0, _moment2.default)(columns[i - 1]).add(timeStep, 'm');
        columns.push(nextSlot);
      }

      var childProps = {
        fromTime: fromTime,
        toTime: toTime,
        timeSpend: timeSpend,
        totalColunm: totalColunm,
        timeStep: timeStep,
        onClickItem: onClickItem
      };
      return _react2.default.createElement(
        'div',
        { className: 'timeline-content' },
        _react2.default.createElement(Header, { title: title }),
        _react2.default.createElement(
          'div',
          { className: 'timeline-window' },
          _react2.default.createElement(
            'div',
            { className: 'scrollable' },
            _react2.default.createElement(
              'div',
              { className: 'coltitle-wrapper' },
              columns.map(function (aCol, idx) {
                return _react2.default.createElement(ColTitle, { key: idx, time: aCol, format: timeColFormat });
              })
            ),
            _react2.default.createElement(Timer, { fromTime: this.props.fromTime, timeSpend: timeSpend }),
            groups.map(function (aGroup) {
              return _react2.default.createElement(ItemsGroup, (0, _extends3.default)({ key: aGroup.id, items: items.filter(function (item) {
                  return item.groupId === aGroup.id;
                }) }, childProps));
            })
          )
        )
      );
    }
  }]);
  return TimelineContent;
}(_react2.default.Component);

var Header = function (_React$Component4) {
  (0, _inherits3.default)(Header, _React$Component4);

  function Header(props) {
    (0, _classCallCheck3.default)(this, Header);
    return (0, _possibleConstructorReturn3.default)(this, (Header.__proto__ || (0, _getPrototypeOf2.default)(Header)).call(this, props));
  }

  (0, _createClass3.default)(Header, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'timeline-header' },
        _react2.default.createElement(
          'div',
          { className: 'timeline-title' },
          this.props.title
        )
      );
    }
  }]);
  return Header;
}(_react2.default.Component);

var Timer = function (_React$Component5) {
  (0, _inherits3.default)(Timer, _React$Component5);

  function Timer(props) {
    (0, _classCallCheck3.default)(this, Timer);

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (Timer.__proto__ || (0, _getPrototypeOf2.default)(Timer)).call(this, props));

    _this5.state = {
      leftPosition: 0
    };
    return _this5;
  }

  (0, _createClass3.default)(Timer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this6 = this;

      this.ticker = setInterval(function () {
        _this6.setState({
          leftPosition: ((0, _moment2.default)().valueOf() - _this6.props.fromTime.valueOf()) / (_this6.props.timeSpend * 60 * 1000)
        });
      }, 1000);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearInterval(this.ticker);
    }
  }, {
    key: 'render',
    value: function render() {
      var leftPosition = this.state.leftPosition;

      var display = 'block';
      if (leftPosition > 1 || leftPosition < 0) {
        // clearInterval(this.ticker);
        display = 'none';
      }
      var timerStyle = {
        display: display,
        left: leftPosition * 100 + '%'
      };
      return _react2.default.createElement('div', { className: 'ticker', style: timerStyle });
    }
  }]);
  return Timer;
}(_react2.default.Component);

var ColTitle = function (_React$Component6) {
  (0, _inherits3.default)(ColTitle, _React$Component6);

  function ColTitle() {
    (0, _classCallCheck3.default)(this, ColTitle);
    return (0, _possibleConstructorReturn3.default)(this, (ColTitle.__proto__ || (0, _getPrototypeOf2.default)(ColTitle)).apply(this, arguments));
  }

  (0, _createClass3.default)(ColTitle, [{
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          time = _props3.time,
          format = _props3.format;

      return _react2.default.createElement(
        'div',
        { className: 'col-title' },
        time.format(format)
      );
    }
  }]);
  return ColTitle;
}(_react2.default.Component);

var ItemsGroup = function (_React$Component7) {
  (0, _inherits3.default)(ItemsGroup, _React$Component7);

  function ItemsGroup() {
    (0, _classCallCheck3.default)(this, ItemsGroup);
    return (0, _possibleConstructorReturn3.default)(this, (ItemsGroup.__proto__ || (0, _getPrototypeOf2.default)(ItemsGroup)).apply(this, arguments));
  }

  (0, _createClass3.default)(ItemsGroup, [{
    key: 'render',
    value: function render() {
      console.log(this.props);
      var _props4 = this.props,
          totalColunm = _props4.totalColunm,
          items = _props4.items,
          timeSpend = _props4.timeSpend,
          fromTime = _props4.fromTime,
          onClickItem = _props4.onClickItem;

      var timeSlots = [];
      for (var i = 0; i < totalColunm; i++) {
        timeSlots.push(_react2.default.createElement(TimeSlot, { key: i }));
      }
      return _react2.default.createElement(
        'div',
        { className: 'items-group' },
        timeSlots.map(function (_) {
          return _;
        }),
        items.map(function (item) {
          return _react2.default.createElement(Item, { key: item.id, value: item, timeSpend: timeSpend, onClickItem: onClickItem, fromTime: fromTime });
        })
      );
    }
  }]);
  return ItemsGroup;
}(_react2.default.Component);

var TimeSlot = function (_React$Component8) {
  (0, _inherits3.default)(TimeSlot, _React$Component8);

  function TimeSlot() {
    (0, _classCallCheck3.default)(this, TimeSlot);
    return (0, _possibleConstructorReturn3.default)(this, (TimeSlot.__proto__ || (0, _getPrototypeOf2.default)(TimeSlot)).apply(this, arguments));
  }

  (0, _createClass3.default)(TimeSlot, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { className: 'time-slot' });
    }
  }]);
  return TimeSlot;
}(_react2.default.Component);

// Todo: Check endTime > startTime


var Item = function (_React$Component9) {
  (0, _inherits3.default)(Item, _React$Component9);

  function Item(props) {
    (0, _classCallCheck3.default)(this, Item);
    return (0, _possibleConstructorReturn3.default)(this, (Item.__proto__ || (0, _getPrototypeOf2.default)(Item)).call(this, props));
  }

  (0, _createClass3.default)(Item, [{
    key: 'render',
    value: function render() {
      var _props5 = this.props,
          onClickItem = _props5.onClickItem,
          fromTime = _props5.fromTime,
          timeSpend = _props5.timeSpend;
      var _props$value = this.props.value,
          id = _props$value.id,
          title = _props$value.title,
          startTime = _props$value.startTime,
          endTime = _props$value.endTime;

      var startTimeInMin = Math.round(startTime.unix() / 60);
      var endTimeInMin = Math.round(endTime.unix() / 60);
      var itemSpend = endTimeInMin - startTimeInMin;
      var leftPosition = (startTimeInMin - fromTime) / timeSpend * 100;
      var itemWidth = itemSpend / timeSpend * 100;
      this.style = {
        width: itemWidth + '%',
        left: leftPosition + '%'
      };
      return _react2.default.createElement(
        'div',
        { className: 'timeline-item', onClick: function onClick() {
            return onClickItem(id);
          }, style: this.style },
        title
      );
    }
  }]);
  return Item;
}(_react2.default.Component);

// STANDART UNIT IS __MINUTE__


TimeLine.propTypes = {
  title: _react2.default.PropTypes.string,
  fromTime: _react2.default.PropTypes.object.isRequired, // Moment Object
  toTime: _react2.default.PropTypes.object.isRequired, // Moment Object
  displayFrom: _react2.default.PropTypes.object, // Moment Object Todo: https://stackoverflow.com/questions/635706/how-to-scroll-to-an-element-inside-a-div
  timeStep: _react2.default.PropTypes.number, // in Minutes
  groups: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.object),
  items: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.object),
  timeColFormat: _react2.default.PropTypes.string,
  onClickItem: _react2.default.PropTypes.func
};

TimeLine.defaultProps = {
  timeColFormat: 'HH:mm'
};

exports.default = TimeLine;