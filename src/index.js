import React from 'react';
import moment from 'moment';
// import './style.scss';
// const buttonStyles = {
//   border: '1px solid #eee',
//   borderRadius: 3,
//   backgroundColor: '#FFFFFF',
//   cursor: 'pointer',
//   fontSize: 15,
//   padding: '3px 10px',
// };
const titleHeight = 30;
const lineHeight = 40;
const timeHeight = 30;

const timelineStyle = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
};
class TimeLine extends React.Component {
  render() {
    const { title, groups, items, fromTime, toTime, displayFrom, timeStep } = this.props;
    const timelineContentProps = {
      title,
      groups,
      items,
      fromTime,
      toTime,
      displayFrom,
      timeStep,
    };
    return (
      <div className="timeline" style={timelineStyle}>
        <SideBar groups={groups} />
        <TimelineContent {...timelineContentProps} />
      </div>
    );
  }
}
const sidebarStyle = {
  width: '10%',
  display: 'flex',
  flexDirection: 'column',
};
const sidebarTitleStyle = {
  height: titleHeight + timeHeight,
};
const groupItemstyle = {
  height: lineHeight,
};
const GroupItem = ({ title }) => (<div className="group-item" style={groupItemstyle}>{title}</div>);
class SideBar extends React.Component {
  render() {
    const { groups } = this.props;
    return (
      <div className="side-bar" style={sidebarStyle}>
        <div className="sidebar-title" style={sidebarTitleStyle}>Sidebar Title</div>
        <div className="group-colunm">
          {
            groups.map(aGroup => <GroupItem key={aGroup.id} {...aGroup} />)
          }
        </div>
      </div>
    );
  }
}
const timelineContentStyle = {
  width: '90%',
};
const coltitleWrapperStyle = {
  display: 'flex',
  height: timeHeight,
};
const timelineWindowStyle = {
  width: '100%',
  overflowX: 'auto',
};
const scrollableStyle = {
  position: 'relative',
  width: 3000,
};
class TimelineContent extends React.Component {
  constructor(props) {
    super(props);
    const { timeStep } = props;
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
    };
  }
  render() {
    const { groups, items, title } = this.props;
    return (
      <div className="timeline-content" style={timelineContentStyle}>
        <Header title={title} />
        <div className="timeline-window" style={timelineWindowStyle}>
          <div className="scrollable" style={scrollableStyle}>
            <div className="coltitle-wrapper" style={coltitleWrapperStyle}>
              {
                this.columns.map((aCol, idx) => <ColTitle key={idx} time={aCol} width={this.state.width} />)
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
const timelineHeaderStyle = {
  height: titleHeight,
}
class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="timeline-header" style={timelineHeaderStyle}>
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
      console.log('ticked', (moment().valueOf() - this.fromTime) / this.timeSpend);
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
      height: 70,
      border: '1px solid red',
      borderWidth: '0px 0px 0px 1px',
      position: 'absolute',
      left: `${leftPosition * 100}%`,
    };
    return (
      <div style={timerStyle}></div>
    );
  }
}
class ColTitle extends React.Component {
  render() {
    const { time, width } = this.props;
    const style = {
      width: `${width}%`,
    };
    return (
      <div className="col-title" style={style}>
        {time.format('HH:mm')}
      </div>
    );
  }
}
const itemsGroupStyle = {
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  height: lineHeight,
};
class ItemsGroup extends React.Component {
  render() {
    console.log(this.props);
    const { totalColunm, width, items, timeSpend, fromTime } = this.props;
    const timeSlots = []
    for (var i = 0; i < totalColunm; i++) {
      timeSlots.push(<TimeSlot key={i} width={width} />);
    }
    return (
      <div className="items-group" style={itemsGroupStyle}>
      {
        timeSlots.map(_ => _)
      }
      {
        items.map(item => <Item key={item.id} value={item} timeSpend={timeSpend} fromTime={fromTime} />)
      }
      </div>
    )
  }
}

class TimeSlot extends React.Component {
  render() {
    const { width } = this.props
    const style = {
      width: `${width}%`,
      height: lineHeight,
    };
    return (
      <div className="time-slot" style={style}></div>
    )
  }
}

// Todo: Check endTime > startTime
class Item extends React.Component {
  render() {
    const { fromTime, timeSpend } = this.props;
    const { title, startTime, endTime } = this.props.value;
    const startTimeInMin = Math.round(startTime.unix() / 60);
    const endTimeInMin = Math.round(endTime.unix() / 60);
    const itemSpend = endTimeInMin - startTimeInMin;
    const leftPosition = ((startTimeInMin - fromTime) / timeSpend) * 100;
    const itemWidth = (itemSpend / timeSpend) * 100;
    console.log(fromTime);
    const style = {
      width: `${itemWidth}%`,
      position: 'absolute',
      left: `${leftPosition}%`,
      display: 'inline-block',
      overflow: 'hidden',
      height: lineHeight - 7,
    };
    return (
      <div className="timeline-item" style={style}>
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
  displayFrom: React.PropTypes.object, // Moment Object
  maxSizeView: React.PropTypes.number, // in Minutes
  timeStep: React.PropTypes.number, // in Minutes
  groups: React.PropTypes.arrayOf(React.PropTypes.object),
  items: React.PropTypes.arrayOf(React.PropTypes.object),
};

export default TimeLine;
