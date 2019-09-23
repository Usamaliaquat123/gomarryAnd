import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Card, Icon } from "react-native-elements";
import { NavigationActions } from "react-navigation";

import { Colors, Fonts } from "../../../Themes";
import CommonHeaderBack from "../../../Components/CommonHeaderBack";
import Api from "../../../Services/Api";

function VerifyEmail(props) {
  const [loading, setLoading] = useState(false);
  const [btnText, setText] = useState("Resend Email");

  const resendCode = () => {
    setLoading(true);
    Api.resendVerificationCode()
      .then(res => {
        setLoading(false);
        setText("Sent");
      })
      .catch(err => {
        setLoading(false);
        ToastAndroid.show(err, ToastAndroid.LONG);
      });
  };
  return (
    <React.Fragment>
      <CommonHeaderBack title="Email Verification" logout={true} />
      <View style={styles.View}>
        <Text style={styles.mainTitle}>We've sent you an activation to</Text>

        <Text style={styles.email}>{props.navigation.state.params.Email}</Text>
        <Card containerStyle={{ borderRadius: 8 }}>
          <Text style={styles.subText}>
            Didn't get an email? Make sure you check your junk and spam filter
          </Text>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => resendCode()}
            disabled={btnText === "Sent"}
          >
            <LinearGradient
              colors={["#FC3838", "#F52B43", "#ED0D51"]}
              start={{ x: 0.7, y: 1.2 }}
              end={{ x: 0.0, y: 0.7 }}
              style={{
                height: 48,
                width: btnText === "Sent" ? 70 : 110,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                borderRadius: 3
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {btnText}
              </Text>
              {btnText === "Sent" && (
                <Icon
                  name="check"
                  type="feather"
                  containerStyle={{ marginLeft: 2 }}
                  size={20}
                  color="white"
                />
              )}
              {loading ? (
                <ActivityIndicator color="white" style={{ marginLeft: 2 }} />
              ) : null}
            </LinearGradient>
          </TouchableOpacity>
        </Card>
        <Text style={styles.subText}>
          If you have verified your's email then please
        </Text>
        <Icon
          color={Colors.mainAppColor}
          size={30}
          name="reload"
          underlayColor={Colors.mainAppColor}
          type="simple-line-icon"
          onPress={() =>
            props.navigation.reset(
              [
                NavigationActions.navigate({
                  routeName: "LaunchScreen"
                })
              ],
              0
            )
          }
        />
      </View>
    </React.Fragment>
  );
}
const styles = StyleSheet.create({
  View: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.textColor
  },
  mainTitle: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "400",
    textAlign: "center",
    fontFamily: Fonts.LatoRegular,

    color: Colors.mainAppColor
  },
  email: {
    fontSize: 24,
    fontFamily: Fonts.LatoBold,

    margin: 10,
    fontWeight: "600",
    color: "#74B9FF",
    textAlign: "center"
  },
  subText: {
    fontSize: 16,
    fontFamily: Fonts.LatoRegular,

    margin: 10,
    fontWeight: "300",
    color: Colors.background,

    textAlign: "center"
  },
  searchButton: {
    alignSelf: "stretch",
    alignSelf: "center",
    marginTop: 5,
    shadowColor: "rgba(46, 229, 157, 0.2)",
    shadowOpacity: 0.5,
    elevation: 0,
    shadowRadius: 20,
    shadowOffset: { width: 1, height: 5 },
    backgroundColor: "rgba(46, 229, 157, 0.2)"
  }
});

export default VerifyEmail;
