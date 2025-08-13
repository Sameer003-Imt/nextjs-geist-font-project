import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import { getUserRideHistory, getCurrentLocation } from '../utils/api';

export default function HomeScreen({ navigation }) {
  const [rideHistory, setRideHistory] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [history, location] = await Promise.all([
        getUserRideHistory(),
        getCurrentLocation()
      ]);
      setRideHistory(history);
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBookRide = () => {
    try {
      navigation.navigate('Map');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Failed to navigate to map.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        {currentLocation && (
          <Text style={styles.locationText}>
            📍 {currentLocation.address}
          </Text>
        )}
      </View>

      <View style={styles.quickActions}>
        <Button
          title="Book a Ride"
          onPress={handleBookRide}
          style={styles.bookRideButton}
        />
        
        <View style={styles.actionRow}>
          <Button
            title="Schedule Later"
            onPress={() => Alert.alert('Coming Soon', 'Schedule ride feature coming soon!')}
            style={[styles.actionButton, styles.scheduleButton]}
            textStyle={styles.scheduleButtonText}
          />
          <Button
            title="Ride History"
            onPress={() => Alert.alert('Ride History', 'View your recent rides below')}
            style={[styles.actionButton, styles.historyButton]}
            textStyle={styles.historyButtonText}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Rides</Text>
        {rideHistory.length > 0 ? (
          rideHistory.map((ride) => (
            <Card key={ride.id} style={styles.rideCard}>
              <View style={styles.rideHeader}>
                <Text style={styles.rideDate}>{formatDate(ride.date)}</Text>
                <Text style={styles.ridePrice}>{ride.price}</Text>
              </View>
              <View style={styles.rideDetails}>
                <Text style={styles.rideRoute}>
                  {ride.from} → {ride.to}
                </Text>
                <Text style={styles.rideType}>{ride.type}</Text>
              </View>
              <View style={styles.rideStatus}>
                <Text style={[
                  styles.statusText,
                  ride.status === 'completed' && styles.completedStatus
                ]}>
                  {ride.status.toUpperCase()}
                </Text>
              </View>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No recent rides</Text>
            <Text style={styles.emptySubtext}>
              Book your first ride to get started!
            </Text>
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Options</Text>
        <Card style={styles.optionsCard}>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>🏠 Add Home</Text>
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>🏢 Add Work</Text>
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>⭐ Saved Places</Text>
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>💳 Payment Methods</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    padding: 20,
  },
  bookRideButton: {
    marginBottom: 15,
    paddingVertical: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
  },
  scheduleButton: {
    backgroundColor: '#f0f0f0',
  },
  scheduleButtonText: {
    color: '#333',
  },
  historyButton: {
    backgroundColor: '#f0f0f0',
  },
  historyButtonText: {
    color: '#333',
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rideCard: {
    marginHorizontal: 20,
    marginVertical: 5,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rideDate: {
    fontSize: 14,
    color: '#666',
  },
  ridePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  rideDetails: {
    marginBottom: 8,
  },
  rideRoute: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  rideType: {
    fontSize: 14,
    color: '#666',
  },
  rideStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedStatus: {
    backgroundColor: '#e8f5e8',
    color: '#2d5a2d',
  },
  emptyCard: {
    marginHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  optionsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  optionRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
