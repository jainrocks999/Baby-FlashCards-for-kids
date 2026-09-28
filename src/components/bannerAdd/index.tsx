import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { addids } from '../../constansts/adids';

interface Props {
  hasPurchased: boolean;
}

const CustomBannerAdd: React.FC<Props> = ({ hasPurchased }) => {
  const [failed, setFailed] = useState(false);

  if (hasPurchased || failed) {
    return null;
  }

  return (
    <View style={styles.adContainer}>
      <BannerAd
        unitId={addids.BANNER}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: { alignItems: 'center', width: '100%' },
});

export default CustomBannerAdd;
