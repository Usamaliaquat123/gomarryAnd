import React from "react";
import AppNav from "../Navigation/AppNavigation";
import { Provider } from "react-redux";
import store from './store';

function App() {
  return <Provider store={store}>
    <AppNav />
  </Provider> 
}
export default App;

