import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {Icon, Text, Header} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import {NavigationActions} from 'react-navigation';
import Toast from 'react-native-root-toast';

import {Colors, Fonts} from '../Themes';
import Api from '../Services/Api';

const CommonHeaderBack = props => {
  const logout = () => {
    Api.logout()
      .then(res => {
        AsyncStorage.removeItem('token');
        delete global.user;
        props.navigation.reset(
          [NavigationActions.navigate({routeName: 'LoginScreen'})],
          0,
        );
      })
      .catch(error => {
        Toast.show(error, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      });
  };
  return (
    <Header
      containerStyle={{
        backgroundColor: Colors.mainAppColor,
        marginTop: Platform.OS === 'ios' ? 0 : -30,
      }}
      leftComponent={
        props.logout ? null : (
          <Icon
            type="ionicon"
            size={30}
            name="md-arrow-back"
            underlayColor={Colors.mainAppColor}
            color={Colors.textColor}
            onPress={() => props.navigation.goBack()}
          />
        )
      }
      centerComponent={
        <Text
          style={{
            fontSize: 24,
            fontWeight: '600',
            fontFamily: Fonts.LatoBold,
            color: Colors.textColor,
          }}>
          {props.title}
        </Text>
      }
      rightComponent={
        props.logout ? (
          <Icon
            type="simple-line-icon"
            name={'logout'}
            size={30}
            color={Colors.textColor}
            underlayColor={Colors.mainAppColor}
            onPress={() => logout()}
          />
        ) : null
      }
    />
  );
};

export default withNavigation(CommonHeaderBack);
