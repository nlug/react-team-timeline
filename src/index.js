import React from 'react';
import moment from 'moment';
import './style.css';

class TimeLine extends React.Component {
  render() {
    const { title, groups, items, fromTime, toTime, displayFrom, timeStep, blockWidth, timeColFormat, onClickItem } = this.props;
    const itemFiltered = items
      .filter(item => item.endTime > fromTime && item.startTime < toTime)
      .map(item => {
        const newItem = { ...item };
        if (newItem.startTime < fromTime) {
          newItem.startTime = moment(fromTime);
        }
        if (newItem.endTime > toTime) {
          newItem.endTime = moment(toTime);
        }
        return newItem;
      });
    const timelineContentProps = {
      title,
      groups,
      items: itemFiltered,
      fromTime,
      toTime,
      displayFrom,
      timeStep,
      blockWidth,
      timeColFormat,
      onClickItem,
    };
    return (
      <div className="timeline">
        <SideBar groups={groups} />
        <TimelineContent {...timelineContentProps} />
      </div>
    );
  }
}

const GroupItem = ({ title }) => (<div className="group-item">{title}</div>);
class SideBar extends React.Component {
  render() {
    const { groups } = this.props;
    return (
      <div className="side-bar">
        <div className="sidebar-title">Sidebar Title</div>
        <div className="group-colunm">
          {
            groups.map(aGroup => <GroupItem key={aGroup.id} {...aGroup} />)
          }
        </div>
      </div>
    );
  }
}

const scrollableStyle = {
  position: 'relative',
};
class TimelineContent extends React.Component {
  constructor(props) {
    super(props);
    const { timeStep, blockWidth, onClickItem } = props;
    const fromTime = Math.round(props.fromTime.unix() / 60);
    const toTime = Math.round(props.toTime.unix() / 60);
    const timeSpend = toTime - fromTime;
    const totalColunm = Math.round(timeSpend / timeStep);

    // Create col title
    this.columns = [moment(new Date(fromTime * 60 * 1000))];
    for (let i = 1; i < totalColunm; i++) {
      const nextSlot = moment(this.columns[i - 1]).add(timeStep, 'm');
      this.columns.push(nextSlot);
    }

    this.state = {
      fromTime,
      toTime,
      timeSpend,
      totalColunm,
      timeStep,
      width: (1 / totalColunm) * 100,
      blockWidth,
      onClickItem,
    };
  }
  render() {
    const { groups, items, title, blockWidth, timeColFormat } = this.props;
    return (
      <div className="timeline-content">
        <Header title={title} />
        <div className="timeline-window">
          <div className="scrollable" style={scrollableStyle}>
            <div className="coltitle-wrapper">
              {
                this.columns.map((aCol, idx) => <ColTitle key={idx} time={aCol} width={blockWidth} format={timeColFormat} />)
              }
            </div>
            <Timer fromTime={this.props.fromTime} timeSpend={this.state.timeSpend} />
            {
              groups.map(aGroup => <ItemsGroup key={aGroup.id} items={items.filter(item => item.groupId === aGroup.id)} {...this.state} />)
            }
          </div>
        </div>
      </div>
    )
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="timeline-header">
        <div className="timeline-title">
          {this.props.title}
        </div>
      </div>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.timeSpend = props.timeSpend * 60 * 1000;
    this.fromTime = props.fromTime.valueOf(); // In mili seconds
    const now = moment().valueOf();
    this.state = {
      leftPosition: (now - this.fromTime) / this.timeSpend,
    };
  }
  componentDidMount() {
    this.ticker = setInterval(() => {
      this.setState({
        leftPosition: (moment().valueOf() - this.fromTime) / this.timeSpend,
      });
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.ticker);
  }
  render() {
    const { leftPosition } = this.state;
    let width = 1;
    if (leftPosition > 1) {
      clearInterval(this.ticker);
      width = 0;
    }
    const timerStyle = {
      width,
      left: `${leftPosition * 100}%`,
    };
    return (
      <div className="ticker" style={timerStyle}></div>
    );
  }
}
class ColTitle extends React.Component {
  render() {
    const { time, format } = this.props;
    return (
      <div className="col-title">
        {time.format(format)}
      </div>
    );
  }
}

class ItemsGroup extends React.Component {
  render() {
    console.log(this.props);
    const { totalColunm, blockWidth, items, timeSpend, fromTime, onClickItem } = this.props;
    const timeSlots = []
    for (var i = 0; i < totalColunm; i++) {
      timeSlots.push(<TimeSlot key={i} width={blockWidth} />);
    }
    return (
      <div className="items-group">
      {
        timeSlots.map(_ => _)
      }
      {
        items.map(item => <Item key={item.id} value={item} timeSpend={timeSpend} onClickItem={onClickItem} fromTime={fromTime} />)
      }
      </div>
    )
  }
}

class TimeSlot extends React.Component {
  render() {
    return <div className="time-slot" />;
  }
}

// Todo: Check endTime > startTime
class Item extends React.Component {
  constructor(props) {
    super(props);
    const { fromTime, timeSpend } = this.props;
    const { startTime, endTime } = this.props.value;
    const startTimeInMin = Math.round(startTime.unix() / 60);
    const endTimeInMin = Math.round(endTime.unix() / 60);
    const itemSpend = endTimeInMin - startTimeInMin;
    const leftPosition = ((startTimeInMin - fromTime) / timeSpend) * 100;
    const itemWidth = (itemSpend / timeSpend) * 100;
    console.log(fromTime);
    this.style = {
      width: `${itemWidth}%`,
      left: `${leftPosition}%`,
    };
  }
  render() {
    const { onClickItem } = this.props;
    const { id, title } = this.props.value;
    return (
      <div className="timeline-item" onClick={() => onClickItem(id)} style={this.style}>
        {title}
      </div>
    )
  }
}

// STANDART UNIT IS __MINUTE__
TimeLine.propTypes = {
  title: React.PropTypes.string,
  fromTime: React.PropTypes.object.isRequired, // Moment Object
  toTime: React.PropTypes.object.isRequired, // Moment Object
  displayFrom: React.PropTypes.object, // Moment Object https://stackoverflow.com/questions/635706/how-to-scroll-to-an-element-inside-a-div
  blockWidth: React.PropTypes.number, // in Minutes
  timeStep: React.PropTypes.number, // in Minutes
  groups: React.PropTypes.arrayOf(React.PropTypes.object),
  items: React.PropTypes.arrayOf(React.PropTypes.object),
  timeColFormat: React.PropTypes.string,
  onClickItem: React.PropTypes.func,
};

TimeLine.defaultProps = {
  blockWidth: 70,
  timeColFormat: 'HH:mm',
};

export default TimeLine;
