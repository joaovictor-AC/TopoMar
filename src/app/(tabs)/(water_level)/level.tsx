import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function WaterLevelScreen() {
  // 1. Define your variable using useState
  // 'name' is the variable
  // 'setName' is the *only* function you use to change it
  // "User" is the default value
  const [name, setName] = useState('User');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Update Variable Manually</Text>

        {/* 2. Create the input to change the variable */}
        <TextInput
          style={styles.input}
          value={name} // The input field shows the current value of 'name'
          onChangeText={setName} // When you type, it calls setName() to update the variable
          placeholder="Enter a new value"
        />

        {/* 3. Display the variable's current value */}
        <Text style={styles.greeting}>Hello, {name}!</Text>
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  greeting: {
    marginTop: 30,
    fontSize: 22,
    color: '#333',
  },
});