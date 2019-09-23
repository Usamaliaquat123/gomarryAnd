import React from "react";
import { View, Text, Image } from "react-native";
import { Card } from "react-native-elements";
import { Images } from "../Themes";
function SampleUserCard() {
  return (
    <Card style={{ flex: 0 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start"
        }}
      >
        <Image
          style={{ width: 100, height: 100 }}
          blurRadius={6}
          source={Images.Boy}
        />
        <View style={{ flexDirection: "column", margin: 20 }}>
          <Text>{"-----------"}</Text>
          <Text note>
            {"--------"}, {"--------"}
          </Text>
        </View>
      </View>
    </Card>
  );
}

export default SampleUserCard;
