import Api from '../../Services/Api';

export const loadMessagesSuccess = (messages, friend_id) => ({
  type: 'LOAD_MESSAGES_SUCCESS',
  messages,
  friend_id,
});

export const loadMessagesFailure = () => ({
  type: 'LOAD_MESSAGES_FAIURE',
});

export const loadMessages = friend_id => dispatch => {
  Api.loadConversation(friend_id, undefined, undefined, undefined, '')
    .then(res => {
      dispatch(loadMessagesSuccess(res.conversation.messages, friend_id));
    })
    .catch(error => {
      dispatch(loadMessagesFailure(error));
    });
  return {
    type: 'LOAD_MESSAGES',
  };
};

export const sendMessages = (friend_id, text, message) => dispatch => {
  Api.sendMessage(friend_id, text)
    .then(res =>
      dispatch({
        type: 'SEND_MESSAGES',
        friend_id,
        message,
      }),
    )
    .catch(err => {});
};

export const addMessages = (friend_id, message) => ({
  type: 'SEND_MESSAGES',
  friend_id,
  message,
});
