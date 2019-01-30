import React, {Component} from 'React';
import {connect} from 'react-redux';
import {View, Text, FlatList, StyleSheet, Keyboard, TouchableOpacity, Alert } from 'react-native';
import {textChanged} from '../actions';
import {Card, CardSection, Input, Button, Spinner} from './common';
import {TicketCreate } from '../actions';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Table, TableWrapper, Cell, Row, Rows } from 'react-native-table-component';
import moment from 'moment';

class SelectTicketForm extends Component {

  constructor(props) {
    super(props);
    this.state = props;
    /*var dataDiOggi = moment().format('DD/MM/YYYY H:mm');
    this.state = {
      tipoTreno,
      luogoPartenza,
      dataOraPartenza,
      luogoArrivo,
      dataOraArrivo,
      prezzo
    };*/
  }

  onSavePress() {
    const { luogoPartenza, luogoArrivo, tipoTreno, oraPartenza, oraArrivo, prezzoInserito, pnr, posto,parDesData}=this.state;
    this.props.TicketCreate({ luogoPartenza, luogoArrivo, tipoTreno, oraPartenza, oraArrivo, prezzoInserito, pnr, posto, parDesData});
  }

  onPrezzoChanged(text){
    var prezzoInserito = parseFloat(text);
    if(prezzoInserito > this.state.prezzo) {
      alert("Non puoi vendere un biglietto ad un prezzo maggiore rispetto a Trenitalia")
      this.setState ({
        prezzoInserito: text.substring(0, text.length-1)
      });
    } else {
      this.setState({
        prezzoInserito: prezzoInserito
      });
    }
  }

  render() {
    const { tipoTreno, oraArrivo, oraPartenza, prezzo, luogoPartenza, luogoArrivo } = this.state;
    var dataGiorno = moment(this.state.oraPartenza).add(1, 'hours').format('DD/MM/YYYY');
    var dataOraPartenza = moment(this.state.oraPartenza).add(1, 'hours').format('HH:mm');
    var dataOraArrivo = moment(this.state.oraArrivo).add(1, 'hours').format('HH:mm');

    return (<Card>
              <Text>Stai vendendo il biglietto per il treno {tipoTreno} da {luogoPartenza} ({dataOraPartenza}) a {luogoArrivo} ({dataOraArrivo}) del giorno {dataGiorno} - {prezzo}</Text>
              <CardSection>
                <Input
                  {...this.props}
                  label="Prezzo"
                  placeholder={this.state.prezzo+""}
                  keyboardType='numeric'
                  // verificare come far uscire tastierino numerico
                  maxLength={5}
                  onChangeText={(text) => {this.onPrezzoChanged(text)}}
                  value={this.state.prezzoInserito}
                />
              </CardSection>
              <CardSection>
                <Input
                  {...this.props}
                  label="PNR"
                  placeholder="codice PNR biglietto"
                  onChangeText={(text) => {this.setState({pnr:text})}}
                  value={this.state.pnr}
                />
              </CardSection>
              <CardSection>
                <Input
                  {...this.props}
                  label="Posto"
                  placeholder="Posto"
                  onChangeText={(text) => {this.setState({posto:text})}}
                  value={this.state.posto}
                />
              </CardSection>
              <CardSection>
                <Button title="Salva" onPress={this.onSavePress.bind(this) } >
                  Salva
                </Button>
              </CardSection>
            </Card>);
  }
}

/*
{items.map(item => (
    <Text>{item.name} </Text>))
  }
*/

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  errorTextStyle:{
    fontSize:20,
    alignSelf:'center',
    color:'red'
  },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFFFFF' },
  btn: { width: 78, height: 18, alignSelf:'center', backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' }
})

const mapStateToProps= ({auth}) => {
  const{ email, password, error, loading} = auth;
  return { email, password, error, loading};
};

export default connect(mapStateToProps, { textChanged, TicketCreate }) (SelectTicketForm);
