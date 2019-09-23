import React from "react";
import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import { withNavigation } from "react-navigation";
import LinearGradient from "react-native-linear-gradient";

import Api from "../Services/Api";
import { Colors, Fonts } from "../Themes";

function UserCard(props) {
  const request_id = !props.request_id ? null : props.request_id;
  let isRequest = null;
  if (props.isRequest)
    isRequest =
      props.isRequest === "1" ? (
        <TouchableOpacity
          onPress={() => props.requestResponed(request_id, -1, "approved")}
        >
          <Text style={styles.removeText}>Remove Access</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ marginTop: 10 }}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => props.requestResponed(request_id, 1, "pending")}
              >
                <LinearGradient
                  colors={["#FC3838", "#F52B43", "#ED0D51"]}
                  start={{ x: 0.7, y: 1.2 }}
                  end={{ x: 0.0, y: 0.7 }}
                  style={styles.Linear}
                >
                  <Text style={styles.LinearText}>Accept</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => props.requestResponed(request_id, -1)}
              >
                <LinearGradient
                  colors={["#FC3838", "#F52B43", "#ED0D51"]}
                  start={{ x: 0.7, y: 1.2 }}
                  end={{ x: 0.0, y: 0.7 }}
                  style={styles.Linear}
                >
                  <Text style={styles.LinearText}>Decline</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
  const user = props.user;
  var profile_picture = user.meta.profile_picture
    ? Api._base + "/media/image/" + user.meta.profile_picture + "/3"
    : Api._base + "/media/dpi/" + user.meta.gender + "/3";

  const compatibility = !user.compatibility_possibility ? null : (
    <Text style={styles.subText}>
      Compatibility:
      {Math.round(
        (user.compatibility_score / user.compatibility_possibility) * 100
      )}
      %
    </Text>
  );

  const distance = !user.distance ? null : (
    <Text style={styles.subText}>Distance: {user.distance}km</Text>
  );

  const extra =
    !compatibility && !distance ? null : (
      <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
        {compatibility}
        {distance}
      </View>
    );

  return (
    <Card containerStyle={{ flex: 0 }}>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("UserProfile", {
            user_name: user.meta.username,
            userId: user.user_id
          })
        }
        style={{ flex: 1, flexDirection: "row" }}
      >
        <Image
          style={{ width: 100, height: 100 }}
          source={Api.uri(profile_picture)}
        />
        <View style={{ flex: 1, flexDirection: "column", margin: 5 }}>
          <Text style={styles.username}>{user.meta.username}</Text>
          <Text style={styles.subText}>
            {user.meta.age}, {user.meta.location}
          </Text>
        </View>
      </TouchableOpacity>
      {isRequest}
      {extra}
    </Card>
  );
}
const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  username: {
    fontWeight: "400",
    fontSize: 18,
    fontFamily: Fonts.LatoBold,
    color: Colors.mainAppColor
  },
  subText: {
    fontSize: 16,
    fontFamily: Fonts.LatoRegular
  },
  Linear: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    margin: 5,
    height: 50
  },
  LinearText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: Fonts.LatoBold
  },
  removeText: {
    margin: 10,
    fontSize: 16,
    color: "#D23A1E",
    fontFamily: Fonts.LatoBold
  }
});

export default withNavigation(UserCard);
