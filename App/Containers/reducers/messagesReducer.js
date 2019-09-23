const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOAD_MESSAGES_SUCCESS':
      return {
        ...state,
        [action.friend_id]: action.messages,
      };
    case 'LOAD_MESSAGES_FAILURE':
      return INITIAL_STATE;

    case 'SEND_MESSAGES': {
      if (state[action.friend_id]) {
        return {
          ...state,
          [action.friend_id]: [action.message, ...state[action.friend_id]],
        };
      }
      return {
        ...state,
        [action.friend_id]: [action.message],
      };
    }
    default:
      return state;
  }
};
