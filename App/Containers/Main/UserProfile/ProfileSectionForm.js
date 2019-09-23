import React, { Component } from "react";
import { FlatList, View, TextInput } from "react-native";
import { Icon, Text, ListItem, ButtonGroup } from "react-native-elements";
import Modal from "react-native-modalbox";
import ActivityOverlay from "../../../Components/ActivityOverlay";
import IdentifiedPicker from "../../../Components/IdentifiedPicker";
import IdentifiedInput from "../../../Components/IdentifiedInput";
import CommonHeaderBack from "../../../Components/CommonHeaderBack";
import renderIf from "../../../Components/renderIf";
import Api from "../../../Services/Api";
import { Colors, Fonts } from "../../../Themes";

import styles from "./ProfileSectionFormStyle";
import { ScrollView } from "react-native-gesture-handler";

const component1 = () => <Text style={styles.buttonText}>Cancel</Text>;
const component2 = () => <Text style={styles.buttonText}>Save</Text>;

export default class ProfileSectionForm extends Component {
  constructor(props) {
    super(props);
    this.attributes = global.attributes;
    delete this.attributes["dob"];
    delete this.attributes["gender"];

    var suggestions = [];
    if (global.user.meta.location_raw != 1) {
      suggestions.push({
        id: global.user.meta.location_raw,
        string: global.user.meta.location
      });
    }

    this.state = {
      selectedIndex: 0,

      backAlertHeading: "",
      modalAlert: false,
      errMsg: "",
      searchResult: "",
      loading: false,
      section: this.props.navigation.state.params.section,
      locationSuggestions: suggestions,
      locationId: ""
    };
    this.updateIndex = this.updateIndex.bind(this);
  }
  handleOnChangeText = (text, id) => {
    global.user.data.profile[this.state.section][id] = text;
    this.forceUpdate();
  };

  handleOnValueChange = (itemValue, itemIndex, id) => {
    global.user.data.profile[this.state.section][id] = itemValue;
    global.user.data.profile[this.state.section]["_" + id] = itemValue;
    this.forceUpdate();
  };
  handleNext = () => {
    this.setState({ loading: true });
    if (this.state.section == "location") {
      if (global.user.meta.location_raw > 1) {
        this.setState({ section: null, loading: false });
      } else {
        this.setState({ loading: false });

        this.refs.errAlert.open();
        this.setState({
          backAlertHeading: "Try Again.",
          errMsg: "Please select a location. "
        });
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
      this.refs.errAlert.open();
      this.setState({
        backAlertHeading: "Try Again.",
        errMsg: "Please fill in all fields. "
      });
      // alert("Please fill in all fields.");
      this.setState({ loading: false });
      return;
    }

    Api.updateProfile(this.state.section, update)
      .then(data => {
        Api.whoami().then(res => {
          this.setState({ loading: false });
          this.props.navigation.navigate("MyProfileScreen", { key: true });
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          backAlertHeading: "Something is Wrong",
          errMsg: error
        });
        this.refs.errAlert.open();
      });
  };

  setLocation = (id, string) => {
    this.setState({ loading: true });
    Api.updateProfile(this.state.section, { location: id })
      .then(data => {
        global.user.meta.location_raw = id;
        global.user.meta.location = string;
        this.props.navigation.navigate("MyProfileScreen", { key: true });
      })
      .catch(error => {
        this.setState({ loading: false });

        this.refs.errAlert.open();
        this.setState({
          backAlertHeading: "Something is Wrong",
          errMsg: error
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  async searchingWords(search) {
    try {
      await Api.locationSearch(search)
        .then(data => {
          console.log(data.suggestions.length);
          if (data.suggestions.length == 0)
            this.setState({
              searchResult: "This city or country was not found."
            });
          else this.setState({ searchResult: "" });
          this.setState({ locationSuggestions: data.suggestions });
        })
        .catch(error => {
          this.setState({ loading: false });
          this.refs.errAlert.open();
          this.setState({ errMsg: error });
        });
    } catch (error) {
      this.setState({ loading: false });

      this.refs.errAlert.open();
      this.setState({ errMsg: "Please restart your app to continue" });
    }
  }

  renderLocationRow = ({ item }) => (
    <View>
      <ListItem
        leftIcon={() => (
          <Icon
            type="evilicon"
            name="location"
            size={40}
            color={Colors.mainAppColor}
          />
        )}
        subtitle={item.string}
        onPress={() => this.setLocation(item.id, item.string)}
      />
    </View>
  );

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
    this.fetchSection(selectedIndex);
  }
  fetchSection(index) {
    if (index === 0) {
      this.props.navigation.navigate("MyProfileScreen");
    }
    if (index === 1) {
      this.handleNext();
    }
  }
  render() {
    const { selectedIndex, loading } = this.state;
    load = loading ? <ActivityOverlay /> : null;
    const buttons = [{ element: component1 }, { element: component2 }];
    var form = [];
    if (this.state.section == "location") {
      form.push(
        <View key="location" style={{ margin: 10 }}>
          <View>
            {/* NOte: This section including some sections */}
            {/*  =====>  Moved to another page some reasons  */}
            {/* Note : This section is including location section so when the specific location is selected the upper section is enabled.  */}
            <View />
            <View>
              <View
                style={{
                  marginTop: 70,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Icon
                  type="evilicon"
                  name="location"
                  size={150}
                  color={Colors.mainAppColor}
                />
              </View>
              <View>
                <TextInput
                  style={{
                    alignSelf: "stretch",
                    height: 40,
                    marginBottom: 1,
                    color: Colors.secondaryColor
                  }}
                  placeholder="Search"
                  placeholderTextColor={Colors.secondaryColor}
                  underlineColorAndroid={Colors.mainAppColor}
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  onChangeText={search => this.searchingWords(search)}
                  value={this.state.search}
                />
              </View>
              <View style={{ marginTop: -1 }}>
                {renderIf(this.state.searchResult != "")(
                  <View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 13,
                        fontFamily: Fonts.app_font,

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
                  renderItem={this.renderLocationRow}
                  keyExtractor={item => item.id}
                />
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      for (var k in this.attributes) {
        if (!this.attributes.hasOwnProperty(k)) continue;

        var attribute = this.attributes[k];
        if (attribute.section != this.state.section) continue;
        if (!attribute.profile.enabled) continue;

        switch (attribute.profile.inputType) {
          case "text":
            form.push(
              <View key={attribute.key} style={{ marginBottom: 15 }}>
                <Text>{attribute.title}</Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#000000",
                    borderRadius: 5
                  }}
                >
                  <IdentifiedInput
                    id={attribute.key}
                    value={
                      global.user.data.profile[this.state.section][
                        attribute.key
                      ]
                    }
                    onChangeText={(text, id) => {
                      global.user.data.profile[this.state.section][id] = text;
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
                  options.push({
                      key:sv,
                      label:suboption,
                      value:sv
                  }
                  )
                }
              } else {
                options.push(
                  {key:v, label:option, value:v } 
                );
              }
            }

            form.push(
              <View key={attribute.key} style={{ marginBottom: 15 }}>
                <Text style={styles.textTitle}>{attribute.title}</Text>
                <View
                  style={{
                    margin:5,
                  }}
                >
                  <IdentifiedPicker
                    // itemStyle={{ color: Colors.mainAppColor }}
                    id={attribute.key}
                    value={
                      global.user.data.profile[this.state.section][
                        "_" + attribute.key
                      ]
                    }
                    onValueChange={this.handleOnValueChange}
                    items={options}
                  />
                    {/* <IdentifiedPicker.Item label="-----" value="" /> */}
                  
                </View>
              </View>
            );
            break;

          case "textarea":
            form.push(
              <View key={attribute.key} style={{ marginBottom: 15 }}>
                <Text style={styles.textTitle}>{attribute.title}</Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.mainAppColor,
                    borderRadius: 5
                  }}
                >
                  <IdentifiedInput
                    id={attribute.key}
                    value={
                      global.user.data.profile[this.state.section][
                        attribute.key
                      ]
                    }
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
                <Text>Unknown: {attribute.title}</Text>
              </View>
            );
            break;
        }
      }
    }
    return (
      <React.Fragment>
        {load}
        <CommonHeaderBack title={this.state.section} />

        <ScrollView >{form}</ScrollView>

        {this.state.section != "location" && this.state.loading == false && (
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            selectedButtonStyle={{ backgroundColor: Colors.mainAppColor }}
            containerStyle={{
              backgroundColor: Colors.mainAppColor,
              height: 50,
              width: "100%",
              marginLeft: 0,
              marginBottom: 0,
              marginTop: 0,
              borderWidth: 0,
              borderRadius: 0
            }}
          />
        )}

        {/* ERROR POPUP */}
        <Modal
          style={[styles.errAlert, styles.errAlert3]}
          position={"center"}
          ref={"errAlert"}
          backdrop={true}
          coverScreen={true}
          backdropPressToClose={false}
        >
          <View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon
                type="antdesign"
                name="closecircle"
                size={50}
                color={Colors.mainAppColor}
              />
            </View>
            <View style={{ paddingLeft: 20, paddingRight: 10, paddingTop: 15 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: Fonts.app_font,
                  fontSize: 14
                }}
              >
                {this.state.errMsg}
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text
                onPress={() => this.refs.errAlert.close()}
                style={{
                  color: Colors.mainAppColor,
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                {this.state.backAlertHeading}
              </Text>
            </View>
          </View>
        </Modal>
      </React.Fragment>
    );
  }
}
