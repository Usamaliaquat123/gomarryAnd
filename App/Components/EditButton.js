import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../Themes";

import { Icon } from "react-native-elements";
const EditButton = props => {
  return (
    <View style={Styles.editIconView}>
      <Icon
        name="pencil"
        color={Colors.mainAppColor}
        type="simple-line-icon"
        onPress={() =>
          props.navigation.navigate("ProfileSectionForm", {
            section: props.sectiontext
          })
        }
      />
    </View>
  );
};
const Styles = StyleSheet.create({
  editIconView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 2
  }
});
export default EditButton;
