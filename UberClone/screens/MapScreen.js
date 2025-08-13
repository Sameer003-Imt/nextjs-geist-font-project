import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Button from '../components/Button';
import { getCurrentLocation } from '../utils/api';

const { width, height } = Dimensions.get('window');

export default function MapScreen({ navigation }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  const loadCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      setSelectedLocation(location);
      setMapRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error loading location:', error);
      Alert.alert('Location Error', 'Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = (event) => {
    try {
      const { coordinate } = event.nativeEvent;
      setSelectedLocation({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        address: `${coordinate.latitude.toFixed(4)}, ${coordinate.longitude.toFixed(4)}`
      });
    } catch (error) {
      console.error('Map press error:', error);
    }
  };

  const handleConfirmLocation = () => {
    try {
      if (selectedLocation) {
        navigation.navigate('RideOptions', {
          pickupLocation: currentLocation,
          destination: selectedLocation
        });
      } else {
        Alert.alert('No Location Selected', 'Please select a destination on the map');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Failed to proceed to ride options');
    }
  };

  const handleUseCurrentLocation = () => {
    try {
      if (currentLocation) {
        setSelectedLocation(currentLocation);
        setMapRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error('Error using current location:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChangeComplete={setMapRegion}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Current Location"
            description={currentLocation.address}
            pinColor="blue"
          />
        )}
        
        {selectedLocation && selectedLocation !== currentLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title="Selected Destination"
            description={selectedLocation.address}
            pinColor="red"
          />
        )}
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.locationInfo}>
          <Text style={styles.locationTitle}>Selected Location:</Text>
          <Text style={styles.locationText}>
            {selectedLocation ? selectedLocation.address : 'Tap on map to select'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Use Current Location"
            onPress={handleUseCurrentLocation}
            style={styles.currentLocationButton}
            textStyle={styles.currentLocationButtonText}
          />
          
          <Button
            title="Confirm & Continue"
            onPress={handleConfirmLocation}
            disabled={!selectedLocation}
            style={styles.confirmButton}
          />
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          📍 Tap anywhere on the map to select your destination
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  map: {
    width: width,
    height: height * 0.7,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationInfo: {
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    gap: 10,
  },
  currentLocationButton: {
    backgroundColor: '#f0f0f0',
  },
  currentLocationButtonText: {
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#000',
  },
  instructions: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 8,
  },
  instructionsText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
