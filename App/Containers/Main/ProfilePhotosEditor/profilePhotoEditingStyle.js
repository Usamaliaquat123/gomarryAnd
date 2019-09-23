import { StyleSheet } from "react-native";
import { Colors ,Fonts} from "../../../Themes";

export default StyleSheet.create({
  warningText: {
    justifyContent: "center",
    textAlign: "center",
    marginTop: 10,
    alignContent: "center",
    fontSize: 26,
    fontFamily: Fonts.app_font,

    fontWeight: "400",
    color: Colors.secondaryColor
  },
  flatListContainer: {
    paddingTop: 10,
    backgroundColor: Colors.snow
  },
  imageContainer: {
    flex: 1,
    flexDirection: "column",
    margin: 1
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 10
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
  }
});
