import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

export default function BackgroundWaves() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="begeGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#fff1ea" stopOpacity="1" />
            <Stop offset="100%" stopColor="#e9d2c9" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="rosaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#e97487" />
            <Stop offset="100%" stopColor="#822d3a" />
          </LinearGradient>
        </Defs>

        <Path
          d="M0,0 C50,34 130,0 100,65 L80,70 L0,50 Z"
          fill="#c5dddb"
        />

        <Path
          d="M0,20 C15,38 107,30 100,55 L100,90 L0,70 Z"
          fill="#6d8b89"
        />

        <Path
          d="M0,60 C140,40 70,40 180,0 L100,100 L0,100 Z"
          fill="#000"
        />
      </Svg>
    </View>
  );
}
