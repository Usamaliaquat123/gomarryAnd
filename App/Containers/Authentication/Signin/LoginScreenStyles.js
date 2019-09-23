import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../Themes";

export default StyleSheet.create({
  mainContainerLogin: {
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "column"
  },
  headerLogoStyle: {
    flex: 1,
    alignSelf: "center",
    paddingTop: 50,
    paddingBottom: 30
  },
  logForm: {
    alignSelf: "stretch"
  },
  textStyle: {
    fontSize: 15,
    fontFamily: Fonts.LatoBold,

    color: "#232632",
    textAlign: "center",
    paddingBottom: 10,
    fontWeight: "400"
  },
  errAlert: {
    borderColor: "#FC3838",
    shadowColor: "rgb(252, 56, 56)",
    marginTop: 10,
    height: 220,
    width: 300,
    backgroundColor: "white",
    borderRadius: 10
  },
  errAlert3: {
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    alignSelf: "stretch",
    height: 40,
    fontFamily: Fonts.app_font,
    fontSize:16,
    fontWeight: "400",
    marginBottom: 20,
    color: Colors.secondaryColor
  },
  forgotpass: {
    alignSelf: "flex-end",
    color: Colors.mainAppColor,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: Fonts.LatoBold
  },
  loginButton: {
    alignSelf: "stretch",
    alignSelf: "center",
    marginTop: 25,
    shadowColor: "rgba(46, 229, 157, 0.2)",
    shadowOpacity: 0.5,
    elevation: 0,
    shadowRadius: 20,
    shadowOffset: { width: 1, height: 5 },
    backgroundColor: "rgba(46, 229, 157, 0.2)"
  },

  donthaveaccount: {
    color: "#A9A9A9",
    fontFamily: Fonts.LatoRegular,

    alignSelf: "center",
    fontWeight: "400",
    marginTop: 20
  },
  donthaveaccountother: {
    color: Colors.mainAppColor,
    fontWeight: "600",
    fontSize: 16,

    fontFamily: Fonts.LatoBold
  },
  error: {
    borderBottomColor: "red"
  },
  modal: {
    justifyContent: "center",
    alignItems: "center"
  },
  modal3: {
    marginTop: 30,
    height: 300,
    width: 300,
    backgroundColor: "rgba(255,255,255,0)"
  },
  mainLogoHeader: {
    width: 101,
    height: 100,
    resizeMode: "contain"
  },

  lottie: {
    width: 100,
    height: 100
  }
});
