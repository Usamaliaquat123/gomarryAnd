import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Icon } from "react-native-elements";
import DrawerContent from "../Containers/DrawerContent";
import SurveyScreen from "../Containers/Main/Survey/SurveyScreen";
import mainTab from "../Containers/Main/MainTab/mainTab";
import MessagingTabs from "../Containers/Main/Messages/MessagingTabs/MessagingTabs";
import SettingsScreen from "../Containers/Main/Setting/SettingsScreen";
import Notifications from "../Containers/Main/Notifications/Notifications";

const NavigationDrawer = createDrawerNavigator(
  {
    MainTab: {
      screen: mainTab,
      navigationOptions: ({ navigation }) => ({
        title: ` Dashboard`,
        drawerIcon: ({ tintColor }) => (
          <Icon
            type="simple-line-icon"
            name={"home"}
            size={20}
            color={"#000000"}
          />
        )
      })
    },
    // SearchScreen: { screen: SearchScreen },
    MessagesScreen: {
      screen: MessagingTabs,
      navigationOptions: ({ navigation }) => ({
        title: ` Messages`,
        drawerIcon: ({ tintColor }) => (
          <Icon
            type="antdesign"
            name={"message1"}
            size={20}
            color={"#000000"}
          />
        )
      })
    },
  
    SurveyScreen: {
      screen: SurveyScreen,
      navigationOptions: {
        title: "Marriage Survey",
        drawerIcon: ({ tintColor }) => (
          <Icon type="antdesign" name={"profile"} size={20} color={"#000000"} />
        )
      }
    },
    SettingsScreen: {
      screen: SettingsScreen,
      navigationOptions: {
        title: "Settings",
        drawerIcon: ({ tintColor }) => (
          <Icon
            type="simple-line-icon"
            name={"settings"}
            size={20}
            color={"#000000"}
          />
        )
      }
    },
    NotificationScreen: {
      screen: Notifications,
      navigationOptions: {
        title: "Notifications",
        drawerIcon: ({ tintColor }) => (
          <Icon
            type="feather"
            name={"bell"}
            size={20}
            color={"#000000"}
          />
        )
      }
    }
  },
  {
    initialRouteName: "MainTab",
    contentComponent: props => <DrawerContent {...props} />
  }
);

export default NavigationDrawer;
