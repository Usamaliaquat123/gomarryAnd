import React, { Component } from "react";
import { Picker ,StyleSheet} from "react-native";
import colors from "../Themes/Colors";
import { Fonts } from "../Themes";
import RNPickerSelect from 'react-native-picker-select';
class IdentifiedPicker extends Component {
  onValueChange(value, index) {
    if (value !== this.props.selectedValue) {
      this.props.onValueChange(value, index, this.props.id);
    }
  }

  render() {
    console.log(this.props.items)
    return (
      <RNPickerSelect
        // itemStyle={{
        //   backgroundColor: "grey",
        //   color: "blue",
        //   borderWidth: 0,
        //   borderColor: colors.mainAppColor,
        //   fontSize: 14,
        //   fontFamily: Fonts.LatoRegular
        // }}
        
        
        style={pickerSelectStyles}
        ref={this.props.id}
        {...this.props}
        onValueChange={this.onValueChange.bind(this)}
        // items={this.props.items}
      
      />
    );
  }
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
// IdentifiedPicker.Item = Picker.Item;

export default IdentifiedPicker;
