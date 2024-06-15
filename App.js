import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import myStore from './src/reduxToolkit/MyStore';

import Root from './src';
import IAPProvider from './src/Context';
const App = () => {
  return (
    <IAPProvider>
      <Provider store={myStore}>
        <StatusBar backgroundColor="#73cbea" />
        <Root />
      </Provider>
    </IAPProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
