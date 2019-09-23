import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { FlatList, View, ScrollView, ToastAndroid, Text } from "react-native";
import { ListItem, Icon, Image } from "react-native-elements";
import styles from "./Styles/DrawerContentStyles";
import { NavigationActions } from "react-navigation";
import { Images, Colors } from "../Themes";
import Api from "../Services/Api";

function DrawerContent({ navigation, items, getLabel, renderIcon }) {
  const logout = () => {
    Api.logout()
      .then(res => {
        AsyncStorage.removeItem("token");
        delete global.user;
        // this.props.navigation.reset(
        //   [NavigationActions.navigate({ routeName: "LoginScreen" })],
        //   0
        // );
        navigation.navigate("LoginScreen");
        // this.props.navigation.dismiss();
      })
      .catch(error => {
        ToastAndroid.show(error, ToastAndroid.LONG);
      });
  };
  var picture = user.meta.profile_picture
    ? Api._base + "/media/image/" + user.meta.profile_picture + "/3"
    : Api._base + "/media/dpi/" + user.meta.gender + "/3";

  return (
    <>
      <View style={styles.headerContainer}>
        <Image
          style={styles.logo}
          resizeMode="cover"
          source={Api.uri(picture)}
        />
        <Text style={styles.userName}>{user.meta.username}</Text>
      </View>
      <ScrollView
        style={{ backgroundColor: Colors.textColor }}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <ListItem
              containerStyle={{ backgroundColor: Colors.textColor }}
              title={getLabel({ route: item })}
              leftIcon={renderIcon({ route: item })}
              onPress={() => navigation.navigate(item.routeName)}
            />
          )}
        />
        <FlatList
          data={[{ key: "logout" }]}
          renderItem={({ item }) => (
            <ListItem
              containerStyle={{ backgroundColor: Colors.textColor }}
              title={item.key}
              leftIcon={
                <Icon
                  type="simple-line-icon"
                  name={"logout"}
                  size={20}
                  color={"#000000"}
                />
              }
              onPress={() => logout()}
            />
          )}
        />
      </ScrollView>
    </>
  );
}

export default DrawerContent;
