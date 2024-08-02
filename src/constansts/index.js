import {Platform} from 'react-native';
const productSkus = Platform.select({
  android: ['mandarin_in_ads_product'],
  ios: ['com.eflashapps.eflashchinese.proupgrade'],
});
export const constants = {
  productSkus,
};
