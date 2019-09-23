import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { Colors, Fonts } from "../Themes";

function AddPhotoVideo({ title, name, onPress, alias, type }) {
  return (
    <>
      <View style={{flex:1,flexDirection:"row",justifyContent:"space-between",marginTop:10}}>
        <Text
          style={{
            color: Colors.mainAppColor,
            fontSize: 18,
            fontFamily: Fonts.app_font,

            marginLeft: 5
          }}
        >
          {title}
        </Text>
        <View
          style={{
            marginRight: 5,
            justifyContent: "flex-end",
            alignItems: "flex-end"
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, flexDirection: "row" }}
            onPress={() => onPress(alias ? alias : "", type ? type : "")}
          >
            <Icon
              iconStyle={{ margin: 4 }}
              name="plus"
              type="simple-line-icon"
              size={20}
              color={Colors.mainAppColor}
            />
            <Text
              style={{
                color: Colors.mainAppColor,
                fontSize: 12,
                marginTop: 7,
                fontFamily: Fonts.app_font
              }}
            >
              Add {name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginTop: 2,
          borderBottomColor: Colors.grey,
          borderBottomWidth: 1
        }}
      />
    </>
  );
}

export default AddPhotoVideo;
