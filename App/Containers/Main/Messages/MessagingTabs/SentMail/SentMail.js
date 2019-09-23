import React, { PureComponent } from "react";
import { View, Text, Platform, ActivityIndicator } from "react-native";
import { Icon, Header } from "react-native-elements";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import AnimatedLoader from "react-native-animated-loader";
import Modal from "react-native-modalbox";
import moment from "moment";
import Api from "../../../../../Services/Api";
import firebase from "react-native-firebase";
import ActivityOverlay from "../../../../../Components/ActivityOverlay";
import { Colors, Json, Fonts } from "../../../../../Themes";
import styles from "./SentMail.styles";
export default class SentMail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      friend_id: this.props.navigation.state.params.friendId,
      iconName: "",
      errMsg: "",
      loading: false,
      buttonText: "",
      typeCard: "",
      CurrentUser: user.user_id,
      userName: this.props.navigation.state.params.userName,
      messages: [],
      currentComponent: "SentMail",
      userDefaultPicture: "",
      totalMsg: null,
      abilityOfLoadMore: true,
      isLoadingMore: false,
      isUserTyping: false
    };
    this.isTyping = false;
    this.stopTypingTimeout = undefined;
  }

  componentWillMount() {
    global.messageScreen = this.props.navigation.state.params.friendId;
    this.gettingConversation(this.props.navigation.state.params.friendId);
  }
  componentWillReceiveProps(nextProps) {
    const notification = nextProps.navigation.state.params.message;
    const id = notification._data.friend_id
      ? notification._data.friend_id
      : notification._data.user_id;
    console.log(notification);
    if (notification) {
      if (id == this.state.friend_id) {
        if (notification._data.type == "is_typing") {
          console.log("notification");
          this.setState({ isUserTyping: true });
          setTimeout(() => {
            this.setState({ isUserTyping: false });
          }, 3000);
        }
        if (notification._data.type == "message") {
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, {
              _id: notification._data.message_id,
              text: notification._data.body,
              createdAt: moment.unix(notification._data.time).toDate(),
              user: {
                _id: notification._data.user_id,
                name: notification._data.username
                // avatar: this.state.userDefaultPicture
              }
            })
          }));
        }
      }
    }
  }
  componentDidMount() {
    // this.messageListener = firebase.messaging().onMessage(notification => {
    //   if (global.messageScreen == true) {
    //     if (notification._data.type == "is_typing") {
    //       console.log("notification");
    //       this.setState({ isUserTyping: true });
    //       setTimeout(() => {
    //         this.setState({ isUserTyping: false });
    //       }, 3000);
    //     }
    //     if (notification._data.type == "message") {
    //       this.setState(previousState => ({
    //         messages: GiftedChat.append(previousState.messages, {
    //           _id: notification._messageId,
    //           text: notification._data.body,
    //           createdAt: moment.unix(notification._data.time).toDate(),
    //           user: {
    //             _id: notification._data.user_id,
    //             name: notification._data.username
    //             // avatar: this.state.userDefaultPicture
    //           }
    //         })
    //       }));
    //     }
    //   }
    // });
  }

  async onSend(messages) {
    messages.forEach(message => {
      console.log(message);
      Api.sendMessage(this.state.friend_id, message.text)
        .then(res => {
          if (res.autoresponse) {
            if (res.autoresponse.header == "AutoResponse") {
              delete messages[0];
              this.setState({
                errMsg: "Please upgrade your account..",
                iconName: "credit-card",
                buttonText: "Upgrade your account",
                typeCard: "upgrade"
              });
              this.refs.upgradeCard.open();
            } else {
            }
          } else {
            this.setState(previousState => ({
              messages: GiftedChat.append(previousState.messages, message)
            }));
          }
        })
        .catch(err => {
          this.setState({
            errMsg: err
          });
          this.refs.errAlert.open();
        });
    });
    // console.log(messages);
    // messages[0]["pending"] = true;
    // this.setState(previousState => ({
    //   messages: GiftedChat.append(previousState.messages, messages)
    // }));
    // this.state.messages.filter((msg, index) => {
    //   console.log(msg);
    //   if (msg["pending"] === true) {
    //     Api.sendMessage(this.state.friend_id, msg.text)
    //       .then(res => {
    //         this.state.messages[index]["sent"] = true;
    //         this.state.messages[index]["pending"] = false;
    //         // if (res.autoresponse) {
    //         //   if (res.autoresponse.header == "AutoResponse") {
    //         //     delete messages[0];
    //         //     this.setState({
    //         //       errMsg: "Please upgrade your account..",
    //         //       iconName: "credit-card",
    //         //       buttonText: "Upgrade your account",
    //         //       typeCard: "upgrade"
    //         //     });
    //         //     this.refs.upgradeCard.open();
    //         //   } else {
    //         //   }
    //         // } else {
    //         //   this.state.messages[index]["sent"] = true;
    //         //   this.state.messages[index]["pending"] = false;
    //         // }
    //       })
    //       .catch(err => {
    //         this.setState({
    //           errMsg: err
    //         });
    //         this.refs.errAlert.open();
    //       });
    //   } else {
    //     msg = null;
    //   }
    // });
  }

  gettingConversation(friend_id) {
    this.setState({ loading: true });
    Api.loadConversation(friend_id, undefined, undefined, undefined, 100).then(
      res => {
        this.setState({
          freeReplyCount: res.freeReplyCount,
          loading: false,
          totalMsg: res.conversation.total
        });

        res.conversation.messages.map(usr => {
          console.log(usr);
          usr.sender.default_picture = usr.sender.default_picture
            ? Api._base + "/media/image/" + usr.sender.default_picture + "/3"
            : Api._base + "/media/dpi/" + 0 + "/3";
          this.setState({ userImg: usr.sender.default_picture });
          if (this.state.friend_id == usr.sender.user_id) {
            this.setState({ userDefaultPicture: usr.sender.default_picture });
          }
          this.state.messages.push({
            _id: usr.message.id,
            text: usr.message.body,
            recieve: usr.message.read === 1 ? true : false,
            // sent: true,
            createdAt: moment.unix(usr.message.rawTime).toDate(),
            user: {
              _id: usr.sender.user_id,
              recieve: usr.message.read === 1 ? true : false,
              // sent: true,
              name: usr.sender.username
              // avatar: usr.sender.default_picture
            }
          });
        });
      }
    );
  }
  onLoadEarlier = () => {
    this.setState({ isLoadingMore: true });
    let lastmsg = this.state.messages.slice(-1).pop();
    console.log(lastmsg._id);

    let moreMsg = [];
    Api.loadConversation(
      this.state.friend_id,
      lastmsg._id,
      true,
      undefined,
      200
    ).then(res => {
      this.setState({ isLoadingMore: false });

      res.conversation.messages.map(usr => {
        console.log(usr);
        moreMsg.push({
          _id: usr.message.id,
          text: usr.message.body,
          recieve: usr.message.read === 1 ? true : false,
          sent: true,
          createdAt: moment.unix(usr.message.rawTime).toDate(),
          user: {
            _id: usr.sender.user_id,
            recieve: usr.message.read === 1 ? true : false,
            sent: true,
            name: usr.sender.username,
            avatar: usr.sender.default_picture
          }
        });
      });
      this.setState(previousState => ({
        messages: GiftedChat.prepend(previousState.messages, moreMsg)
      }));
    });
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: "white",
            fontSize: 16,
            fontFamily: Fonts.LatoRegular
          },
          left: {
            fontSize: 16,
            fontFamily: Fonts.LatoRegular
          }
        }}
        wrapperStyle={{
          right: {
            backgroundColor: Colors.mainAppColor
            // borderBottomEndRadius: 10,
            // borderTopRightRadius: 0,
            // borderBottomLeftRadius: 0,
            // borderTopLeftRadius: 10
          },
          left: {
            backgroundColor: "#fff"
          }
        }}
      />
    );
  }
  setTypingState = isTyping => {
    if (isTyping) Api.isTypingTo(this.props.navigation.state.params.friendId);
  };

  resetStopTypingTimeout = () => {
    const { stopTypingTimeout } = this;
    if (stopTypingTimeout) {
      clearTimeout(stopTypingTimeout);
    }
    this.stopTypingTimeout = setTimeout(() => {
      this.isTyping = false;
      this.setTypingState(this.isTyping);
      this.stopTypingTimeout = undefined;
    }, 3000);
  };

  onTextChanged = text => {
    const { resetStopTypingTimeout } = this;
    const { setTypingState } = this;
    const isInputEmpty = text.length === 0;
    if (isInputEmpty === false) {
      if (this.isTyping === false) {
        this.isTyping = true;
        setTypingState(this.isTyping);
        resetStopTypingTimeout();
      } else {
        resetStopTypingTimeout();
      }
    } else {
      if (this.isTyping === true) {
        this.isTyping = false;
        setTypingState(this.isTyping);
        if (this.stopTypingTimeout) {
          clearTimeout(this.stopTypingTimeout);
          this.stopTypingTimeout = undefined;
        }
      }
    }
  };
  componentWillUnmount() {
    console.log("message componentWillUnmount");
    delete global.messageScreen;
  }

  render() {
    const { CurrentUser, userName } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#f0fefc" }}>
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
              onPress={() => {
                delete global.messageScreen;
                this.props.navigation.navigate("Inbox");
              }}
            />
          }
          centerComponent={
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "600",
                  fontFamily: Fonts.LatoBold,
                  color: Colors.textColor
                }}
              >
                {userName}
              </Text>
              {this.state.isUserTyping && (
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: "200",
                    fontFamily: Fonts.LatoRegular,
                    color: Colors.textColor
                  }}
                >
                  Typing ...
                </Text>
              )}
            </View>
          }
        />

        <GiftedChat
          loadEarlier={this.state.messages.length < this.state.totalMsg}
          isLoadingEarlier={this.state.isLoadingMore}
          onLoadEarlier={this.onLoadEarlier}
          renderLoading={() => <ActivityIndicator />}
          renderAvatar={null}
          renderAvatarOnTop={false}
          isAnimated={true}
          dateFormat="LL"
          timeFormat="LT"
          renderBubble={this.renderBubble}
          bottomOffset={5}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{ _id: CurrentUser }}
          onInputTextChanged={this.onTextChanged}
        />

        <Modal
          style={[styles.modal, styles.modal3]}
          position={"center"}
          ref={"modal3"}
          backdrop={true}
          isDisabled={this.state.isDisabled}
          coverScreen={true}
          backdropPressToClose={false}
        >
          <View>
            {/* <Bars size={20} color="#FC3838" /> */}
            <AnimatedLoader
              visible={this.state.iconVisible}
              source={Json.like}
              animationStyle={{
                width: 100,
                height: 100
              }}
            />
          </View>
        </Modal>

        {/* ERROR POPUP */}
        <Modal
          style={{
            borderColor: "#FC3838",
            shadowColor: "rgb(252, 56, 56)",
            marginTop: 10,
            height: 220,
            width: 300,
            backgroundColor: "white",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center"
          }}
          position={"center"}
          ref={"upgradeCard"}
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
                type="entypo"
                name={this.state.iconName}
                size={50}
                color={"#FC3838"}
              />
            </View>
            <View style={{ paddingLeft: 20, paddingRight: 10, paddingTop: 15 }}>
              <Text style={{ textAlign: "center", fontSize: 14 }}>
                {this.state.errMsg}
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text
                onPress={() => {
                  delete global.messageScreen;
                  this.props.navigation.navigate("UpgradeScreen");
                  this.refs.upgradeCard.close();
                }}
                style={{
                  color: "#FC3838",
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                {this.state.buttonText}
              </Text>
            </View>
          </View>
        </Modal>

        {/* ERROR POPUP */}
        <Modal
          style={{
            borderColor: "#FC3838",
            shadowColor: "rgb(252, 56, 56)",
            marginTop: 10,
            height: 220,
            width: 300,
            backgroundColor: "white",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center"
          }}
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
                color={"#FC3838"}
              />
            </View>
            <View style={{ paddingLeft: 20, paddingRight: 10, paddingTop: 15 }}>
              <Text style={{ textAlign: "center", fontSize: 14 }}>
                {this.state.errMsg}
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text
                onPress={() => this.refs.errAlert.close()}
                style={{
                  color: "#FC3838",
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                Review Credientials !
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
