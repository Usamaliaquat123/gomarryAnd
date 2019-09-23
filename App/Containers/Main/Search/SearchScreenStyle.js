import { StyleSheet } from "react-native";
import {  Colors, Fonts } from "../../../Themes/";

export default StyleSheet.create({
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: "#800000",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    color: "white",
    fontSize: 15,
    fontFamily: Fonts.app_font,

    textAlign: "center"
  },
  rowpicker: {
    marginBottom:10,
    flex:1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  rowcheckboxes: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  checkboxes: {
    flex: 1,
    borderWidth: 0
  },
  label: {
    fontFamily: Fonts.app_font,

    color: "#A9A9A9",
    alignSelf: "center",
    fontWeight: "400"
  },
  picker: {
    flex: 1
  },
  checkboxText: {
    fontFamily: Fonts.app_font,

    color: Colors.mainAppColor,
    fontWeight: "400"
  },
  searchButton: {
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
  moreOption: {
    fontSize: 16,
    fontFamily: Fonts.app_font,

    color: Colors.mainAppColor,
    fontWeight: "400"
  }
});
