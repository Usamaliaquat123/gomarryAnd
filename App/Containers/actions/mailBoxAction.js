import {
  ALL_USER,
  IS_TYPING,
  NEW_MESSAGE,
  OPEN_CHAT,
  NEW_MESSAGE_FOR_EXISTED,
} from './types';
import Api from '../../Services/Api';

export function setUsers() {
  return dispatch => {
    Api.loadMailbox()
      .then(data => {
        dispatch({
          type: ALL_USER,
          payload: data.mailbox,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
}
export function setIsTyping(istyping, typing_id) {
  return {
    type: IS_TYPING,
    istyping,
    typing_id,
  };
}
export function setNewMessage(
  lastMessageBody,
  friend_id,
  unreadCount,
  lastMessageTimeRaw,
  default_picture,
  username,
  star = 0,
  archived = 0,
) {
  return {
    type: NEW_MESSAGE,
    payload: {
      lastMessageBody,
      friend_id,
      lastMessageTimeRaw,
      default_picture,
      username,
      star,
      archived,
      unreadCount,
    },
  };
}

export function onOpenChat(friend_id) {
  return {
    type: OPEN_CHAT,
    friend_id,
  };
}

export function newMessageForExisted(friend_id, lastMessageBody, unreadCount) {
  return {
    type: NEW_MESSAGE_FOR_EXISTED,
    friend_id,
    lastMessageBody,
    unreadCount,
  };
}
