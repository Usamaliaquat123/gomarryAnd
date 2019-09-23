import {combineReducers} from 'redux';
import messages from './messagesReducer';
import mailBoxReducer from './mailBoxReducer';
import isTypingReducer from './isTypingReducer';

export default combineReducers({
  messages,
  mailBoxReducer,
  isTypingReducer,
});
