import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import moment from 'moment';
import TimeLine from '../index';

storiesOf('TimeLine', module)
  .add('default view', () => {
    const groups = [
      { id: 1, title: 'Group 1' },
      { id: 2, title: 'Group 2' },
    ];
    const items = [
      { id: 1, groupId: 1, title: 'I belong to Group 1', startTime: moment('2017-07-20 16:10'), endTime: moment('2017-07-20 16:30') },
      { id: 2, groupId: 2, title: 'And I belong to Group 2', startTime: moment().add(5, 'm'), endTime: moment().add(20, 'm') },
    ];
    const props = {
      title: 'React Team Timeline Calendar',
      fromTime: moment().startOf('hour'),
      toTime: moment().endOf('hour'),
      displayFrom: moment(),
      timeStep: 5,
      groups,
      items,
    };
    return (<TimeLine {...props} />);
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
