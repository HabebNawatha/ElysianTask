import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { changePassword} from '@/services/api';
import * as WebBrowser from 'expo-web-browser';



WebBrowser.maybeCompleteAuthSession();

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangePassword = async () => {
    console.log("Change password button clicked");
    const userData = { email, password };
    try{
      const response = await changePassword(userData);
      console.log("Change password successful", response);
      Alert.alert('Success','Password changed successfuly! Now you can log in.');
    } catch (error : any){
      console.error('Login failed:', error);
      Alert.alert('Error', error.message || 'An error occured');
    }
  }

  const handleNaviate = () => {
    Linking.openURL('http://localhost:8081/')
      .catch((err) => console.error('Failed to ope URL:', err));
  };

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/images/elysianIcon.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Change Password</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#9E9E9E"
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#9E9E9E"
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.ChangePasswordButton} onPress={handleChangePassword}>
        <Text style={styles.ChangeButtonText}>Change Password</Text>
      </TouchableOpacity>

        <View style={styles.backToLoginButtons}>
          <TouchableOpacity style={styles.backToLoginButton} onPress={handleNaviate}>
            <Text style={styles.socialText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  logo: {
    height: 80,
    width: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#344ADB',
  },
  form: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    color: '#000',
  },
  ChangePasswordButton: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#AAA8E9',
    alignItems: 'center',
  },
  ChangeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  backToLoginButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  backToLoginButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  socialText: {
    fontWeight: 'bold',
    color: '#000',
  },
});
