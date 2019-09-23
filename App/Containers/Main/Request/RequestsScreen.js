import React, {Component} from 'react';
import {Text, ScrollView} from 'react-native';
import {ButtonGroup} from 'react-native-elements';
import Dataset from 'impagination';
import Api from '../../../Services/Api';
import Toast from 'react-native-root-toast';

import CommonHeader from '../../../Components/CommonHeader';
import UserCard from '../../../Components/UserCard';

// Styles
import SampleUserCard from '../../../Components/SampleUserCard';
import {Fonts, Colors} from '../../../Themes';

const component1 = () => <Text>Approved</Text>;
const component2 = () => <Text>Pending</Text>;

export default class RequestsScreen extends Component {
  constructor() {
    super();
    this.state = {
      dataset: null,
      datasetState: null,
      loading: true,
      selectedIndex: 0,
      Flag: false,
    };
    this.updateIndex = this.updateIndex.bind(this);
  }
  componentWillMount() {
    const section = this.props.navigation.state.params.section
      ? 'pending'
      : 'approved';

    this.setupImpagination(section);
  }

  setupImpagination(section) {
    let _this = this;

    let dataset = new Dataset({
      pageSize: 15,
      loadHorizon: 15,

      // Anytime there's a new state emitted, we want to set that on
      // the componets local state.
      observe(datasetState) {
        _this.setState({datasetState});
      },

      // Where to fetch the data from.
      fetch(pageOffset, pageSize, stats) {
        return Api.requests(section, pageOffset + 1, pageSize)
          .then(data => {
            if (data.requests.length != 0) return data.requests;
            else {
              _this.setState({Flag: true});
              return;
            }
          })
          .catch(error => {
            Toast.show(error, {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            });
          });
      },
    });

    dataset.setReadOffset(0);
    this.setState({dataset});
  }

  setCurrentReadOffset = event => {
    let itemHeight = 100;
    let currentOffset = Math.floor(event.nativeEvent.contentOffset.y);
    let currentItemIndex = Math.ceil(currentOffset / itemHeight);
    this.state.dataset.setReadOffset(currentItemIndex);
  };

  renderItems() {
    let _this = this;
    if (!this.state.datasetState) return null;
    return this.state.datasetState.map(function(user, index) {
      if (!user.isSettled) {
        return <SampleUserCard />;
      }
      return (
        <UserCard
          key={index}
          user={user.content.user}
          isRequest={user.content.status}
          request_id={user.content.request_id}
          requestResponed={_this.requestResponed}
        />
      );
    });
  }

  updateIndex(selectedIndex) {
    this.setState({selectedIndex});
    this.fetchSection(selectedIndex);
  }
  fetchSection(index) {
    this.setState({loading: true, Flag: false});
    if (index === 0) {
      this.setupImpagination('approved');
    }
    if (index === 1) {
      this.setupImpagination('pending');
    }
  }
  requestResponed = (request_id, decision, section) => {
    Api.photoRequestRespond(request_id, decision).then(res => {
      this.setupImpagination(section);
    });
  };
  render() {
    const buttons = [{element: component1}, {element: component2}];
    const {selectedIndex} = this.state;
    return (
      <ScrollView>
        <CommonHeader title={'Requests'} />

        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerBorderRadius={0}
          selectedButtonStyle={{backgroundColor: '#FFF'}}
          containerStyle={{
            width: '100%',
            height: 50,
            marginLeft: 0,
            marginTop: 0,
            borderWidth: 1,
            borderRadius: null,
            borderColor: Colors.mainAppColor,
          }}
        />

        {!this.state.Flag && this.renderItems()}
        {this.state.Flag && (
          <Text
            style={{
              marginTop: 50,
              textAlign: 'center',
              fontSize: 16,
              fontFamily: Fonts.app_font,

              fontWeight: '400',
            }}>
            No Request
          </Text>
        )}
      </ScrollView>
    );
  }
}
