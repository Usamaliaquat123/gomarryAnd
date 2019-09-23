import React from "react";
import { View } from "react-native";
import Api from "../Services/Api";
import { Icon, Card } from "react-native-elements";
import { Colors } from "../Themes";

function ImageCard(props) {
  let { item } = props;
  return (
    <View style={{ flex: 1 }}>
      <Card
        image={Api.uri(
          Api._base + "/media/image/" + item + "/3" + "?" + Math.random()
        )}
        containerStyle={{ borderRadius: 8 }}
      >
        <View
          style={{
            flex: 1,
            margin: 2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly"
          }}
        >
          <Icon
            color={Colors.mainAppColor}
            size={30}
            name="rotate-left"
            type="material"
            onPress={() => {
              props.Rotate(item, -90);
            }}
          />
          <Icon
            color={Colors.mainAppColor}
            size={30}
            name="rotate-right"
            type="material"
            onPress={() => props.Rotate(item, 90)}
          />
          <Icon
            color={Colors.mainAppColor}
            size={25}
            type="simple-line-icon"
            name="check"
            onPress={() => props.Default(item)}
          />
          <Icon
            color={Colors.mainAppColor}
            size={25}
            type="simple-line-icon"
            name="trash"
            onPress={() => props.Delete(item)}
          />
        </View>
      </Card>
    </View>
  );
}

export default ImageCard;
