import React, {Component} from 'react';
import {ScrollView, Platform} from 'react-native';
import Dataset from 'impagination';
import {NavigationActions} from 'react-navigation';
import {Icon, Text, Header} from 'react-native-elements';
import {connect} from 'react-redux';

import Api from '../../../../../Services/Api';
import {setUsers, onOpenChat} from '../../../../actions';

import styles from './Inbox.styles';
import ChatCard from '../../../../../Components/ChatCard';
import {Colors, Fonts} from '../../../../../Themes';
import CommonHeader from '../../../../../Components/CommonHeader';

class Inbox extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      refreshing: false,
      users: null,
      message: null,
      dataset: null,
      mailBox: [],
      isTyping: false,
      typing_id: '',
      isStar: false,
      isArchived: false,
      messageCount: null,
    };
  }
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentWillMount(this);
    this.setState({refreshing: false});
  };

  handleBackButtonClick() {
    this.resetNavigation('MainScreen');
    return true;
  }
  componentWillReceiveProps(nextProps) {
    //   console.log("notification");
    //   const { isTyping } = this.state;
    //   if(nextProps.navigation.state.params.message){
    //   const notification = nextProps.navigation.state.params.message;
    //   console.log(notification);
    //   if (notification._data.type == "is_typing") {
    //     if (!isTyping)
    //       this.setState({
    //         isTyping: true,
    //         typing_id: notification._data.friend_id
    //       });
    //     setTimeout(() => {
    //       this.setState({ isTyping: false });
    //     }, 2000);
    //   } else if (notification._data.type == "message") {
    //     this.setState({
    //       messageCount: notification._data.unreadCount,
    //       message: notification._data.body,
    //       typing_id: notification._data.user_id
    //     });
    //   }
    // }
  }
  componentWillUnmount() {
    console.log('Inbox componentWillUnmount');
  }
  componentWillMount() {
    console.log('Inbox componentWillMount');

    global.Inbox = true;
    this.props.setUsers();
    // this.gettingAllUsers();
  }
  gettingAllUsers = async () => {
    let _this = this;
    // let dataset = new Dataset({
    //   pageSize: 15,
    //   loadHorizon: 15,
    //   observe(datasetState) {

    //     _this.setState({ datasetState });
    //     // _this.props.setAllUsers(datasetState)
    //   },
    //   // Where to fetch the data from.
    //   fetch(pageOffset, pageSize, stats) {
    //     return
    // Api.loadMailbox()
    //   .then(data => {
    //     console.log(data);
    //     _this.props.dispatch(setUsers(data.mailbox));

    //     return data.mailbox;
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // }
    // });
    // dataset.setReadOffset(0);
    // this.setState({ dataset });
  };
  Chat = (friend_id, username, unreadCount) => {
    if (unreadCount != 0) this.props.onOpenChat(friend_id);
    this.props.navigation.navigate('SentMail', {
      friend_id,
      username,
    });
  };

  renderItem() {
    if (!this.props.allUsers) return null;
    var _that = this;
    return this.props.allUsers.map(function(user, index) {
      // if (!user.isSettled) {
      //   return null;
      // }
      return (
        <ChatCard
          // messageCount={_that.state.messageCount}
          key={index}
          index={index}
          // message={_that.state.message}
          isTyping={_that.props.usersTyping}
          // typing_id={_that.state.typing_id}
          user={user}
          onPress={_that.Chat}
        />
      );
    });
  }

  render() {
    return (
      <>
        <CommonHeader title="Inbox" />
        {/* <Header
          containerStyle={{
            backgroundColor: Colors.mainAppColor,
            marginTop: Platform.OS === "ios" ? 0 : -30
          }}
          leftComponent={
            <Icon
              type="ionicon"
              size={30}
              name="md-arrow-back"
              underlayColor={Colors.mainAppColor}
              color={Colors.textColor}
              onPress={() =>
                //  this.props.navigation.dismiss()
                // this.props.navigation.dispatch(NavigationActions.back())
                this.props.navigation.reset(
                  [
                    NavigationActions.navigate({
                      routeName: "NavigationDrawer"
                    })
                  ],
                  0
                )
              }
            />
          }
          centerComponent={
            <Text
              style={{
                fontSize: 24,
                fontWeight: "600",
                fontFamily: Fonts.LatoBold,
                color: Colors.textColor
              }}
            >
              Inbox
            </Text>
          }
        /> */}

        <ScrollView
          style={styles.mainContainerHome}
          showsVerticalScrollIndicator={false}>
          {this.renderItem()}
        </ScrollView>
      </>
    );
  }
}
function mapStateToProps(state, ownProps) {
  console.log('state', state);
  return {
    allUsers: state.mailBoxReducer,
    usersTyping: state.isTypingReducer.isTypingUsers,
    // abouttyping:state.mailBoxReducer.IS_TYPING
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onOpenChat: friend_id => dispatch(onOpenChat(friend_id)),
    setUsers: () => dispatch(setUsers()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Inbox);
