import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../Themes";

export default StyleSheet.create({
  containerSignup: {
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center"
  },
  form: {
    alignSelf: "stretch"
  },
  headerLogoStyle: {
    flex: 1,
    alignSelf: "center",
    paddingTop: 15,
    paddingBottom: 30
  },
  mainLogoHeader: {
    width: 80,
    height: 80,
    resizeMode: "contain"
  },
  textInput: {
    borderWidth:1,
    borderRadius:3,
    borderColor:Colors.secondaryColor,
    alignSelf: "stretch",
    height: 45,
    fontFamily: Fonts.LatoRegular,
    marginBottom: 25,
    color: "#757575"
  },
  textInputOfUserName: {
    alignSelf: "stretch",
    height: 40,

    fontFamily: Fonts.LatoRegular,

    marginLeft: 5,
    color: "#757575"
  },
  lottie: {
    width: 100,
    height: 100
  },
  dateView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 15
  },
  actionSheetTittle: {
    color: "#000",
    fontSize: 15,
    fontFamily: Fonts.app_font,
    alignSelf: "flex-start",
    marginLeft: 10
  },
  InputView: {
    borderBottomWidth: 1,
    borderColor: Colors.mainAppColor,
    borderRadius: 0
  },
  heading: {
    fontSize: 16,
    fontFamily: Fonts.app_font,
    textAlign: "center",
    letterSpacing: 0.2
  },
  LinearGradient: {
    height: 40,
    width: 270,
    alignItems: "center",
    justifyContent: "center",
    width: 270,
    borderRadius: 3
  },
  LinearGradientText: {
    color: "white",
    fontFamily: Fonts.LatoBold,
    fontWeight: "bold"
  },
  locationIcon: {
    marginTop: 70,
    justifyContent: "center",
    alignItems: "center"
  },
  signupButton: {
    alignSelf: "stretch",
    alignSelf: "center",
    marginTop: 30,
    shadowColor: "rgba(46, 229, 157, 0.2)",
    shadowOpacity: 0.5,
    elevation: 0,
    shadowRadius: 20,
    marginBottom: 50,
    shadowOffset: { width: 1, height: 5 },
    backgroundColor: "rgba(46, 229, 157, 0.2)"
  },
  modal3: {
    marginTop: 30,
    height: 300,
    width: 300,
    backgroundColor: "rgba(255,255,255,0)"
  },
  modal: {
    justifyContent: "center",
    alignItems: "center"
  },

  modalAlert: {
    marginTop: 30,
    height: 300,
    width: 300,
    backgroundColor: "white",
    borderRadius: 10
  },
  modalAlert3: {
    justifyContent: "center",
    alignItems: "center"
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
  heading: {
    letterSpacing: 0.2,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: Fonts.LatoRegular
  },
  HearAboutUs: {
    alignSelf: "stretch",
    height: 40,
    color: "#757575"
  },

  PickerHead: {
    alignSelf: "stretch",
    height: 40,
    marginBottom: 25,
    color: "#757575"
  }
});
