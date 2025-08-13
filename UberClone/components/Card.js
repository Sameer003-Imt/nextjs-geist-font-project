import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Card({ children, style }) {
  try {
    return (
      <View style={[styles.card, style]}>
        {children}
      </View>
    );
  } catch (error) {
    console.error('Card render error:', error);
    return <View style={[styles.card, style]} />;
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
});
