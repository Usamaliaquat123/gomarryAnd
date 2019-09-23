import { Colors, Fonts } from "../../Themes";
export default {
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.mainAppColor,
    height: 150
  },
  logo: {
    marginLeft: 20,
    paddingVertical: 10,
    width: 100,
    height: 100,
    borderRadius: 75
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
    marginLeft: 20,
    marginTop: 10,
    fontFamily: Fonts.LatoBold
  }
};
