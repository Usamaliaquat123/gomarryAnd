import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Card, Icon, Badge } from "react-native-elements";
import Api from "../Services/Api";
import { withNavigation } from "react-navigation";
import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../Themes";
function ChatCard(props) {
  const { user, onPress, isTyping, typing_id, message, messageCount } = props;
  const [lastmessage, lastMessage] = useState(user.lastMessageBody);

  const [read, unreadCount] = useState(user.unreadCount);
  const [isStar, updateStar] = useState(user.star);
  const [isToggle, updateToggle] = useState(user.star);

  useEffect(() => {
    if (!isTyping && typing_id == user.friend_id && messageCount)
      unreadCount(messageCount);
  });

  const onPressStar = friend_id => {
    Api.toggleStarredConversation(friend_id)
      .then(res => {
        updateStar(res.newstate);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onArchivedMessage = friend_id => {
    Api.toggleArchivedConversation(friend_id).then(res => {
      updateToggle(res.newstate);
    });
  };
  const openChat = () => {
    if (read != 0) {
      onPress(user.friend_id, user.username);
      unreadCount(0);
    } else {
      onPress(user.friend_id, user.username);
    }
  };
  return (
    <TouchableOpacity onPress={() => openChat()}>
      <Card containerStyle={styles.card}>
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
        >
          <View style={{ flex: 1, alignSelf: "flex-start" }}>
            <Image
              style={styles.image}
              resizeMode="cover"
              source={Api.uri(
                user.default_picture
                  ? Api._base + "/media/image/" + user.default_picture + "/3"
                  : Api._base + "/media/dpi/" + 0 + "/3"
              )}
            />
            {read != 0 && (
              <Badge
                containerStyle={styles.badge}
                status="error"
                value={read}
              />
            )}
          </View>

          <View style={{ flex: 5, flexDirection: "column" }}>
            <Text style={styles.username}>{user.username}</Text>
            {isTyping && typing_id == user.friend_id && (
              <Text style={styles.typing}>Typing...</Text>
            )}
            {!isTyping && typing_id == user.friend_id && (
              <Text style={styles.message}>
                {message ? message : lastmessage.slice(0, 100)}
              </Text>
            )}

            {typing_id != user.friend_id && (
              <Text style={styles.message}>{lastmessage.slice(0, 100)}</Text>
            )}
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end"
              // alignSelf: "flex-end"
            }}
          >
            <TouchableOpacity onPress={() => onArchivedMessage(user.friend_id)}>
              <Icon
                type="entypo"
                size={20}
                name={isToggle == 1 ? "archive" : "archive"}
                color={Colors.mainAppColor}
                containerStyle={{ marginRight: 5 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPressStar(user.friend_id)}>
              <Icon
                type="antdesign"
                size={20}
                name={isStar == 1 ? "star" : "staro"}
                color={Colors.mainAppColor}
                containerStyle={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
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
    borderRadius: 25
    // marginBottom: 20
  },
  badge: {
    position: "absolute"
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Fonts.LatoBold,
    color: Colors.mainAppColor
  },
  typing: {
    fontSize: 14,
    fontWeight: "300",
    color: Colors.green,
    fontFamily: Fonts.LatoRegular
  },
  message: {
    fontSize: 14,
    fontWeight: "300",
    color: Colors.coal,
    fontFamily: Fonts.LatoRegular
  }
});

export default withNavigation(ChatCard);
