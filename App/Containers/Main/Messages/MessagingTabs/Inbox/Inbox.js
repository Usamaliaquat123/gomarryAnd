import React, { Component } from "react";
import { ScrollView, Platform } from "react-native";
import Dataset from "impagination";
import { NavigationActions } from "react-navigation";
import { Icon, Text, Header } from "react-native-elements";

import Api from "../../../../../Services/Api";

import styles from "./Inbox.styles";
import ChatCard from "../../../../../Components/ChatCard";
import { Colors, Fonts } from "../../../../../Themes";

export default class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      users: null,
      message: null,
      dataset: null,
      mailBox: [],
      isTyping: false,
      typing_id: "",
      isStar: false,
      isArchived: false,
      messageCount: null
    };
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.componentWillMount(this);
    this.setState({ refreshing: false });
  };

  handleBackButtonClick() {
    this.resetNavigation("MainScreen");
    return true;
  }
  componentWillReceiveProps(nextProps) {
    const { isTyping } = this.state;
    const notification = nextProps.navigation.state.params.message;
    console.log(notification);
    if (notification._data.type == "is_typing") {
      if (!isTyping)
        this.setState({
          isTyping: true,
          typing_id: notification._data.friend_id
        });
      setTimeout(() => {
        this.setState({ isTyping: false });
      }, 2000);
    } else if (notification._data.type == "message") {
      this.setState({
        messageCount: notification._data.unreadCount,
        message: notification._data.body,
        typing_id: notification._data.user_id
      });
    }
  }
  componentWillUnmount() {
    console.log("Inbox componentWillUnmount");
    delete global.Inbox;
  }
  componentWillMount() {
    console.log("Inbox componentWillMount");

    global.Inbox = true;
    this.gettingAllUsers();
  }
  gettingAllUsers = async () => {
    let _this = this;
    let dataset = new Dataset({
      pageSize: 15,
      loadHorizon: 15,
      observe(datasetState) {
        _this.setState({ datasetState });
      },
      // Where to fetch the data from.
      fetch(pageOffset, pageSize, stats) {
        return Api.loadMailbox()
          .then(data => {
            console.log(data);
            return data.mailbox;
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
    dataset.setReadOffset(0);
    this.setState({ dataset });
  };
  Chat = (friend_id, username) => {
    this.setState({ messageCount: null });
    this.props.navigation.navigate("SentMail", {
      friendId: friend_id,
      userName: username
    });
  };

  renderItem() {
    if (!this.state.datasetState) return null;
    var _that = this;
    return this.state.datasetState.map(function(user, index) {
      if (!user.isSettled) {
        return null;
      }
      return (
        <ChatCard
          messageCount={_that.state.messageCount}
          key={index}
          message={_that.state.message}
          isTyping={_that.state.isTyping}
          typing_id={_that.state.typing_id}
          user={user.content}
          onPress={_that.Chat}
        />
      );
    });
  }

  render() {
    return (
      <>
        <Header
          containerStyle={{
            backgroundColor: Colors.mainAppColor,
            marginTop: Platform.OS === "ios" ? 0 : -30
          }}
          leftComponent={
            <Icon
              type="ionicon"
              size={30}
              name="md-arrow-back"
              underlayColor={Colors.mainAppColor}
              color={Colors.textColor}
              onPress={() =>
                //  this.props.navigation.dismiss()
                // this.props.navigation.dispatch(NavigationActions.back())
                this.props.navigation.reset(
                  [
                    NavigationActions.navigate({
                      routeName: "NavigationDrawer"
                    })
                  ],
                  0
                )
              }
            />
          }
          centerComponent={
            <Text
              style={{
                fontSize: 24,
                fontWeight: "600",
                fontFamily: Fonts.LatoBold,
                color: Colors.textColor
              }}
            >
              Inbox
            </Text>
          }
        />

        <ScrollView
          style={styles.mainContainerHome}
          showsVerticalScrollIndicator={false}
        >
          {this.renderItem()}
        </ScrollView>
      </>
    );
  }
}
