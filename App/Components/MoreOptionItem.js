import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";

import { Colors, Fonts } from "../Themes";
import DialogBox from "./DialogBox";
function MoreOptionItem(props) {
  const [dialogVisible, setVisible] = useState(false);
  const { name, title, selectedItems, onSelectionsChange } = props;
  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.moreOption} onPress={() => setVisible(true)}>
          {title}
        </Text>

        <Icon
          onPress={() => setVisible(true)}
          name="arrow-right"
          type="simple-line-icon"
          color={"#000000"}
          size={10}
          iconStyle={{ margin: 6 }}
        />
      </View>
      <DialogBox
        visible={dialogVisible}
        name={name}
        selectedItems={selectedItems}
        onSelectionsChange={onSelectionsChange}
        changeVisible={value => setVisible(value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  moreOption: {
    fontSize: 16,
    color: Colors.mainAppColor,
    fontWeight: "400",
    fontFamily: Fonts.app_font
  }
});

export default MoreOptionItem;
