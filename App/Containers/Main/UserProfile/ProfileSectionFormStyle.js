import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../Themes";

export default StyleSheet.create({
  textTitle: {
    fontSize: 16,
    margin: 5,
    fontFamily: Fonts.app_font,
    color: Colors.mainAppColor
  },
  textInput: {
    alignSelf: "stretch",
    height: 40,
    marginBottom: 25,
    fontFamily: Fonts.app_font,
    color: Colors.secondaryColor
  },
  errAlert: {
    color: Colors.mainAppColor,
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
  buttonText: {
    color: Colors.textColor,
    fontFamily: Fonts.LatoBold,
    fontSize: 16
  }
});
