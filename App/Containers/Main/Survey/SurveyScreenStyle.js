import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../Themes";

export default StyleSheet.create({
  textStyle: {
    color: Colors.mainAppColor,
    fontWeight: "400",
    fontSize: 18,
    marginBottom: 10,
    fontFamily: Fonts.app_font
  },
  questionListValue: {
    marginTop: 6
  },
  buttonText: {
    color: Colors.textColor,
    fontFamily: Fonts.LatoBold,
    fontSize: 16
  }
});
