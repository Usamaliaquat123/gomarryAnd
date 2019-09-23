import React, {Component} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-root-toast';

import ProgressBar from 'react-native-progress/Bar';
import {NavigationActions} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import PasswordInputText from '../../../Components/PasswordInput/PasswordInput';
import Api from '../../../Services/Api';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker';

import tus from 'tus-js-client';
import ImagePicker from 'react-native-image-picker';

import {ViewPager} from 'rn-viewpager';
import {Icon} from 'react-native-elements';
import {Images, Colors, Fonts, Json} from '../../../Themes';
import StepIndicator from 'react-native-step-indicator';
import Modal from 'react-native-modalbox';
import AnimatedLoader from 'react-native-animated-loader';
// Styles
import styles from './SignupScreenStyle';
import {Image} from 'react-native';
import {stepIdicator} from '../../../Components/ConstantList';
import CommonHeaderBack from '../../../Components/CommonHeaderBack';

export default class SignupScreen extends Component {
  constructor(props) {
    super(props);

    // this._renderPage = this._renderPage.bind(this);
    this.state = {
      //date
      chosenDate: new Date(),
      currentPage: 0,
      // Step 0
      iconVisible: false,
      hearAboutUs: '',
      lookingFor: '',
      gender: null,
      year: null,
      month: null,
      day: null,
      email: props.navigation.state.params.Email
        ? props.navigation.state.params.Email
        : null,
      password: null,
      discovery: null,
      // Step 1
      username: '',
      userTitle: '',
      // Step 2
      locationSuggestions: '',
      searchResult: '',
      //  ==> Personal Sections
      personalQueries: true,

      locationVisible: false,
      locationId: null,
      locationName: null,
      userCurrentImage: '',
      modalAlert: false,
      errMsg: '',

      //stage 3
      uploadedBytes: 0,
      totalBytes: 0,
      file: null,
      status: 'no file selected',
    };
  }

  setDate = newDate => {
    let {chosenDate} = this.state;
    this.setState({
      chosenDate: newDate,
      day: moment(chosenDate).format('d'),
      year: moment(chosenDate).format('YYYY'),
      month: moment(chosenDate).format('MM'),
    });
  };

  componentWillMount() {
    let currentPage = this.props.navigation.state.params.currentPage;
    if (currentPage == 0) {
      this.setState({currentPage: 0});
      AsyncStorage.removeItem('token');
    }
    this.setState({currentPage});
  }

  // //////////////////////////////////////////////////////////////////////////

  // Upload image to tus client

  ////////////////////////////////////////////////////////////////////////////

  uploadImageThroughTusClient = async () => {
    const {file} = this.state;
    this.refs.lert.open();
    const upload = new tus.Upload(file, {
      headers: {'X-Auth-Token': token},
      endpoint: `${Api._base}/api/uploadPicture`, // use goMarry tus server endpoint instead
      retryDelays: [0, 1000, 3000, 5000],
      metadata: {
        filename: file.fileName,
        filetype: file.filetype,
      },
      onError: error => {
        this.setState({
          status: `upload failed ${error}`,
        });
        Toast.show(error, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      },
      onProgress: (uploadedBytes, totalBytes) => {
        this.setState({
          totalBytes: totalBytes,
          uploadedBytes: uploadedBytes,
          progress: uploadedBytes / totalBytes,
        });
      },
      onSuccess: () => {
        this.setState({
          status: 'upload finished',
        });
        this.refs.lert.close();
        Toast.show(`Uploading is done`, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
        Api.completeSignupStage3()
          .then(data => {
            this.refs.congragulationsAlert.open();
          })
          .catch(error =>
            Toast.show(error, {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            }),
          );
      },
    });
    upload.start();
  };

  openImagePicker = async () => {
    ImagePicker.openPicker({}, result => {
      if (!result.cancelled) {
        if (result.type === 'image/jpeg')
          this.setState({file: result, userCurrentImage: result.uri});
        else
          Toast.show(`Please Select Image`, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
          });
      }
    }).catch(err => {
      Toast.show(err, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
    });
  };
  // //////////////////////////////////////////////////////////////////////////

  // ------------- //

  ////////////////////////////////////////////////////////////////////////////

  firstHandlePressNext = () => {
    this.setState({iconVisible: true});
    try {
      const {gender, month, day, year, email, password, discovery} = this.state;
      Api.register(gender, month, day, year, email, password, discovery)
        .then(async data => {
          if (global.token) {
            this.setState({iconVisible: false, currentPage: 1});
          } else {
            this.setState({iconVisible: false});
            Toast.show(
              'You may type worng credientials or you may need to restart your app ',
              {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
              },
            );
          }
        })
        .catch(error => {
          Toast.show(error, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
          });
        })
        .finally(() => {
          this.setState({iconVisible: false});
        });
    } catch (error) {
      Toast.show(error, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
    }
  };

  SecondHandlePressNext = () => {
    try {
      if (this.state.username != '' || this.state.userTitle != '') {
        this.setState({iconVisible: true});
        Api.completeSignupStage1(this.state.username, this.state.userTitle)
          .then(() => {
            this.setState({iconVisible: false});
            global.user.meta.username = this.state.username;
            global.user.meta.tagline = this.state.userTitle;
            this.props.navigation.navigate('SignupStage2Screen');
          })
          .catch(error => {
            Toast.show(error, {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            }),
              this.setState({iconVisible: false});
          })
          .finally(() => {
            this.setState({iconVisible: false});
          });
      } else {
        Toast.show('Type username and tagname', {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch (error) {
      Toast.show(error, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
    }
  };

  async signupCompleteScreenClicked() {
    this.setState({currentPage: 3});
  }

  render() {
    const {currentPage, userCurrentImage} = this.state;
    return (
      <>
        <CommonHeaderBack logout={true} />

        <ScrollView
          style={{backgroundColor: 'white'}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.containerSignup}>
            <KeyboardAwareScrollView style={styles.form}>
              <View style={{marginTop: 10}}>
                <StepIndicator
                  customStyles={stepIdicator}
                  currentPosition={currentPage}
                  stepCount={6}
                />
              </View>

              <ViewPager
                style={{flexGrow: 1}}
                ref={viewPager => {
                  this.viewPager = viewPager;
                }}
                onPageSelected={page => {
                  this.setState({currentPage: page.position});
                }}
                // renderPage={this._renderPage}
              />
              <View style={[styles.headerLogoStyle]}>
                <Image
                  source={Images.clearLogo}
                  style={styles.mainLogoHeader}
                  resizeMode="cover"
                  source={Images.clearLogo}
                />
              </View>

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

              {currentPage == 0 && (
                <View>
                  <Text style={styles.heading}>
                    Type Your basic information and continue to next step
                  </Text>

                  <RNPickerSelect
                    style={pickerSelectStyles}
                    placeholder={{label: "I'm Looking For", value: ''}}
                    onValueChange={value => this.setState({gender: value})}
                    items={[
                      {label: 'A man seeking a wife', value: 1},
                      {label: 'A woman seeking a husband', value: '2'},
                    ]}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      margin: 15,
                    }}>
                    <Text
                      style={[
                        {
                          alignSelf: 'center',
                          textAlign: 'center',
                          fontFamily: Fonts.LatoBold,
                          fontSize: 18,
                        },
                      ]}>
                      I was born in
                    </Text>
                    <DatePicker
                      date={this.state.chosenDate}
                      mode="date"
                      placeholder="select date"
                      format="YYYY-MM-DD"
                      // minDate="2016-05-01"
                      maxDate={new Date()}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          left: 0,
                          top: 4,
                          marginLeft: 0,
                        },
                        dateInput: {
                          marginLeft: 36,
                        },
                        // ... You can check the source to find the other keys.
                      }}
                      onDateChange={this.setDate}
                    />
                  </View>
                  <TextInput
                    style={[
                      styles.textInput,
                      !this.state.validated ? styles.error : null,
                    ]}
                    placeholder="Email"
                    placeholderTextColor="#757575"
                    keyboardType={'email-address'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onChangeText={email => this.setState({email})}
                    value={this.state.email}
                  />
                  <PasswordInputText
                    placeholder={'*******'}
                    style={[
                      styles.textInput,
                      !this.state.passwordvalidation ? styles.error : null,
                    ]}
                    value={this.state.password}
                    onChangeText={password => this.setState({password})}
                  />

                  <RNPickerSelect
                    style={pickerSelectStyles}
                    placeholder={{
                      label: 'How did you hear about us',
                      value: '',
                    }}
                    onValueChange={value => this.setState({gender: value})}
                    items={[
                      {label: 'How did you hear about us', value: ''},
                      {label: 'Friend', value: 'friend'},
                      {label: 'Social', value: 'social'},
                      {label: 'Search', value: 'search'},
                      {label: 'Adwords', value: 'adwords'},
                      {label: 'Youtube', value: 'youtube'},
                      {label: 'Radio', value: 'radio'},
                      {label: 'Press', value: 'press'},
                      {label: 'Other', value: 'other'},
                    ]}
                  />
                  <TouchableOpacity
                    style={styles.signupButton}
                    onPress={this.firstHandlePressNext}>
                    <LinearGradient
                      colors={['#FC3838', '#F52B43', '#ED0D51']}
                      start={{x: 0.7, y: 1.2}}
                      end={{x: 0.0, y: 0.7}}
                      style={styles.LinearGradient}>
                      <Text style={styles.LinearGradientText}>
                        Continue to the next step
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {currentPage == 1 &&
                this.props.navigation.navigate('VerifyEmail', {
                  Email: this.state.email,
                })}

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

              {currentPage == 2 && (
                <View>
                  <View>
                    <Text style={styles.heading}>
                      Your account has been created. You are now able to sign
                      in, but to use your account, you need to fill in your
                      profile. Hit next, and we will walk you through the steps
                      to continue setting up your account.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.signupButton}
                    onPress={() => this.signupCompleteScreenClicked()}>
                    <LinearGradient
                      colors={['#FC3838', '#F52B43', '#ED0D51']}
                      start={{x: 0.7, y: 1.2}}
                      end={{x: 0.0, y: 0.7}}
                      style={styles.LinearGradient}>
                      <Text style={styles.LinearGradientText}>
                        Setting up your profile..!
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {currentPage == 3 && (
                <View>
                  <Text style={styles.heading}>
                    Now it's time to add your username
                  </Text>
                  <TextInput
                    style={[
                      styles.textInputOfUserName,
                      !this.state.validated ? styles.error : null,
                    ]}
                    placeholder="Username"
                    placeholderTextColor="#757575"
                    underlineColorAndroid={Colors.mainAppColor}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onChangeText={username => this.setState({username})}
                    value={this.state.username}
                  />
                  <Text style={[styles.heading, {marginTop: 10}]}>
                    Say something to grap people attention
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      !this.state.validated ? styles.error : null,
                    ]}
                    placeholder="Say something about your title"
                    placeholderTextColor="#757575"
                    underlineColorAndroid={Colors.mainAppColor}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onChangeText={userTitle => this.setState({userTitle})}
                    value={this.state.userTitle}
                  />
                  <View>
                    <TouchableOpacity
                      style={styles.signupButton}
                      onPress={this.SecondHandlePressNext}>
                      <LinearGradient
                        colors={['#FC3838', '#F52B43', '#ED0D51']}
                        start={{x: 0.7, y: 1.2}}
                        end={{x: 0.0, y: 0.7}}
                        style={styles.LinearGradient}>
                        <Text style={styles.LinearGradientText}>
                          Continue to the next step
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {currentPage == 5 && (
                <View>
                  {/* Imager Picker Circle  */}

                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <TouchableOpacity onPress={() => this.openImagePicker()}>
                      <Image
                        style={{
                          height: 200,
                          width: 200,
                          borderRadius: 100,
                          marginBottom: 20,
                        }}
                        resizeMode="cover"
                        source={
                          userCurrentImage == ''
                            ? Images.uploadProfile
                            : {uri: userCurrentImage}
                        }
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.signupButton, {marginTop: 80}]}
                      onPress={() => {
                        if (userCurrentImage != '') {
                          this.uploadImageThroughTusClient();
                        } else {
                          this.openImagePicker();
                        }
                      }}>
                      <LinearGradient
                        colors={['#FC3838', '#F52B43', '#ED0D51']}
                        start={{x: 0.7, y: 1.2}}
                        end={{x: 0.0, y: 0.7}}
                        style={styles.LinearGradient}>
                        <Text style={styles.LinearGradientText}>
                          Upload your photo
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <View style={{marginTop: 15}} />
                  </View>
                </View>
              )}
            </KeyboardAwareScrollView>
          </View>

          {/* uploading */}
          <Modal
            style={[styles.errAlert, styles.errAlert3]}
            position={'center'}
            ref={'lert'}
            backdrop={true}
            coverScreen={true}
            backdropPressToClose={false}>
            <View>
              <View style={{alignItems: 'center'}}>
                <Icon
                  type="simple-line-icon"
                  name="arrow-up-circle"
                  size={50}
                  color={'#00FF00'}
                />
              </View>
              <View style={{alignItems: 'center', margin: 10}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.app_font,
                    fontSize: 14,
                  }}>
                  Status: {this.state.status}
                </Text>
              </View>
              <View style={{marginTop: 10, alignItems: 'center'}}>
                <ProgressBar
                  progress={this.state.progress}
                  color="#00FF00"
                  unfilledColor="rgba(255,255,255,.5)"
                  borderColor="#00FF00"
                  width={250}
                  height={20}
                />
              </View>
            </View>
          </Modal>

          {/* Level 3 : last popup */}
          <Modal
            style={[styles.errAlert, styles.errAlert3]}
            position={'center'}
            ref={'congragulationsAlert'}
            backdrop={true}
            coverScreen={true}
            backdropPressToClose={false}>
            <View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  type="entypo"
                  name="heart-outlined"
                  size={50}
                  color={Colors.mainAppColor}
                />
              </View>
              <View style={{paddingLeft: 20, paddingRight: 10, paddingTop: 15}}>
                <Text style={{textAlign: 'center', fontSize: 16}}>
                  Congragulations ! You sucessfully registered you profile
                </Text>
              </View>
              <View style={{marginTop: 10}}>
                <Text
                  onPress={() =>
                    this.props.navigation.reset(
                      [
                        NavigationActions.navigate({
                          routeName: 'HomeNavigation',
                        }),
                      ],
                      0,
                    )
                  }
                  style={{
                    color: Colors.mainAppColor,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: Fonts.app_font,

                    fontSize: 20,
                  }}>
                  Let Start !!
                </Text>
              </View>
            </View>
          </Modal>

          <View>
            <AnimatedLoader
              visible={this.state.iconVisible}
              source={Json.like}
              animationStyle={styles.lottie}
            />
          </View>
        </ScrollView>
      </>
    );
  }
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
