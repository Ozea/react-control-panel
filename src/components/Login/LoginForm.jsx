import React, { useEffect, useState } from 'react';

import { Link, useHistory } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/Session/sessionActions';
import LoginLayout from '../ControlPanel/LoginLayout/LoginLayout';
import TextInput from '../ControlPanel/AddItemLayout/Form/TextInput/TextInput';

import './Login.scss';

export default function LoginForm() {
  const { i18n } = window.GLOBAL.App;
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    user: '',
    password: ''
  });
  const session = useSelector(state => state.session);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (session.error) {
      setErrorMessage(session.error);
      return;
    }

    if (session.token) {
      history.push('/list/user/');
    }
  }, [session]);

  const submitHandler = event => {
    event.preventDefault();
    const { user, password } = formValues;

    setLoading(true);

    dispatch(login(user, password))
      .then((res) => {
        setLoading(false);
      });
  }

  const changeInputHandler = event => {
    const { value, name } = event.target;

    setFormValues({
      ...formValues,
      [name]: value
    });
  }

  return (
    <div className="login-page">
      {loading && <Spinner />}
      <div className="login-form-wrapper">
        <LoginLayout>
          <form onSubmit={submitHandler}>
            <div className="c1">
              <Link to="/">
                <img src="https://r5.vestacp.com:8083/images/vesta_logo.png" alt="Logo" />
              </Link>
            </div>
            <div className="c2">
              <TextInput
                onChange={changeInputHandler}
                title={i18n['Username']}
                value={formValues.user}
                name="user"
                id="user" />

              <TextInput
                onChange={changeInputHandler}
                title={i18n['Password']}
                value={formValues.password}
                optionalTitle={(
                  <button className="forgot-password">
                    {i18n['forgot password']}
                  </button>
                )}
                name="password"
                type="password"
                id="password" />

              <button type="submit" disabled={loading} className={loading ? 'disabled' : ''}>
                {i18n['Log in']}
              </button>

              <div className="error-message">{errorMessage}</div>
            </div>
          </form>

          <span>
            <Link to="http://vestacp.com">vestacp.com</Link>
          </span>
        </LoginLayout>
      </div>
    </div>
  );
}