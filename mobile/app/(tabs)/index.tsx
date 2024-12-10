import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { facebookLogin, forgotPassowrd, googleLogin, loginUser,registerUser } from '@/services/api';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-facebook';



WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {

  const[request,response,promptAsync] = Google.useAuthRequest({
    clientId:process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId:process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId:process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });
  
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Google Login Success:', authentication);
    }
  }, [response]);


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleLogin = async () => {
    console.log("Login button clicked");

    const loginData = {email,password};
    try{
      const response = await loginUser(loginData);
      console.log('Login Success:',response);
      Alert.alert('Success','Login successful!');
    } catch (error : any) {
      console.error('Login failed:', error);
      Alert.alert('Error','Login failed! Please check your credentails');
    }
  }

  const handleForgotPassword = async () => {
    console.log("Forgot password button clicked");
    try{
      const response = await forgotPassowrd(email);
      console.log("Forgot password successful", response);
      Alert.alert('Success','Email sent successfuly');
    } catch (error:any){
      console.error("Forgot password failed", error);
      Alert.alert('Error', error.response?.data?.message || "An unknown error occurred.")
    }
  }

  const handleGoogleLogin = async () => {
    if(request){
      await promptAsync();
    } else {
      Alert.alert('Google Login not ready');
    }
  }

  const handleFacebookLogin = async () => {
    try {
      if (Facebook && Facebook.initializeAsync) {
        await Facebook.initializeAsync({
          appId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
        });
      } else {
        console.error("Facebook SDK is not properly loaded.");
      }
      const result = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });

      console.log("Facebook Login Result:", result);

      if (result.type == 'success') {
        const userId = await Facebook.getUserIDAsync();
        console.log("Facebook login successful", userId);

        const response = await facebookLogin(result.token);
        const userData = await response.json;
        setUserInfo(userData);
        console.log("user data:", userData);
      } else {
        Alert.alert('Facebook login failed', 'Please try again.');
      }
    } catch (error : any) {
      console.error('Facebook login error:', error);
      Alert.alert('An error occurred during login', error.message || 'Unknown error');
    }
  }

  const handleRegister = async () => {
    console.log("Register button clicked");
    const registerData = { email, password };
    try{
      const response = await registerUser(registerData);
      console.log("Register successful", response);
      Alert.alert('Success','Account created successfuly! Now you can log in.');
    } catch (error : any){
      console.error('Login failed:', error);
      Alert.alert('Error', error.message || 'An error occured');
    }
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
