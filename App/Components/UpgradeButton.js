import React from "react";
import { Icon } from "react-native-elements";
import { withNavigation } from "react-navigation";
import { Colors } from "../Themes";

function UpgradeButton(props) {
  return (
    <Icon
      name="arrow-up-circle"
      type="simple-line-icon"
      size={25}
      underlayColor={Colors.mainAppColor}
      onPress={() => props.navigation.navigate("UpgradeScreen")}
      color={Colors.textColor}
    />
  );
}

export default withNavigation(UpgradeButton);
