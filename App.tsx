import React from 'react';

import { Provider } from 'react-redux';
import { store } from './src/store/store';
import Redirection from './src/navigation/redirection';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const App = () => {

  return (
    <Provider store={store}>
      <Redirection />
    </Provider>
  );
}

export default App;
