import React from "react";
import { ImageBackground, View, Text, StyleSheet } from "react-native";
import { Colors, Images, Fonts } from "../Themes";

function SampleDashBoardCard() {
  return (
    <ImageBackground source={Images.Boy} style={styles.imageBackground}>
      <View
        style={{
          flex: 1,
          flexDirection: "column-reverse",
          marginBottom: 5,
          alignSelf: "center"
        }}
      >
        <Text style={styles.ageText}>Age : ---------</Text>
        <Text style={styles.title}>----------</Text>
      </View>
    </ImageBackground>
  );
}
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
    textShadowRadius: 20,
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

export default SampleDashBoardCard;
