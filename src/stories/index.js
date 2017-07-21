import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import moment from 'moment';
import TimeLine from '../index';
import '../style.css';

storiesOf('TimeLine', module)
  .add('default view', () => {
    const groups = [
      { id: 1, title: 'Group 1' },
      { id: 2, title: 'Group 2' },
      { id: 3, title: 'Past group' },
    ];
    const items = [
      { id: 1, groupId: 1, title: 'I belong to Group 1', startTime: moment(), endTime: moment().add(2, 'h') },
      { id: 2, groupId: 2, title: 'And I belong to Group 2', startTime: moment().add(-10, 'm'), endTime: moment().add(20, 'm') },
      { id: 3, groupId: 3, title: 'Im from the past, and bring bug for you', startTime: moment().add(-36, 'h'), endTime: moment().add(-30, 'h') },
    ];
    const props = {
      title: 'React Team Timeline Calendar',
      fromTime: moment().startOf('day'),
      toTime: moment().endOf('day'),
      displayFrom: moment(),
      timeStep: 60,
      groups,
      items,
    };
    const test = 'test';
    const onClick = (idx) => alert('You click from'+idx+test);
    return (<TimeLine {...props} onClickItem={onClick.bind(this)} />);
  });
  // .add('some emojies as the text', () => (
  //   <Button>😀 😎 👍 💯</Button>
  // ))
  // .add('custom styles', () => {
  //   const style = {
  //     fontSize: 20,
  //     textTransform: 'uppercase',
  //     color: '#FF8833',
  //   };
  //   return (
  //     <Button style={ style }>Hello</Button>
  //   );
  // });
