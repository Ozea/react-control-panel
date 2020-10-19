import React, { useState } from 'react';
import Password from '../Form/Password/Password';

import './AdditionalFtp.scss';

const AdditionalFtp = ({ domain, index, onDeleteAdditionalFtp, prefixI18N }) => {
  const { i18n } = window.GLOBAL.App;
  const [state, setState] = useState({
    path: '',
    username: ''
  });

  return (
    <div className="additional-ftp">
      <div className="title">
        <span>{i18n.FTP} #{index}</span>
        <span>
          &nbsp;
          <button type="button" onClick={() => onDeleteAdditionalFtp(index)}>({i18n.Delete})</button>
        </span>
      </div>

      <div className="form-transform">
        <div className="form-group username">
          <label for={`username_${index}`}>{i18n.Username}</label>
          <span className="prefix-note">{prefixI18N}</span>
          <div className="input-wrapper">
            <input
              value={state.username}
              onChange={event => setState({ ...state, username: event.target.value })}
              type="text"
              className="form-control"
              id={`username_${index}`}
              name={`v_ftp_user[${index}][v_ftp_user]`} />
            <span>{window.GLOBAL.App.user + '_'}{state.username}</span>
          </div>
        </div>

        <Password name={`v_ftp_user[${index}][v_ftp_password]`} index={index} />

        <div className="form-group">
          <label for={`path${index}`}>{i18n.Path}</label>
          <input
            type="text"
            value={state.path}
            onChange={event => setState({ ...state, path: event.target.value })}
            className="form-control"
            id={`path${index}`}
            name={`v_ftp_user[${index}][v_ftp_path]`} />
          <span className="path-note">{`/web/${domain ? domain + '/' : ''}${state.path}`}</span>
        </div>

        <div className="form-group">
          <label for={`sendLoginCredentialsToEmailAddress_${index}`}>{i18n['Send login credentials to email address']}</label>
          <input
            type="email"
            className="form-control"
            id={`sendLoginCredentialsToEmailAddress_${index}`}
            name={`v_ftp_user[${index}][v_ftp_email]:`} />
          <input type="hidden" name={`v_ftp_user[${index}][delete]`} value="0" />
          <input type="hidden" name={`v_ftp_user[${index}][is_new]`} value="1" />
          <input type="hidden" name={`v_ftp_pre_path`} value={domain ? `/web/${domain}/` : ''} />
        </div>
      </div>
    </div>
  );
}

export default AdditionalFtp;