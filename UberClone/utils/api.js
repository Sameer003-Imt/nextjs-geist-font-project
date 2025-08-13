// Simulated API functions for Uber Clone

export async function fetchRideOptions() {
  try {
    // Simulated API call delay
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve([
        { 
          id: 1,
          type: 'UberX', 
          price: '$12', 
          wait: '3 min',
          description: 'Affordable, everyday rides',
          capacity: '4 seats'
        },
        { 
          id: 2,
          type: 'UberXL', 
          price: '$18', 
          wait: '5 min',
          description: 'Extra space for up to 6',
          capacity: '6 seats'
        },
        { 
          id: 3,
          type: 'UberBlack', 
          price: '$28', 
          wait: '8 min',
          description: 'Premium rides with professional drivers',
          capacity: '4 seats'
        },
        { 
          id: 4,
          type: 'UberPool', 
          price: '$8', 
          wait: '6 min',
          description: 'Share your ride, split the cost',
          capacity: '2 seats'
        },
      ]), 1500)
    );
    return response;
  } catch (error) {
    console.error('Error fetching ride options:', error);
    return [];
  }
}

export async function getCurrentLocation() {
  try {
    // Simulated location data
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve({
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'San Francisco, CA'
      }), 1000)
    );
    return response;
  } catch (error) {
    console.error('Error getting current location:', error);
    return {
      latitude: 37.7749,
      longitude: -122.4194,
      address: 'Default Location'
    };
  }
}

export async function calculateRidePrice(from, to, rideType) {
  try {
    // Simulated price calculation
    const basePrice = {
      'UberX': 8,
      'UberXL': 12,
      'UberBlack': 20,
      'UberPool': 5
    };
    
    const response = await new Promise((resolve) =>
      setTimeout(() => {
        const distance = Math.random() * 10 + 2; // Random distance 2-12 miles
        const price = (basePrice[rideType] || 8) + (distance * 1.5);
        resolve({
          price: `$${Math.round(price)}`,
          distance: `${distance.toFixed(1)} miles`,
          duration: `${Math.round(distance * 3 + 5)} min`
        });
      }, 800)
    );
    return response;
  } catch (error) {
    console.error('Error calculating ride price:', error);
    return {
      price: '$10',
      distance: '5.0 miles',
      duration: '15 min'
    };
  }
}

export async function bookRide(rideDetails) {
  try {
    // Simulated ride booking
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve({
        bookingId: `UB${Date.now()}`,
        status: 'confirmed',
        driverName: 'John Doe',
        driverRating: 4.8,
        vehicleInfo: 'Toyota Camry - ABC 123',
        estimatedArrival: '3 min'
      }), 2000)
    );
    return response;
  } catch (error) {
    console.error('Error booking ride:', error);
    throw new Error('Failed to book ride. Please try again.');
  }
}

export async function getUserRideHistory() {
  try {
    // Simulated ride history
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve([
        {
          id: 1,
          date: '2024-01-15',
          from: 'Home',
          to: 'Office',
          type: 'UberX',
          price: '$12',
          status: 'completed'
        },
        {
          id: 2,
          date: '2024-01-14',
          from: 'Airport',
          to: 'Hotel',
          type: 'UberBlack',
          price: '$35',
          status: 'completed'
        },
        {
          id: 3,
          date: '2024-01-13',
          from: 'Restaurant',
          to: 'Home',
          type: 'UberX',
          price: '$8',
          status: 'completed'
        }
      ]), 1200)
    );
    return response;
  } catch (error) {
    console.error('Error fetching ride history:', error);
    return [];
  }
}

export async function validateUser(email, password) {
  try {
    // Simulated user validation
    const response = await new Promise((resolve, reject) =>
      setTimeout(() => {
        if (email && password && password.length >= 6) {
          resolve({
            success: true,
            user: {
              id: 1,
              name: 'John Smith',
              email: email,
              phone: '+1 (555) 123-4567'
            }
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1500)
    );
    return response;
  } catch (error) {
    console.error('Error validating user:', error);
    throw error;
  }
}
