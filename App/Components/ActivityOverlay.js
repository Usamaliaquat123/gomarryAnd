import React from "react";
import AnimatedLoader from "react-native-animated-loader";
import { Json } from "../Themes";

export default function ActivityOverlay() {
  return (
    <AnimatedLoader
      visible={true}
      source={Json.like}
      overlayColor="white"
      animationStyle={{ width: 100, height: 100 }}
    />
  );
}
