import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Colors, Fonts } from "../Themes";

const CardItems = ({ array }) => {
  return array.map((item, index) => (
    <View key={index} style={Styles.row}>
      <Text style={Styles.textLabel}>{item.label}</Text>
      <Text style={Styles.textvalue}>{item.value}</Text>
    </View>
  ));
};
const Styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  textLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: Colors.secondaryColor,
    fontFamily: Fonts.LatoBold
  },
  textvalue: {
    flex: 1,
    color: Colors.black,
    fontFamily: Fonts.LatoBold
  }
});

export default CardItems;
