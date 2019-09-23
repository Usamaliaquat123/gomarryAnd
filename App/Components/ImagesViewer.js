import React, { Component } from "react";
import { Dimensions } from "react-native";
import Api from "../Services/Api";
import Lightbox from "react-native-lightbox";
import ActivityOverlay from "./ActivityOverlay";
import { Image } from "react-native-elements";

const WINDOW_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ImagesViewer = item => {
  return (
    <Lightbox
      renderContent={() => (
        <Image
          source={Api.uri(
            Api._base + "/media/image/" + item.item + "/3" + "?" + Math.random()
          )}
          style={{
            resizeMode: "contain",
            alignSelf: "center",
            height: SCREEN_HEIGHT,
            width: WINDOW_WIDTH,
            backgroundColor: "black"
          }}
        />
      )}
      springConfig={{ tension: 1000, friction: 1000 }}
    >
      <Image
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 150,
          borderRadius: 8
        }}
        source={Api.uri(
          Api._base + "/media/image/" + item.item + "/3" + "?" + Math.random()
        )}
        // PlaceholderContent={<ActivityOverlay />}
      />
    </Lightbox>
  );
};

export default ImagesViewer;
