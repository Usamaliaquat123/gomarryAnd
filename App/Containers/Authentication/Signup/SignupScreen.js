import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  DatePickerIOS,
  DatePickerAndroid,
  Platform,
  ToastAndroid,
  Picker
} from "react-native";
import ProgressBar from "react-native-progress/Bar";
import { NavigationActions } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import PasswordInputText from "../../../Components/PasswordInput/PasswordInput";
import Api from "../../../Services/Api";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Feather from "react-native-vector-icons/Feather";
import ImagePicker from "react-native-image-crop-picker";

import { ViewPager } from "rn-viewpager";
import { Icon } from "react-native-elements";
import { Images, Colors, Fonts, Json } from "../../../Themes";
import StepIndicator from "react-native-step-indicator";
import Modal from "react-native-modalbox";
import { Upload } from "react-native-tus-client";
import ActionSheet from "react-native-actionsheet";
import AnimatedLoader from "react-native-animated-loader";
// Styles
import styles from "./SignupScreenStyle";
import { Image } from "react-native";
import { stepIdicator } from "../../../Components/ConstantList";
import CommonHeaderBack from "../../../Components/CommonHeaderBack";

const optionsOfImageType = [
  <Feather
    name="image"
    size={20}
    color={Colors.mainAppColor}
    style={styles.actionIcon}
  >
    <Text style={styles.actionText}>Select Image</Text>
  </Feather>,
  <Feather
    name="camera"
    size={20}
    color={Colors.mainAppColor}
    style={styles.actionIcon}
  >
    <Text style={styles.actionText}>Camera</Text>
  </Feather>
];
export default class SignupScreen extends Component {
  constructor(props) {
    super(props);

    // this._renderPage = this._renderPage.bind(this);
    this.state = {
      //date
      chosenDate: new Date(),
      androidDate: "",
      currentPage: 0,
      // Step 0
      iconVisible: false,
      hearAboutUs: "",
      lookingFor: "",
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
      username: "",
      userTitle: "",
      // Step 2
      locationSuggestions: "",
      searchResult: "",
      //  ==> Personal Sections
      personalQueries: true,

      locationVisible: false,
      locationId: null,
      locationName: null,
      userCurrentImage: "",
      modalAlert: false,
      errMsg: "",

      //stage 3
      uploadedBytes: 0,
      totalBytes: 0,
      status: "no file selected"
    };
  }

  setDate(newDate) {
    this.setState({
      chosenDate: newDate,
      day: moment(chosenDate).format("d"),
      year: moment(chosenDate).format("YYYY"),
      month: moment(chosenDate).format("MM")
    });
  }

  setDateAndroid = async () => {
    let date = new Date();
    let validDate = moment(date).format("YYYY") - 18;
    console.log(validDate);
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: date,

        maxDate: new Date(validDate, 11, 31)
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({
          androidDate: `${day}/${month + 1}/${year}`,
          day,
          month: month + 1,
          year
        });
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  componentWillMount() {
    let currentPage = this.props.navigation.state.params.currentPage;
    if (currentPage == 0) {
      this.setState({ currentPage: 0 });
      AsyncStorage.removeItem("token");
    }
    this.setState({ currentPage });
  }

  // //////////////////////////////////////////////////////////////////////////

  // Upload image to tus client

  ////////////////////////////////////////////////////////////////////////////

  uploadImageThroughTusClient = async () => {
    this.refs.lert.open();

    const file = this.state.userCurrentImage.substr(8);
    const extension = this.getFileExtension(file);

    const upload = new Upload(file, {
      headers: { "X-Auth-Token": token },
      endpoint: `${Api._base}/api/uploadPicture`, // use goMarry tus server endpoint instead
      retryDelays: [0, 1000, 3000, 5000],
      metadata: {
        filename: `${new Date().valueOf()}.${extension}`,
        filetype: this.getMimeType(extension)
      },
      onError: error => {
        this.setState({
          status: `upload failed ${error}`
        });
        ImagePicker.clean();

        ToastAndroid.show(
          `Something is wrong please try again`,
          ToastAndroid.LONG
        );
      },
      onProgress: (uploadedBytes, totalBytes) => {
        this.setState({
          totalBytes: totalBytes,
          uploadedBytes: uploadedBytes,
          progress: uploadedBytes / totalBytes
        });
      },
      onSuccess: () => {
        this.setState({
          status: "upload finished"
        });
        ImagePicker.clean();
        this.refs.lert.close();

        ToastAndroid.show(`Uploading is done`, ToastAndroid.LONG);
        Api.completeSignupStage3()
          .then(data => {
            this.refs.congragulationsAlert.open();
          })
          .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
      }
    });
    upload.start();
  };

  getFileExtension(uri) {
    const match = /\.([a-zA-Z]+)$/.exec(uri);
    if (match !== null) {
      return match[1];
    }
    return "";
  }

  getMimeType(extension) {
    if (extension === "jpg") return "image/jpeg";
    return `image/${extension}`;
  }

  openImagePickerAndCropper = async () => {
    ImagePicker.openPicker({})
      .then(result => {
        if (!result.cancelled) {
          if (result.mime === "image/jpeg")
            this.setState({ userCurrentImage: result.path });
          else ToastAndroid.show(`Please Select Image`, ToastAndroid.LONG);
        }
      })
      .catch(err => {
        console.log(err.toString());
      });
  };

  caprtureImageAndCropper = async () => {
    ImagePicker.openCamera({})
      .then(result => {
        if (!result.cancelled) {
          if (result.mime === "image/jpeg")
            this.setState({ userCurrentImage: result.path });
          else ToastAndroid.show(`Please Select Image`, ToastAndroid.LONG);
        }
      })
      .catch(err => {
        console.log(err.toString());
      });
  };
  // //////////////////////////////////////////////////////////////////////////

  // ------------- //

  ////////////////////////////////////////////////////////////////////////////

  firstHandlePressNext = () => {
    this.setState({ iconVisible: true });
    try {
      const {
        gender,
        month,
        day,
        year,
        email,
        password,
        discovery
      } = this.state;
      Api.register(gender, month, day, year, email, password, discovery)
        .then(async data => {
          if (global.token) {
            this.setState({ iconVisible: false, currentPage: 1 });
          } else {
            this.setState({ iconVisible: false });
            ToastAndroid.show(
              "You may type worng credientials or you may need to restart your app ",
              ToastAndroid.LONG
            );
          }
        })
        .catch(error => {
          ToastAndroid.show(error, ToastAndroid.LONG);
        })
        .finally(() => {
          this.setState({ iconVisible: false });
        });
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
    }
  };

  SecondHandlePressNext = () => {
    try {
      if (this.state.username != "" || this.state.userTitle != "") {
        this.setState({ iconVisible: true });
        Api.completeSignupStage1(this.state.username, this.state.userTitle)
          .then(() => {
            this.setState({ iconVisible: false });
            global.user.meta.username = this.state.username;
            global.user.meta.tagline = this.state.userTitle;
            this.props.navigation.navigate("SignupStage2Screen");
          })
          .catch(error => {
            ToastAndroid.show(error, ToastAndroid.LONG);
            this.setState({ iconVisible: false });
          })
          .finally(() => {
            this.setState({ iconVisible: false });
          });
      } else {
        ToastAndroid.show("Type username and tagname", ToastAndroid.LONG);
      }
    } catch (e) {
      ToastAndroid.show(e, ToastAndroid.LONG);
    }
  };

  async signupCompleteScreenClicked() {
    this.setState({ currentPage: 3 });
  }

  render() {
    const { androidDate, currentPage, userCurrentImage } = this.state;
    return (
      <>
        <CommonHeaderBack logout={true} />

        <ScrollView
          style={{ backgroundColor: "white" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.containerSignup}>
            <KeyboardAwareScrollView style={styles.form}>
              <View style={{ marginTop: 10 }}>
                <StepIndicator
                  customStyles={stepIdicator}
                  currentPosition={currentPage}
                  stepCount={6}
                />
              </View>

              <ViewPager
                style={{ flexGrow: 1 }}
                ref={viewPager => {
                  this.viewPager = viewPager;
                }}
                onPageSelected={page => {
                  this.setState({ currentPage: page.position });
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
                  <View style={styles.InputView}>
                    <Picker
                      selectedValue={this.state.gender}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ gender: itemValue })
                      }
                    >
                      <Picker.Item label="I'm Looking For" value="" />
                      <Picker.Item label="A man seeking a wife" value="1" />
                      <Picker.Item
                        label="A woman seeking a husband"
                        value="2"
                      />
                    </Picker>
                  </View>

                  {Platform.OS === "ios" ? (
                    <DatePickerIOS
                      date={chosenDate}
                      onDateChange={this.setDate}
                    />
                  ) : (
                    <View style={styles.dateView}>
                      <Text
                        style={[{ fontFamily: Fonts.LatoBold, fontSize: 18 }]}
                      >
                        {androidDate === "" ? "I was born in" : androidDate}
                      </Text>
                      <Icon
                        name="calendar"
                        type="simple-line-icon"
                        size={30}
                        color={Colors.mainAppColor}
                        onPress={() => this.setDateAndroid()}
                      />
                    </View>
                  )}
                  <TextInput
                    style={[
                      styles.textInput,
                      !this.state.validated ? styles.error : null
                    ]}
                    placeholder="Email"
                    placeholderTextColor="#757575"
                    underlineColorAndroid={Colors.mainAppColor}
                    keyboardType={"email-address"}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                  />
                  <PasswordInputText
                    placeholder={"*******"}
                    style={[
                      styles.textInput,
                      !this.state.passwordvalidation ? styles.error : null
                    ]}
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                  />

                  <View style={styles.InputView}>
                    <Picker
                      selectedValue={this.state.discovery}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ discovery: itemValue })
                      }
                    >
                      <Picker.Item label="How did you hear about us" value="" />
                      <Picker.Item label="Friend" value="friend" />
                      <Picker.Item label="Social" value="social" />
                      <Picker.Item label="Search" value="search" />
                      <Picker.Item label="Adwords" value="adwords" />
                      <Picker.Item label="Youtube" value="youtube" />
                      <Picker.Item label="Radio" value="radio" />
                      <Picker.Item label="Press" value="press" />
                      <Picker.Item label="Other" value="other" />
                    </Picker>
                  </View>
                  <TouchableOpacity
                    style={styles.signupButton}
                    onPress={this.firstHandlePressNext}
                  >
                    <LinearGradient
                      colors={["#FC3838", "#F52B43", "#ED0D51"]}
                      start={{ x: 0.7, y: 1.2 }}
                      end={{ x: 0.0, y: 0.7 }}
                      style={styles.LinearGradient}
                    >
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
                this.props.navigation.navigate("VerifyEmail", {
                  Email: this.state.email
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
                    onPress={() => this.signupCompleteScreenClicked()}
                  >
                    <LinearGradient
                      colors={["#FC3838", "#F52B43", "#ED0D51"]}
                      start={{ x: 0.7, y: 1.2 }}
                      end={{ x: 0.0, y: 0.7 }}
                      style={styles.LinearGradient}
                    >
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
                      !this.state.validated ? styles.error : null
                    ]}
                    placeholder="Username"
                    placeholderTextColor="#757575"
                    underlineColorAndroid={Colors.mainAppColor}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    onChangeText={username => this.setState({ username })}
                    value={this.state.username}
                  />
                  <Text style={[styles.heading, { marginTop: 10 }]}>
                    Say something to grap people attention
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      !this.state.validated ? styles.error : null
                    ]}
                    placeholder="Say something about your title"
                    placeholderTextColor="#757575"
                    underlineColorAndroid={Colors.mainAppColor}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    onChangeText={userTitle => this.setState({ userTitle })}
                    value={this.state.userTitle}
                  />
                  <View>
                    <TouchableOpacity
                      style={styles.signupButton}
                      onPress={this.SecondHandlePressNext}
                    >
                      <LinearGradient
                        colors={["#FC3838", "#F52B43", "#ED0D51"]}
                        start={{ x: 0.7, y: 1.2 }}
                        end={{ x: 0.0, y: 0.7 }}
                        style={styles.LinearGradient}
                      >
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
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.actionSheetOfImagePickerType.show()}
                    >
                      <Image
                        style={{
                          height: 200,
                          width: 200,
                          borderRadius: 100,
                          marginBottom: 20
                        }}
                        resizeMode="cover"
                        source={
                          userCurrentImage == ""
                            ? Images.uploadProfile
                            : { uri: userCurrentImage }
                        }
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.signupButton, { marginTop: 80 }]}
                      onPress={() => {
                        if (userCurrentImage != "") {
                          this.uploadImageThroughTusClient();
                        } else {
                          this.actionSheetOfImagePickerType.show();
                        }
                      }}
                    >
                      <LinearGradient
                        colors={["#FC3838", "#F52B43", "#ED0D51"]}
                        start={{ x: 0.7, y: 1.2 }}
                        end={{ x: 0.0, y: 0.7 }}
                        style={styles.LinearGradient}
                      >
                        <Text style={styles.LinearGradientText}>
                          Upload your photo
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <View style={{ marginTop: 15 }} />
                  </View>
                </View>
              )}
            </KeyboardAwareScrollView>
          </View>
          <ActionSheet
            ref={o => (this.actionSheetOfImagePickerType = o)}
            title={
              <Text
                style={{
                  color: "#000",
                  fontFamily: Fonts.app_font,
                  fontSize: 15,
                  alignSelf: "flex-start",
                  marginLeft: 10
                }}
              >
                Select your image type
              </Text>
            }
            options={optionsOfImageType}
            onPress={e => {
              if (e == 0) {
                this.openImagePickerAndCropper();
              } else {
                this.caprtureImageAndCropper();
              }
            }}
          />
          {/* uploading */}
          <Modal
            style={[styles.errAlert, styles.errAlert3]}
            position={"center"}
            ref={"lert"}
            backdrop={true}
            coverScreen={true}
            backdropPressToClose={false}
          >
            <View>
              <View style={{ alignItems: "center" }}>
                <Icon
                  type="simple-line-icon"
                  name="arrow-up-circle"
                  size={50}
                  color={"#00FF00"}
                />
              </View>
              <View style={{ alignItems: "center", margin: 10 }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: Fonts.app_font,
                    fontSize: 14
                  }}
                >
                  Status: {this.state.status}
                </Text>
              </View>
              <View style={{ marginTop: 10, alignItems: "center" }}>
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
            position={"center"}
            ref={"congragulationsAlert"}
            backdrop={true}
            coverScreen={true}
            backdropPressToClose={false}
          >
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Icon
                  type="entypo"
                  name="heart-outlined"
                  size={50}
                  color={Colors.mainAppColor}
                />
              </View>
              <View
                style={{ paddingLeft: 20, paddingRight: 10, paddingTop: 15 }}
              >
                <Text style={{ textAlign: "center", fontSize: 16 }}>
                  Congragulations ! You sucessfully registered you profile
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text
                  onPress={() =>
                    this.props.navigation.reset(
                      [
                        NavigationActions.navigate({
                          routeName: "HomeNavigation"
                        })
                      ],
                      0
                    )
                  }
                  style={{
                    color: Colors.mainAppColor,
                    fontWeight: "bold",
                    textAlign: "center",
                    fontFamily: Fonts.app_font,

                    fontSize: 20
                  }}
                >
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
