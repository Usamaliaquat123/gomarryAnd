import React from "react";
import { createBottomTabNavigator, TabBarBottom } from "react-navigation";
import { Icon } from "react-native-elements";
import { View } from "react-native";

import MyProfileScreen from "../UserProfile/MyProfileScreen";
import DashboardScreen from "../Home/DashboardScreen";
import profilePhotoEditing from "../ProfilePhotosEditor/profilephotoEditors";
import SearchScreen from "../Search/SearchScreen";
import RequestsScreen from "../Request/RequestsScreen";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../../Themes";

export default createBottomTabNavigator(
  {
    Home: {
      screen: DashboardScreen,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          const iconName = "md-home";
          return (
            <Icon
              type="simple-line-icon"
              size={20}
              name="home"
              color="#FFFFFF"
            />
          );
        }
      }
    },
    RequestsScreen: {
      screen: RequestsScreen,
      params: { section: "approved" },
      navigationOptions: {
        title: "Requests",
        tabBarIcon: ({ focused, tintColor }) => {
          const iconName = "md-home";
          return (
            <Icon
              type="simple-line-icon"
              name={"user-follow"}
              size={20}
              color={"#FFFFFF"}
            />
          );
        }
      }
    },
    SearchScreen: {
      screen: SearchScreen,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          const iconName = "camera";
          return (
            <View
              style={{
                position: "absolute",
                alignSelf: "center",
                backgroundColor: Colors.mainAppColor,
                width: 70,
                height: 70,
                borderRadius: 35,
                bottom: 5,
                zIndex: 25,
                borderColor: "#FFF",
                borderWidth: 5
              }}
            >
              <Icon
                containerStyle={{
                  alignSelf: "center",
                  marginVertical: 12
                }}
                type="simple-line-icon"
                color={Colors.textColor}
                size={28}
                name="magnifier"
              />
            </View>
          );
        }
      }
    },
    profilePhotoEditing: {
      screen: profilePhotoEditing,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          const iconName = "ios-settings";
          return (
            <Icon
              type="simple-line-icon"
              size={20}
              name="camera"
              color="#FFFFFF"
            />
          );
        }
      }
    },
    MyProfileScreen: {
      screen: MyProfileScreen,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          const iconName = "ios-settings";
          return (
            <Icon
              type="simple-line-icon"
              size={20}
              name="user"
              color="#FFFFFF"
            />
          );
        }
      }
    }
  },
  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: Colors.mainAppColor,
      // inactiveTintColor: "gray",
      style: {
        backgroundColor: Colors.mainAppColor
      }
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",

    animationEnabled: true,
    swipeEnabled: true
  }
);
