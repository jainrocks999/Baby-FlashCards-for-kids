import { Platform } from 'react-native';
import { RequestConfiguration } from 'react-native-google-mobile-ads';
import { RequestPurchaseProps } from 'react-native-iap';
export const productSkus = Platform.select({
  android: 'mandarin_in_ads_product',
  ios: 'com.eflash.eFlash.proupgrade',
});

export const requestPurchaseOption: RequestPurchaseProps = {
  request: {
    apple: { sku: 'com.eflash.eFlash.proupgrade' },
    google: { skus: ['mandarin_in_ads_product'] },
  },
  type: 'in-app',
};
