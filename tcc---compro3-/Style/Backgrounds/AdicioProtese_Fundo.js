import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Ellipse } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function BackgroundScreen() {
  return (
    <View style={styles.container}>
      <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
        <Circle
          cx={width * 0.20}       
          cy={height * 0.10}     
          r={height * 0.12}    
          fill="#F3F0C0"       
        />

        <Ellipse
          cx={width * 0.70}
          cy={height * 0.10}
          rx={width * 0.45}
          ry={height * 0.20}
          fill="#DDE2BE"
        />
        
        <Circle
          cx={width * 0.95}
          cy={height * 0.2}
          r={height * 0.12}
          fill="#5E7674"
        />
        
        <Circle
          cx={width * 0.32}
          cy={height * 0.20}
          r={height * 0.06}
          fill="#a5c3a7"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', 
  },
});
