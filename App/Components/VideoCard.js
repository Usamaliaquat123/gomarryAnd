import React from "react";
import { View } from "react-native";
import { Icon, Card } from "react-native-elements";
import { Colors } from "../Themes";
import VideoPlayer from "./VideoPlayer";

function VideoCard(props) {
  let { item } = props;
  return (
    <Card
      containerStyle={{
        flex: 1,
        flexDirection: "column",
        alignContent: "center"
      }}
    >
      <VideoPlayer item={item} />
      <View
        style={{
          flex: 1,
          margin: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly"
        }}
      >
        <Icon
          color={Colors.mainAppColor}
          size={25}
          type="simple-line-icon"
          name="trash"
          onPress={() => props.Delete(item)}
        />
      </View>
    </Card>
  );
}

export default VideoCard;
