import {Platform} from 'react-native';
const productSkus = Platform.select({
  android: ['eflash_upgrade'],
});
export const constants = {
  productSkus,
};
