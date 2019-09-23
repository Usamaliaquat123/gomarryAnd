import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../Themes";

export default StyleSheet.create({
  linear: {
    height: 40,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3
  },

  idImage: {
    margin: 10,
    width: 250,
    height: 250,
    alignSelf: "center"
  },

  innerView: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  rowButton: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-around"
  },
  textStyles: {
    fontFamily: Fonts.app_font,
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#74B9FF"
  },
  textStyles2: {
    fontFamily: Fonts.app_font,
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#383833"
  },
  textHeader: {
    fontFamily: Fonts.app_font,
    fontSize: 15,
    fontWeight: "300",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: Colors.mainAppColor
  }
});
