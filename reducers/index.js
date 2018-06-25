import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import TicketFormReducer from './TicketFormReducer';
import TicketReducer from './TicketReducer';

export default combineReducers({
  auth: AuthReducer,
  TicketForm: TicketFormReducer,
  Ticket: TicketReducer
});
