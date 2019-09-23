import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { NavigationActions } from "react-navigation";

import { Fonts, Colors } from "../Themes";
function BadRequest(props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Icon type="simple-line-icon" name="globe" size={80} color={"#FC3838"} />
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          fontFamily: Fonts.LatoBold,
          marginTop: 10
        }}
      >
        Looks like!
      </Text>
      <Text style={{ fontSize: 15 }}>
        You are not connected to the Internet ...
      </Text>
      <TouchableOpacity
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
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: Fonts.LatoBold,
            marginTop: 10,
            color: Colors.mainAppColor
          }}
        >
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default BadRequest;
