import React from 'react';
import ListItem from '../ControlPanel/ListItem/ListItem';
import Container from '../ControlPanel/Container/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DomainNameSystem.scss';

const DomainNameSystem = props => {
  const { data } = props;
  const { i18n } = window.GLOBAL.App;
  const token = localStorage.getItem("token");

  const toggleFav = (starred) => {
    if (starred) {
      props.toggleFav(props.data.NAME, 'add');
    } else {
      props.toggleFav(props.data.NAME, 'delete');
    }
  }

  const checkItem = () => {
    props.checkItem(props.data.NAME);
  }

  const handleSuspend = () => {
    let suspendedStatus = data.SUSPENDED === 'yes' ? 'unsuspend' : 'suspend' === 'yes' ? 'unsuspend' : 'suspend';
    props.handleModal(data.suspend_conf, `/${suspendedStatus}/dns?domain=${data.NAME}&token=${token}`);
  }

  const handleDelete = () => {
    props.handleModal(data.delete_confirmation, `/delete/dns?domain=${data.NAME}&token=${token}`);
  }

  return (
    <ListItem
      id={data.NAME}
      checked={data.isChecked}
      starred={data.STARRED}
      date={data.DATE}
      toggleFav={toggleFav}
      checkItem={checkItem}
      suspended={data.SUSPENDED === 'yes'}
      focused={data.FOCUSED} >
      <Container className="r-col w-85">
        <div className="name">{data.NAME} <span className="dns-records">/ {data.RECORDS}</span></div>
        <br />
        <div className="stats">
          <Container className="c-1 w-35">
            <div className="ip">{data.IP}</div>
            <div className="soa"><span className="stat">{data.SOA}</span></div>
          </Container>
          <Container className="c-2 w-30">
            <div>{i18n.TTL}: <span className="stat">{data.TTL}</span></div>
            <div>{i18n.Serial}: <span className="stat">{data.SERIAL}</span></div>
          </Container>
          <Container className="c-3 w-35">
            <div>{i18n.Template}: <span className="stat">{data.TPL}</span></div>
            <div>{i18n.Expire}: <span className="stat">{data.EXP}</span></div>
          </Container>
        </div>
      </Container>
      <div className="actions">
        <div>
          <a className="link-gray" href={`/list/dns/?domain=${data.NAME}`}>
            {data.RECORDS_I18N}
            {data.FOCUSED ? <span className="shortcut-button">L</span> : <FontAwesomeIcon icon="list" />}
          </a>
        </div>

        <div>
          <a className="link-edit" href={`/add/dns/?domain=${data.NAME}`}>
            {i18n['add record']}
            {data.FOCUSED ? <span className="shortcut-button">N</span> : <FontAwesomeIcon icon="add" />}
          </a>
        </div>

        <div>
          <a className="link-edit" href={`/edit/dns/?domain=${data.NAME}`}>
            {i18n.edit}
            {data.FOCUSED ? <span className="shortcut-button html-unicode">&#8617;</span> : <FontAwesomeIcon icon="pen" />}
          </a>
        </div>

        <div>
          <button
            className="link-gray"
            onClick={() => handleSuspend()}>
            {i18n[data.suspend_action]}
            {data.FOCUSED ? <span className="shortcut-button">S</span> : <FontAwesomeIcon icon={data.SUSPENDED === 'yes' ? 'unlock' : 'lock'} />}
          </button>
        </div>

        <div>
          <button className="link-delete" onClick={() => handleDelete()}>
            {i18n.Delete}
            {data.FOCUSED ? <span className="shortcut-button del">Del</span> : <FontAwesomeIcon icon="times" />}
          </button>
        </div>
      </div>
    </ListItem>
  );
}

export default DomainNameSystem;