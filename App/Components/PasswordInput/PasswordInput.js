import React, { Component } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../../Themes";
// import { Icon } from "react-elements";

export default class PasswordInputText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      icEye: "visibility-off",
      password: true
    };
  }

  changePwdType = () => {
    let newState;
    if (this.state.password) {
      newState = {
        icEye: "visibility",
        password: false
      };
    } else {
      newState = {
        icEye: "visibility-off",
        password: true
      };
    }
    // set new state value
    this.setState(newState);
  };

  render() {
    return (
      <View>
        <TextInput
          {...this.props}
          placeholderTextColor={Colors.secondaryColor}
          secureTextEntry={this.state.password}
          maxLength={25}
          autoCapitalize={"none"}
          autoCorrect={false}
        />
        <Icon
          style={styles.icon}
          name={this.state.icEye}
          size={this.props.iconSize}
          color={Colors.mainAppColor}
          onPress={this.changePwdType}
        />

        {/* <Icon name="ios-book" color="#4F8EF7" /> */}
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    top: 7,
    right: 3
  }
});

PasswordInputText.defaultProps = {
  iconSize: 25,
};
