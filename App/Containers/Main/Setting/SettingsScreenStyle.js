import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../Themes";

export default StyleSheet.create({
  linear: {
    height: 48,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3
  },
  cardStyle: { borderRadius: 8 },
  TouchableOpacity: {
    alignSelf: "stretch",
    alignSelf: "center",
    marginTop: 5,
    shadowColor: "rgba(46, 229, 157, 0.2)",
    shadowOpacity: 0.5,
    elevation: 0,
    shadowRadius: 20,
    shadowOffset: { width: 1, height: 5 },
    backgroundColor: "rgba(46, 229, 157, 0.2)"
  },
  textInput: {
    alignSelf: "stretch",
    height: 40,
    marginBottom: 25,
    color: Colors.secondaryColor
  },
  DialogTitle: {
    color: Colors.mainAppColor,
    fontSize: 14,
    fontFamily: Fonts.app_font,

    fontWeight: "400"
  },
  textTitle: {
    fontSize: 20,
    marginBottom: 3,
    fontFamily: Fonts.app_font,

    alignItems: "center",
    alignContent: "center",
    color: Colors.secondaryColor
  },
  warningText: {
    margin: 5,
    textAlign: "center",
    fontFamily: Fonts.app_font,

    fontSize: 18,
    fontWeight: "400",
    color: Colors.mainAppColor
  },
  warningView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 100,
    alignContent: "center"
  }
});
