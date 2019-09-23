const INITIAL_STATE = {isTypingUsers: []};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_TYPING_USER':
      return {
        ...state,
        isTypingUsers: [...state.isTypingUsers, action.friend_id],
      };
    case 'REMOVE_TYPING_USER':
      return state.isTypingUsers.filter(
        item => item != state.isTypingUsers[action.friend_id],
      );
    default:
      return state;
  }
};
