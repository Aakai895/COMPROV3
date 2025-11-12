import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Polygon, Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function FundoPersonalizado() {
  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <Svg height={180} width={width}>
          <Circle cx="15" cy="170" r="40" fill="#46687B" /> 
          <Circle cx={width - 50} cy="110" r="100" fill="#F7F3C4" /> 
          <Circle cx={width - 170} cy="180" r="80" fill="#D5E2B9" />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
  footer: {
    position: "absolute",
    bottom: 0, 
    left: 0,
  },
});
