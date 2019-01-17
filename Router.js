import React from 'react';
import { Scene, Router,Actions } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import FindTicketForm from './components/FindTicketForm';
import SellTicketForm from './components/SellTicketForm';
import SelectTicketForm from './components/SelectTicketForm';
import List from './components/List';
import Create from './components/Create';
import TicketEdit from './components/TicketEdit';

const RouterComponent = () => {
  return(
    <Router sceneStyle={{paddingTop: 25}}>
      <Scene key="root" hideNavBar>
        <Scene key="auth">
          <Scene key="login" component={LoginForm} title="Autenticazione"/>
        </Scene>
        <Scene key="registration">
          <Scene key="signup" component={SignupForm} title="Registrazione"/>
        </Scene>
        <Scene key="main">
          <Scene
            onRight={ () => Actions.TicketCreate()}
            rightTitle="Aggiungi"
            key = "list"
            component={List}
            title="Biglietti"
          />
          <Scene key = "TicketCreate" component={Create} title="Aggiungi biglietto" />
          <Scene key = "FindTicket" component={FindTicketForm} title="Ricerca biglietto" />
          <Scene key = "SellTicket" component={SellTicketForm} title="Vendi biglietto" />
          <Scene key = "SelezionaBiglietto" component={SelectTicketForm} title="Vendi biglietto" />
          <Scene key = "TicketEdit" component={TicketEdit} title="Modifica" />
        </Scene>
      </Scene>
    </Router>
  );
};

export default RouterComponent;
