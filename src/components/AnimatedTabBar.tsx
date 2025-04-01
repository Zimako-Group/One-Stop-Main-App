import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Icons for each tab
const tabIcons: Record<string, string> = {
  'index': 'home',
  'shop': 'cart',
  'services': 'apps',
  'products': 'cube-outline',
  'rewards': 'gift-outline',
};

// Tab titles
const tabTitles: Record<string, string> = {
  'index': 'Home',
  'shop': 'Shop',
  'services': 'Services',
  'products': 'Products',
  'rewards': 'Rewards',
};

export function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const tabWidth = width / state.routes.length;
  const indicatorPosition = useSharedValue(0);
  const indicatorScale = useSharedValue(1);
  const indicatorOpacity = useSharedValue(0);
  
  // Refs for each tab animation
  const tabAnimations = useRef(state.routes.map(() => ({
    scale: useSharedValue(1),
    opacity: useSharedValue(1),
    translateY: useSharedValue(0),
  }))).current;

  useEffect(() => {
    // Animate the indicator to the active tab position
    indicatorPosition.value = withSpring(state.index * tabWidth, {
      damping: 15,
      stiffness: 120,
    });
    
    // Animate the indicator scale and opacity
    indicatorScale.value = withSpring(1.2, {
      damping: 15,
      stiffness: 120,
    });
    indicatorOpacity.value = withTiming(1, { duration: 200 });
    
    // Animate each tab
    tabAnimations.forEach((anim, index) => {
      if (index === state.index) {
        // Active tab animation
        anim.scale.value = withSpring(1.1, { damping: 15, stiffness: 120 });
        anim.opacity.value = withTiming(1, { duration: 200 });
        anim.translateY.value = withSpring(-8, { damping: 15, stiffness: 120 });
      } else {
        // Inactive tab animation
        anim.scale.value = withSpring(1, { damping: 15, stiffness: 120 });
        anim.opacity.value = withTiming(0.7, { duration: 200 });
        anim.translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
      }
    });
  }, [state.index, tabWidth]);

  // Animated style for the indicator
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: indicatorPosition.value },
        { scale: indicatorScale.value },
      ],
      opacity: indicatorOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(26, 35, 126, 0.95)', 'rgba(13, 71, 161, 0.95)']}
        style={styles.background}
      />
      
      {/* Animated indicator */}
      <Animated.View style={[styles.indicator, indicatorStyle]} />
      
      {/* Tab buttons */}
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          
          // Get the tab animation values
          const tabAnim = tabAnimations[index];
          
          // Create animated styles for the tab
          const tabStyle = useAnimatedStyle(() => {
            return {
              transform: [
                { scale: tabAnim.scale.value },
                { translateY: tabAnim.translateY.value },
              ],
              opacity: tabAnim.opacity.value,
            };
          });
          
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <AnimatedTouchable
              key={route.key}
              style={[styles.tab, tabStyle]}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tabIcons[route.name] as any}
                size={24}
                color={isFocused ? "#fff" : "#888"}
              />
              <Text style={[
                styles.tabText, 
                { color: isFocused ? "#fff" : "#888" }
              ]}>
                {tabTitles[route.name]}
              </Text>
            </AnimatedTouchable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    paddingBottom: 10,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  tabsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  tabText: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
    color: '#fff',
  },
  indicator: {
    position: 'absolute',
    width: width / 5, 
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    bottom: 0,
    left: 0,
  },
});
