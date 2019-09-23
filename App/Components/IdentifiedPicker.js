import React, { Component } from "react";
import { Picker } from "react-native";
import colors from "../Themes/Colors";
import { Fonts } from "../Themes";

class IdentifiedPicker extends Component {
  onValueChange(value, index) {
    if (value !== this.props.selectedValue) {
      this.props.onValueChange(value, index, this.props.id);
    }
  }

  render() {
    return (
      <Picker
        itemStyle={{
          backgroundColor: "grey",
          color: "blue",
          borderWidth: 0,
          borderColor: colors.mainAppColor,
          fontSize: 14,
          fontFamily: Fonts.LatoRegular
        }}
        style={{ borderColor: colors.mainAppColor }}
        ref={this.props.id}
        {...this.props}
        onValueChange={this.onValueChange.bind(this)}
      >
        {this.props.children}
      </Picker>
    );
  }
}

IdentifiedPicker.Item = Picker.Item;

export default IdentifiedPicker;
