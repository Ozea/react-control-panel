import React, { useEffect, useState } from 'react';

import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import SelectInput from 'src/components/ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from 'src/components/ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addMail } from '../../../ControlPanelService/Mail';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';
import { useDispatch } from 'react-redux';

import './AddDNSRecord.scss'

export default function AddDNSRecord(props) {
  const { i18n } = window.GLOBAL.App;
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [state, setState] = useState({
    data: {},
    selectOptions: [
      'A',
      'AAAA',
      'NS',
      'CNAME',
      'MX',
      'TXT',
      'SRV',
      'DNSKEY',
      'KEY',
      'IPSECKEY',
      'PTR',
      'SPF',
      'TLSA',
      'CAA'
    ],
    loading: false,
    okMessage: '',
    errorMessage: '',
  });

  useEffect(() => {
    dispatch(addActiveElement(`/list/dns/`));
    dispatch(removeFocusedElement());
  }, []);

  const submitFormHandler = event => {
    event.preventDefault();
    let newMailDomain = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      newMailDomain[name] = value;
    }

    newMailDomain['v_domain'] = props.domain;

    if (Object.keys(newMailDomain).length !== 0 && newMailDomain.constructor === Object) {
      addMail(newMailDomain)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;

            if (error_msg) {
              setState({ ...state, errorMessage: error_msg, okMessage: '' });
            } else if (ok_msg) {
              setState({ ...state, errorMessage: '', okMessage: ok_msg });
            }
          }
        })
        .catch(err => console.error(err));
    }
  }

  return (
    <div className="edit-template add-dns-record">
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Adding DNS Record']}</div>
        <div className="error">
          <span className="error-message">
            {state.errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''}
            {state.errorMessage}</span>
        </div>
        <div className="success">
          <span className="ok-message">
            {state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''}
            <span dangerouslySetInnerHTML={{ __html: state.okMessage }}></span>
          </span>
        </div>
      </Toolbar>
      <AddItemLayout>
        {state.loading ? <Spinner /> : (
          <form onSubmit={event => submitFormHandler(event)}>
            <input type="hidden" name="ok_rec" value="add" />
            <input type="hidden" name="token" value={token} />

            <TextInput
              title={i18n['Domain']}
              value={props.domain}
              name="v_domain"
              id="domain"
              disabled />

            <TextInput
              title={i18n['Record']}
              name="v_domain"
              id="domain" />

            <SelectInput
              options={state.selectOptions}
              title={i18n['Type']}
              name="v_type"
              id="type" />

            <TextInput
              title={i18n['IP or Value']}
              name="v_val"
              id="val" />

            <TextInput
              optionalTitle={`(${i18n['optional']})`}
              title={i18n['Priority']}
              name="v_priority"
              id="priority" />

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Add}</button>
              <button type="button" className="back" onClick={() => history.push(`/list/dns/?domain=${props.domain}`)}>{i18n.Back}</button>
            </div>
          </form>
        )}
      </AddItemLayout>
    </div>
  );
}