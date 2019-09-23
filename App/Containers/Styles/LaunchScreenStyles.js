import { StyleSheet } from "react-native";

export default StyleSheet.create({
  logo: {
    width: 101,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 150,
    alignContent: "center"
  },
  container: {
    flexDirection: "row",
    justifyContent: "center"
    // alignContent: "center",
    // alignItems: "stretch",
    // alignSelf: "center",
  },
  loader: {
    width: 100,
    height: 100,
    alignSelf: "center",
    alignContent: "center",

    marginTop: 20
  }
});
