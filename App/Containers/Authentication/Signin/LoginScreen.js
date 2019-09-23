import React, { Component } from "react";
import {
  ScrollView,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid
} from "react-native";
import { NavigationActions } from "react-navigation";

import AsyncStorage from "@react-native-community/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradient from "react-native-linear-gradient";
import Api from "../../../Services/Api";
import PasswordInputText from "../../../Components/PasswordInput/PasswordInput";
import { Images, Colors } from "../../../Themes";
import styles from "./LoginScreenStyles";
import ActivityOverlay from "../../../Components/ActivityOverlay";
export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "fparityzone@gmail.com",
      password: "Don123456",
      Loading: false,
      passwordvalidation: true
      // defaultUsername: "fparityzone@gmail.com",
      // defaultPassword: "Don123456"
      // defaultUsername: "reter@email-24x7.com",
      // defaultPassword: "Don123456"
      // defaultUsername: "inconnent12345@outlook.com",
      // defaultPassword: "1Daniyal"
    };
  }

  DisableLaunchScreen = async () => {
    await AsyncStorage.setItem("LaunchDisable", "true");
  };

  validate = text => {
    this.setState({ username: text });
  };
  getpassword = text => {
    this.setState({ password: text });
  };

  componentDidMount() {
    const { navigation } = this.props;

    if (navigation.getParam("fromLaunch") == true) {
      this.DisableLaunchScreen();
    }
  }

  loginPressed = () => {
    const { username, password, Loading } = this.state;
    if (this.state.defaultUsername != "" && this.state.defaultPassword != "") {
      this.setState({ passwordvalidation: true, Loading: true });
      AsyncStorage.setItem("username", this.state.defaultUsername);

      Api.login(username, password)
        .then(async val => {
          Api.whoami()
            .then(async data => {
              this.setState({ Loading: false });
              if (data.user.meta.verified != 0) {
                switch (data.user.meta.signup_stage) {
                  case "1":
                    this.props.navigation.navigate("SignupScreen", {
                      currentPage: 2
                    });
                    break;
                  case "2":
                    this.props.navigation.navigate("SignupScreen", {
                      currentPage: 4
                    });
                    break;
                  case "3":
                    this.props.navigation.navigate("SignupScreen", {
                      currentPage: 5
                    });
                    break;
                  default:
                    this.props.navigation.reset(
                      [
                        NavigationActions.navigate({
                          routeName: "HomeNavigation"
                        })
                      ],
                      0
                    );
                    break;
                }
              }
              //check after email change
              else if (
                data.user.meta.signup_stage == 4 &&
                data.user.meta.verified == 0
              ) {
                this.props.navigation.navigate("VerifyEmail", {
                  Email: data.user.meta.email
                });
              } else {
                this.props.navigation.navigate("SignupScreen", {
                  currentPage: 1,
                  Email: data.user.meta.email
                });
              }
            })
            .catch(error => {
              this.setState({ Loading: false });
              ToastAndroid.show(error, ToastAndroid.LONG);
            });
        })
        .catch(error => {
          this.setState({ Loading: false });
          ToastAndroid.show(error, ToastAndroid.LONG);
        });
    } else {
      ToastAndroid.show(`You may type  wrong credientials`, ToastAndroid.LONG);
    }
  };

  render() {
    const { username, password, Loading } = this.state;
    if (Loading) return <ActivityOverlay />;

    return (
      <ScrollView style={{ backgroundColor: "white" }}>
        <View style={styles.mainContainerLogin}>
          <KeyboardAwareScrollView
            style={styles.logForm}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            automaticallyAdjustContentInsets={false}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerLogoStyle}>
              <Image
                source={Images.clearLogo}
                style={styles.mainLogoHeader}
                resizeMode="cover"
                source={Images.clearLogo}
              />
            </View>

            <Text style={styles.textStyle}> Please login to continue!</Text>
            <View style={{ marginTop: 10 }}>
              <TextInput
                style={[
                  styles.textInput,
                  !this.state.validated ? styles.error : null
                ]}
                placeholder="Username"
                placeholderTextColor={Colors.secondaryColor}
                underlineColorAndroid={Colors.mainAppColor}
                autoCapitalize={"none"}
                autoCorrect={false}
                value={username}
                onChangeText={text => this.setState({ username: text })}
              />
              <PasswordInputText
                onChangeText={text => this.setState({ password: text })}
                style={[
                  styles.textInput,
                  !this.state.passwordvalidation ? styles.error : null
                ]}
                o
                value={password}
              />
            </View>
            <Text
              style={styles.forgotpass}
              onPress={() => this.props.navigation.navigate("forgotPassword")}
            >
              Forgot Password?
            </Text>
            <TouchableOpacity
              style={{
                alignSelf: "stretch",
                alignSelf: "center",
                marginTop: 25,
                shadowColor: "rgba(46, 229, 157, 0.2)",
                shadowOpacity: 0.5,
                elevation: 0,
                shadowRadius: 20,
                shadowOffset: { width: 1, height: 5 },
                backgroundColor: "rgba(46, 229, 157, 0.2)"
              }}
              onPress={() => this.loginPressed()}
            >
              <LinearGradient
                colors={["#FC3838", "#F52B43", "#ED0D51"]}
                start={{ x: 0.7, y: 1.2 }}
                end={{ x: 0.0, y: 0.7 }}
                style={{
                  height: 48,
                  width: 270,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 3
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  LOGIN
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.donthaveaccount}>
              Don't have an account?
              <Text
                style={styles.donthaveaccountother}
                onPress={() =>
                  this.props.navigation.navigate("SignupScreen", {
                    currentPage: 0
                  })
                }
              >
                Sign up
              </Text>
            </Text>
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>
    );
  }
}
