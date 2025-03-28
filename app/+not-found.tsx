import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found', headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a237e', '#0d47a1', '#01579b']}
          style={StyleSheet.absoluteFill}
        />
        
        <Animated.View 
          entering={FadeIn.delay(200).duration(800)}
          style={styles.iconContainer}
        >
          <Ionicons name="alert-circle-outline" size={120} color="rgba(255,255,255,0.8)" />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
          <Text style={styles.title}>Oops!</Text>
          <Text style={styles.text}>The page you're looking for doesn't exist.</Text>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.delay(600).duration(800)}
          style={styles.buttonContainer}
        >
          <Link href="/(tabs)" asChild>
            <Pressable style={styles.button}>
              <Ionicons name="home-outline" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Go Home</Text>
            </Pressable>
          </Link>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
    opacity: 0.9,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: 300,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 250,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});