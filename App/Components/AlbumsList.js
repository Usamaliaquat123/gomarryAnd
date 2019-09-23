import React from "react";
import { Text, StyleSheet, FlatList, View, Button } from "react-native";
import ImagesViewer from "./ImagesViewer";
import VideoPlayer from "./VideoPlayer";

import { Colors } from "../Themes";
import NoImageVideo from "./NoImageVideo";

function AlbumsList({ albums, request }) {
  return (
    <React.Fragment>
      <Text style={styles.title}>{albums.name}</Text>
      {albums.type === "picture" && (
        <React.Fragment>
          {albums.images.length == 0 && <NoImageVideo />}
          {albums.images.length != 0 && (
            <React.Fragment>
              {albums.private == 1 && (
                <>
                  {!albums.allowed && (
                    <React.Fragment>
                      {albums.requested && (
                        <Text style={styles.warningText}>
                          You have requested access to view this album
                        </Text>
                      )}
                      {!albums.requested && (
                        <Button
                          onPress={() => request(albums.id)}
                          title="This album is private. Request Access to view. "
                          color={Colors.mainAppColor}
                        />
                      )}
                    </React.Fragment>
                  )}
                  {albums.allowed && (
                    <Text style={styles.warningText}>
                      You have been granted permission to view this album
                    </Text>
                  )}
                </>
              )}

              <FlatList
                data={albums.images}
                keyExtractor={(item, index) => index}
                renderItem={({ item }) => (
                  <View style={styles.imageContainer}>
                    <ImagesViewer item={item} />
                  </View>
                )}
                //Setting the number of column
                numColumns={3}
              />
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      {albums.type === "video" && (
        <React.Fragment>
          {albums.videos.length == 0 && <NoImageVideo />}
          {albums.videos.length != 0 && (
            <React.Fragment>
              {albums.private == 1 && (
                <View style={{ margin: 5 }}>
                  {!albums.allowed && (
                    <React.Fragment>
                      {albums.requested && (
                        <Text style={styles.warningText}>
                          You have requested access to view this album
                        </Text>
                      )}
                      {!albums.requested && (
                        <Button
                          onPress={() => request(albums.id)}
                          title="This album is private. Request Access to view. "
                          color={Colors.mainAppColor}
                        />
                      )}
                    </React.Fragment>
                  )}
                  {albums.allowed && (
                    <Text style={styles.warningText}>
                      You have been granted permission to view this album
                    </Text>
                  )}
                </View>
              )}
              <FlatList
                data={albums.videos}
                keyExtractor={(item, index) => index}
                renderItem={({ item }) => (
                  <View style={styles.videoContainer}>
                    <VideoPlayer item={item} />
                  </View>
                )}
              />
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
const styles = StyleSheet.create({
  empty: {
    justifyContent: "center",
    textAlign: "center",
    margin: 50,
    alignContent: "center",
    fontSize: 20,
    fontWeight: "400",
    color: Colors.mainAppColor
  },
  warningText: {
    backgroundColor: Colors.mainAppColor,
    color: Colors.textColor,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    margin: 3
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: Colors.mainAppColor,
    margin: 5
  },
  imageContainer: {
    flex: 1,
    flexDirection: "column",
    margin: 3
  },
  videoContainer: {
    justifyContent: "center",
    marginBottom: 10
  }
});

export default AlbumsList;
