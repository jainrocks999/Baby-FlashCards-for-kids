import {
  StyleSheet,
  Text,
  View,
  AppState,
  BackHandler,
  LogBox,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import MyStack from './components/MyStack';

import {AdEventType, InterstitialAd} from 'react-native-google-mobile-ads';
import {Addsid} from './screens/ads';
import {IAPContext} from './Context';

const Root = () => {
  LogBox.ignoreAllLogs();
  const {hasPurchased} = useContext(IAPContext);
  const appState = useRef(AppState.currentState);
  const interstitial = InterstitialAd.createForAdRequest(Addsid.Interstitial, {
    requestNonPersonalizedAdsOnly: true,
  });

  const [appStateVisible, setAppStateVisible] = useState(false);
  const [count, setCount] = useState(1);
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

  function handleBackButtonClick() {
    console.log('tjhisisisi', hasPurchased);
    if (hasPurchased) {
      showAdd1();
    } else {
      BackHandler.exitApp();
    }

    return true;
  }

  const showAdd1 = () => {
    alert('called');
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
        BackHandler.exitApp();
      },
    );
    interstitial.load();
    return unsubscribe;
  };

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
