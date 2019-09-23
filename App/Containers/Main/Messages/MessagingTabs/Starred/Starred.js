import React, { Component } from "react";
import { ScrollView } from "react-native";

import Dataset from "impagination";
import Api from "../../../../../Services/Api";
import CommonHeader from "../../../../../Components/CommonHeader";
import styles from "./Starred.styles";
import ChatCard from "../../../../../Components/ChatCard";
export default class Starred extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      users: null,
      dataset: null,
      mailBox: []
    };
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.componentWillMount(this);
    this.setState({ refreshing: false });
  };

  handleBackButtonClick() {
    this.resetNavigation("MainScreen");
    return true;
  }
  componentWillReceiveProps() {
    console.log("componentWillReceiveProps");
    this.gettingAllUsers();
  }
  componentWillMount() {
    this.gettingAllUsers();
  }
  gettingAllUsers = async () => {
    let _this = this;
    let dataset = new Dataset({
      pageSize: 15,
      loadHorizon: 15,
      observe(datasetState) {
        _this.setState({ datasetState });
      },
      // Where to fetch the data from.
      fetch(pageOffset, pageSize, stats) {
        return Api.loadMailbox("starred")
          .then(data => {
            console.log(data);
            return data.mailbox;
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
    dataset.setReadOffset(0);
    this.setState({ dataset });
  };
  Chat = (friend_id, username) => {
    this.props.navigation.navigate("SentMail", {
      friendId: friend_id,
      userName: username
    });
  };

  renderItem() {
    if (!this.state.datasetState) return null;
    var _that = this;
    return this.state.datasetState.map(function(user, index) {
      if (!user.isSettled) {
        return null;
      }
      return <ChatCard key={index} user={user.content} onPress={_that.Chat} />;
    });
  }

  render() {
    return (
      <React.Fragment>
        <CommonHeader title={"Starred"} />

        <ScrollView
          style={styles.mainContainerHome}
          showsVerticalScrollIndicator={false}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={this.state.refreshing}
          //     onRefresh={this._onRefresh}
          //   />
          // }
        >
          {this.renderItem()}
        </ScrollView>
      </React.Fragment>
    );
  }
}
