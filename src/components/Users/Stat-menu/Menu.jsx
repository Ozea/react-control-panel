import React from 'react';
import { users } from '../../../mocks/users';
import './Menu.scss';

function className(height) {
  if (height === 35) {
    return "menu-stat shadow";
  } else {
    return "menu-stat";
  }
}

function style({ menuHeight, mobile }) {
  if (mobile) {
    return;
  }

  if (document.documentElement.clientWidth > 900) {
    return menuHeight
  } else {
    return 45;
  }
}

const Menu = (props) => {
  let usersAmount = Object.keys(users).length;
  return (
    <div className="menu-wrapper">
      <div className={className(props.menuHeight)} style={{ height: style(props) }}>
        <div className="stat l-active">
          <h3>User</h3>
          <div className="stats">
            <div>users: <span>{usersAmount}</span></div>
            <div>suspended: <span>{users.admin.SUSPENDED_USERS}</span></div>
          </div>
        </div>
        <div className="stat">
          <h3>Web</h3>
          <div className="stats">
            <div>domains: <span>{users.admin.U_WEB_DOMAINS}</span></div>
            <div>aliases: <span>{users.admin.U_WEB_ALIASES}</span></div>
            <div>suspended: <span>{users.admin.SUSPENDED_WEB}</span></div>
          </div>
        </div>
        <div className="stat">
          <h3>Dns</h3>
          <div className="stats">
            <div>domains: <span>{users.admin.U_DNS_DOMAINS}</span></div>
            <div>records: <span>{users.admin.U_DNS_RECORDS}</span></div>
            <div>suspended: <span>{users.admin.SUSPENDED_DNS}</span></div>
          </div>
        </div>
        <div className="stat">
          <h3>Mail</h3>
          <div className="stats">
            <div>domains: <span>{users.admin.U_MAIL_DOMAINS}</span></div>
            <div>accounts: <span>{users.admin.U_MAIL_ACCOUNTS}</span></div>
            <div>suspended: <span>{users.admin.SUSPENDED_MAIL}</span></div>
          </div>
        </div>
        <div className="stat">
          <h3>Db</h3>
          <div className="stats">
            <div>databases: <span>{users.admin.U_DATABASES}</span></div>
            <div>suspended: <span>{users.admin.SUSPENDED_DB}</span></div>
          </div>
        </div>
        <div className="stat">
          <h3>Cron</h3>
          <div className="stats">
            <div>jobs: <span>{users.admin.U_CRON_JOBS}</span></div>
            <div>suspended: <span>{users.admin.SUSPENDED_CRON}</span></div>
          </div>
        </div>
        <div className="stat last">
          <h3>Backup</h3>
          <div className="stats">
            <div>backups: <span>{users.admin.U_BACKUPS}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;