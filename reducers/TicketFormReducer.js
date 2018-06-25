import {
    TICKET_UPDATE,
    TICKET_CREATE,
    TICKET_SAVE_SUCCESS
} from '../actions/types';


const INITIAL_STATE={
  city: '',
  number: '',
  shift: ''
};

export default (state= INITIAL_STATE, action ) => {
  switch (action.type){
    case TICKET_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value};
    case TICKET_CREATE:
      return INITIAL_STATE;
      case TICKET_SAVE_SUCCESS:
        return INITIAL_STATE;
    default:
      return state;
  }
};
