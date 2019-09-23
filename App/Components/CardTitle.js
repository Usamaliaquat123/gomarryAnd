import React from "react";
import { View, Text } from "react-native";
import EditButton from "./EditButton";
import CardItems from "./CardItems";
import { Card } from "react-native-elements";

import { Colors, Fonts } from "../Themes";

function CardTitle(props) {
  return (
    <Card
      containerStyle={{ borderRadius: 8 }}
      title={
        <View style={{ flexDirection: "column" }}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "400",
                textAlign: "left",
                color: Colors.mainAppColor,
                fontFamily: Fonts.LatoBold
              }}
            >
              {props.title}
            </Text>
            <EditButton
              sectiontext={props.section}
              navigation={props.navigation}
            />
          </View>
          <View
            style={{
              marginTop: 8,
              marginBottom: 10,
              borderBottomColor: Colors.grey,
              borderBottomWidth: 1
            }}
          />
        </View>
      }
    >
      {props.title === "Location" && (
        <Text style={{ color: Colors.black, fontFamily: Fonts.LatoBold }}>
          {props.array}
        </Text>
      )}
      {props.title !== "Location" && <CardItems array={props.array} />}
    </Card>
  );
}

export default CardTitle;
