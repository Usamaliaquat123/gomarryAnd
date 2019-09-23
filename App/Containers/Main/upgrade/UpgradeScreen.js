import React, { Component } from "react";
import { WebView } from "react-native-webview";
import Api from "../../../Services/Api";
import CommonHeaderBack from "../../../Components/CommonHeaderBack";

export default function UpgradeScreen() {
  return (
    <React.Fragment>
      <CommonHeaderBack title="Upgrade" />
      <WebView
        source={{
          headers: { "X-Auth-Token": global.token },
          uri: `${Api._base}/upgrade`
        }}
        cacheEnabled={true}
      />
    </React.Fragment>
  );
}
