import { StyleSheet } from "react-native";
import { Fonts, Colors } from "../../../Themes";

export default StyleSheet.create({
  textInputOfUserName: {
    alignSelf: "stretch",
    height: 40,
    margin: 5,
    color: "#757575"
  },
  heading: {
    fontSize: 16,
    fontFamily: Fonts.LatoBold,
    textAlign: "center",
    letterSpacing: 0.2
  },
  titlt: {
    fontSize: 16,
    fontFamily: Fonts.LatoBold,
    letterSpacing: 0.2
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
  PickerView: {
    borderBottomWidth: 1,
    borderColor: Colors.mainAppColor
  },
  TextAreaView: {
    borderWidth: 1,
    borderColor: Colors.mainAppColor,
    borderRadius: 5
  },
  Touchable: {
    alignSelf: "stretch",
    marginTop: 25,
    shadowColor: "rgba(46, 229, 157, 0.2)",
    shadowOpacity: 0.5,
    elevation: 0,
    shadowRadius: 20,
    shadowOffset: { width: 1, height: 5 },
    backgroundColor: "rgba(46, 229, 157, 0.2)"
  },
  Linear: {
    height: 48,
    width: 390,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3
  },
  LinearText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: Fonts.LatoBold
  }
});
