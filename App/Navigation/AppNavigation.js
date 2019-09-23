import { createStackNavigator, createAppContainer } from "react-navigation";
import LaunchScreen from "../Containers/LaunchScreen";
import LoginScreen from "../Containers/Authentication/Signin/LoginScreen";
import SignupScreen from "../Containers/Authentication/Signup/SignupScreen";
import SignupStage2Screen from "../Containers/Authentication/Signup/SignupStage2Screen";
import VerifyEmail from "../Containers/Authentication/Signup/VerifyEmail";

import forgotPassword from "../Containers/Authentication/forgotPassword/forgotPassword";
import HomeNavigation from "./HomeNavigation";

import styles from "./Styles/NavigationStyles";
import BadRequest from "../Containers/BadRequest";

// Manifest of possible screens
const Auth = createStackNavigator(
  {
    LaunchScreen: { screen: LaunchScreen },
    LoginScreen: { screen: LoginScreen },
    SignupScreen: { screen: SignupScreen },
    SignupStage2Screen: { screen: SignupStage2Screen },
    forgotPassword: { screen: forgotPassword },
    VerifyEmail: { screen: VerifyEmail },

    BadRequest: { screen: BadRequest },
    HomeNavigation: { screen: HomeNavigation }
  },
  {
    headerMode: "none",
    initialRouteName: "LaunchScreen",
    navigationOptions: {
      headerStyle: styles.header
    }
  }
);

const AppNav = createAppContainer(Auth);
export default AppNav;
