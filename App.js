import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Router from './Router';

class App extends Component{
    componentWillMount(){
    const config={
      apiKey: "AIzaSyAPkz7FJa1ouefuN44a2dPJbNDoMr75wAg",
      authDomain: "trend-2e0ff.firebaseapp.com",
      databaseURL: "https://trend-2e0ff.firebaseio.com",
      projectId: "trend-2e0ff",
      storageBucket: "",
      messagingSenderId: "481355043670"
    };

    firebase.initializeApp(config);
  }

  render() {
    const store=createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
      <Router />
      </Provider>
    );
  }
}
export default App;
