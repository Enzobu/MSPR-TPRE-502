import createStore from 'react-auth-kit/createStore';

const store = createStore({
  authName: '_auth',
  authType: 'localstorage',
  cookieDomain: window.location.hostname,
  cookieSecure: false,
});

export default store;
