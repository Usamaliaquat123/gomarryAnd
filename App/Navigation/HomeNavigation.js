import { createStackNavigator, createAppContainer } from "react-navigation";
import NavigationDrawer from "./NavigationDrawer";
import UserProfile from "../Containers/Main/UserProfile/UserProfile";
import VerifyIdentity from "../Containers/Main/UserProfile/VerifyIdentity";
import UpgradeScreen from "../Containers/Main/upgrade/UpgradeScreen";
import DashboardScreen from "../Containers/Main/Home/DashboardScreen";
import mainTab from "../Containers/Main/MainTab/mainTab";
import MyProfileScreen from "../Containers/Main/UserProfile/MyProfileScreen";
import ProfileSectionForm from "../Containers/Main/UserProfile/ProfileSectionForm";
import MessagingTabs from "../Containers/Main/Messages/MessagingTabs/MessagingTabs";
import SentMail from "../Containers/Main/Messages/MessagingTabs/SentMail/SentMail";
import ViewAll from "../Components/ViewAll";

import styles from "./Styles/NavigationStyles";
// Manifest of possible screens
const Home = createStackNavigator(
  {
    NavigationDrawer: { screen: NavigationDrawer },

    MyProfileScreen: { screen: MyProfileScreen },
    UserProfile: { screen: UserProfile },
    UpgradeScreen: { screen: UpgradeScreen },
    VerifyIdentity: { screen: VerifyIdentity },
    ProfileSectionForm: { screen: ProfileSectionForm },
    MessagingTabs: { screen: MessagingTabs },
    SentMail: { screen: SentMail },
    DashboardScreen: { screen: DashboardScreen },
    TabNavigationSetting: { screen: mainTab },
    ViewAll: { screen: ViewAll }
  },
  {
    headerMode: "none",
    initialRouteName: "NavigationDrawer",
    navigationOptions: {
      headerStyle: styles.header
    }
  }
);

const HomeNav = createAppContainer(Home);
export default HomeNav;
