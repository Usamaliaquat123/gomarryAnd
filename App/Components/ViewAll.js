import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ToastAndroid,
  ActivityIndicator
} from "react-native";
import Api from "../Services/Api";
import CommonHeaderBack from "./CommonHeaderBack";
import ActivityOverlay from "./ActivityOverlay";

import UserCard from "./UserCard";
import { Fonts } from "../Themes";

class ViewAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.navigation.getParam("title", "View All"),
      section: this.props.navigation.getParam("section", ""),
      filter: this.props.navigation.getParam("filter", ""),
      loading: true,
      serverData: [],
      fetching_from_server: false,
      itemslimit: false
    };
    this.offset = 1;
  }
  FetchData() {
    const { filter } = this.state;
    if (filter == "") {
      Api.interests(this.state.section, this.offset, 1)
        .then(data => {
          console.log(this.offset);
          this.offset += 1;
          if (data.users.length === 0) {
            this.setState({
              loading: false,
              itemslimit: true
            });
            return;
          }

          if (this.state.serverData.length != data.pagination.totalItems) {
            this.state.serverData.push(...data.users);

            this.setState({
              loading: false,
              fetching_from_server: false
            });
          } else this.setState({ itemslimit: true });
        })
        .catch(error => {
          this.setState({
            loading: false
          });
          ToastAndroid.show(error, ToastAndroid.LONG);
        });
    } else {
      Api.search({}, this.offset, 20)
        .then(data => {
          console.log(data);
          this.offset += 1;
          if (data.users.length != 0) {
            this.state.serverData.push(...data.users);
            this.setState({
              loading: false,
              fetching_from_server: false
            });
          } else this.setState({ itemslimit: true });
        })
        .catch(error => {
          this.setState({
            loading: false
          });
          ToastAndroid.show(error, ToastAndroid.LONG);
        });
    }
  }
  componentDidMount() {
    this.FetchData();
  }
  loadMoreData = () => {
    this.setState({ fetching_from_server: true }, () => this.FetchData());
  };
  renderFooter() {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.loadMoreData}
          style={styles.loadMoreBtn}
        >
          <Text style={styles.btnText}>Load More</Text>
          {this.state.fetching_from_server ? (
            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    const { title } = this.state;
    if (this.state.loading) return <ActivityOverlay />;
    return (
      <React.Fragment>
        <CommonHeaderBack title={title} />
        <FlatList
          style={{ width: "100%" }}
          keyExtractor={(item, index) => index}
          data={this.state.serverData}
          renderItem={({ item, index }) => <UserCard key={index} user={item} />}
          ListFooterComponent={
            !this.state.itemslimit ? this.renderFooter.bind(this) : null
          }
        />
      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: "#800000",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    color: "white",
    fontSize: 15,
    fontFamily: Fonts.app_font,

    textAlign: "center"
  }
});

export default ViewAll;
