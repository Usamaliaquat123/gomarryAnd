import {
  ALL_USER,
  NEW_MESSAGE,
  OPEN_CHAT,
  NEW_MESSAGE_FOR_EXISTED,
} from '../actions/types';

let flag = false;

const mailBoxReducer = (state = [], action) => {
  console.log(action);
  switch (action.type) {
    case ALL_USER:
      return [...action.payload];
    case NEW_MESSAGE: {
      state.map(user => {
        if (user.friend_id === action.payload.friend_id) flag = true;
      });
      if (flag) {
        return state.map(user => {
          if (user.friend_id === action.payload.friend_id) {
            return {
              ...user,
              unreadCount: action.unreadCount,
              lastMessageBody: action.lastMessageBody,
            };
          }
          return user;
        });
      } else return state.concat(action.payload);
    }

    //   return state.concat(action.payload);

    //   return state.map(user => {
    //     if (user.friend_id === action.payload.friend_id) {
    //       return {
    //         ...user,
    //         unreadCount: action.payload.unreadCount,
    //         lastMessageBody: action.payload.lastMessageBody,

    //         // archived: "0"
    //         // default_picture: "2b9c1c6"
    //         // lastMessageBody: "k.k."
    //         // lastMessageTime: "23 hours ago"
    //         // lastMessageTimeRaw: "1568895660"
    //         // star: "0"
    //         // unreadCount: 0
    //         // username: "captainmarry"
    //         // friend_id: "53250"
    //       };
    //     }
    //     return user;
    //   });

    case NEW_MESSAGE_FOR_EXISTED:
      return state.map(user => {
        if (user.friend_id === action.payload.friend_id) {
          return {
            ...user,
            unreadCount: action.unreadCount,
            lastMessageBody: action.lastMessageBody,
          };
        }
        return user;
      });

    case OPEN_CHAT:
      return state.map(user => {
        if (user.friend_id === action.friend_id) {
          return {...user, unreadCount: 0};
        }
        return user;
      });
    // ...state,
    // [action.index]:{
    //     ...state[action.index],
    //     unreadCount:0
    // }

    default:
      return state;
  }
};

export default mailBoxReducer;
