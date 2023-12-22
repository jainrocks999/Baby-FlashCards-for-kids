import {View, Text, Image, TouchableOpacity, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {height, width} from '../components/Diemenstions';
import {StyleSheet} from 'react-native';
import {setupPlayer} from '../components/Setup';
import TrackPlayer from 'react-native-track-player';
import {RightVOid, WrongVoid} from '../components/WrongVoid';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import {addPagable} from '../reduxToolkit/Slicer6';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {isTablet} from 'react-native-device-info';
import {
  TestIds,
  InterstitialAd,
  AdEventType,
  GAMBannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import {Addsid} from './ads';
const authId = Addsid.Interstitial;
const requestOption = {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
};
const QuestionPage = props => {
  const interstitial = InterstitialAd.createForAdRequest(authId, requestOption);
  const tablet = isTablet();
  const disapatch = useDispatch();
  useEffect(() => {
    const backAction = async () => {
      await TrackPlayer.reset();
      navigation.dispatch(StackActions.popToTop());
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const navigation = useNavigation();
  const canlable = useSelector(state => state.cancle);
  const page = useSelector(state => state.page);
  const [song, setSong] = useState();
  const [x, setX] = useState(0);
  const [wrong0, setWrong0] = useState(false);
  const [wrong1, setWrong1] = useState(false);
  const [wrong2, setWrong2] = useState(false);
  const [wrong3, setWrong3] = useState(false);
  const [count, setCount] = useState(1);

  const data = useSelector(state => state.Items);
  const showAdd = () => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      },
    );
    interstitial.load();
    return unsubscribe;
  };

  const IsPlay = async (item, index) => {
    //  console.log('isPlay is fired')
    let isReady = await setupPlayer();
    await TrackPlayer.reset();
    setCount(count + 1);

    if (count > 8) {
      setCount(0), showAdd();
    }
    let arr = [
      (track = {
        url: require('../../asset2/clickon.mp3'), // Load media from the file system
        title: 'Ice Age',
        artist: 'deadmau5',

        duration: null,
      }),
      (track2 = {
        url: `asset:/files/${item.Sound}`, // Load media from the file system
        title: 'Ice Age',
        artist: 'deadmau5',
        // Load artwork from the file system:
        //  artwork: require('../../asset2/clickon.mp3'),
        duration: null,
      }),
    ];
    if (isReady) {
      await TrackPlayer.add(arr);
      await TrackPlayer.play();
    }

    setSong(arr);
    console.log('called');
  };

  const [rendomdat, setrandomDat] = useState(data.slice(0, 4));
  const up = async indexx => {
    await TrackPlayer.reset();
    console.log(x);

    let traxck;
    let track2;
    WrongVoid.sort(() => Math.random() - 0.5).map((item, index) => {
      if (index === 1) {
        traxck = item;
      }
    });
    RightVOid.sort(() => Math.random() - 0.5).map((item, index) => {
      if (index === 1) {
        track2 = item;
      }
    });

    if (indexx === x) {
      if (x != 0) {
        setWrong0(true);
      }
      if (x != 1) {
        setWrong1(true);
      }
      if (x != 2) {
        setWrong2(true);
      }
      if (x != 3) {
        setWrong3(true);
      }
      await TrackPlayer.add(track2);
      setTimeout(() => {
        setWrong0(false);
        setWrong1(false);
        setWrong2(false);
        setWrong3(false);
        const shuffledData = data
          .slice()
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
        setrandomDat(shuffledData);
      }, 2000);
    } else {
      await TrackPlayer.add(traxck);
      switch (indexx) {
        case 0:
          setWrong0(true);
          break;
        case 1:
          setWrong1(true);
          console.log(indexx);
          break;
        case 2:
          setWrong2(true);
          break;
        case 3:
          setWrong3(true);
          break;
      }
    }

    await TrackPlayer.play();
  };

  useEffect(() => {
    run();
  }, [rendomdat]);
  console.log('this is canclelbe', canlable);

  const run = async () => {
    await TrackPlayer.reset();
    let y = Math.floor(Math.random() * 4);
    rendomdat.map((item, index) => {
      if (index === y) {
        IsPlay(item, index);
        setX(y);
      }
    });
  };
  useEffect(() => {
    setTimeout(() => {
      page ? sound() : null;
    }, 500);
  }, [canlable]);

  const sound = async () => {
    await TrackPlayer.reset();
    await TrackPlayer.add(song);
    await TrackPlayer.play();
  };

  const gotoSettings = async () => {
    await TrackPlayer.reset();
    disapatch(addPagable(false));
    navigation.dispatch(StackActions.push('setting', {pr: 'question'}));
  };
  return (
    <View style={{height: '100%', width: '100%'}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={async () => {
              await TrackPlayer.reset();
              disapatch(addPagable(false));
              navigation.dispatch(StackActions.popToTop());
            }}>
            <Image
              style={styles.icon}
              source={require('../../Assets4/btnhome_normal.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => sound()}>
            <Image
              style={styles.btn2}
              source={require('../../Assets4/btnrepeat_normal.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              gotoSettings();
            }}>
            <Image
              style={styles.icon}
              source={require('../../Assets4/btnsetting_normal.png')}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: tablet ? '5%' : '15%',
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <FlatList
            data={rendomdat}
            numColumns={2}
            keyExtractor={item => item.ID}
            renderItem={({item, index}) => {
              return (
                <View style={[!tablet ? styles.mobileView : styles.tabView]}>
                  <Image
                    style={{height: '100%', width: '100%'}}
                    source={{uri: `asset:/files/${item.Image}`}}
                  />
                </View>
              );
            }}
          />
        </View>
        <View style={[styles.worgImgContainer, {top: !tablet ? '17%' : '13%'}]}>
          <TouchableOpacity
            onPress={() => up(0)}
            style={[!tablet ? styles.wrongImg1 : styles.tabWrong1]}>
            {wrong0 && (
              <Image
                style={{height: '100%', width: '100%'}}
                source={require('../../Assets4/wrongselection.png')}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => up(1)}
            style={[!tablet ? styles.wrongImg2 : styles.tabWrong2]}>
            {wrong1 && (
              <Image
                style={{height: '100%', width: '100%'}}
                source={require('../../Assets4/wrongselection.png')}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.worgImgContainer2}>
          <TouchableOpacity
            onPress={() => up(2)}
            style={[!tablet ? styles.wrongImg1 : styles.tabWrong1]}>
            {wrong2 && (
              <Image
                style={{height: '100%', width: '100%'}}
                source={require('../../Assets4/wrongselection.png')}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => up(3)}
            style={[!tablet ? styles.wrongImg2 : styles.tabWrong2]}>
            {wrong3 && (
              <Image
                style={{height: '100%', width: '100%'}}
                source={require('../../Assets4/wrongselection.png')}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{bottom: 0, borderWidth: 0}}>
        <GAMBannerAd
          unitId={Addsid.BANNER}
          sizes={[BannerAdSize.FULL_BANNER]}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </View>
  );
};

export default QuestionPage;
const styles = StyleSheet.create({
  icon: {
    height: hp(7),
    width: hp(7),
    margin: '1%',
  },
  Titel: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  header: {
    height: height / 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'grey',
  },
  btn2: {
    height: hp(6.5),
    width: hp(6.5),
    alignSelf: 'center',
    marginTop: '15%',
  },
  wrongImg1: {
    height: hp(33),
    width: hp(24),
    marginHorizontal: wp(1.5),
    marginVertical: hp(3),
    // borderWidth: 4,
    alignItems: 'center',
  },
  wrongImg2: {
    height: hp(33),
    width: hp(24),
    marginHorizontal: wp(1.5),
    marginVertical: hp(3),
    // /  borderWidth: 4,
    alignItems: 'center',
  },
  worgImgContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: '16.7%',
  },
  worgImgContainer2: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: '1%',
  },
  mobileView: {
    height: hp(30),
    width: hp(24),
    marginHorizontal: wp(1.5),
    marginVertical: hp(3),
    alignItems: 'center',
  },
  tabView: {
    height: hp(38),
    width: hp(27),
    marginHorizontal: hp(1.5),
    // borderWidth: 4,
    marginVertical: hp(1),
  },
  tabWrong2: {
    height: hp(40),
    width: hp(29),
    marginLeft: hp(1),
    marginVertical: hp(1),
  },
  tabWrong1: {
    height: hp(40),
    width: hp(29),
    marginLeft: hp(4),
    marginVertical: hp(1),
  },
});
