import React, { useEffect, useRef, useState } from 'react';
import {View, StyleSheet, Animated, Keyboard, Platform,
  useWindowDimensions,} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useFonts } from 'expo-font';

export default function BackgroundWaves() {
  const [fontsLoaded] = useFonts({
    Alice: require('../../fonts/Alice-Regular.ttf'),
    Findel: require('../../fonts/Findel-Display-Regular.otf'),
  });

  const keyboardHeight = useRef(new Animated.Value(0)).current;
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { height } = useWindowDimensions();

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardShowListener = Keyboard.addListener(showEvent, (e) => {
      setKeyboardVisible(true);
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
    });

    const keyboardHideListener = Keyboard.addListener(hideEvent, (e) => {
      setKeyboardVisible(false);
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: e?.duration || 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [keyboardHeight]);

  if (!fontsLoaded) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          top: Animated.multiply(keyboardHeight, -0.99),
          zIndex: 0,
        }}
      >
        <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="begeGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#fff1ea" stopOpacity="1" />
              <Stop offset="100%" stopColor="#e9d2c9" stopOpacity="1" />
            </LinearGradient>
            
            <LinearGradient id="verdeGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#e97487" />
              <Stop offset="100%" stopColor="#822d3a" />
            </LinearGradient>
          </Defs>

          <Path
            d="M0,48 C50,55 45,65 150,35 L100,100 L0,100 Z"
            fill="#a5c3a7"
          />

          <Path
            d="M0,50 C60,60 30,70 255,15 L100,100 L0,100 Z"
            fill="#000"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
