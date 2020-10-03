import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './LeftButton.scss';
import { Link } from 'react-router-dom';

function leftMenuClassName(props) {
  if (!props.showLeftMenu) {
    return "l-menu none";
  }

  if (props.list === 'server') {
    return "l-menu server-icon";
  }

  return "l-menu";
}

function renderIcon(props) {
  if (props.list === 'server') {
    return <FontAwesomeIcon icon="cog" />
  }

  return <FontAwesomeIcon icon="plus" />
}

const LeftButton = (props) => {
  return (
    <div className={leftMenuClassName(props)}>
      <Link to={props.href}>
        {renderIcon(props)}
        <span className="add">{props.name}</span>
      </Link>
    </div>
  );
}

export default LeftButton;