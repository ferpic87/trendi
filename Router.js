import React from 'react';
import { Scene, Router,Actions } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import List from './components/List';
import Create from './components/Create';
import TicketEdit from './components/TicketEdit';

const RouterComponent = () => {
  return(
    <Router sceneStyle={{paddingTop: 65}}>
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
            key="list"
            component={List}
            title="Biglietti"
          />
          <Scene key = "TicketCreate" component={Create} title="Ricerca biglietto" />
          <Scene key = "TicketEdit" component={TicketEdit} title="Modifica" />
        </Scene>
      </Scene>
    </Router>
  );
};

export default RouterComponent;
