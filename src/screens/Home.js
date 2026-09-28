import {
  StatusBar,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import HorizontalList from '../components/HorizontalList';
import Header from '../components/Header';
import MyData from '../components/CatagotyData';
import {useNavigation} from '@react-navigation/native';
var SQLite = require('react-native-sqlite-storage');
import {addSetting} from '../reduxToolkit/Slice2';
import {QuestionMode} from '../reduxToolkit/Slice3';
import {IAPContext} from '../Context';
import PurcahsdeModal from '../components/PurchaseModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageBackground from '../components/ImageBackgrond';
import CustomBannerAdd from '../components/bannerAdd';
const db = SQLite.openDatabase({
  name: 'eFlashEngishinappnew.db',
  createFromLocation: 1,
});

const Home = () => {
  const muted = useSelector(state => state.sound);
  const {hasPurchased, requestPurchase, checkPurchases, visible, setVisible} =
    useContext(IAPContext);
  const Navigation = useNavigation();
  const [mute, setMute] = useState(muted);
  useEffect(() => {
    getSettings();
  }, []);
  const dispatch = useDispatch();
  const getSettings = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM  tbl_settings',
        [],
        (tx, results) => {
          let row = results.rows.item(0);
          dispatch(addSetting(row));
          dispatch(QuestionMode(row.Question));
        },
        err => {
          console.log(err);
        },
      );
    });
  };
  const onClose = value => {
    setVisible(value);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#7ee3ff'}}>
      <StatusBar backgroundColor={'#7ee3ff'} />
      <ImageBackground
        source={require('../../Assets4/bgnewcategory.png')}>
        <Header
          onPress2={() => setMute(!mute)}
          onPressPuchase={() => setVisible(true)}
          hasPurchased={hasPurchased}
          mute={mute}
          onPress={() => {
            Navigation.navigate('setting', {pr: 'home'});
          }}
          home
        />
        {!hasPurchased ? (
          <PurcahsdeModal
            onPress={async () => {
              requestPurchase();
              setVisible(false);
            }}
            onClose={onClose}
            visible={visible}
            onRestore={() => {
              checkPurchases(true);
            }}
          />
        ) : null}
        <HorizontalList items={MyData} />
         <CustomBannerAdd hasPurchased={hasPurchased} />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Home;
