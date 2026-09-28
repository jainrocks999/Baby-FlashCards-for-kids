import React, { useContext, useState } from 'react';
import {
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { StackActions, useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../components/Header';
import { IAPContext } from '../Context';
import { addData } from '../reduxToolkit/Slice';
import { addCatNext } from '../reduxToolkit/Slice7';
import CustomBannerAdd from '../components/bannerAdd';
const SQLite = require('react-native-sqlite-storage');
const db = SQLite.openDatabase({
  name: 'eFlashEngishinappnew.db',
  createFromLocation: 1,
});
const NextScreen = ({ route }) => {
  const { hasPurchased } = useContext(IAPContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const item = useSelector(state => state?.catdata);
  const wr = useSelector(state => state.question);
  const muted = useSelector(state => state.sound);
  const [mute, setMut] = useState(muted);
  const getData = (cat, id) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tbl_items WHERE Category=? ',
        [cat],
        (tx, results) => {
          console.log('item query Query completed');
          const arr = [];
          const len = results.rows.length;
          for (let i = 0; i < len; i++) {
            const row = results.rows.item(i);
            arr.push(row);
          }
          dispatch(addData(arr));
          dispatch(addCatNext({ items: item.items, id: parseInt(id) + 1 }));
          if (cat != 'link') {
            navigation.navigate(wr ? 'question' : 'details', {
              page: true,
              item: { items: item.items, id: parseInt(id) + 1 },
            });
          } else {
            navigation.reset({ index: 0, routes: [{ name: 'home' }] });
          }
        },
        err => {
          console.log(err);
        },
      );
    });
    console.log(cat, id);
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require('../../Assets4/settingscreen.png')}
      >
        <View style={styles.container}>
          <StatusBar backgroundColor="#93e9ff" />
          <Header onPress2={() => setMut(!mute)} mute={mute} />
          <View style={styles.buttonsContainer}>
            <View style={styles.leftButtonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.dispatch(StackActions.replace('details'));
                }}
              >
                <Image
                  style={styles.buttonImage}
                  source={require('../../Assets4/btnrepeat_normal.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text style={styles.buttonText}>Repeat</Text>
            </View>
            {/* Next */}
            <View style={styles.centerButtonContainer}>
              <TouchableOpacity
                onPress={() =>
                  getData(item.items[item.id - 1]?.Category, parseInt(item.id))
                }
                style={styles.button}
              >
                <Image
                  style={styles.buttonImage}
                  source={require('../../Assets4/btnnextcatg_normal.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text style={styles.buttonText}>Next</Text>
            </View>
            <View style={styles.rightButtonContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.reset({ index: 0, routes: [{ name: 'home' }] })
                }
                style={styles.button}
              >
                <Image
                  style={styles.buttonImage}
                  source={require('../../Assets4/btnhome_normal.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text style={styles.buttonText}>Home</Text>
            </View>
          </View>
        </View>
        <CustomBannerAdd hasPurchased={hasPurchased} />
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#93e9ff' },
  container: { flex: 1 },
  buttonsContainer: {
    top: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  leftButtonContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '33%',
  },
  centerButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '33%',
  },
  rightButtonContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '33%',
  },
  button: { height: hp('8%'), width: hp('8%') },
  buttonImage: { height: '100%', width: '100%' },
  buttonText: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: 'red',
    marginTop: 5,
    elevation: 5,
  },
});
export default NextScreen;
