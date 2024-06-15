import {Platform} from 'react-native';
import {TestIds} from 'react-native-google-mobile-ads';
export const Addsid = {
  ...Platform.select({
    ios: {
      BANNER: TestIds.BANNER,
      Interstitial: TestIds.INTERSTITIAL,
    },
    android: {
      BANNER: TestIds.BANNER, // 'ca-app-pub-3339897183017333/5721016782',
      Interstitial: TestIds.INTERSTITIAL, //'ca-app-pub-3339897183017333/4244283582',
      Interstitial2: 'ca-app-pub-3339897183017333/7197749989',
    },
  }),
};

// banner ca-app-pub-3339897183017333/5721016782
// Interstitial ca-app-pub-3339897183017333/4244283582
