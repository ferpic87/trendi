import firebase from 'firebase';
import {AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {
    EMAIL_CHANGED,
    NUMERO_CARTA_CHANGED,
    NAME_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_NOT_REGISTERED,
    LOGIN_USER_FAIL,
    LOGIN_USER,
    REGISTER,
    SAVE_USER,
    SIGNUP_USER,
    SIGNUP_USER_FAIL
  } from './types';

export const emailChanged = (text) => {
    return{
      type: EMAIL_CHANGED,
      payload:text
    };
};

export const nameChanged = (text) => {
  return {
    type: NAME_CHANGED,
    payload:text
  };
};

export const numeroCartaChanged = (text) => {
  return {
    type: NUMERO_CARTA_CHANGED,
    payload:text
  };
};


export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload:text
  };
};

export const registerUser = () => {
  return (dispatch)=>{

    dispatch({
      type: REGISTER
    });
    Actions.registration();
  };
};

export const signupUser = ({email, password, displayName}) => {
  console.log(displayName);
  return (dispatch)=>{
    dispatch ({ type: SIGNUP_USER });

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => {
          const { currentUser }= firebase.auth();
          firebase.database().ref(`/users/${currentUser.uid}/displayName`)
            .push(displayName)
            .then(() =>{
              dispatch({ type: SAVE_USER, payload: user});
              Actions.main({type: 'reset'});
          });
          //loginUserSuccess(dispatch, user);
        })
        .catch((error) => {
        console.log(error);
        signupUserFail(dispatch,""+error);
      }
      );
  };
};

export const loginUser = ({email, password}) => {
  return (dispatch)=>{
    dispatch ({ type: LOGIN_USER });

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user=> loginUserSuccess(dispatch, user))
      .catch((error) => {
        console.log(error);

        loginUserNotRegistered(dispatch);
        /*firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(user => loginUserSuccess(dispatch, user))
          .catch(() => loginUserFail(dispatch));*/
      });
  };
};

const loginUserNotRegistered = (dispatch) => {
    dispatch({ type: LOGIN_USER_NOT_REGISTERED });
};

const loginUserFail= (dispatch) => {
    dispatch({ type: LOGIN_USER_FAIL });
};

const signupUserFail= (dispatch, error) => {
    dispatch({ type: SIGNUP_USER_FAIL, payload: error });
};

const loginUserSuccess= (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  });

  Actions.main();

};
