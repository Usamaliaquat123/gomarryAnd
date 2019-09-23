import React, { Component } from "react";
import { BackHandler, TouchableOpacity, View } from "react-native";
import { Icon, Text, Image, Card } from "react-native-elements";
// import { Upload } from "react-native-tus-client";
import tus from "tus-js-client"

import LinearGradient from "react-native-linear-gradient";
// import ImagePicker from "react-native-image-crop-picker";
import ImagePicker from 'react-native-image-picker';

import Api from "../../../Services/Api";

import { Images, Colors, Fonts } from "../../../Themes";
import CommonHeaderBack from "../../../Components/CommonHeaderBack";

// Styles
import Styles from "./VerifyIdentityStyle";
import { ScrollView } from "react-native-gesture-handler";

export default class VerifyIdentity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      uploadedBytes: 0,
      totalBytes: 0,
      file: null,
      filename:null,
      filetype:null,
      status: "no file selected"
    };

    this.startUpload = this.startUpload.bind(this);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.goBack();
      return true;
    });
  }
  selectPhotoTapped() {
    ImagePicker.showImagePicker({} ,result => {
      console.log("result",result)
      if (!result.cancelled) {
        if (result.type === "image/jpeg")
          this.setState({
            file: result,
            filename:result.fileName,
            filetype:result.type,
            status: "file selected"
          });
        else console.log(result)
      }
    });
  }

  getFileExtension(uri) {
    const match = /\.([a-zA-Z]+)$/.exec(uri);
    if (match !== null) {
      return match[1];
    }
    return "";
  }

  getMimeType(extension) {
    if (extension === "jpg") return "image/jpeg";
    return `image/${extension}`;
  }
  startUpload() {
    const {file,filename,filetype} =this.state
    console.log("welcome in upload");
    if (!file) return;
    console.log(token,file);
    const upload = new tus.Upload(file, {
      headers: { "X-Auth-Token": token },
      endpoint: `${Api._base}/api/submitVerificationPicture`, // use goMarry tus server endpoint instead
      retryDelays: [0, 1000, 3000, 5000],
      metadata: {
        filename,
        filetype
      },
      onError: error => {

        this.setState({
          status: `upload failed ${error}`
        });
      },
      onProgress: (uploadedBytes, totalBytes) => {
        console.log(uploadedBytes, totalBytes);
        this.setState({
          totalBytes: totalBytes,
          uploadedBytes: uploadedBytes
        });
      },
      onSuccess: () => {
        this.setState({
          status: "upload finished"
        });
      }
    });

    upload.start();

    this.setState({
      status: "upload started",
      uploadedBytes: 0,
      totalBytes: 0
    });
  }

  render() {
    const { file } = this.state;
    return (
      <ScrollView style={{ backgroundColor: Colors.textColor }}>
        <CommonHeaderBack title="Verify Identity" />
        <Card
          title="Become a trusted member today"
          containerStyle={{ borderRadius: 8, flexDirection: "column" }}
        >
          <Text style={Styles.textStyles}>
            Become a trusted member by verifying your identity. Other people on
            the site will see a green tick next to your name which will indicate
            to them your profile has been verified as genuine.
          </Text>
          <Text style={[Styles.textStyles2, { marginTop: 10 }]}>
            Status: {this.state.status}
          </Text>
          <Text style={Styles.textStyles2}>
            {this.state.uploadedBytes} of {this.state.totalBytes}
          </Text>
          <Image
            style={Styles.idImage}
            resizeMode="cover"
            source={file ? { uri: file.uri } : Images.verifyID}
          />

          <Text style={Styles.textStyles2}>
            Upload a photo of yourself holding your own photo ID
          </Text>

          <View style={Styles.rowButton}>
            <TouchableOpacity
              style={Styles.TouchableOpacity}
              onPress={() => this.selectPhotoTapped()}
            >
              <LinearGradient
                colors={["#FC3838", "#F52B43", "#ED0D51"]}
                start={{ x: 0.7, y: 1.2 }}
                end={{ x: 0.0, y: 0.7 }}
                style={Styles.linear}
              >
                <Text
                  style={{
                    fontFamily: Fonts.app_font,
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  Browse...
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={Styles.TouchableOpacity}
              onPress={() => this.startUpload()}
            >
              <LinearGradient
                colors={["#FC3838", "#F52B43", "#ED0D51"]}
                start={{ x: 0.7, y: 1.2 }}
                end={{ x: 0.0, y: 0.7 }}
                style={Styles.linear}
              >
                <Text
                  style={{
                    fontFamily: Fonts.app_font,
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  Submit
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Text style={Styles.textStyles}>
            Once verified, the image you upload will be destroyed
          </Text>
        </Card>
      </ScrollView>
    );
  }
}
