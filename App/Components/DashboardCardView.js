import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { withNavigation } from "react-navigation";

import Api from "../Services/Api";
import { Colors, Fonts } from "../Themes";

const DashboardCardView = ({ user, onPress }) => (
  <TouchableOpacity onPress={() => onPress(user)}>
    <ImageBackground
      source={Api.uri(
        user.meta.profile_picture
          ? Api._base + "/media/image/" + user.meta.profile_picture + "/3"
          : Api._base + "/media/dpi/" + user.meta.gender + "/3"
      )}
      style={styles.imageBackground}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column-reverse",
          marginBottom: 5,
          alignSelf: "center"
        }}
      >
        <Text style={styles.age}>Age : {user.meta.age}</Text>
        <Text style={styles.title}>{user.meta.username}</Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "400",
    fontFamily: Fonts.LatoBold,
    color: Colors.snow,
    alignSelf: "center",
    marginTop: 5,
    textShadowRadius: 20,
    textShadowColor: Colors.black
  },
  age: {
    fontSize: 12,
    fontFamily: Fonts.LatoRegular,
    textShadowRadius: 15,
    textShadowColor: Colors.black,
    color: Colors.snow,
    textAlign: "center"
  },
  imageBackground: {
    borderRadius: 8,
    marginBottom: 20,
    marginLeft: 3,
    marginRight: 3,
    height: 160,

    overflow: "hidden",
    width: 120,
    alignSelf: "center"
  }
});

export default withNavigation(DashboardCardView);
