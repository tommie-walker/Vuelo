import React from 'react';
import { Card, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const HelicopterCard = (props) => {
  return (
    <>
      <Link to={{
        pathname: `/heliDetailPage/${props.helicopter._id}`,
        state: {
          helicopter: props.helicopter
        }
      }}
      >
        <Tooltip placement='bottom' title='Learn More' mouseEnterDelay={0.5} >
          < Card
            hoverable
            className='helicopter-card'
            cover={<img alt={props.helicopter.model} src={props.helicopter.url ? props.helicopter.url : require('../images/default.png')} className='helicopter-Img' />}
          >
            <Meta title={props.helicopter.model} description={props.helicopter.date} />
          </Card >
        </Tooltip>
      </Link>
    </>
  )
}

export default HelicopterCard;