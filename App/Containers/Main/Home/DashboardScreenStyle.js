import { StyleSheet } from "react-native";
import { Metrics, Colors, Fonts } from "../../../Themes";

export default StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.mainAppColor,
    alignSelf: "center",
    marginTop: 5,
    fontFamily: Fonts.app_font
  },
  row: {
    flex: 1,
    flexDirection: "row"
  },
  maintitle: {
    fontSize: 20,
    fontFamily: Fonts.LatoBold,
    flex: 1,
    color: Colors.headingColor,
    fontWeight: "800",
    marginLeft: 2
  },
  viewall: {
    fontSize: 16,

    fontFamily: Fonts.LatoRegular,
    color: Colors.mainAppColor,
    fontWeight: "700",
    marginRight: 5
  },

  ageText: {
    fontSize: 10,
    color: Colors.secondaryColor,
    textAlign: "center",
    fontFamily: Fonts.app_font
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: "center"
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
  },
  loginRow: {
    paddingBottom: Metrics.doubleBaseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
    flexDirection: "row",
    marginTop: 10
  },
  mainContainerHome: {
    backgroundColor: "white"
  },
  modalAlert: {
    marginTop: 30,
    height: 300,
    width: 300,
    backgroundColor: "white",
    borderRadius: 10
  },
  modalAlert3: {
    justifyContent: "center",
    alignItems: "center"
  },

  informationAlert: {
    borderColor: Colors.mainAppColor,
    shadowColor: "rgb(252, 56, 56)",
    marginTop: 10,
    height: 220,
    width: 300,
    backgroundColor: "white",
    borderRadius: 10
  },
  informationAlert3: {
    justifyContent: "center",
    alignItems: "center"
  },

  lottie: {
    width: 100,
    height: 100
  }
  // normalLoader: {
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // },
  // normalLoader3: {
  //   marginTop : 30,
  //   height: 300,
  //   width: 300,
  //   backgroundColor : 'rgba(255,255,255,0)'
  // },
});
