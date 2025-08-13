import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({ title, onPress, style, textStyle, disabled = false }) {
  const handlePress = () => {
    try {
      if (onPress && !disabled) {
        onPress();
      }
    } catch (error) {
      console.error('Button press error:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        disabled && styles.disabledButton,
        style
      ]} 
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.buttonText, 
        disabled && styles.disabledText,
        textStyle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledText: {
    color: '#666',
  },
});
