import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  RefreshControl
} from "react-native";
import { Icon } from "react-native-elements";
import Dataset from "impagination";
import DeviceInfo from "react-native-device-info";
import Modal from "react-native-modalbox";
import LinearGradient from "react-native-linear-gradient";
import firebase from "react-native-firebase";
import {
  Notification,
  NotificationOpen,
  RemoteMessage
} from "react-native-firebase";
import Api from "../../../Services/Api";
import CommonHeader from "../../../Components/CommonHeader";
import DashboardCardView from "../../../Components/DashboardCardView";
import SampleDashBoardCard from "../../../Components/SampleDashBoardCard";
// Styles
import styles from "./DashboardScreenStyle";
import { Fonts } from "../../../Themes";
export default class DashboardScreen extends Component {
  static navigationOptions = {
    title: "Dashboard",
    drawerIcon: ({ tintColor }) => (
      <Icon
        name="md-home"
        type="ionicon"
        style={[styles.icon, { color: tintColor }]}
      />
    )
  };
  constructor(props) {
    super(props);
    this.state = {
      datasetStateOfInterestViewedMe: null,
      datasetStateOfInterestFavouritedMe: null,
      datasetStateOfInterestFavourite: null,
      dataset: null,
      datasetState: null,
      refreshing: false,
      viewedmeFlag: false,
      FavouriteFlag: false,
      FavouriteMeFlag: false,
      userProfilePictureShower: "",
      username: "",
      tagline: "",
      notificationMessageOverview: "",
      notificationMessage: "",
      // Top bar loading state
      messageOverview: "",
      message: "",
      messageFriendId: "",
      messageUserName: "",
      currentComponent: "dashboard"
    };
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.componentWillMount(this);
    this.setState({ refreshing: false });
    // this.props.rerender()
  };
  componentWillMount() {
    const SUMMARY_ID = 1;

    let GROUP = "io.invertase.firebase.messaging.RNFirebaseInstanceIdService";

    // const notification = new firebase.notifications.Notification().android
    //   .setChannelId(1)
    //   .setSubtitle("hellos")
    //   .setNotificationId(SUMMARY_ID)
    //   .android.setChannelId(1)
    //   .android.setGroup(GROUP)
    //   .android.setGroupSummary(true)
    //   .android.setAutoCancel(true)
    //   .android.setGroupAlertBehaviour(
    //     firebase.notifications.Android.GroupAlert.Children
    //   );
    // firebase.notifications().displayNotification(notification);
    firebase
      .notifications()
      .getInitialNotification()
      .then((notificationOpen: NotificationOpen) => {
        console.log("notificationOpen");
        console.log(notificationOpen);
        firebase.notifications().removeAllDeliveredNotifications();
        if (notificationOpen) {
          console.log("notificationOpen");
          const notification: Notification = notificationOpen.notification;
          console.log(notification);
          if (
            notification._data.type == "favourited" ||
            notification._data.type == "profile_invite" ||
            notification._data.type == "photo_request_approved"
          ) {
            this.props.navigation.navigate("UserProfile", {
              user_name: notification._data.username,
              userId: notification._data.triggered_by
            });
          } else if (notification._data.type == "message") {
            this.props.navigation.navigate("SentMail", {
              friendId: notification._data.user_id,
              userName: notification._data.username
            });
          } else if (notification._data.type == "photo_request") {
            this.props.navigation.navigate("RequestsScreen", {
              section: "pending"
            });
          } else if (
            notification._data.type == "photo_approved" ||
            notification._data.type == "video_approved" ||
            notification._data.type == "trusted" ||
            notification._data.type == "not_trusted"
          ) {
            this.props.navigation.navigate("MyProfileScreen");
          } else if (
            notification._data.type == "subscription_created" ||
            notification._data.type == "subscription_failed" ||
            notification._data.type == "subscription_renewed" ||
            notification._data.type == "subscription_renew_failed" ||
            notification._data.type == "subscription_event" ||
            notification._data.type == "subscription_payment" ||
            notification._data.type == "subscription_payment_pending" ||
            notification._data.type == "subscription_cancelled" ||
            notification._data.type == "strike"
          ) {
            this.props.navigation.navigate("Notifications");
          }
        }
      });
    this.setupFMessaging();
    this.testingUserMessage();
    this.setupImpaginationOfRecentUsers();
    this.setupImpaginationOfInterestFavourite();
    this.setupImpaginationOfInterestViewedMe();
    this.setupImpaginationOfInterestFavouritedMe();
  }
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //
  //
  //                       S  E  T  U  P   ------>    F  C  M         T  O  K  E  N
  //
  //
  //
  //
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  componentWillUnmount() {
    this.notificationListener();
  }
  // complete setup firebase
  setupFMessaging = async () => {
    await this.firebaseCheckPermission().then(IsUserPer => {
      if (IsUserPer == true) {
        this.firebaseGetToken().then(deviceToken => {
          this.getDeviceId().then(deviceId => {
            this.messageListener = firebase
              .messaging()
              .onMessage((message: RemoteMessage) => {
                if (message._data.type == "is_typing") {
                  if (global.Inbox && global.messageScreen == undefined) {
                    this.props.navigation.navigate("Inbox", {
                      message: message
                    });
                  } else if (global.messageScreen == message._data.friend_id) {
                    this.props.navigation.navigate("SentMail", {
                      message: message
                    });
                  }
                }
              });
            this.notificationListener = firebase
              .notifications()
              .onNotification((notification: Notification) => {
                console.log("notification");
                console.log(notification);

                if (
                  notification._data.type == "favourited" ||
                  notification._data.type == "profile_invite" ||
                  notification._data.type == "photo_request_approved"
                ) {
                  const regex = /(<([^>]+)>)/gi;
                  const result = notification._data.text.replace(regex, "");
                  this.setState({
                    localNotifyIconType: "entypo",
                    localNotifyIconName: "heart-outlined",
                    notifySenderImg: notification._data.default_picture,
                    notifySenderDesc: result
                  });
                  this.refs.featuresNotify.open();
                } else if (notification._data.type == "is_typing") {
                  if (global.Inbox && global.messageScreen == undefined) {
                    this.props.navigation.navigate("Inbox", {
                      message: notification
                    });
                  } else if (
                    global.messageScreen == notification._data.friend_id
                  ) {
                    this.props.navigation.navigate("SentMail", {
                      message: notification
                    });
                  }
                } else if (notification._data.type == "message") {
                  if (global.messageScreen == notification._data.user_id) {
                    this.props.navigation.navigate("SentMail", {
                      message: notification
                    });
                  } else if (
                    global.Inbox &&
                    global.messageScreen == undefined
                  ) {
                    this.props.navigation.navigate("Inbox", {
                      message: notification
                    });
                  } else if (global.messageScreen == undefined) {
                    this.setState({
                      messageOverview: `${notification._data.username} messaged`,
                      message: notification._data.body,
                      messageUserName: notification._data.username,
                      messageFriendId: notification._data.user_id
                    });
                    this.refs.messageInbox.open();
                  }
                }
              });
            Api.registerDeviceToken(deviceId, deviceToken)
              .then(res => {})
              .catch(err => console.log(err));
          });
        });
      } else {
        this.firebaseRequestPermission()
          .then(() => {
            this.firebaseGetToken().then(token => {
              this.getDeviceId().then(deviceId => {
                Api.registerDeviceToken(deviceId, deviceToken)
                  .then(res => {})
                  .catch(err => console.log(err));
              });
            });
          })
          .catch(() => {
            this.setState({
              errMsg: "Your device is not supported to notifications"
            });
            this.refs.errAlert.open();
          });
      }
    });
  };

  // Get device token
  firebaseGetToken = async () => {
    return new Promise(async (resolve, reject) => {
      await firebase
        .messaging()
        .getToken()
        .then(fcmToken => {
          if (fcmToken) {
            resolve(fcmToken);
          } else {
            reject("Your device is not supported to notifications");
          }
        });
    });
  };
  // Checking user permission
  firebaseCheckPermission = async () => {
    return new Promise(async (resolve, reject) => {
      await firebase
        .messaging()
        .hasPermission()
        .then(enabled => {
          if (enabled) {
            resolve(true);
          } else {
            reslove(false);
          }
        });
    });
  };
  // Request firebase permission
  firebaseRequestPermission = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        await firebase
          .messaging()
          .requestPermission()
          .then(resolve(true));
      } catch (error) {
        reject("Your device is not supported to notifications");
      }
    });
  };

  // get specific device unique id
  getDeviceId = async () => {
    return new Promise(async (resolve, reject) => {
      let deviceId = DeviceInfo.getUniqueID();
      resolve(deviceId);
    });
  };

  testingUserMessage = async () => {
    // this.backgroundNotificationListener = firebase
    //   .notifications()
    //   .onNotificationDisplayed(notification => {
    //     const localNotification = new firebase.notifications.Notification()
    //       .setNotificationId(notification.notificationId)
    //       .setTitle(notification.title)
    //       .setSubtitle(notification.subtitle)
    //       .setBody(notification.body)
    //       .setData(notification.data)
    //       .android.setChannelId("channelId");
    //     // .android.setSmallIcon("ic_launcher")
    //     firebase
    //       .notifications()
    //       .displayNotification(localNotification)
    //       .catch(err => console.error(err));
    //   });
    // this.messageListener = firebase.messaging().onMessage(notification => {
    //   console.log(notification);
    //   if (
    //     notification._data.type == "favourited" ||
    //     notification._data.type == "profile_invite"
    //   ) {
    //     const regex = /(<([^>]+)>)/gi;
    //     const result = notification._data.text.replace(regex, "");
    //     this.setState({
    //       localNotifyIconType: "entypo",
    //       localNotifyIconName: "heart-outlined",
    //       notifySenderImg: notification._data.default_picture,
    //       notifySenderDesc: result
    //     });
    //     this.refs.featuresNotify.open();
    //   }
    //   if (global.messageScreen == undefined) {
    //     console.log("notification");
    //     if (notification._data.type == "message") {
    //       this.setState({
    //         messageOverview: `${notification._data.username} messaged`,
    //         message: notification._data.body,
    //         messageUserName: notification._data.username,
    //         messageFriendId: notification._data.user_id
    //       });
    //       this.refs.messageInbox.open();
    //     }
    //   }
    // });
  };

  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  gotoUserProfile = user => {
    this.props.navigation.navigate("UserProfile", {
      user_name: user.meta.username,
      userId: user.user_id
    });
  };
  // Setup Impagination of Recent Users
  setupImpaginationOfRecentUsers() {
    let _this = this;

    let dataset = new Dataset({
      pageSize: 6,
      loadHorizon: 2,

      observe(datasetState) {
        _this.setState({ datasetState });
      },

      // Where to fetch the data from.
      fetch(pageOffset, pageSize, stats) {
        return Api.search("", pageOffset + 1, pageSize)
          .then(data => data.users)
          .catch(error => {
            _this.refs.errAlert.open();
            _this.setState({
              errMsg:
                "Looks like you are offline now. Please connect your connection and try again"
            });
          });
      }
    });
    dataset.setReadOffset(0);
    this.setState({ dataset });
  }
  // Setup Impagination of Interest favourite Users
  setupImpaginationOfInterestViewedMe() {
    let _this = this;
    let dataset = new Dataset({
      pageSize: 15,
      loadHorizon: 15,

      observe(datasetStateOfInterestViewedMe) {
        _this.setState({ datasetStateOfInterestViewedMe });
      },

      // Where to fetch the data from.
      fetch(pageOffset, pageSize, stats) {
        return Api.interests("viewedme", pageOffset + 1, pageSize)
          .then(data => {
            if (data.users.length != 0) return data.users;
            else {
              _this.setState({ viewedmeFlag: true });
              return;
            }
          })
          .catch(error => {
            _this.refs.errAlert.open();
            _this.setState({
              errMsg:
                "Looks like you are offline now. Please connect your connection and try again"
            });
          });
      }
    });
    dataset.setReadOffset(0);
    this.setState({ dataset });
  }

  // Setup Impagination of Interest favourite Users
  setupImpaginationOfInterestFavourite() {
    let _this = this;
    let dataset = new Dataset({
      pageSize: 15,
      loadHorizon: 15,
      observe(datasetStateOfInterestFavourite) {
        _this.setState({ datasetStateOfInterestFavourite });
      },
      // Where to fetch the data from.
      fetch(pageOffset, pageSize, stats) {
        return Api.interests("favourited", pageOffset + 1, pageSize)
          .then(data => {
            if (data.users.length != 0) return data.users;
            else {
              _this.setState({ FavouriteFlag: true });
              return;
            }
          })
          .catch(error => {
            _this.refs.errAlert.open();
            _this.setState({
              errMsg:
                "Looks like you are offline now. Please connect your connection and try again"
            });
          });
      }
    });
    dataset.setReadOffset(0);
    this.setState({ dataset });
  }
  // Setup Impagination of favourited Me Users
  setupImpaginationOfInterestFavouritedMe() {
    let _this = this;
    let dataset = new Dataset({
      pageSize: 15,
      loadHorizon: 15,
      observe(datasetStateOfInterestFavouritedMe) {
        _this.setState({ datasetStateOfInterestFavouritedMe });
      },
      // Where to fetch the data from.
      fetch(pageOffset, pageSize, stats) {
        return Api.interests("favouritedme", pageOffset + 1, pageSize)
          .then(data => {
            if (data.users.length != 0) return data.users;
            else {
              _this.setState({ FavouriteMeFlag: true });
              return;
            }
          })
          .catch(error => {
            _this.refs.errAlert.open();
            _this.setState({
              errMsg:
                "Looks like you are offline now. Please connect your connection and try again"
            });
          });
      }
    });
    dataset.setReadOffset(0);
    this.setState({ dataset });
  }

  // =================================================================================================================================
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // =================================================================================================================================

  renderRecentUsers() {
    if (!this.state.datasetState) return null;

    const that = this;
    return this.state.datasetState.map(function(user, index) {
      if (
        !user ||
        !user.content ||
        !user.content.meta ||
        (user.isPending && !user.isSettled)
      ) {
        return <SampleDashBoardCard />;
      }
      return (
        <DashboardCardView
          key={index}
          user={user.content}
          onPress={that.gotoUserProfile}
        />
      );
    });
  }

  // =================================================================================================================================
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // =================================================================================================================================

  renderFavouritesUsers() {
    if (!this.state.datasetStateOfInterestFavourite) return null;

    const that = this;
    return this.state.datasetStateOfInterestFavourite.map(function(
      user,
      index
    ) {
      if (
        !user ||
        !user.content ||
        !user.content.meta ||
        (user.isPending && !user.isSettled)
      ) {
        return <SampleDashBoardCard />;
      }
      return (
        <DashboardCardView
          key={index}
          user={user.content}
          onPress={that.gotoUserProfile}
        />
      );
    });
  }

  // =================================================================================================================================
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // =================================================================================================================================
  renderViewedMeUsers() {
    if (!this.state.datasetStateOfInterestViewedMe) return null;

    const that = this;
    return this.state.datasetStateOfInterestViewedMe.map(function(user, index) {
      if (
        !user ||
        !user.content ||
        !user.content.meta ||
        (user.isPending && !user.isSettled)
      ) {
        return <SampleDashBoardCard />;
      }
      return (
        <DashboardCardView
          key={index}
          user={user.content}
          onPress={that.gotoUserProfile}
        />
      );
    });
  }
  // =================================================================================================================================
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // =================================================================================================================================
  renderFavouritedMe() {
    if (!this.state.datasetStateOfInterestFavouritedMe) return null;
    const that = this;
    return this.state.datasetStateOfInterestFavouritedMe.map(function(
      user,
      index
    ) {
      if (
        !user ||
        !user.content ||
        !user.content.meta ||
        (user.isPending && !user.isSettled)
      ) {
        return <SampleDashBoardCard />;
      }
      return (
        <DashboardCardView
          key={index}
          user={user.content}
          onPress={that.gotoUserProfile}
        />
      );
    });
  }
  // =================================================================================================================================
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // =================================================================================================================================

  render() {
    return (
      <React.Fragment>
        <CommonHeader title="GoMarry" />
        <ScrollView
          style={[styles.mainContainerHome, { backgroundColor: "#F0F8FF" }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View
            style={[
              styles.row,
              {
                marginTop: 10,
                marginLeft: 5
              }
            ]}
          >
            <Text style={styles.maintitle}>Recent Users</Text>
            <TouchableOpacity
              onPress={() =>
                // this.props.navigation.navigate("AllRecentUsersScreen")
                this.props.navigation.navigate("ViewAll", {
                  title: "Recent Users",
                  filter: "recent"
                })
              }
              style={{ backgroundColor: "#F0F8FF" }}
            >
              <Text style={styles.viewall}>View all >></Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ backgroundColor: "#F0F8FF" }}
          >
            {this.renderRecentUsers()}
          </ScrollView>
          {!this.state.FavouriteFlag && (
            <React.Fragment>
              <View
                style={[
                  styles.row,
                  {
                    marginTop: 1,
                    marginLeft: 5
                  }
                ]}
              >
                <Text style={styles.maintitle}>Favourited Users</Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ViewAll", {
                      section: "favourited",
                      title: "Favourite Users"
                    })
                  }
                  style={{ backgroundColor: "#F0F8FF" }}
                >
                  <Text style={styles.viewall}>View all >></Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={{ backgroundColor: "#F0F8FF" }}
              >
                {this.renderFavouritesUsers()}
              </ScrollView>
            </React.Fragment>
          )}

          {!this.state.viewedmeFlag && (
            <React.Fragment>
              <View style={styles.row}>
                <Text style={styles.maintitle}>Viewed me</Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ViewAll", {
                      section: "viewedme",
                      title: "Viewed Me"
                    })
                  }
                >
                  <Text style={styles.viewall}>View all >></Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={{ backgroundColor: "#F0F8FF" }}
              >
                {this.renderViewedMeUsers()}
              </ScrollView>
            </React.Fragment>
          )}
          {!this.state.FavouriteMeFlag && (
            <React.Fragment>
              <View style={styles.row}>
                <Text style={styles.maintitle}>Favourited me</Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ViewAll", {
                      section: "favouritedme",
                      title: "Favourited Me"
                    })
                  }
                >
                  <Text style={styles.viewall}>View all >></Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              >
                {this.renderFavouritedMe()}
              </ScrollView>
            </React.Fragment>
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
                  color={"#FC3838"}
                />
              </View>
              <View
                style={{ paddingLeft: 20, paddingRight: 10, paddingTop: 15 }}
              >
                <Text style={{ textAlign: "center", fontSize: 14 }}>
                  {this.state.errMsg}
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text
                  onPress={() => this.refs.errAlert.close()}
                  style={{
                    fontFamily: Fonts.app_font,
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

          <Modal
            style={[styles.errAlert, styles.errAlert3]}
            position={"center"}
            x
            ref={"messageInbox"}
            backdrop={true}
            coverScreen={true}
            backdropPressToClose={true}
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
                  name="message1"
                  size={50}
                  color={"#FC3838"}
                />
              </View>
              <View
                style={{ paddingLeft: 20, paddingRight: 10, paddingTop: 15 }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                >
                  {this.state.messageOverview}
                </Text>
                <Text style={{ textAlign: "center", fontSize: 14 }}>
                  {this.state.message}
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => {
                    this.refs.messageInbox.close();
                    this.props.navigation.navigate("SentMail", {
                      friendId: this.state.messageFriendId,
                      userName: this.state.messageUserName
                    });
                  }}
                >
                  <LinearGradient
                    colors={["#FC3838", "#F52B43", "#ED0D51"]}
                    start={{ x: 0.7, y: 1.2 }}
                    end={{ x: 0.0, y: 0.7 }}
                    style={{
                      height: 48,
                      width: 240,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 50
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Check Your inbox now...
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            style={{
              borderColor: "#FC3838",
              shadowColor: "rgb(252, 56, 56)",
              marginTop: 10,
              height: 180,
              width: 300,
              backgroundColor: "white",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center"
            }}
            position={"center"}
            x
            ref={"notificationPopup"}
            backdrop={true}
            coverScreen={true}
            backdropPressToClose={true}
          >
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Icon
                  type="material"
                  name="notifications-active"
                  size={50}
                  color={"#FC3838"}
                />
              </View>
              <View
                style={{ paddingLeft: 20, paddingRight: 10, paddingTop: 15 }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                >
                  {this.state.notificationMessageOverview}
                </Text>
                <Text style={{ textAlign: "center", fontSize: 14 }}>
                  {this.state.notificationMessage}
                </Text>
              </View>
              <View style={{ marginTop: 10 }} />
            </View>
          </Modal>

          <Modal
            style={{
              borderColor: "#FC3838",
              shadowColor: "rgb(252, 56, 56)",
              marginTop: 10,
              height: 95,
              width: 300,
              backgroundColor: "white",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center"
            }}
            position={"center"}
            x
            ref={"featuresNotify"}
            backdrop={true}
            coverScreen={true}
            backdropPressToClose={true}
          >
            <Image
              style={{
                height: 80,
                width: 80,
                borderRadius: 50,
                marginTop: -30,
                marginBottom: 20,
                alignSelf: "center"
                // float : 'right'
              }}
              resizeMode="cover"
              source={Api.uri(
                this.state.notifySenderImg
                  ? Api._base +
                      "/media/image/" +
                      this.state.notifySenderImg +
                      "/3"
                  : Api._base + "/media/dpi/" + 1 + "/3"
              )}
            />
            <View>
              <View
                style={{ paddingLeft: 20, paddingRight: 10, marginTop: -5 }}
              >
                <Text
                  style={{
                    // textAlign: "center",
                    fontSize: 12,
                    fontWeight: "bold"
                  }}
                >
                  {this.state.notifySenderDesc}
                </Text>
                <Text style={{ textAlign: "center", fontSize: 12 }}>
                  {`${this.state.notificationMessage}`}
                </Text>
              </View>

              <View style={{ marginTop: 10 }} />
            </View>
          </Modal>
        </ScrollView>
      </React.Fragment>
    );
  }
}
