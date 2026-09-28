import React, { useEffect } from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import { Provider } from 'react-redux';
import myStore from './src/reduxToolkit/MyStore';
import Root from './src';
import IAPProvider from './src/Context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initAds } from './admobconfig';
const App = () => {
  useEffect(()=>{
    initAds()
  })
  return (
    <SafeAreaProvider>
      <IAPProvider>
        <Provider store={myStore}>
          <Root />
        </Provider>
      </IAPProvider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
