import {
  AdEventType,
  InterstitialAd,
  MaxAdContentRating,
  RequestOptions,
} from 'react-native-google-mobile-ads';
import { addids } from '../../constansts/adids';

const requestOptions: RequestOptions = {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['education', 'kids', 'learning'], // optional
};

export const showInterstitialAd = (hasPurchased: boolean) => {
  if (hasPurchased) return Promise.resolve();

  return new Promise<void>(resolve => {
    const interstitial = InterstitialAd.createForAdRequest(
      addids.Interstitial,
      requestOptions,
    );

    const unsubs: (() => void)[] = [];
    const done = () => {
      unsubs.forEach(u => u());
      resolve();
    };

    unsubs.push(
      interstitial.addAdEventListener(AdEventType.LOADED, () => {
        interstitial.show();
      }),
      interstitial.addAdEventListener(AdEventType.CLOSED, done),
      interstitial.addAdEventListener(AdEventType.ERROR, done),
    );

    interstitial.load();
  });
};
