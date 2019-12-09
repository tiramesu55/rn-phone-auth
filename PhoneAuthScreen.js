import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Button,
  TextInput,
} from 'react-native';
import firebase from 'react-native-firebase';

class PhoneAuthScreen extends Component {
  state = {
    phone: '+16505553434',
    message: '',
    confirmResult: null,
    verificationCode: '',
    user: null,
  };
  componentDidMount() {
    if (Platform.OS !== 'ios') {
      this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log( user)
          this.setState({user: user});
        } else {
          // User has been signed out, reset the state
          this.setState({
            user: null,
            message: '',
            codeInput: '',
            phoneNumber: '+16505553434',
            confirmResult: null,
          });
        }
      });
    }
  }
  componentWillUnmount() {
    if (Platform.OS !== 'ios') {
      if (this.unsubscribe) this.unsubscribe();
    }
  }

  validatePhoneNumber = () => {
    var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
    return regexp.test(this.state.phone);
  };
  signOut = () => {
    firebase.auth().signOut();
  }
  handleSendCode = () => {
    // Request to send OTP
    if (this.validatePhoneNumber()) {
      this.setState({message: 'Sending code ...'});
      const prom = firebase.auth().signInWithPhoneNumber(this.state.phone);
      console.log(prom);
      prom
        .then(confirmResult => {
          console.log('should be good')
          this.setState({confirmResult});
        })
        .catch(error => {
          console.log('err')
          alert(error.message);

          console.log(error);
        });
    } else {
      alert('Invalid Phone Number');
    }
  };

  changePhoneNumber = () => {
    this.setState({confirmResult: null, verificationCode: ''});
  };

  handleVerifyCode = () => {
    console.log('button');
    const {confirmResult, verificationCode} = this.state;
    if (verificationCode.length == 6) {
      confirmResult
        .confirm(verificationCode)
        .then(user => {
          this.setState({user: user, message: 'code Confirmed'});
          alert(`Verified! ${user.uid}`);
        })
        .catch(error => {
          this.setState({message: `Code Confirm Error: ${error.message}`});
          alert(error.message);
          console.log(error);
        });
    } else {
      alert('Please enter a 6 digit OTP code.');
    }
  };

  renderConfirmationCodeView = () => {
    return (
      <View style={styles.verificationView}>
        <TextInput
          style={styles.textInput}
          placeholder="Verification code"
          placeholderTextColor="#eee"
          value={this.state.verificationCode}
          keyboardType="numeric"
          onChangeText={verificationCode => {
            this.setState({verificationCode});
          }}
          maxLength={6}
        />
        <TouchableOpacity
          style={[styles.themeButton, {marginTop: 20}]}
          onPress={this.handleVerifyCode}>
          <Text style={styles.themeButtonTitle}>Verify Code</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={[styles.container]}>
        <View style={styles.page}>
          <TextInput
            style={styles.textInput}
            placeholder="Phone Number with country code"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={this.state.phone}
            onChangeText={p => {
              this.setState({phone: p});
            }}
            maxLength={15}
            editable={this.state.confirmResult ? false : true}
          />

          <TouchableOpacity
            style={[styles.themeButton, {marginTop: 20}]}
            onPress={
              this.state.confirmResult
                ? this.changePhoneNumber
                : this.handleSendCode
            }>
            <Text style={styles.themeButtonTitle}>
              {this.state.confirmResult ? 'Change Phone Number' : 'Send Code'}
            </Text>
          </TouchableOpacity>

          {this.state.confirmResult ? this.renderConfirmationCodeView() : null}
          <Button title="Sign Out" color="red" onPress={this.signOut} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aaa',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    marginTop: 20,
    width: '90%',
    height: 40,
    borderColor: '#555',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    color: '#fff',
    fontSize: 16,
  },
  themeButton: {
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#888',
    borderColor: '#555',
    borderWidth: 2,
    borderRadius: 5,
  },
  themeButtonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  verificationView: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },
});

export default PhoneAuthScreen;
