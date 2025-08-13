import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  TouchableOpacity 
} from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import { fetchRideOptions, calculateRidePrice, bookRide } from '../utils/api';

export default function RideOptionsScreen({ navigation, route }) {
  const [rideOptions, setRideOptions] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [ridePrices, setRidePrices] = useState({});

  const { pickupLocation, destination } = route.params || {};

  useEffect(() => {
    loadRideOptions();
  }, []);

  const loadRideOptions = async () => {
    try {
      const options = await fetchRideOptions();
      setRideOptions(options);
      
      // Calculate prices for each ride type
      if (pickupLocation && destination) {
        const prices = {};
        for (const option of options) {
          try {
            const priceInfo = await calculateRidePrice(
              pickupLocation, 
              destination, 
              option.type
            );
            prices[option.type] = priceInfo;
          } catch (error) {
            console.error(`Error calculating price for ${option.type}:`, error);
            prices[option.type] = {
              price: option.price,
              distance: '5.0 miles',
              duration: '15 min'
            };
          }
        }
        setRidePrices(prices);
      }
    } catch (error) {
      console.error('Error loading ride options:', error);
      Alert.alert('Error', 'Failed to load ride options');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRide = (ride) => {
    try {
      setSelectedRide(ride);
    } catch (error) {
      console.error('Error selecting ride:', error);
    }
  };

  const handleBookRide = async () => {
    try {
      if (!selectedRide) {
        Alert.alert('No Ride Selected', 'Please select a ride option');
        return;
      }

      setBooking(true);
      
      const rideDetails = {
        rideType: selectedRide.type,
        pickupLocation,
        destination,
        price: ridePrices[selectedRide.type]?.price || selectedRide.price,
        estimatedDuration: ridePrices[selectedRide.type]?.duration || '15 min'
      };

      const booking = await bookRide(rideDetails);
      
      Alert.alert(
        'Ride Booked Successfully!',
        `Booking ID: ${booking.bookingId}\nDriver: ${booking.driverName}\nVehicle: ${booking.vehicleInfo}\nETA: ${booking.estimatedArrival}`,
        [
          {
            text: 'Track Ride',
            onPress: () => {
              Alert.alert('Coming Soon', 'Ride tracking feature coming soon!');
              navigation.navigate('Home');
            }
          },
          {
            text: 'Go Home',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Booking Failed',
        error.message || 'Failed to book ride. Please try again.'
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading ride options...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Ride</Text>
          {pickupLocation && destination && (
            <View style={styles.routeInfo}>
              <Text style={styles.routeText}>
                📍 From: {pickupLocation.address}
              </Text>
              <Text style={styles.routeText}>
                🎯 To: {destination.address}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.optionsContainer}>
          {rideOptions.map((ride) => {
            const priceInfo = ridePrices[ride.type];
            const isSelected = selectedRide?.id === ride.id;
            
            return (
              <TouchableOpacity
                key={ride.id}
                onPress={() => handleSelectRide(ride)}
                activeOpacity={0.7}
              >
                <Card style={[
                  styles.rideCard,
                  isSelected && styles.selectedCard
                ]}>
                  <View style={styles.rideHeader}>
                    <View style={styles.rideInfo}>
                      <Text style={styles.rideType}>{ride.type}</Text>
                      <Text style={styles.rideDescription}>
                        {ride.description}
                      </Text>
                      <Text style={styles.rideCapacity}>
                        {ride.capacity}
                      </Text>
                    </View>
                    <View style={styles.ridePricing}>
                      <Text style={styles.ridePrice}>
                        {priceInfo?.price || ride.price}
                      </Text>
                      <Text style={styles.rideWait}>
                        {ride.wait} wait
                      </Text>
                    </View>
                  </View>
                  
                  {priceInfo && (
                    <View style={styles.rideDetails}>
                      <Text style={styles.rideDetailText}>
                        📏 {priceInfo.distance} • ⏱️ {priceInfo.duration}
                      </Text>
                    </View>
                  )}
                  
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedText}>✓ Selected</Text>
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedRide && (
          <View style={styles.selectedRideInfo}>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Ride Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ride Type:</Text>
                <Text style={styles.summaryValue}>{selectedRide.type}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Price:</Text>
                <Text style={styles.summaryValue}>
                  {ridePrices[selectedRide.type]?.price || selectedRide.price}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Wait Time:</Text>
                <Text style={styles.summaryValue}>{selectedRide.wait}</Text>
              </View>
              {ridePrices[selectedRide.type] && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Duration:</Text>
                  <Text style={styles.summaryValue}>
                    {ridePrices[selectedRide.type].duration}
                  </Text>
                </View>
              )}
            </Card>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={booking ? 'Booking Ride...' : 'Book Ride'}
          onPress={handleBookRide}
          disabled={!selectedRide || booking}
          style={styles.bookButton}
        />
        
        {booking && (
          <ActivityIndicator 
            size="small" 
            color="#000" 
            style={styles.bookingLoader}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  routeInfo: {
    marginTop: 10,
  },
  routeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  optionsContainer: {
    padding: 10,
  },
  rideCard: {
    marginVertical: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#000',
    backgroundColor: '#f8f8f8',
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rideInfo: {
    flex: 1,
  },
  rideType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  rideDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  rideCapacity: {
    fontSize: 12,
    color: '#999',
  },
  ridePricing: {
    alignItems: 'flex-end',
  },
  ridePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  rideWait: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rideDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  rideDetailText: {
    fontSize: 12,
    color: '#666',
  },
  selectedIndicator: {
    marginTop: 10,
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  selectedRideInfo: {
    padding: 10,
  },
  summaryCard: {
    backgroundColor: '#f8f8f8',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookButton: {
    paddingVertical: 16,
  },
  bookingLoader: {
    marginTop: 10,
  },
});
