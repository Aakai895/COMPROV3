import React from "react";
import { View, StyleSheet } from "react-native";

export default function FundoProfile() {
  return (
   <View style={styles.container}>
    <View style={styles.bottomShape} />
    <View style={styles.topShape} />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
     ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fbfbfb",
  },
  topShape: {
    width: "100%",
    height: 210,
    backgroundColor: "#3F5F5E",
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: "center",
    zIndex: 0,
    marginTop: -340,
  },
  bottomShape: {
    width: "100%",
    height: 340,
    backgroundColor: "#D6E1B1", 
    borderBottomLeftRadius: "100%",
    borderBottomRightRadius: "100%",
    
  },
});
