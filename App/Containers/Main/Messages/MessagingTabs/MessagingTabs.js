import React from "react";

import { createBottomTabNavigator, TabBarBottom } from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Icon ,Badge} from "react-native-elements";
import { Colors } from "../../../../Themes";
import { View } from "react-native";
import Inbox from "./Inbox/Inbox";
import AllMail from "./AllMail/AllMail";
import Starred from "./Starred/Starred";
import SentMail from "./SentMail/SentMail";
import Archived from "./Archived/Archived";
import Api from "../../../../Services/Api";

export default createBottomTabNavigator(
  {

   
  
    // AllMail: {
    //   screen: AllMail,
    //   navigationOptions: {
    //     tabBarIcon: ({ focused, tintColor }) => {
    //       const iconName = "md-home";
    //       return (
    //         <Icon
    //           type="antdesign"
    //           size={20}
    //           name="message1"
    //           color={Colors.m    ainAppColor}
    //         />
    //       );
    //     }
    //   }
    // },
    Inbox: {
      screen: Inbox,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          return (
            <View>
              <Icon
              type="font-awesome"
              size={20}
              style={{ position: 'absolute' }}
              name="folder-open-o"
              color={Colors.mainAppColor}
            />

            </View>
          );
        }
      }
    },
   
    
    Starred: {
      screen: Starred,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
        
          return (
            <View>
                {/* {user.unreadCount != 0 && (
                <Badge
                  containerStyle={{    position: "absolute",
                  top: -4,
                  right: -4}}
                  status="error"
                  value={`${user.unreadCount}`}
                />
              )} */}
              {
                // Api.loadMailbox().then(res => {
                 
                //   return (
                //     <Badge
                //     containerStyle={{    position: "absolute",
                //     top: -4,
                //     right: -4}}
                //     status="error"
                //     value={`${ res.unread.all}`}
                //   />
                //   )
                // })
              }
            <Icon
              type="evilicon"
              size={20}
              name="star"
              color={Colors.mainAppColor}
            />
            </View>
            
          );
        }
      }
    },
    Archived: {
      screen: Archived,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          return (
            <View>
              <Icon
              type="entypo"
              size={20}
              style={{ position: 'absolute' }}
              name="archive"
              color={Colors.mainAppColor}
            />
            </View>
          );
        }
      }
    },
    // SentMail: {
    //   screen: SentMail,
    //   navigationOptions: {
    //     tabBarIcon: ({ focused, tintColor }) => {
    //       return (
    //         <Icon
    //           type="font-awesome"
    //           size={20}
    //           name="send-o"
    //           color={Colors.mainAppColor}
    //         />
    //       );
    //     }
    //   }
    // }
  },

  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: Colors.mainAppColor,
      inactiveTintColor: "gray"
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    animationEnabled: true,
    swipeEnabled: false
  }
);


