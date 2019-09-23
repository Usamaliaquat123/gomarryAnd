import React, { Component } from "react";

import {
  BackHandler,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ToastAndroid,
  ScrollView
} from "react-native";
import { NavigationActions } from "react-navigation";

import { Icon, ListItem } from "react-native-elements";
import AnimatedLoader from "react-native-animated-loader";
import LinearGradient from "react-native-linear-gradient";
import Api from "../../../Services/Api";
import IdentifiedPicker from "../../../Components/IdentifiedPicker";
import IdentifiedInput from "../../../Components/IdentifiedInput";
import CommonHeaderBack from "../../../Components/CommonHeaderBack";

// Styles
import styles from "./SignupStage2ScreenStyle";
import colors from "../../../Themes/Colors";
import { Colors, Fonts, Json } from "../../../Themes";

export default class SignupStage2Screen extends Component {
  constructor(props) {
    super(props);

    this.attributes = global.attributes;

    delete this.attributes["dob"];

    delete this.attributes["gender"];

    var s = null;

    if (global.resume) {
      s = this.getResumeSection();

      global.resume = false;
    } else if (global.gotoLast) {
      var l = global.sections.length - 1;

      s = global.sections[l];

      global.gotoLast = false;
    }

    if (s === null) s = global.sections[0];

    var suggestions = [];

    if (global.user.meta.location_raw != 1) {
      suggestions.push({
        id: global.user.meta.location_raw,
        string: global.user.meta.location
      });
    }

    this.state = {
      searchResult: "",

      loading: false,

      section: s,

      update: {},
      locationSuggestions: suggestions
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.goBack();

      return true;
    });
  }

  goBack = () => {
    var i = global.sections.indexOf(this.state.section);

    if (i < 1) {
      this.props.navigation.navigate("SignupStage1Screen");
    } else {
      this.setState({ section: global.sections[i - 1] });
    }
  };

  handleNext = () => {
    if (this.state.loading) return;
    this.setState({ loading: true });
    if (this.state.section == "location") {
      if (global.user.meta.location_raw > 1) {
        this.setState({ section: "basic", loading: false });
      } else {
        this.setState({ loading: false });
        ToastAndroid.show(error, ToastAndroid.LONG);
      }
      return;
    }

    var ok = true;

    var update = {};

    for (var k in this.attributes) {
      if (!this.attributes.hasOwnProperty(k)) continue;

      var attribute = this.attributes[k];

      if (attribute.section != this.state.section) continue;

      if (!attribute.profile.enabled) continue;

      if (attribute.profile.inputType == "select") {
        update[attribute.key] =
          global.user.data.profile[this.state.section]["_" + attribute.key];
      } else {
        update[attribute.key] =
          global.user.data.profile[this.state.section][attribute.key];
      }

      if (!update[attribute.key]) ok = false;
    }

    if (!ok) {
      // alert('Please fill in all fields.');

      // Todo error
      this.setState({ loading: false });
      ToastAndroid.show("Please fill all fields.", ToastAndroid.LONG);

      return;
    }

    Api.updateProfile(this.state.section, update)
      .then(data => {
        var s = this.getNextSection();

        if (s === null) {
          Api.completeSignupStage2()
            .then(data => {
              this.props.navigation.reset(
                [
                  NavigationActions.navigate({
                    routeName: "SignupScreen",
                    params: { currentPage: 5 }
                  })
                ],
                0
              );
            })
            .catch(error => {
              ToastAndroid.show(error, ToastAndroid.LONG);
            });
        } else {
          this.setState({ section: s });
        }
      })
      .catch(error => {
        ToastAndroid.show(error, ToastAndroid.LONG);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  getNextSection = () => {
    var i = global.sections.indexOf(this.state.section);

    if (i < global.sections.length - 1) {
      return global.sections[i + 1];
    } else {
      return null;
    }
  };

  getResumeSection = () => {
    // Find the current section being worked on

    var currentSection = null;
    for (var s = 0; s < global.sections.length; s++) {
      var section = global.sections[s];
      if (section == "location") {
        if (global.user.meta.location_raw == 1) {
          currentSection = section;
          break;
        }
      } else {
        for (var k in this.attributes) {
          if (!this.attributes.hasOwnProperty(k)) continue;

          var attribute = this.attributes[k];

          if (attribute.section != section) continue;

          if (!attribute.profile.enabled) continue;

          if (global.user.data.profile[section]) {
            if (!global.user.data.profile[section][attribute.key]) {
              currentSection = section;

              break;
            }
          }
        }
      }

      if (currentSection) break;
    }

    return currentSection;
  };

  async searchForLocation(search) {
    // this.setState({ loading: true });

    await Api.locationSearch(search)
      .then(data => {
        if (data.suggestions.length == 0)
          this.setState({
            searchResult: "This city or country was not found."
          });
        else this.setState({ searchResult: "" });
        this.setState({ locationSuggestions: data.suggestions });
      })
      .catch(error => {
        ToastAndroid.show(error, ToastAndroid.LONG);
      })
      .finally(() => {
        // this.setState({ loading: false });
      });
  }

  setLocation = (id, string) => {
    this.setState({ loading: true });

    Api.updateProfile(this.state.section, { location: id })
      .then(data => {
        global.user.meta.location_raw = id;

        global.user.meta.location = string;

        this.setState({ section: "basic" });
      })
      .catch(error => {
        ToastAndroid.show(error, ToastAndroid.LONG);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handleOnChangeText = (text, id) => {
    global.user.data.profile[this.state.section][id] = text;
    this.forceUpdate();
  };

  handleOnValueChange = (itemValue, itemIndex, id) => {
    global.user.data.profile[this.state.section][id] = itemValue;

    global.user.data.profile[this.state.section]["_" + id] = itemValue;

    this.forceUpdate();
  };
  renderRow = ({ item }) => (
    <View>
      <ListItem
        leftIcon={() => (
          <Icon
            type="evilicon"
            name="location"
            size={30}
            color={Colors.mainAppColor}
          />
        )}
        title={item.string}
        onPress={() => this.setLocation(item.id, item.string)}
      />
    </View>
  );

  render() {
    var form = [];
    const { section } = this.state;
    if (section == "location") {
      form.push(
        <View key="location" style={{ marginBottom: 15 }}>
          <View>
            <View style={styles.headerLogoStyle}>
              <Icon
                type="evilicon"
                name="location"
                size={100}
                color={Colors.mainAppColor}
              />
              <Text style={styles.heading}>
                Search for the location nearest you
              </Text>
            </View>
            <TextInput
              style={styles.textInputOfUserName}
              placeholder="Search"
              placeholderTextColor="#757575"
              underlineColorAndroid={Colors.mainAppColor}
              autoCapitalize={"none"}
              autoCorrect={false}
              onChangeText={search => this.searchForLocation(search)}
              value={this.state.search}
            />
            <View style={{ marginTop: -1 }}>
              {this.state.searchResult != "" && (
                <View>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 13,
                      fontFamily: Fonts.LatoRegular,
                      color: Colors.mainAppColor
                    }}
                  >
                    {this.state.searchResult}
                  </Text>
                </View>
              )}
              <FlatList
                data={this.state.locationSuggestions}
                extraData={this.state}
                renderItem={this.renderRow}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
        </View>
      );
    } else {
      for (var k in this.attributes) {
        if (!this.attributes.hasOwnProperty(k)) continue;

        var attribute = this.attributes[k];

        if (attribute.section != section) continue;

        if (!attribute.profile.enabled) continue;

        switch (attribute.profile.inputType) {
          case "text":
            form.push(
              <View key={attribute.key} style={{ marginBottom: 15 }}>
                <Text style={styles.titlt}>{attribute.title}</Text>
                <View style={styles.TextAreaView}>
                  <IdentifiedInput
                    id={attribute.key}
                    value={global.user.data.profile[section][attribute.key]}
                    onChangeText={(text, id) => {
                      global.user.data.profile[section][id] = text;
                    }}
                    keyboardType="default"
                    returnKeyType="next"
                    autoCapitalize="none"
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
            );

            break;

          case "select":
            var options = [];

            for (var v in attribute.options) {
              if (!attribute.options.hasOwnProperty(v)) continue;

              var option = attribute.options[v];

              if (typeof option === "object") {
                for (var sv in option) {
                  if (!option.hasOwnProperty(sv)) continue;

                  var suboption = option[sv];

                  options.push(
                    <IdentifiedPicker.Item
                      key={sv}
                      label={suboption}
                      value={sv}
                    />
                  );
                }
              } else {
                options.push(
                  <IdentifiedPicker.Item key={v} label={option} value={v} />
                );
              }
            }

            form.push(
              <View key={attribute.key} style={{ marginBottom: 15 }}>
                <Text style={styles.titlt}>{attribute.title}</Text>
                <View style={styles.PickerView}>
                  <IdentifiedPicker
                    id={attribute.key}
                    selectedValue={
                      global.user.data.profile[section]["_" + attribute.key]
                    }
                    onValueChange={this.handleOnValueChange}
                  >
                    <IdentifiedPicker.Item label="-----" value="" />

                    {options}
                  </IdentifiedPicker>
                </View>
              </View>
            );

            break;

          case "textarea":
            form.push(
              <View key={attribute.key} style={{ marginBottom: 15 }}>
                <Text style={styles.titlt}>{attribute.title}</Text>
                <View
                  style={{
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    borderColor: colors.mainAppColor,
                    borderRadius: 5
                  }}
                >
                  <IdentifiedInput
                    id={attribute.key}
                    value={global.user.data.profile[section][attribute.key]}
                    onChangeText={this.handleOnChangeText}
                    keyboardType="default"
                    returnKeyType="next"
                    autoCapitalize="none"
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                    multiline={true}
                    style={{ height: 100, textAlignVertical: "top" }}
                    multiline={true}
                  />
                </View>
              </View>
            );

            break;

          default:
            form.push(
              <View key={attribute.key}>
                <Text style={styles.titlt}>Unknown: {attribute.title}</Text>
              </View>
            );

            break;
        }
      }
      form.push(
        <TouchableOpacity style={styles.Touchable} onPress={this.handleNext}>
          <LinearGradient
            colors={["#FC3838", "#F52B43", "#ED0D51"]}
            start={{ x: 0.7, y: 1.2 }}
            end={{ x: 0.0, y: 0.7 }}
            style={styles.Linear}
          >
            <Text style={styles.LinearText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <React.Fragment>
        <CommonHeaderBack title={section.toUpperCase()} logout={true} />

        <ScrollView style={{ margin: 10 }}>{form}</ScrollView>

        <AnimatedLoader
          visible={this.state.loading}
          source={Json.like}
          animationStyle={{ width: 100, height: 100 }}
        />
      </React.Fragment>
    );
  }
}
