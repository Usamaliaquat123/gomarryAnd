import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card, Badge, Icon } from "react-native-elements";
import Dataset from "impagination";
import Api from "../../../Services/Api";
import styles from "./NotificationsStyle";
import CommonHeaderBack from "../../../Components/CommonHeaderBack";
export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      read: null,
      datasetState: null,
      currentUserName: ""
    };
  }
  componentWillMount() {
    this.gettingAllNotifications();
  }

  //   function to get notifications
  gettingAllNotifications = async () => {
    let _this = this;
    let dataset = new Dataset({
      pageSize: 100,
      loadHorizon: 15,
      observe(datasetState) {
        _this.setState({ datasetState });
      },
      // Where to fetch the data from.
      fetch(pageOffset, pageSize, stats) {
        return Api.getNotifications(1, pageSize)
          .then(data => data.notifications)
          .catch(error => {
            console.log(error);
          });
      }
    });
    dataset.setReadOffset(0);
    this.setState({ dataset });
  };

  onPress(content) {
    let action = content.action;
    let username = content.username;
    let id = content.triggered_by;
    if (
      action == "favourited" ||
      action == "profile_invite" ||
      action == "photo_request_approved"
    ) {
      this.props.navigation.navigate("UserProfile", {
        user_name: username,
        userId: id
      });
    } else if (action == "photo_request") {
      this.props.navigation.navigate("RequestsScreen", {
        section: "pending"
      });
    } else if (
      action == "photo_approved" ||
      action == "video_approved" ||
      action == "trusted" ||
      action == "not_trusted"
    ) {
      this.props.navigation.navigate("MyProfileScreen");
    } else if (
      action == "subscription_created" ||
      action == "subscription_failed" ||
      action == "subscription_renewed" ||
      action == "subscription_renew_failed" ||
      action == "subscription_event" ||
      action == "subscription_payment" ||
      action == "subscription_payment_pending" ||
      action == "subscription_cancelled" ||
      action == "strike"
    ) {
      // this.props.navigation.navigate("Notifications");
    }
    // this.props.navigation.navigate("UserProfile", {
    //   user_name: content.username,
    //   userId: content.user_id
    // });
  }

  renderItem() {
    if (!this.state.datasetState) return null;
    var _that = this;
    return this.state.datasetState.map(function(user, index) {
      if (!user.isSettled) {
        return null;
      }
      console.log(user.content);
      // _that.setState({ read: user.content.read });
      if (user.content.text) {
        const regex = /(<([^>]+)>)/gi;
        user.content.text = user.content.text.replace(regex, "");

        var username = user.content.text.split(" ");
        user.content["username"] = username[0];
      }
      return (
        <TouchableOpacity onPress={() => _that.onPress(user.content)}>
          <Card key={user.content.id} containerStyle={styles.card}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Icon
                containerStyle={{ flex: 1, alignSelf: "flex-start" }}
                type="feather"
                name="bell"
                size={25}
                color={"#FC3838"}
              />
              <Text style={styles.message}>{user.content.text}</Text>
              {user.content.read != 0 && (
                <Badge
                  containerStyle={styles.badge}
                  status="error"
                  value={""}
                />
              )}
            </View>
          </Card>
        </TouchableOpacity>
      );
    });
  }
  render() {
    return (
      <React.Fragment>
        <CommonHeaderBack title={"Notifications"} />

        <ScrollView
          style={styles.mainContainerHome}
          showsVerticalScrollIndicator={false}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={this.state.refreshing}
          //     onRefresh={this._onRefresh}
          //   />
          // }
        >
          {this.renderItem()}
        </ScrollView>
      </React.Fragment>
    );
  }
}
