import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../Themes";

export default StyleSheet.create({
  warningText: {
    justifyContent: "center",
    textAlign: "center",
    marginTop: 100,
    alignContent: "center",
    fontSize: 26,
    fontWeight: "400",
    fontFamily: Fonts.LatoBold,
    color: Colors.secondaryColor,
    backgroundColor: Colors.textColor
  },
  activeTabText: {
    fontSize: 18,
    fontWeight: "400",
    fontFamily: Fonts.LatoRegular,

    color: Colors.mainAppColor
  },
  TabText: {
    fontSize: 16,
    fontFamily: Fonts.LatoBold,

    fontWeight: "400",
    color: Colors.mainAppColor
  },
  name: {
    fontSize: 20,
    fontFamily: Fonts.LatoBold,

    fontWeight: "500",
    color: Colors.mainAppColor,
    margin: 5
  },
  username: {
    fontSize: 26,
    fontWeight: "900",
    fontFamily: Fonts.LatoBold,

    color: Colors.black,
    textAlign: "center",
    margin: 2
  },
  summaryText: {
    textAlign: "center",
    fontFamily: Fonts.LatoRegular
  },
  linear: {
    height: 40,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3
  },
  TouchableOpacity: {
    alignSelf: "center",
    flex: 1,
    shadowColor: "rgba(46, 229, 157, 0.2)",
    marginRight: 5,
    backgroundColor: "rgba(46, 229, 157, 0.2)"
  },
  rowProfile: {
    justifyContent: "space-between",
    flexDirection: "row",
    flex: 1
  },
  flatListContainer: {
    paddingTop: 10
  },
  TabLabel: {
    color: Colors.mainAppColor,
    marginTop: 5,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: Fonts.LatoBold
  },
  editIconView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 2
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
  }
});
