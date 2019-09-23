import React, {Component} from 'react';
import {View, Text, ScrollView, FlatList} from 'react-native';
import Toast from 'react-native-root-toast';

import {Icon} from 'react-native-elements';
// import ImagePicker from "react-native-image-crop-picker";
import ImagePicker from 'react-native-image-picker';

// import { Upload } from "react-native-tus-client";
import tus from 'tus-js-client';
import Modal from 'react-native-modalbox';
import ProgressBar from 'react-native-progress/Bar';

import Api from '../../../Services/Api';
import CommonHeader from '../../../Components/CommonHeader';
import ImagesViewer from '../../../Components/ImagesViewer';
import VideoPlayer from '../../../Components/VideoPlayer';
import AddPhotoVideo from '../../../Components/AddPhotoVideo';
import ActivityOverlay from '../../../Components/ActivityOverlay';
import Styles from './profilePhotoEditingStyle';
import NoImageVideo from '../../../Components/NoImageVideo';

class profilePhotoEditing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      albums: {},
      userCurrentImage: null,
      imagesNotFound: false,
      videosNotFound: false,
      loading: true,
      uploadedBytes: 0,
      totalBytes: 0,
      status: 'no file selected',
    };

    this.startUpload = this.startUpload.bind(this);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }
  selectPhotoTapped(alias, type) {
    ImagePicker.showImagePicker({}, result => {
      if (!result.cancelled) {
        if (type === 'video')
          if (
            result.type === 'video/mp4' ||
            result.type === 'video/x-flv' ||
            result.type === 'application/x-mpegURL' ||
            result.type === 'video/MP2T' ||
            result.type === 'video/3gpp' ||
            result.type === 'video/x-msvideo' ||
            result.type === 'video/x-ms-wmv' ||
            result.type === 'video/quicktime'
          )
            this.startUpload(result, alias, type);
          else
            Toast.show(`Please Select Video`, {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            });
        if (type === 'image')
          if (result.type === 'image/jpeg')
            this.startUpload(result, alias, type);
          else
            Toast.show(`Please Select Image`, {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            });
      }
    }).catch(err => {
      console.log('openCamera' + err.toString());
    });
  }

  startUpload(file, alias, type) {
    if (!file) return;
    this.refs.lert.open();

    this.setState({
      status: 'file selected',
    });
    let typo = type === 'image' ? 'uploadPicture' : 'uploadVideo';
    let url =
      alias === ''
        ? `${Api._base}/api/${typo} `
        : `${Api._base}/api/${typo}?alias=${alias}`;
    const upload = new tus.Upload(file, {
      headers: {'X-Auth-Token': token},
      endpoint: url,
      retryDelays: [0, 1000, 3000, 5000],
      metadata: {
        filename: file.fileName,
        filetype: file.type,
      },
      onError: error => {
        this.setState({
          status: `upload failed ${error}`,
        });
        // this.refs.lert.close();
        Toast.show('Something is wrong please try again', {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      },
      onProgress: (uploadedBytes, totalBytes) => {
        this.setState({
          totalBytes: totalBytes,
          uploadedBytes: uploadedBytes,
          progress: uploadedBytes / totalBytes,
        });
      },
      onSuccess: () => {
        this.setState({
          status: 'upload finished',
        });

        this.refs.lert.close();
        Toast.show('Uploading is done', {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
        this.componentWillMount();
      },
    });

    console.log(upload);
    upload.start();

    this.setState({
      status: 'uploading is started',
      uploadedBytes: 0,
      totalBytes: 0,
    });
  }
  componentWillMount() {
    Api.profile(global.user.meta.username).then(async data => {
      {
        this.setState({albums: data.user.albums, loading: false});
      }
    });
  }

  getImagesAndSave = async (alias = '', type = '') => {
    this.selectPhotoTapped(alias, type);
  };

  render() {
    if (this.state.loading) {
      return <ActivityOverlay />;
    }
    const {albums} = this.state;
    return (
      <React.Fragment>
        <CommonHeader title={'Gallery'} />

        <ScrollView>
          <AddPhotoVideo
            name="Photo"
            title="Public Photos"
            type="image"
            onPress={this.getImagesAndSave}
          />
          {/* <Text>Status: {this.state.status}</Text>
          <Text>
            {this.state.uploadedBytes} of {this.state.totalBytes}
          </Text> */}
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {/* I  M  A  G  E  S     S  E  T  U  P                        PUBLIC*/}
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {albums[0].images.length == 0 && <NoImageVideo />}
          {albums[0].images.length != 0 && (
            <FlatList
              data={albums[0].images}
              keyExtractor={(item, index) => index}
              renderItem={({item}) => (
                <View style={Styles.imageContainer}>
                  <ImagesViewer item={item} />
                </View>
              )}
              //Setting the number of column
              numColumns={3}
            />
          )}

          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {/* I  M  A  G  E  S     S  E  T  U  P                        PRIVETE*/}
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <AddPhotoVideo
            name="Photo"
            title="Private Photos"
            type="image"
            alias={albums[1].alias}
            onPress={this.getImagesAndSave}
          />
          {albums[1].images.length == 0 && <NoImageVideo />}
          {albums[1].images.length != 0 && (
            <FlatList
              data={albums[1].images}
              keyExtractor={(item, index) => index}
              renderItem={({item}) => (
                <View style={Styles.imageContainer}>
                  <ImagesViewer item={item} />
                </View>
              )}
              //Setting the number of column
              numColumns={3}
            />
          )}

          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {/* V  I  D  E  O  S     S  E  T  U  P                          VIDEO*/}
          {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <AddPhotoVideo
            name="Video"
            title="Videos"
            type="video"
            onPress={this.getImagesAndSave}
          />
          <View style={{marginBottom: 50}}>
            {albums[2].videos.length == 0 && <NoImageVideo />}
            {albums[2].videos.length != 0 && (
              <FlatList
                data={albums[2].videos}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => (
                  <View style={Styles.imageContainer}>
                    <VideoPlayer item={item} />
                  </View>
                )}
                //Setting the number of column
                numColumns={3}
              />
            )}
          </View>
        </ScrollView>

        <Modal
          style={[Styles.errAlert, Styles.errAlert3]}
          position={'center'}
          ref={'lert'}
          // swipeToClose={false}
          backdrop={true}
          coverScreen={true}
          backdropPressToClose={false}>
          <View>
            <View style={{alignItems: 'center'}}>
              <Icon
                type="simple-line-icon"
                name="arrow-up-circle"
                size={50}
                color={'#00FF00'}
              />
            </View>
            <View style={{alignItems: 'center', margin: 10}}>
              <Text style={{textAlign: 'center', fontSize: 14}}>
                Status: {this.state.status}
              </Text>
            </View>
            <View style={{marginTop: 10, alignItems: 'center'}}>
              <ProgressBar
                progress={this.state.progress}
                color="#00FF00"
                unfilledColor="rgba(255,255,255,.5)"
                borderColor="#00FF00"
                width={250}
                height={20}
              />
            </View>
          </View>
        </Modal>
      </React.Fragment>
    );
  }
}

export default profilePhotoEditing;
