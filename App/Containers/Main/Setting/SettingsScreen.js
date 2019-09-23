import React, {Component} from 'react';
import {
  BackHandler,
  TouchableOpacity,
  TextInput,
  Dimensions,
  View,
  Text,
} from 'react-native';
import Toast from 'react-native-root-toast';

import {TabView} from 'react-native-tab-view';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import {Card} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Dialog, {
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
import Api from '../../../Services/Api';
import PasswordInputText from '../../../Components/PasswordInput/PasswordInput';
import ActivityOverlay from '../../../Components/ActivityOverlay';
import CommonHeaderBack from '../../../Components/CommonHeaderBack';
// Styles
import Styles from './SettingsScreenStyle';
import {Colors} from '../../../Themes';
import {ScrollView} from 'react-native-gesture-handler';

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        {key: 'Account', title: 'Account'},
        {key: 'Membership', title: 'Membership'},
        {key: 'Notification', title: 'Notification'},
      ],

      current_Password: '',
      new_Password: '',
      repeat_Password: '',
      current_Email: '',
      new_Email: '',
      repeat_Email: '',
      loading: false,
      isDeleteDialogVisible: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
  }
  changePassword = () => {
    this.setState({loading: true});
    const {current_Password, new_Password, repeat_Password} = this.state;
    Api.changePassword(current_Password, new_Password, repeat_Password)
      .then(res => {
        this.setState({loading: false});
        Toast.show('Password Changed Successfully', {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      })
      .catch(error =>
        Toast.show(error, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        }),
      );
  };
  changeEmail = () => {
    this.setState({loading: true});
    const {current_Email, new_Email, repeat_Email} = this.state;

    Api.changeEmail(current_Email, new_Email, repeat_Email)
      .then(res => {
        this.setState({loading: false});
        Toast.show('Email Changed Successfully', {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      })
      .catch(error =>
        Toast.show(error, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        }),
      );
  };
  deleteAccount = () => {
    Api.deleteAccount()
      .then(res => {
        console.log(this.props);
        AsyncStorage.removeItem('token');
        delete global.user;
        this.props.navigation.navigate('LoginScreen');
      })
      .catch(error =>
        Toast.show(error, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        }),
      );
  };
  render() {
    const {premium, premium_until} = global.user.meta;
    if (this.state.loading == true) return <ActivityOverlay />;

    return (
      <React.Fragment>
        <CommonHeaderBack title={'Settings'} />
        <TabView
          sceneContainerStyle={{
            flex: 1,
            backgroundColor: Colors.textColor,
          }}
          navigationState={this.state}
          renderScene={({route, jumpTo}) => {
            switch (route.key) {
              case 'Account':
                return (
                  <ScrollView>
                    <Card containerStyle={Styles.cardStyle}>
                      <View>
                        <PasswordInputText
                          placeholder="Current Password"
                          style={[Styles.textInput]}
                          value={this.state.current_Password}
                          onChangeText={text =>
                            this.setState({current_Password: text})
                          }
                        />

                        <PasswordInputText
                          placeholder="New Password"
                          style={[Styles.textInput]}
                          value={this.state.new_Password}
                          onChangeText={text =>
                            this.setState({new_Password: text})
                          }
                        />

                        <PasswordInputText
                          placeholder="Repeat Password"
                          style={[Styles.textInput]}
                          value={this.state.repeat_Password}
                          onChangeText={text =>
                            this.setState({repeat_Password: text})
                          }
                        />
                        <TouchableOpacity
                          style={Styles.TouchableOpacity}
                          onPress={this.changePassword}>
                          <LinearGradient
                            colors={['#FC3838', '#F52B43', '#ED0D51']}
                            start={{x: 0.7, y: 1.2}}
                            end={{x: 0.0, y: 0.7}}
                            style={Styles.linear}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>
                              Change Password
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </Card>
                    <Card containerStyle={Styles.cardStyle}>
                      <View>
                        <TextInput
                          style={[Styles.textInput]}
                          placeholder="Current Email Address"
                          placeholderTextColor={Colors.secondaryColor}
                          underlineColorAndroid={Colors.mainAppColor}
                          autoCapitalize={'none'}
                          autoCorrect={false}
                          onChangeText={text =>
                            this.setState({current_Email: text})
                          }
                          value={this.state.current_Email}
                        />
                        <TextInput
                          style={[Styles.textInput]}
                          placeholder="New Email Address"
                          placeholderTextColor={Colors.secondaryColor}
                          underlineColorAndroid={Colors.mainAppColor}
                          autoCapitalize={'none'}
                          autoCorrect={false}
                          onChangeText={text =>
                            this.setState({new_Email: text})
                          }
                          value={this.state.new_Email}
                        />
                        <TextInput
                          style={[Styles.textInput]}
                          placeholder="Repeat Email Address"
                          placeholderTextColor={Colors.secondaryColor}
                          underlineColorAndroid={Colors.mainAppColor}
                          autoCapitalize={'none'}
                          autoCorrect={false}
                          onChangeText={text =>
                            this.setState({repeat_Email: text})
                          }
                          value={this.state.repeat_Email}
                        />
                        <TouchableOpacity
                          style={Styles.TouchableOpacity}
                          onPress={this.changeEmail}>
                          <LinearGradient
                            colors={['#FC3838', '#F52B43', '#ED0D51']}
                            start={{x: 0.7, y: 1.2}}
                            end={{x: 0.0, y: 0.7}}
                            style={Styles.linear}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>
                              Change Email Address
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </Card>
                    <Card containerStyle={{marginBottom: 50, borderRadius: 8}}>
                      <Text
                        style={{
                          color: Colors.mainAppColor,
                          justifyContent: 'center',
                          textAlign: 'center',
                        }}>
                        Once you delete your account you will be logged out
                      </Text>
                      <TouchableOpacity
                        style={Styles.TouchableOpacity}
                        onPress={() => {
                          this.setState({isDeleteDialogVisible: true});
                        }}>
                        <LinearGradient
                          colors={['#FC3838', '#F52B43', '#ED0D51']}
                          start={{x: 0.7, y: 1.2}}
                          end={{x: 0.0, y: 0.7}}
                          style={Styles.linear}>
                          <Text style={{color: 'white', fontWeight: 'bold'}}>
                            Delete Account
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <Dialog
                        width={0.6}
                        visible={this.state.isDeleteDialogVisible}
                        dialogTitle={
                          <DialogTitle
                            textStyle={Styles.DialogTitle}
                            title="Confirmation"
                          />
                        }
                        footer={
                          <DialogFooter>
                            <DialogButton
                              textStyle={Styles.DialogTitle}
                              text="CANCEL"
                              onPress={() =>
                                this.setState({isDeleteDialogVisible: false})
                              }
                            />
                            <DialogButton
                              textStyle={Styles.DialogTitle}
                              text="DELETE"
                              onPress={() => {
                                this.setState({isDeleteDialogVisible: false});
                                this.deleteAccount();
                              }}
                            />
                          </DialogFooter>
                        }>
                        <DialogContent>
                          <View
                            style={{
                              flex: 1,
                              margin: 10,
                              alignItems: 'center',
                            }}>
                            <Text style={Styles.textTitle}>Are you Sure?</Text>
                          </View>
                        </DialogContent>
                      </Dialog>
                    </Card>
                  </ScrollView>
                );
              case 'Membership':
                return (
                  <ScrollView>
                    {premium != 1 && (
                      <Card containerStyle={Styles.cardStyle}>
                        <Text style={Styles.warningText}>
                          You have no active subscriptions
                        </Text>
                      </Card>
                    )}
                    {premium == 1 && (
                      <Card containerStyle={Styles.cardStyle}>
                        <Text style={Styles.warningText}>Premium Until </Text>
                        <Text
                          style={[Styles.warningText, {color: Colors.banner}]}>
                          {moment(premium_until).format('MMM Do YYYY')}{' '}
                        </Text>
                      </Card>
                    )}
                  </ScrollView>
                );
              // case "Notification":
              //   return <View />;
            }
          }}
          onIndexChange={index => this.setState({index})}
          initialLayout={{width: Dimensions.get('window').width}}
        />
      </React.Fragment>
    );
  }
}
