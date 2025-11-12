import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated,} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Loading() {
  const navigation = useNavigation();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    }).start(() => {
      navigation.replace('Main');
    });
  }, [navigation, progress]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.slogan}>
        Sua mente comanda. O futuro responde.
      </Text>

      <View style={styles.progressBarBackground}>
        <Animated.View style={[
            styles.progressBarFill,
            { width: widthInterpolated }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  slogan: {
    fontSize: 18,
    fontFamily: 'Alice',
    textAlign: 'center',
    marginBottom: 30,
  },
  progressBarBackground: {
    width: '60%',
    height: 8,
    backgroundColor: '#e7e7e7',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6d8b89',
  },
});
