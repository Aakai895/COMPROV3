import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Polygon, Circle } from "react-native-svg";

const { width } = Dimensions.get("window");

export default function FundoPersonalizado() {
  return (
    <View style={styles.container}>
      <Svg height={210} width={width} style={styles.top}>
        <Polygon
          points={`0,0 ${width},0 ${width},150 ${width / 2},210 0,150`}
          fill="#44615f"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fbfbfb",
  },
  top: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
