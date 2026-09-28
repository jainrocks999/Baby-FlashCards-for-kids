import {
  AppState,
  BackHandler,
  LogBox,
  ToastAndroid,
  Platform,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MyStack from './components/MyStack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { showInterstitialAd } from './components/Ads';

const Root = () => {
  LogBox.ignoreAllLogs();
  const appState = useRef(AppState.currentState);

  const doublePressTimeout = useRef(null);

  const [appStateVisible, setAppStateVisible] = useState(false);

  const handleAppStateChange = nextState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextState == 'active'
    ) {
      setAppStateVisible(true);
    }
    appState.current = nextState;
    if (appState.current == 'background') {
    }
  };
  useEffect(() => {
    const unsubscribe = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => unsubscribe.remove();
  }, []);
  useEffect(() => {}, [appStateVisible]);

  async function handleBackButtonClick() {
    const DOUBLE_PRESS_DELAY = 2000;
    const currentTime = Date.now();

    if (
      doublePressTimeout.current &&
      doublePressTimeout.current + DOUBLE_PRESS_DELAY >= currentTime
    ) {
      const purchase = await AsyncStorage.getItem('IN_APP_PURCHASE');
      if (purchase) {
        BackHandler.exitApp();
      } else {
        showInterstitialAd();
      }
      return true;
    } else {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
      }
      doublePressTimeout.current = currentTime;
      return true;
    }
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
    BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);
  return <MyStack />;
};

export default Root;
