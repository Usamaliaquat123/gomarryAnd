import React from "react";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { Colors, Fonts } from "../Themes";

function NoImageVideo() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        marginTop: 50
      }}
    >
      <Icon
        color={Colors.secondaryColor}
        size={30}
        name="picture"
        type="simple-line-icon"
      />
      <Text
        style={{
          textAlign: "center",
          fontSize: 16,
          fontWeight: "400",
          fontFamily: Fonts.app_font,
          color: Colors.secondaryColor
        }}
      >
        No Image or Video
      </Text>
    </View>
  );
}

export default NoImageVideo;
