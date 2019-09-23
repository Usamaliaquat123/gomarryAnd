import { types } from "mobx-state-tree";

const app = types.model('App',{
    title : types.string
})