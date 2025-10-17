import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/config/redux/store';
import HomeScreen from './src/screens/HomeScreen';
import Notification from './src/screens/Notification';

export default function App() {
  return (
    <Provider store={store}>
      <HomeScreen />
      {/* <Notification /> */}
    </Provider>
  );
}
