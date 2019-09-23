import React, { Component } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Text,
  ScrollView,
  ToastAndroid
} from "react-native";
import { TabView } from "react-native-tab-view";

import LinearGradient from "react-native-linear-gradient";
import { Card, Image, Icon } from "react-native-elements";
import * as Progress from "react-native-progress";

import Api from "../../../Services/Api";
import CommonHeader from "../../../Components/CommonHeader";
import EditButton from "../../../Components/EditButton";
import ActivityOverlay from "../../../Components/ActivityOverlay";
import CardTitle from "../../../Components/CardTitle";
import ImageCard from "../../../Components/ImageCard";
import VideoCard from "../../../Components/VideoCard";
import NoImageVideo from "../../../Components/NoImageVideo";

import { Colors, Fonts } from "../../../Themes";

// Styles
import Styles from "./MyProfileScreenStyle";

export default class MyProfileScreen extends Component {
  static navigationOptions = {
    title: "My Profile",
    drawerIcon: ({ tintColor }) => (
      <Icon name="person" style={{ color: tintColor }} />
    )
  };

  constructor(props) {
    super(props);
    this.attributes = global.attributes;
    delete this.attributes["dob"];
    delete this.attributes["gender"];
    this.state = {
      index: 0,
      routes: [
        { key: "Profile", title: "Profile" },
        { key: "Images", title: "Images" },
        { key: "Videos", title: "Videos" }
      ],

      taglineEdit: true,
      section: null,
      loading: true,
      update: {},
      albums: {},
      loading: true,
      profile_picture: user.meta.profile_picture
        ? Api._base + "/media/image/" + user.meta.profile_picture + "/3"
        : Api._base + "/media/dpi/" + user.meta.gender + "/3",
      newTagline:
        global.user.meta.tagline === ""
          ? `I haven't wrote a tagline yet`
          : global.user.meta.tagline
    };
  }
  componentWillMount() {
    Api.whoami();

    Api.profile(global.username).then(async data => {
      {
        this.setState({ albums: data.user.albums, loading: false });
      }
    });
  }
  Default = id => {
    Api.defaultPicture(id)
      .then(res => {
        this.setState({
          profile_picture: Api._base + "/media/image/" + id + "/3"
        });
        ToastAndroid.show("Profile Picture is Chnage", ToastAndroid.LONG);
      })
      .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
  };
  Rotate = (id, degrees) => {
    Api.rotatePicture(id, degrees)
      .then(res => {
        this.componentWillMount();
        // this.forceUpdate();
        ToastAndroid.show("Picture is Rotate", ToastAndroid.LONG);
      })
      .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
  };
  Delete = id => {
    Api.deletePicture(id)
      .then(res => {
        this.componentWillMount();
      })
      .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
  };
  DeleteVideo = id => {
    Api.deleteVideo(id)
      .then(res => {
        this.componentWillMount();
      })
      .catch(error => ToastAndroid.show(error, ToastAndroid.LONG));
  };

  componentWillReceiveProps() {
    console.log(this.props.navigation.state.params);

    Api.whoami();
  }
  updateTagline = text => {
    this.setState({ newTagline: text });
    global.user.meta.tagline = text;
    this.forceUpdate();
    Api.updateTagLine(text)
      .then(res => this.setState({ taglineEdit: false }))
      .catch(error => {
        this.setState({ loading: false });
        ToastAndroid.show(error, ToastAndroid.LONG);
      });
  };
  render() {
    if (this.state.loading) {
      return <ActivityOverlay />;
    }
    const { albums, profile_picture } = this.state;

    const basicItems = [
      { label: "Age", value: user.meta.age },
      { label: "Ethnic Origin", value: user.data.profile.basic.ethnic_origin },
      { label: "Language", value: user.data.profile.basic.language },
      {
        label: "Second Language",
        value: user.data.profile.basic.second_language
      },
      { label: "Nationality", value: user.data.profile.basic.nationality }
    ];
    const academiaItems = [
      { label: "Ambition", value: user.data.profile.academia.ambition },
      { label: "Education", value: user.data.profile.academia.education },
      { label: "Profession", value: user.data.profile.academia.profession }
    ];
    const apperanceItems = [
      { label: "Body Type", value: user.data.profile.appearance.body_type },
      { label: "Eye Colour", value: user.data.profile.appearance.eye_colour },
      { label: "Hair Colour", value: user.data.profile.appearance.hair_colour },
      { label: "Height", value: user.data.profile.appearance.height }
    ];
    const lifeItems = [
      { label: "Children", value: user.data.profile.lifestyle.children },
      { label: "Diet", value: user.data.profile.lifestyle.diet },
      { label: "Siblings", value: user.data.profile.lifestyle.siblings },
      {
        label: "Personal Wealth",
        value: user.data.profile.lifestyle.personal_wealth
      },
      {
        label: "Personality Style",
        value: user.data.profile.lifestyle.personality
      },
      {
        label: "Religious Affiliation",
        value: user.data.profile.lifestyle.religious_status
      },
      { label: "Smoking", value: user.data.profile.lifestyle.smoking },
      {
        label: "Living Status",
        value: user.data.profile.lifestyle.living_status
      },
      {
        label: "Martial Status",
        value: user.data.profile.lifestyle.marital_status
      },
      { label: "Willing to Move", value: user.data.profile.lifestyle.move }
    ];
    const aboutItems = [
      { label: "About Me", value: user.data.profile.personal.about },
      {
        label: "Advantages of marry me",
        value: user.data.profile.personal.advantages
      },
      { label: "Family", value: user.data.profile.personal.family },
      { label: "Goals", value: user.data.profile.personal.goals },
      { label: "Hobbies", value: user.data.profile.personal.hobbies },
      { label: "Works", value: user.data.profile.personal.work },
      { label: "Seeking", value: user.data.profile.personal.seeking }
    ];

    return (
      <React.Fragment>
        <CommonHeader title={"My Profile"} />
        <ScrollView style={{ flex: 0 }}>
          <View
            style={{
              justifyContent: "space-evenly",
              flexDirection: "row"
            }}
          >
            <Image
              style={{
                width: 150,
                height: 150
              }}
              resizeMode="cover"
              source={Api.uri(profile_picture)}
            />
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-evenly"
              }}
            >
              <Text style={Styles.username}>
                {global.username},<Text> {user.meta.age}</Text>
              </Text>

              <View style={{ flex: 1, flexDirection: "row", marginTop: 5 }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <Progress.Circle
                    textStyle={{ fontSize: 16 }}
                    animated={false}
                    color={Colors.mainAppColor}
                    showsText={true}
                    progress={parseInt(user.meta.completed) / 100}
                    size={60}
                  />
                  <Text style={Styles.summaryText}>Profile Completion</Text>
                </View>

                {user.meta.trusted_member == 1 && (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <Icon
                      color={"#008000"}
                      type="simple-line-icon"
                      size={60}
                      name="check"
                    />

                    <Text style={Styles.summaryText}>Identity</Text>
                  </View>
                )}
                {user.meta.trusted_member == 0 && (
                  <TouchableOpacity
                    style={Styles.TouchableOpacity}
                    onPress={() =>
                      this.props.navigation.navigate("VerifyIdentity")
                    }
                  >
                    <LinearGradient
                      colors={["#FC3838", "#F52B43", "#ED0D51"]}
                      start={{ x: 0.7, y: 1.2 }}
                      end={{ x: 0.0, y: 0.7 }}
                      style={Styles.linear}
                    >
                      <Text
                        style={{
                          fontFamily: Fonts.LatoRegular,
                          color: "white",
                          fontWeight: "bold"
                        }}
                      >
                        Verify Identity
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "column", marginTop: 10 }}>
            <View style={{ backgroundColor: Colors.mainAppColor }}>
              <TextInput
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "300",
                  fontFamily: Fonts.LatoBold,
                  color: Colors.textColor
                }}
                value={this.state.newTagline}
                onChangeText={text => {
                  this.updateTagline(text);
                }}
              />
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
                      <CardTitle
                        title="Location"
                        section="location"
                        navigation={this.props.navigation}
                        array={user.meta.location}
                      />

                      {/* Basic */}
                      <CardTitle
                        title="Basic"
                        section="basic"
                        navigation={this.props.navigation}
                        array={basicItems}
                      />

                      {/* Academia */}
                      <CardTitle
                        title="Academia"
                        section="academia"
                        navigation={this.props.navigation}
                        array={academiaItems}
                      />

                      {/* Apperance */}
                      <CardTitle
                        title="Appearance"
                        section="appearance"
                        navigation={this.props.navigation}
                        array={apperanceItems}
                      />

                      {/* Lifestyle */}
                      <CardTitle
                        title="Lifestyle"
                        section="lifestyle"
                        navigation={this.props.navigation}
                        array={lifeItems}
                      />
                      <Card
                        containerStyle={{ borderRadius: 8, marginBottom: 50 }}
                      >
                        <EditButton
                          sectiontext="personal"
                          navigation={this.props.navigation}
                        />
                        {aboutItems.map((item, index) => (
                          <View key={index}>
                            <Text style={Styles.TabLabel}>{item.label}</Text>
                            <Text
                              style={{
                                fontFamily: Fonts.LatoRegular,
                                color: Colors.black
                              }}
                            >
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
                      <Text style={Styles.name}>{albums[0].name}</Text>
                      {albums[0].images.length == 0 && <NoImageVideo />}
                      {albums[0].images.length != 0 && (
                        <FlatList
                          data={albums[0].images}
                          keyExtractor={(item, index) => index}
                          renderItem={({ item }) => (
                            <ImageCard
                              item={item}
                              Default={this.Default}
                              Delete={this.Delete}
                              Rotate={this.Rotate}
                            />
                          )}
                          numColumns={2}
                        />
                      )}
                      <Text style={Styles.name}>{albums[1].name}</Text>

                      {albums[1].images.length == 0 && <NoImageVideo />}
                      {albums[1].images.length != 0 && (
                        <FlatList
                          data={albums[1].images}
                          keyExtractor={(item, index) => index}
                          renderItem={({ item }) => (
                            <ImageCard
                              item={item}
                              Default={this.Default}
                              Delete={this.Delete}
                              Rotate={this.Rotate}
                            />
                          )}
                          numColumns={2}
                        />
                      )}
                    </View>
                  );
                case "Videos":
                  return (
                    <View>
                      <Text style={Styles.name}>{albums[2].name}</Text>

                      {albums[2].videos.length == 0 && <NoImageVideo />}
                      {albums[2].videos.length != 0 && (
                        <FlatList
                          data={albums[2].videos}
                          keyExtractor={(item, index) => index}
                          renderItem={({ item }) => (
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "column",
                                marginBottom: 5
                              }}
                            >
                              <VideoCard
                                item={item}
                                Delete={this.DeleteVideo}
                              />
                            </View>
                          )}
                        />
                      )}
                    </View>
                  );
              }
            }}
            onIndexChange={index => this.setState({ index })}
            initialLayout={{ width: Dimensions.get("window").width }}
          />
        </ScrollView>
      </React.Fragment>
    );
  }
}
