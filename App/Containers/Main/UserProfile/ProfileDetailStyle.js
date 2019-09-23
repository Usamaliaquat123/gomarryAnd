import { StyleSheet } from "react-native";
import { Colors, Metrics, Fonts } from "../../../Themes";

export default StyleSheet.create({
  container: {
    paddingTop: 10,
    backgroundColor: Colors.snow
  },
  form: {
    backgroundColor: Colors.snow,
    margin: Metrics.baseMargin,
    borderRadius: 4
  },
  form2: {
    backgroundColor: Colors.snow,
    margin: Metrics.smallMargin,
    borderRadius: 4
  },
  row: {
    paddingVertical: Metrics.doubleBaseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
    flexDirection: "row",
    flex: 1
  },
  rowLabel: {
    color: Colors.charcoal,
    fontFamily: Fonts.app_font
  },
  textInput: {
    height: 40,
    color: Colors.coal,
    fontFamily: Fonts.app_font
  },
  textInputReadonly: {
    height: 40,
    color: Colors.steel,
    fontFamily: Fonts.app_font
  },
  loginRow: {
    paddingBottom: Metrics.doubleBaseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
    flexDirection: "row",
    marginTop: 10
  },
  loginButtonWrapper: {
    flex: 1
  },
  loginButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.charcoal,
    backgroundColor: Colors.panther,
    padding: 6
  },
  loginText: {
    textAlign: "center",
    color: Colors.silver,
    fontFamily: Fonts.app_font
  },
  topLogo: {
    width: "100%",
    alignSelf: "center",
    resizeMode: "contain"
  },
  error: {
    borderWidth: 1,
    borderColor: "red"
  },
  attr: {
    margin: 5,
    width: "95%",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between"
  }
});
