import React from "react";
import { Card, Icon } from "react-native-elements";
import { StyleSheet, View, Text } from "react-native";
import { Colors, Fonts } from "../Themes";

import CardItems from "./CardItems";

const CardView = props => {
  return (
    <View>
      {props.title != "about" && props.title != "summary" && (
        <Card
          containerStyle={{ borderRadius: 8 }}
          title={props.title}
          titleStyle={Styles.heading}
        >
          <CardItems array={props.array} />
        </Card>
      )}
    </View>
  );
};
const Styles = StyleSheet.create({
  summaryLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: Fonts.app_font
  },
  summaryText: {
    flex: 1,
    fontFamily: Fonts.app_font
  },
  rowProfile: {
    justifyContent: "space-between",
    flexDirection: "row",
    flex: 1
  },
  heading: {
    fontWeight: "400",
    fontSize: 20,
    fontFamily: Fonts.app_font,

    color: Colors.mainAppColor
  }
});

export default CardView;
