/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import PhoneAuthScreen from './PhoneAuthScreen';
import firebase from 'react-native-firebase';
class App extends React.Component {
  state = {
    isAuthenticated: false,
  };
  /* componentDidMount() {
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        this.setState({
          isAuthenticated: true,
        });
      })
      .catch(e => {});
  }*/
  render() {
    return <PhoneAuthScreen />;
  }
}

export default App;
