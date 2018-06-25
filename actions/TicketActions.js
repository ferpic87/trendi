import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {
    TICKET_UPDATE,
    TICKET_CREATE,
    TICKET_FETCH_SUCCESS,
    TICKET_SAVE_SUCCESS
} from './types';

export const TicketUpdate= ({prop, value}) => {
  return {
      type: TICKET_UPDATE,
      payload: {prop, value}
  };
};

export const TicketCreate = ({ city, number, shift }) => {
  const { currentUser }= firebase.auth();

  return(dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/Ticket`)
      .push({ city, number, shift })
      .then(() =>{
        dispatch({ type: TICKET_CREATE});
        Actions.main({type: 'reset'});
      });
  };
};

export const TicketFetch= () => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/Ticket`)
      .on('value', snapshot => {
          dispatch({ type: TICKET_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

  export const TicketSave = ({city,number, shift, uid}) => {
    const { currentUser }= firebase.auth();

    return(dispatch) =>{
      firebase.database().ref( `/users/${currentUser.uid}/Ticket/${uid}` )
      .set({ city, number, shift})
      .then(() => {
          dispatch({ type:TICKET_SAVE_SUCCESS });
          Actions.main({type: 'reset'});
      });
  };
};

export const TicketDelete= ({ uid }) => {
  const { currentUser }= firebase.auth();

  return () => {
    firebase.database().ref( `/users/${currentUser.uid}/Ticket/${uid}`)
    .remove()
    .then(() => {
      Actions.main({type: 'reset' });
    });
  };
};
