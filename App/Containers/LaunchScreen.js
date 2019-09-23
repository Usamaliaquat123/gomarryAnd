import React, { Component } from "react";
import {
  Image,
  View,
  ToastAndroid,
  ActivityIndicator,
  Alert
} from "react-native";
import AnimatedLoader from "react-native-animated-loader";

import AsyncStorage from "@react-native-community/async-storage";
import Api from "../Services/Api";
import { NavigationActions } from "react-navigation";

import { Images, Colors, Json } from "../Themes";
import styles from "./Styles/LaunchScreenStyles";
import ActivityOverlay from "../Components/ActivityOverlay";
export default class LaunchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errMsg: "",
      connectionLastHeading: ""
    };
  }

  reteriveDataFromGlobalVar = async value => {
    await AsyncStorage.getItem(value).then(val => {
      if (val != null) {
        Api.whoami()
          .then(async data => {
            this.setState({ loading: false });

            if (data.user.meta.verified != 0) {
              switch (data.user.meta.signup_stage) {
                case "1":
                  this.props.navigation.navigate("SignupScreen", {
                    currentPage: 2
                  });
                  break;
                case "2":
                  global.resume = true;
                  this.props.navigation.navigate("SignupStage2Screen", {
                    currentPage: 4
                  });
                  break;
                case "3":
                  ToastAndroid.show(
                    "Lets continue to stage 3",
                    ToastAndroid.LONG
                  );
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
            this.setState({ loading: false });
            ToastAndroid.show(error, ToastAndroid.LONG);
            this.props.navigation.navigate("BadRequest");
          });
      } else {
        this.setState({ loading: false });

        this.props.navigation.navigate("LoginScreen");
        return;
      }
    });
  };

  configurePushNotification = async () => {
    await PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log("TOKEN:", token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log("NOTIFICATION:", notification);

        // process the notification

        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: "741452477547",

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      requestPermissions: true
    });
  };
  componentWillMount() {
    this.setState({ loading: true });

    this.reteriveDataFromGlobalVar("token");
    AsyncStorage.getItem("LaunchDisable").then(valueLamnch => {
      if (valueLamnch == "true") {
        this.reteriveDataFromGlobalVar("token");
      }
    });
  }
  render() {
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <Image source={Images.clearLogo} style={styles.logo} />
        {/* <ActivityIndicator size="large" color={Colors.mainAppColor} /> */}
        {/* {loading && <ActivityOverlay />} */}

        <AnimatedLoader
          visible={loading}
          // overlayColor="white"
          source={Json.like}
          animationStyle={styles.loader}
        />
      </View>
    );
  }
}
