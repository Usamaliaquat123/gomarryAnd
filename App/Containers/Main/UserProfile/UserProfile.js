import React, { Component } from "react";
import {
  BackHandler,
  Alert,
  Dimensions,
  Platform,
  View,
  Text,
  ToastAndroid,
  TextInput
} from "react-native";
import { TabView } from "react-native-tab-view";
import { Card, Icon, Image } from "react-native-elements";
import * as Progress from "react-native-progress";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import CardView from "../../../Components/CardView";
import ActivityOverlay from "../../../Components/ActivityOverlay";
import Api from "../../../Services/Api";
import { Colors, Fonts, Images } from "../../../Themes";
import Dialog, {
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogButton
} from "react-native-popup-dialog";
import Styles from "./UserProfileStyle";
import CommonHeaderBack from "../../../Components/CommonHeaderBack";

import AlbumsList from "../../../Components/AlbumsList";
const Img = [Images.cover1, Images.cover2, Images.cover3, Images.cover4];
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.attributes = global.attributes;
    delete this.attributes["dob"];
    delete this.attributes["gender"];
    this.Index = Math.floor(Math.random() * 3);
    this.state = {
      data: "",
      reportText: "",

      index: 0,
      routes: [
        { key: "Profile", title: "Profile" },
        { key: "Images", title: "Images" },
        { key: "Videos", title: "Videos" }
      ],

      backAlertHeading: "",
      modalAlert: false,
      errMsg: "",

      loading: true,
      isfavourite: false,
      isBlocked: false,
      isReportDialogVisible: false,

      userProfilePictureShower: "",
      username: "",
      tagline: ""
    };
  }
  componentWillMount() {
    const username = this.props.navigation.state.params.user_name;
    const user_id = this.props.navigation.state.params.userId;
    console.log(username);
    console.log(user_id);
    const fav = global.user.data.favourited
      ? global.user.data.favourited.includes(user_id)
      : false;
    const block = global.user.data.blocked
      ? global.user.data.blocked.includes(user_id)
      : false;

    if (fav) {
      this.setState({ isfavourite: true });
    }
    if (block) {
      this.setState({ isBlocked: true });
    }

    this.setState({ loading: true });
    this.fetchUsers(username);
  }
  fetchUsers(username) {
    Api.profile(username)
      .then(async data => {
        {
          console.log(data);
          this.setState({
            data: data.user,
            loading: false
          });
        }
      })
      .catch(error => {
        // this.setState({ loading: false });
        ToastAndroid.show(error, ToastAndroid.LONG);
        this.props.navigation.goBack();
      });
  }
  goBack = () => {
    global.gotoLast = true;
    this.props.navigation.navigate("DashBoard");
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.goBack();
      return true;
    });
  }

  PreMessageAbility = user_to_message => {
    const { user_id } = this.state.data;

    //if male or female and is male is premium?
    if (user.meta.premium == 1) {
      this.props.navigation.navigate("SentMail", {
        friendId: user_id,
        userName: user_to_message
      });
    } else {
      this.props.navigation.navigate("UpgradeScreen");
    }
  };
  addUserToFavourite = () => {
    const { user_id } = this.state.data;
    if (this.state.isfavourite == true) {
      Api.toggleFavourite(user_id)
        .then(res => {
          this.setState({ isfavourite: false });
          ToastAndroid.show("UnFavourited Successfully", ToastAndroid.LONG);
        })
        .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
    } else {
      Api.toggleFavourite(user_id)
        .then(res => {
          this.setState({ isfavourite: true });
          ToastAndroid.show("Favourited Successfully", ToastAndroid.LONG);
        })
        .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
    }
  };

  addUserToBlock = () => {
    const { user_id } = this.state.data;

    if (this.state.isBlocked == true) {
      Api.toggleBlocked(user_id)
        .then(res => {
          this.setState({
            isBlocked: false
          });
          ToastAndroid.show("Un Blocked Sucessfully", ToastAndroid.LONG);
        })
        .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
    } else {
      Api.toggleBlocked(user_id)
        .then(res => {
          this.setState({
            isBlocked: true
          });
          ToastAndroid.show("Blocked Sucessfully", ToastAndroid.LONG);
        })
        .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
    }
  };
  SendProfileInvitation = () => {
    const { user_id } = this.state.data;

    Api.toggleInvite(user_id)
      .then(res => ToastAndroid.show("Invitation Sent", ToastAndroid.LONG))
      .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
  };
  sendReport = () => {
    const { user_id } = this.state.data;

    const { reportText } = this.state;
    Api.reportUser(user_id, reportText)
      .then(res => ToastAndroid.show("Report Sent", ToastAndroid.LONG))
      .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
  };
  sendRequest = album_id => {
    const { user_id, meta } = this.state.data;
    const { username } = meta;

    Api.photoRequest(user_id, album_id)
      .then(res => {
        this.fetchUsers(username);
        ToastAndroid.show("Request Sent", ToastAndroid.LONG);
      })
      .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
  };
  render() {
    if (this.state.loading) {
      return <ActivityOverlay />;
    }
    const { data } = this.state;
    const { albums } = data;
    const { complete } = data.completeness;
    const {
      trusted_member,
      tagline,
      location,
      profile_picture,
      username,
      age,
      premium
    } = data.meta;
    const {
      academia,
      appearance,
      lifestyle,
      personal,
      basic
    } = data.data.profile;
    const { profession, education, ambition } = academia;
    const { height, body_type, eye_colour, hair_colour } = appearance;
    const {
      advantages,
      about,
      family,
      hobbies,
      work,
      goals,
      seeking
    } = personal;

    const {
      children,
      diet,
      living_status,
      marital_status,
      move,
      personal_wealth,
      personality,
      religious_status,
      siblings,
      smoking
    } = lifestyle;
    const {
      gender,
      language,
      second_language,
      ethnic_origin,
      nationality
    } = basic;
    const basicItems = [
      { label: "Age", value: age },
      { label: "Gender", value: gender },
      { label: "Ethnic Origin", value: ethnic_origin },
      { label: "Language", value: language },
      { label: "Second Language", value: second_language },
      { label: "Nationality", value: nationality },
      { label: "Location", value: location }
    ];
    const academiaItems = [
      { label: "Ambition", value: ambition },
      { label: "Education", value: education },
      { label: "Profession", value: profession }
    ];
    const apperanceItems = [
      { label: "Body Type", value: body_type },
      { label: "Eye Colour", value: eye_colour },
      { label: "Hair Colour", value: hair_colour },
      { label: "Height", value: height }
    ];
    const lifeItems = [
      { label: "Children", value: children },
      { label: "Diet", value: diet },
      { label: "Siblings", value: siblings },
      { label: "Personal Wealth", value: personal_wealth },
      { label: "Personality Style", value: personality },
      { label: "Religious Affiliation", value: religious_status },
      { label: "Smoking", value: smoking },
      { label: "Living Status", value: living_status },
      { label: "Martial Status", value: marital_status },
      { label: "Willing to Move", value: move }
    ];
    const aboutItems = [
      { label: "About Me", value: about },
      { label: "Advantages of marry me", value: advantages },
      { label: "Family", value: family },
      { label: "Goals", value: goals },
      { label: "Hobbies", value: hobbies },
      { label: "Works", value: work },
      { label: "Seeking", value: seeking }
    ];

    const genderNo = gender === "Female" ? 2 : 1;

    var picture = profile_picture
      ? Api._base + "/media/image/" + profile_picture + "/3"
      : Api._base + "/media/dpi/" + genderNo + "/3";

    return (
      <ParallaxScrollView
        renderBackground={() => (
          <Image
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT * 0.7
            }}
            resizeMode="cover"
            source={Img[this.Index]}
          />
        )}
        renderStickyHeader={() => <CommonHeaderBack title={username} />}
        stickyHeaderHeight={Platform.select({
          android: 50,
          default: 44
        })}
        parallaxHeaderHeight={SCREEN_HEIGHT * 0.7}
        backgroundColor={Colors.textColor}
        renderForeground={() => (
          <View style={Styles.innerHeaderView}>
            <Image
              style={Styles.userProfileImage}
              resizeMode="cover"
              source={Api.uri(picture)}
            />
            <Text style={Styles.userName}>{username}</Text>
            <Text style={Styles.userTagline}>
              {tagline === "" ? `I haven't wrote a tagline yet` : tagline}
            </Text>

            <View style={Styles.innerHeaderRowView}>
              <View style={Styles.innerHeaderRowColoumView}>
                <Icon
                  color={premium == 1 ? "#008000" : "#FF0000"}
                  type={premium == 1 ? "material" : "simple-line-icon"}
                  size={50}
                  name={premium == 1 ? "verified-user" : "shield"}
                />

                <Text style={Styles.title}>Premium</Text>
              </View>
              <View style={Styles.innerHeaderRowColoumView}>
                <Icon
                  color={trusted_member == 1 ? "#008000" : "#FF0000"}
                  type="simple-line-icon"
                  size={50}
                  name={trusted_member == 1 ? "check" : "close"}
                />

                <Text style={Styles.title}>Identity</Text>
              </View>

              <View style={Styles.innerHeaderRowColoumView}>
                <Progress.Circle
                  textStyle={{ fontSize: 16 }}
                  animated={false}
                  color={"#008000"}
                  showsText={true}
                  progress={complete / 100}
                  size={50}
                />
                <Text style={Styles.title}>Completion</Text>
              </View>
            </View>
          </View>
        )}
      >
        <>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View
              style={{
                flex: 1,
                paddingVertical: 10,
                height: 70,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                backgroundColor: Colors.mainAppColor
              }}
            >
              <Icon
                color={Colors.textColor}
                size={30}
                name="bubble"
                underlayColor={Colors.mainAppColor}
                type="simple-line-icon"
                onPress={() => {
                  this.PreMessageAbility(username);
                }}
              />
              <Icon
                color={Colors.textColor}
                size={30}
                underlayColor={Colors.mainAppColor}
                name="envelope"
                type="simple-line-icon"
                onPress={this.SendProfileInvitation}
              />

              <Icon
                color={Colors.textColor}
                size={30}
                name={this.state.isfavourite ? "heart" : "hearto"}
                type="antdesign"
                underlayColor={Colors.mainAppColor}
                onPress={this.addUserToFavourite}
              />

              <Icon
                color={Colors.textColor}
                size={30}
                type="simple-line-icon"
                underlayColor={Colors.mainAppColor}
                name={this.state.isBlocked ? "lock-open" : "lock"}
                onPress={this.addUserToBlock}
              />

              <Icon
                color={Colors.textColor}
                size={30}
                underlayColor={Colors.mainAppColor}
                type="material"
                name="feedback"
                onPress={() => this.setState({ isReportDialogVisible: true })}
              />
              <Dialog
                visible={this.state.isReportDialogVisible}
                dialogTitle={
                  <DialogTitle textStyle={Styles.DialogTitle} title="Report" />
                }
                footer={
                  <DialogFooter>
                    <DialogButton
                      textStyle={Styles.DialogTitle}
                      text="CANCEL"
                      onPress={() =>
                        this.setState({ isReportDialogVisible: false })
                      }
                    />
                    <DialogButton
                      textStyle={Styles.DialogTitle}
                      text="SUBMIT"
                      onPress={() => {
                        this.setState({ isReportDialogVisible: false });
                        this.sendReport();
                      }}
                    />
                  </DialogFooter>
                }
              >
                <DialogContent>
                  <Text style={Styles.textTitle}>
                    Why are you reporting this user?
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.secondaryColor,
                      borderRadius: 5
                    }}
                  >
                    <TextInput
                      keyboardType="default"
                      autoCapitalize="none"
                      autoCorrect={false}
                      multiline={true}
                      value={this.state.reportText}
                      onChangeText={value =>
                        this.setState({ reportText: value })
                      }
                    />
                  </View>
                </DialogContent>
              </Dialog>
            </View>
          </View>

          <TabView
            sceneContainerStyle={{
              flex: 1,
              backgroundColor: Colors.textColor
            }}
            navigationState={this.state}
            renderScene={({ route, jumpTo }) => {
              switch (route.key) {
                case "Profile":
                  return (
                    <>
                      {/* Basic */}
                      <CardView title={"Basic"} array={basicItems} />

                      {/* Academia */}
                      <CardView title={"Academia"} array={academiaItems} />

                      {/* Apperance */}
                      <CardView title={"Apperance"} array={apperanceItems} />

                      {/* Lifestyle */}
                      <CardView title={"Lifestyle"} array={lifeItems} />

                      <Card
                        containerStyle={{
                          borderRadius: 8,
                          marginBottom: 50
                        }}
                      >
                        {aboutItems.map((item, index) => (
                          <View key={index}>
                            <Text style={Styles.TabLabel}>{item.label}</Text>
                            <Text style={{ color: Colors.black }}>
                              {item.value}
                            </Text>
                          </View>
                        ))}
                      </Card>
                    </>
                  );
                case "Images":
                  return (
                    <View>
                      <AlbumsList
                        albums={albums[0]}
                        request={this.sendRequest}
                      />
                      <AlbumsList
                        albums={albums[1]}
                        request={this.sendRequest}
                      />
                    </View>
                  );
                case "Videos":
                  return (
                    <View>
                      <AlbumsList
                        albums={albums[2]}
                        request={this.sendRequest}
                      />
                    </View>
                  );
              }
            }}
            onIndexChange={index => this.setState({ index })}
            initialLayout={{ width: Dimensions.get("window").width }}
          />
        </>
      </ParallaxScrollView>
    );
  }
}
