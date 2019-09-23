export const addTypingUser = friend_id => ({
  type: 'ADD_TYPING_USER',
  friend_id,
});

export const removeTypingUser = friend_id => ({
  type: 'REMOVE_TYPING_USER',
  friend_id,
});
