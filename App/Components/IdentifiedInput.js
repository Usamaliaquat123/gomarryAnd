import React, { Component } from "react";
import { Input } from "react-native-elements";

class IdentifiedInput extends Component {
  onChangeText(value) {
    if (value !== this.props.value) {
      this.props.onChangeText(value, this.props.id);
    }
  }

  render() {
    return (
      <Input
        inputContainerStyle={{ borderBottomWidth: 0 }}
        ref={this.props.id}
        {...this.props}
        onChangeText={this.onChangeText.bind(this)}
      />
    );
  }
}

export default IdentifiedInput;
