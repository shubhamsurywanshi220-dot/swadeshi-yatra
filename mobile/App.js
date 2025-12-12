import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SOSScreen from './screens/SOSScreen';
import DirectoryScreen from './screens/DirectoryScreen';
import PlaceDetailsScreen from './screens/PlaceDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import BottomTabs from './components/BottomTabs';
import { theme } from './constants/theme';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [routeParams, setRouteParams] = useState({});

  // Simple manual navigation helper to bypass broken libraries
  const navigation = {
    navigate: (screen, params = {}) => {
      setRouteParams(params);
      setCurrentScreen(screen);
    },
    replace: (screen, params = {}) => {
      setRouteParams(params);
      setCurrentScreen(screen);
    },
    goBack: () => {
      // Basic back handling
      if (currentScreen === 'PlaceDetails') {
        setCurrentScreen('Places');
      } else if (['Places', 'SOS', 'Profile', 'Favorites'].includes(currentScreen)) {
        setCurrentScreen('Home');
      } else {
        setCurrentScreen('Home'); // Default fallback
      }
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <LoginScreen navigation={navigation} />;
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      case 'SOS':
        return <SOSScreen navigation={navigation} />;
      case 'Places':
        return <DirectoryScreen route={{ params: routeParams }} navigation={navigation} />;
      case 'PlaceDetails':
        return <PlaceDetailsScreen route={{ params: routeParams }} navigation={navigation} />;
      case 'Profile':
        return <ProfileScreen navigation={navigation} />;
      case 'Favorites':
        return <FavoritesScreen navigation={navigation} />;
      default:
        return <LoginScreen navigation={navigation} />;
    }
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
        {renderScreen()}
      </View>

      {/* Helper to show Tabs only on non-login screens, and NOT on Details/Favorites screen */}
      {currentScreen !== 'Login' && currentScreen !== 'PlaceDetails' && currentScreen !== 'Favorites' && (
        <BottomTabs currentScreen={currentScreen} navigate={navigation.navigate} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flex: 1,
  }
});
