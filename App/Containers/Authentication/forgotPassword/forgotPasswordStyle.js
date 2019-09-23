import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../Themes";

export default StyleSheet.create({
  mainContainerForgot: {
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  headerLogoStyle: {
    flex: 1,
    alignSelf: "center",
    paddingTop: 50,
    paddingBottom: 30
  },
  forgotForm: {
    alignSelf: "stretch"
  },
  textStyle: {
    fontSize: 18,
    fontFamily: Fonts.LatoBold,

    color: "#232632",
    textAlign: "center",
    paddingBottom: 10,
    fontWeight: "400"
  },
  textStyleContinue: {
    fontFamily: Fonts.LatoRegular,

    fontSize: 16,
    color: "#A4A4A4",
    textAlign: "center",
    paddingBottom: 10,
    marginTop: 10,
    fontWeight: "400"
  },
  mainLogoHeader: {
    width: 101,
    height: 100,
    resizeMode: "contain"
  },
  textInput: {
    fontFamily: Fonts.LatoRegular,

    alignSelf: "stretch",
    height: 40,
    marginBottom: 25,
    color: "#757575"
  },
  forgotpass: {
    fontFamily: Fonts.app_font,

    alignSelf: "flex-end",
    color: Colors.secondaryColor,
    fontWeight: "400"
  },
  resetButton: {
    alignSelf: "stretch",
    alignSelf: "center",
    marginTop: 25,
    shadowColor: "rgba(46, 229, 157, 0.2)",
    shadowOpacity: 0.5,
    elevation: 5,
    shadowRadius: 20,
    shadowOffset: { width: 1, height: 5 },
    backgroundColor: "rgba(46, 229, 157, 0.2)"
  },
  orText: {
    fontFamily: Fonts.app_font,

    color: "#232632",
    alignSelf: "center",
    fontWeight: "400",
    marginTop: 20
  },
  continueSocialText: {
    color: "#232632",
    alignSelf: "center",
    fontFamily: Fonts.app_font,

    marginTop: 15
  },
  donthaveaccount: {
    color: "#A9A9A9",
    fontFamily: Fonts.app_font,

    alignSelf: "center",
    fontWeight: "bold",
    marginTop: 30
  },
  donthaveaccountother: {
    color: Colors.mainAppColor,
    fontFamily: Fonts.app_font,

    fontWeight: "bold"
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
    elevation: 10
  },
  modalText: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 20
  }
});
