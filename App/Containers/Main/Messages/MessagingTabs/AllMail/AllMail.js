import React, { PureComponent } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput
} from "react-native";
import { Card, Icon } from "react-native-elements";

import CommonHeader from "../../../../../Components/CommonHeader";
import { Images, Colors } from "../../../../../Themes";
import styles from "./AllMail.styles";
import Api from "../../../../../Services/Api";
import Dataset from "impagination";
import colors from "../../../../../Themes/Colors";
export default class AllMail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      users: null,
      dataset: null
    };
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.componentDidMount(this);
    this.setState({ refreshing: false });
  };
  setCurrentReadOffset = event => {
    let itemHeight = 200;
    let currentOffset = Math.floor(event.nativeEvent.contentOffset.y);
    let currentItemIndex = Math.ceil(currentOffset / itemHeight);

    this.state.dataset.setReadOffset(currentItemIndex);
  };

  gettingAllUsers = async searchingWrds => {
    let _this = this;
    let dataset = new Dataset({
      pageSize: 15,
      loadHorizon: 15,
      observe(datasetState) {
        _this.setState({ datasetState });
      },
      // Where to fetch the data from.
      fetch(pageOffset, pageSize, stats) {
        return Api.search([searchingWrds], pageOffset + 1, pageSize)
          .then(data => data.users)
          .catch(error => {
            console.log(error);
          });
      }
    });
    dataset.setReadOffset(0);
    this.setState({ dataset });
  };

  filterFreeUsers = async user => {
    if (user.meta.premium == 0) {
      this.props.navigation.navigate("SentMail");
    } else {
      this.props.navigation.navigate("UpgradeScreen");
    }
  };

  componentDidMount() {
    this.gettingAllUsers("");
  }
  searchingWords(searchingWrds) {
    console.log(searchingWrds);
    this.gettingAllUsers(searchingWrds);
  }
  renderItem() {
    if (!this.state.datasetState) return null;
    var _that = this;
    return this.state.datasetState.map(function(user, index) {
      console.log(user.content);
      if (!user.isSettled) {
        return (
          <Card
            containerStyle={{
              shadowColor: "rgba(252, 56, 56, 0.2)",
              shadowOpacity: 0.5,
              elevation: 1,
              shadowRadius: 10,
              shadowOffset: { width: 1, height: 3 },
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              marginBottom: -13,
              marginLeft: 10,
              marginRight: 10
            }}
          >
            <View style={{ opacity: 0.5 }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ alignSelf: "flex-start" }}>
                  <Image
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 25,
                      marginBottom: 20
                    }}
                    resizeMode="cover"
                    source={Images.defaultUserProfile}
                  />
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "bold",
                      color: Colors.mainAppColor,
                      alignSelf: "flex-start",
                      marginTop: 5,
                      marginLeft: 5
                    }}
                  >
                    username
                    <Text style={{ fontSize: 12, color: "#87888F" }}>
                      {" "}
                      Age : 27
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    position: "absolute",
                    right: 0
                  }}
                >
                  <Icon
                    type="antdesign"
                    size={20}
                    name="staro"
                    color={Colors.mainAppColor}
                    containerStyle={{
                      marginTop: 5
                    }}
                  />
                </View>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  color: "#87888F",
                  alignSelf: "flex-start",
                  marginTop: -35,
                  marginLeft: 45,
                  marginBottom: 10
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
              </Text>
            </View>
          </Card>
        );
      }
      console.log(user.content);
      var profile_picture = user.content.meta.profile_picture
        ? Api._base + "/media/image/" + user.content.meta.profile_picture + "/3"
        : Api._base + "/media/dpi/" + user.content.meta.gender + "/3";
      return (
        <TouchableOpacity onPress={() => _that.filterFreeUsers(user.content)}>
          <Card
            key={user.user_id}
            containerStyle={{
              shadowColor: "rgba(252, 56, 56, 0.2)",
              shadowOpacity: 0.5,
              elevation: 1,
              shadowRadius: 10,
              shadowOffset: { width: 1, height: 3 },
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              marginBottom: -13,
              marginLeft: 10,
              marginRight: 10
            }}
          >
            <View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ alignSelf: "flex-start" }}>
                  <Image
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 25,
                      marginBottom: 20
                    }}
                    resizeMode="cover"
                    source={Api.uri(profile_picture)}
                  />
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "bold",
                      color: Colors.mainAppColor,
                      alignSelf: "flex-start",
                      marginTop: 5,
                      marginLeft: 5
                    }}
                  >
                    {user.content.meta.username}
                    <Text style={{ fontSize: 12, color: "#87888F" }}>
                      {" "}
                      Age : {user.content.meta.age}
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    position: "absolute",
                    right: 0
                  }}
                >
                  <Icon
                    type="antdesign"
                    size={20}
                    name="staro"
                    color={Colors.mainAppColor}
                    containerStyle={{
                      marginTop: 5
                    }}
                  />
                </View>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  color: "#87888F",
                  alignSelf: "flex-start",
                  marginTop: -35,
                  marginLeft: 45,
                  marginBottom: 10
                }}
              >
                {user.content.meta.tagline == ""
                  ? "This user not have any tagline"
                  : user.content.meta.tagline}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      );
    });
  }
  componentWillMount() {}
  render() {
    return (
      <React.Fragment>
        <CommonHeader title={"Message"} />
        <TextInput
          style={{
            alignSelf: "stretch",
            height: 40,
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 1,
            color: colors.mainAppColor
          }}
          placeholder="Search"
          placeholderTextColor="#757575"
          underlineColorAndroid={colors.mainAppColor}
          autoCapitalize={"none"}
          autoCorrect={false}
          onChangeText={search => this.searchingWords(search)}
          value={this.state.search}
        />
        <ScrollView
          scrollEventThrottle={300}
          onScroll={this.setCurrentReadOffset}
          removeClippedSubviews={true}
        >
          {this.renderItem()}
        </ScrollView>
      </React.Fragment>
    );
  }
}
