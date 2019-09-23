import {createStore,compose,applyMiddleware} from "redux"
import thuck from "redux-thunk"
import reducers from "../reducers" 

const store =createStore(
    reducers,
    {},
    compose(
        applyMiddleware(thuck)
    )
);

export default store