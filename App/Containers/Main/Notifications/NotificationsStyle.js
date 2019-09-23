import { StyleSheet } from "react-native";
import { Metrics, Colors } from "../../../Themes";

export default StyleSheet.create({
  mainContainerHome: {
    backgroundColor: "white"
  },
  card: {
    margin: 1,
    borderWidth: 0,
    borderColor: "#FFF"
  },

  image: {
    height: 40,
    width: 40,
    borderRadius: 25,
    marginBottom: 20
  },
  badge: {
    flex: 1,
    alignSelf: "flex-end"
  },
  username: {
    fontSize: 14,
    textAlign: "left",
    fontWeight: "400",
    color: Colors.mainAppColor,
    marginTop: 5,
    marginLeft: 15
  },
  message: {
    flex: 10,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    color: Colors.coal
  },
  iconView: {
    flexDirection: "row",
    position: "absolute",
    right: 0
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
