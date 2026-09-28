import mobileAds, {
  MaxAdContentRating,
} from 'react-native-google-mobile-ads';

export const initAds = async () => {
  await mobileAds().setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.G,
    tagForChildDirectedTreatment: true,
    tagForUnderAgeOfConsent: true,
  });
  await mobileAds().initialize();
};