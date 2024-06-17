import {Platform} from 'react-native';
const productSkus = Platform.select({
  android: ['eflash_upgrade'],
  ios: ['com.eflash.eFlash.proupgrade'],
});
export const constants = {
  productSkus,
};
