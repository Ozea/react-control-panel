import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import { getFirewallInfo, updateFirewall } from '../../../ControlPanelService/Firewalls';
import SelectInput from '../../ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from '../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../components/Spinner/Spinner';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import QS from 'qs';

import './EditFirewall.scss';

const EditFirewall = props => {
  const token = localStorage.getItem("token");
  const { i18n } = window.GLOBAL.App;
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    data: {},
    loading: false,
    errorMessage: '',
    okMessage: ''
  });

  useEffect(() => {
    let queryParams = QS.parse(history.location.search, { ignoreQueryPrefix: true });
    const { rule } = queryParams;

    dispatch(addActiveElement('/list/firewall/'));
    dispatch(removeFocusedElement());

    if (rule) {
      setState({ ...state, loading: true });

      getFirewallInfo(rule)
        .then(response => {
          setState({
            ...state,
            data: response.data,
            errorMessage: response.data['error_msg'],
            okMessage: response.data['ok_msg'],
            loading: false
          });
        })
        .catch(err => console.error(err));
    }
  }, []);

  const submitFormHandler = event => {
    event.preventDefault();
    let updatedDomain = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedDomain[name] = value;
    }

    if (Object.keys(updatedDomain).length !== 0 && updatedDomain.constructor === Object) {
      setState({ ...state, loading: true });

      updateFirewall(updatedDomain, state.data.domain)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;

            if (error_msg) {
              setState({ ...state, errorMessage: error_msg, okMessage: '', loading: false });
            } else if (ok_msg) {
              setState({ ...state, errorMessage: '', okMessage: ok_msg, loading: false });
            } else {
              setState({ ...state, loading: false });
            }
          }
        })
        .catch(err => console.error(err));
    }
  }

  return (
    <div className="edit-template edit-firewall">
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Editing Firewall Rule']}</div>
        <div className="error">
          <span className="error-message">
            {state.data.errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} {state.errorMessage}
          </span>
        </div>
        <div className="success">
          <span className="ok-message">
            {state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} <span dangerouslySetInnerHTML={{ __html: state.okMessage }}></span>
          </span>
        </div>
      </Toolbar>
      <AddItemLayout date={state.data.date} time={state.data.time} status={state.data.status}>
        {state.loading ? <Spinner /> :
          <form onSubmit={event => submitFormHandler(event)} id="edit-firewall">
            <input type="hidden" name="save" value="save" />
            <input type="hidden" name="token" value={token} />

            <SelectInput
              options={state.data.actions}
              selected={state.data.action}
              title={i18n['Action']}
              name="v_action"
              id="action" />

            <SelectInput
              options={state.data.protocols}
              selected={state.data.protocol}
              title={i18n['Protocol']}
              name="v_protocol"
              id="protocol" />

            <TextInput
              optionalTitle={i18n['ranges are acceptable']}
              value={state.data.port}
              title={i18n['Port']}
              name="v_port"
              id="port" />

            <TextInput
              optionalTitle={i18n['CIDR format is supported']}
              value={state.data.ip}
              title={i18n['IP address']}
              name="v_ip"
              id="ip" />

            <TextInput
              optionalTitle={i18n['optional']}
              value={state.data.comment}
              title={i18n['Comment']}
              name="v_comment"
              id="comment" />

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Save}</button>
              <button type="button" className="back" onClick={() => history.push('/list/firewall/')}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div>
  );
}

export default EditFirewall;