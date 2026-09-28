import React from 'react';
import { Image, ImageProps, StyleSheet, View } from 'react-native';
import { height, width } from '../Diemenstions';

type ImageBackgroundProps = Omit<ImageProps, 'children'> & {
  children?: React.ReactNode;
};

const ImageBackground: React.FC<ImageBackgroundProps> = ({
  children,
  style,
  ...imageProps
}) => {
  return (
    <View style={[styles.container]}>
      <Image {...imageProps} style={styles.imagebackground} />
      {children}
    </View>
  );
};

export default ImageBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagebackground: {
   position:'absolute',
   height:height,
   width:width
  },
});
