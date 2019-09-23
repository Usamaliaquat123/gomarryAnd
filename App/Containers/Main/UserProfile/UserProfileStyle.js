import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../Themes";

export default StyleSheet.create({
  warningText: {
    justifyContent: "center",
    textAlign: "center",
    marginTop: 50,
    alignContent: "center",
    fontSize: 20,
    fontFamily: Fonts.app_font,

    fontWeight: "400",
    color: Colors.secondaryColor
  },
  activeTabText: {
    fontSize: 18,
    fontFamily: Fonts.app_font,

    fontWeight: "400",
    color: Colors.mainAppColor
  },
  TabText: {
    fontSize: 16,
    fontFamily: Fonts.app_font,

    fontWeight: "400",
    color: Colors.mainAppColor
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.app_font,

    fontWeight: "400",
    color: Colors.mainAppColor,
    margin: 5
  },
  textInput: {
    height: 40,
    fontFamily: Fonts.app_font
  },
  DialogTitle: {
    fontWeight: "400",
    fontSize: 14,
    fontFamily: Fonts.app_font,

    color: Colors.mainAppColor
  },
  userName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFF",
    marginTop: 5,
    fontFamily: Fonts.app_font,
    textAlign: "center",
    textShadowRadius: 20,
    textShadowColor: Colors.coal
  },
  userTagline: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "300",
    marginTop: 5,
    fontFamily: Fonts.app_font,
    textAlign: "center",
    textShadowRadius: 20,
    textShadowColor: Colors.coal
  },

  innerHeaderRowView: {
    flexDirection: "row",
    marginTop: 30
  },
  innerHeaderRowColoumView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center"
  },
  title: {
    color: "#FFF",
    textAlign: "center",
    textShadowRadius: 20,
    fontFamily: Fonts.app_font,

    textShadowColor: Colors.coal
  },
  innerHeaderView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center"
  },
  userProfileImage: {
    width: 150,
    height: 150,
    alignContent: "center",
    borderRadius: 75
  },
  textTitle: {
    fontSize: 20,
    marginBottom: 3,
    fontFamily: Fonts.app_font,

    alignItems: "center",
    alignContent: "center",
    color: Colors.secondaryColor
  },
  imageContainer: {
    flex: 1,
    flexDirection: "column",
    margin: 1
  },
  videoContainer: {
    justifyContent: "center",
    marginBottom: 10
  },
  TabLabel: {
    fontFamily: Fonts.app_font,
    color: Colors.mainAppColor,
    marginTop: 10,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "400"
  }
});
