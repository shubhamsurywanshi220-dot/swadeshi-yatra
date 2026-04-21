import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './i18n'; // Initialize i18n
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SOSScreen from './screens/SOSScreen';
import DirectoryScreen from './screens/DirectoryScreen';
import PlaceDetailsScreen from './screens/PlaceDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import SettingsScreen from './screens/SettingsScreen';
import InitiativesScreen from './screens/InitiativesScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';
import AboutScreen from './screens/AboutScreen';
import DestinationAboutScreen from './screens/DestinationAboutScreen';
import ProviderRegistrationScreen from './screens/ProviderRegistrationScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import CultureScreen from './screens/CultureScreen';
import StoryReaderScreen from './screens/StoryReaderScreen';
import BookingScreen from './screens/BookingScreen';
import MyTicketsScreen from './screens/MyTicketsScreen';
import SocialHubScreen from './screens/SocialHubScreen';
import PackageDetailsScreen from './screens/PackageDetailsScreen';
import BottomTabs from './components/BottomTabs';
import { theme } from './constants/theme';

import { ThemeProvider, useTheme } from './context/ThemeContext';

function MainApp() {
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [routeParams, setRouteParams] = useState({});

  // Dynamic Styles
  const styles = StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      flex: 1,
    }
  });

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
      if (currentScreen === 'PlaceDetails' || currentScreen === 'DestinationAbout') {
        setCurrentScreen('Explore');
      } else if (currentScreen === 'PackageDetails') {
        setCurrentScreen('Home');
      } else if (currentScreen === 'Settings' || currentScreen === 'HelpSupport' || currentScreen === 'About') {
        setCurrentScreen('Profile');
      } else if (currentScreen === 'Initiatives') {
        setCurrentScreen('Home');
      } else if (['Explore', 'SOS', 'Profile', 'Favorites'].includes(currentScreen)) {
        setCurrentScreen('Home');
      } else if (['EditProfile', 'ChangePassword', 'PrivacyPolicy'].includes(currentScreen)) {
        setCurrentScreen('Settings');
      } else {
        setCurrentScreen('Home');
      }
    },
    addListener: (event, callback) => {
      // Stub for custom navigation compatibility
      return () => { };
    },
    getState: () => ({
      routes: [{ name: currentScreen, params: routeParams }]
    })
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <LoginScreen navigation={navigation} />;
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      case 'SOS':
        return <SOSScreen navigation={navigation} />;
      case 'Explore':
        return <DirectoryScreen route={{ params: routeParams }} navigation={navigation} />;
      case 'PlaceDetails':
        return <PlaceDetailsScreen route={{ params: routeParams }} navigation={navigation} />;
      case 'Profile':
        return <ProfileScreen navigation={navigation} />;
      case 'Favorites':
        return <FavoritesScreen navigation={navigation} />;
      case 'Settings':
        return <SettingsScreen navigation={navigation} />;
      case 'Initiatives':
        return <InitiativesScreen navigation={navigation} />;
      case 'HelpSupport':
        return <HelpSupportScreen navigation={navigation} />;
      case 'About':
        return <AboutScreen navigation={navigation} />;
      case 'ProviderRegistration':
        return <ProviderRegistrationScreen navigation={navigation} />;
      case 'Culture':
        return <CultureScreen route={{ params: routeParams }} navigation={navigation} />;
      case 'StoryReader':
        return <StoryReaderScreen route={{ params: routeParams }} navigation={navigation} />;
      case 'Booking':
        return <BookingScreen route={{ params: routeParams }} navigation={navigation} />;
      case 'MyTickets':
        return <MyTicketsScreen navigation={navigation} />;
      case 'SocialHub':
        return <SocialHubScreen route={{ params: routeParams }} navigation={navigation} />;
      case 'PackageDetails':
        return <PackageDetailsScreen route={{ params: routeParams }} navigation={navigation} />;
      case 'DestinationAbout':
        return <DestinationAboutScreen route={{ params: routeParams }} navigation={navigation} />;
      case 'EditProfile':
        return <EditProfileScreen navigation={navigation} />;
      case 'ChangePassword':
        return <ChangePasswordScreen navigation={navigation} />;
      case 'PrivacyPolicy':
        return <PrivacyPolicyScreen navigation={navigation} />;
      default:
        return <LoginScreen navigation={navigation} />;
    }
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>
        {renderScreen()}
      </View>

      {/* Helper to show Tabs only on non-login screens, and NOT on Details/Favorites screen etc */}
      {currentScreen !== 'Login' &&
        currentScreen !== 'PlaceDetails' &&
        currentScreen !== 'Favorites' &&
        currentScreen !== 'Settings' &&
        currentScreen !== 'Initiatives' &&
        currentScreen !== 'HelpSupport' &&
        currentScreen !== 'About' &&
        currentScreen !== 'DestinationAbout' &&
        currentScreen !== 'PackageDetails' &&
        currentScreen !== 'ProviderRegistration' && (
          <BottomTabs currentScreen={currentScreen} navigate={navigation.navigate} />
        )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}


