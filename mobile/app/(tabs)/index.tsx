import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { loginUser } from '@/services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log("Login button clicked");
    try{
      const loginData = {email,password};
      const response = await loginUser(loginData);
      console.log('Login Success:',response);
    } catch (error : any) {
      console.error('Login failed:', error);
      Alert.alert('Login Failed', error.message || 'An error occured');
    }
  }

  const handleForgotPassword = () => {
    console.log("Forgot password button clicked");
  }

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  }

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
  }

  const handleRegister = () => {
    console.log("Register button clicked");
  }

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/images/elysianIcon.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Log in</Text>

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
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      <View style={styles.socialLogin}>
        <Text style={styles.orText}>Or</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.register}>
        <Text style={styles.noAccountText}>Have no account yet?</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerText}>Register</Text>
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
  forgotPassword: {
    textAlign: 'right',
    color: '#344ADB',
    marginBottom: 16,
  },
  loginButton: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#AAA8E9',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  socialLogin: {
    alignItems: 'center',
    marginVertical: 16,
  },
  orText: {
    marginBottom: 8,
    color: '#9E9E9E',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  socialButton: {
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
  register: {
    flexDirection: 'row',
    marginTop: 16,
  },
  noAccountText: {
    color: '#9E9E9E',
  },
  registerText: {
    marginLeft: 4,
    color: '#344ADB',
    fontWeight: 'bold',
  },
});
