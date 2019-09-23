import React from "react";
import { Icon, Text, Header } from "react-native-elements";
import { withNavigation } from "react-navigation";
import { Platform } from "react-native";
import UpgradeButton from "./UpgradeButton";
import { Colors, Fonts } from "../Themes";
const CommonHeader = props => {
  return (
    <Header
      containerStyle={{
        backgroundColor: Colors.mainAppColor,
        marginTop: Platform.OS === "ios" ? 0 : -30
      }}
      leftComponent={
        <Icon
          type="simple-line-icon"
          size={25}
          name="menu"
          color={Colors.textColor}
          underlayColor={Colors.mainAppColor}
          onPress={() => props.navigation.openDrawer("DrawerOpen")}
        />
      }
      centerComponent={
        <Text
          style={{
            fontSize: 24,
            fontFamily: Fonts.bold,

            fontWeight: "600",
            color: Colors.textColor
          }}
        >
          {props.title}
        </Text>
      }
      rightComponent={<UpgradeButton />}
    />
  );
};

export default withNavigation(CommonHeader);
