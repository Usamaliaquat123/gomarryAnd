import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modalbox';
import Api from '../../../Services/Api';
import Toast from 'react-native-root-toast';

import {Icon} from 'react-native-elements';
import styles from './forgotPasswordStyle';
import {Images, Colors} from '../../../Themes';
import CommonHeaderBack from '../../../Components/CommonHeaderBack';

class forgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      validated: true,
      isDisabled: false,
      resetDisabled: false,
    };
  }
  resetPassword = () => {
    Api.reset(this.state.email)
      .then(res => {
        Toast.show('Password is reset', {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      })
      .catch(error => {
        Toast.show(error, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      });
  };
  render() {
    return (
      <ScrollView style={{backgroundColor: 'white'}}>
        <CommonHeaderBack title="Forget Password" />
        <View style={styles.mainContainerForgot}>
          <KeyboardAwareScrollView
            style={styles.forgotForm}
            resetScrollToCoords={{x: 0, y: 0}}
            scrollEnabled={true}
            automaticallyAdjustContentInsets={false}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}>
            <View style={styles.headerLogoStyle}>
              <Image
                style={styles.mainLogoHeader}
                resizeMode="cover"
                source={Images.clearLogo}
              />
            </View>
            <Text style={styles.textStyle}> Forgot Password?</Text>
            <Text style={styles.textStyleContinue}>
              Please enter your email address below to reset your password
            </Text>
            <View style={{marginTop: 25}}>
              <TextInput
                style={[
                  styles.textInput,
                  !this.state.validated ? styles.error : null,
                ]}
                placeholder="Email"
                placeholderTextColor="#757575"
                underlineColorAndroid={'#FC3838'}
                keyboardType={'email-address'}
                autoCapitalize={'none'}
                autoCorrect={false}
                onChangeText={text => this.setState({email: text})}
                value={this.state.email}
              />
            </View>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={this.resetPassword}
              disabled={this.state.resetDisabled}>
              <LinearGradient
                colors={['#FC3838', '#F52B43', '#ED0D51']}
                start={{x: 0.7, y: 1.2}}
                end={{x: 0.0, y: 0.7}}
                style={{
                  height: 48,
                  width: 270,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 270,
                  borderRadius: 3,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  RESET PASSWORD
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
        <Modal
          style={[styles.modal, styles.modal3]}
          position={'center'}
          ref={'modal3'}
          backdrop={false}
          isDisabled={this.state.isDisabled}>
          <Icon
            type="material-community"
            size={60}
            name="check-circle"
            color={Colors.mainAppColor}
            containerStyle={{
              alignSelf: 'center',
            }}
          />
          <Text style={styles.modalText}>
            Enter the code sent to your email to reset your password
          </Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={this.modalContinue}>
            <LinearGradient
              colors={['#FC3838', '#F52B43', '#ED0D51']}
              start={{x: 0.7, y: 1.2}}
              end={{x: 0.0, y: 0.7}}
              style={{
                height: 48,
                width: 270,
                alignItems: 'center',
                justifyContent: 'center',
                width: 270,
                borderRadius: 3,
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>OK</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    );
  }
}

export default forgotPassword;
