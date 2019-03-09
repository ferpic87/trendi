import React, {Component} from 'React';
import {connect} from 'react-redux';
import {View, Text, FlatList, StyleSheet, Keyboard, Linking} from 'react-native';
import {textChanged} from '../actions';
import {Card, CardSection, Input, Button, Spinner} from './common';
import {Actions} from 'react-native-router-flux';
//import DatePicker from 'react-native-datepicker'
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Table, TableWrapper, Cell, Row, Rows } from 'react-native-table-component';
import moment from 'moment';
import firebase from 'firebase';

class FindTicketForm extends Component {

  constructor(props) {
    super(props);
    var dataDiOggi = moment().format('DD/MM/YYYY H:mm');
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      user: props.user,
      messaggio: "",
      isSelected: false,
      isDateTimePickerVisible: false,
      dataPartenzaString: dataDiOggi,
      dataPartenza: moment(),
      ticketList: [],
      tableHead: ['Partenza', 'Arrivo', 'Treno', 'Prezzo'],
      tableData: [
        //['Napoli C.le\n12:35', 'Milano C.le\n15:55', 'Frecciarossa 1000', '11.5€']
      ]
    };
  }

  onSelectLocation (text){
    if(this.state.isPartenza) {
      this.setState({
        partenza: text,
        messaggio: "hai selezionato "+ text,
        isSelected: true,
        items: null
      });
    } else {
      this.setState({
        destinazione: text,
        messaggio: "hai selezionato "+ text,
        isSelected: true,
        items: null
      });
    }
    //console.log(text);
  }

  async onTextChanged (text){
    if(text.length >= 2) {
      fetch("https://www.lefrecce.it/msite/api/geolocations/locations?name="+text)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result,
              messaggio: text
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: false,
              error,
              messaggio: text
            });
            console.log(error);
          }
        );
      } else {
        this.setState({
          isLoaded: true,
          messaggio: "stringa troppo corta "+ text
        })
      }
  }

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = (date) => {
    this.setState({
                  dataPartenzaString: moment(date).format('DD/MM/YYYY H:mm'),
                  dataPartenza: moment(date)});
    this.hideDateTimePicker();
    Keyboard.dismiss();
  };

  openTicketDetails(data, index, isInApp) {
      console.log("entro in openTicketDetails:"+isInApp);
      var that = this;
      if(isInApp) {
        // apre altra view
        var tempTicket = this.state.ticketList[index];
        var uid = tempTicket.uid;
        var ref = firebase.database().ref('/users/'+uid);
        ref.on("value", function(snapshot) {
          that.setState({
            ticket: tempTicket,
            ticketOwner: Object.values(snapshot.val().displayName)[0]
          });
          var ticket = tempTicket;
          var ticketOwner = Object.values(snapshot.val().displayName)[0];
          Actions.BuyTicket({ticket, ticketOwner});
        });
      } else {
        // apre Trenitalia
        var urlTrenitalia = "https://www.trenitalia.com/";
        Linking.openURL(urlTrenitalia).catch((err) => console.error('An error occurred', err));
      }
  }

  onButtonPress(){

    var dataGiorno = this.state.dataPartenza.format('DD/MM/YYYY');
    var dataOra = this.state.dataPartenza.format('H');
    var idUtente = this.state.user.user.uid;

    fetch("https://www.lefrecce.it/msite/api/solutions?origin="+this.state.partenza+"&destination="+this.state.destinazione+
    "&arflag=A&adate="+dataGiorno+"&atime="+dataOra+"&adultno=1&childno=0&direction=A&frecce=true&onlyRegional=false")
      .then(res => res.json())
      .then(
        (result) => {
          var trenitaliaData = result.map( sol =>
              [sol.origin+"\n"+moment(sol.departuretime).add(1, 'hours').format('H:mm'), sol.destination+"\n"+moment(sol.arrivaltime).add(1, 'hours').format('H:mm'), sol.trainlist[0].trainidentifier, parseFloat(sol.minprice)+" €"]
            );

          var multipleFieldSearch = this.state.partenza.toLowerCase()+"-"+this.state.destinazione.toLowerCase()+"-"+this.state.dataPartenza.format('DD-MM-YYYY');
          //console.log(multipleFieldSearch);
          var firebaseData = [];
          var list = [];

          var ref = firebase.database().ref('/tickets');
          ref.on("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var obj = childSnapshot.val();
                if(obj.parDesData == multipleFieldSearch && obj.uid != idUtente) {
                  firebaseData.push([obj.luogoPartenza+"\n"+moment(obj.oraPartenza).add(1, 'hours').format('H:mm'), obj.luogoArrivo+"\n"+moment(obj.oraArrivo).add(1, 'hours').format('H:mm'), obj.tipoTreno+" (v)", parseFloat(obj.prezzoInserito)+" €"]);
                  list.push(obj);
                }
            });
          });
          this.setState({
            tableData: firebaseData.concat(trenitaliaData),
            ticketList: list
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          alert("Errore")
        }
    );
  }

  render() {
    const { error, isSelected, partenza, destinazione, user, isLoaded, dataPartenzaString, dataPartenza, oraPartenzaString, isDateTimePickerVisible, items, messaggio, tableHead, tableData } = this.state;
    let messaggioRisposta = "";
    if (error) {
        messaggioRisposta = "Error" + error.message;
    } else if (!isLoaded) {
        messaggioRisposta = "Loading...";
    } else if(isSelected) {
        messaggioRisposta = "";
    } else {
        messaggioRisposta = "Testo inserito:"+ messaggio;
    }
    const element = (data, index, isInApp) => (
        <Button onPress={this.openTicketDetails.bind(this, data, index, isInApp)}>{data}</Button>
    )
    return (<Card>
              <CardSection>
                <Input
                  {...this.props}
                  label="Partenza"
                  placeholder="Partenza"
                  onChangeText={(text) => {this.setState({partenza:text, isPartenza: true}); this.onTextChanged(text)}}
                  value={partenza}
                />
              </CardSection>
              <CardSection>
                <Input
                  {...this.props}
                  label="Destinazione"
                  placeholder="Destinazione"
                  onChangeText={(text) => {this.setState({destinazione:text, isPartenza: false}); this.onTextChanged(text)}}
                  value={destinazione}
                />
              </CardSection>
              <Text>{messaggioRisposta}</Text>
              <FlatList
                data={items}
                renderItem={({item}) => <Text onPress={() => this.onSelectLocation(item.name) } style={styles.item} >{item.name}</Text>}
                keyExtractor={(item, index) => index.toString()}
              />
              <CardSection>
                <Input onFocus={this.showDateTimePicker}
                  label="Data/Ora partenza"
                  value={dataPartenzaString}
                />
              </CardSection>
              <CardSection>
                <DateTimePicker
                  isVisible={isDateTimePickerVisible}
                  onConfirm={this.handleDatePicked}
                  onCancel={this.hideDateTimePicker}
                  mode='datetime'
                />
              </CardSection>
              <CardSection>
                <Button onPress={this.onButtonPress.bind(this)}>
                Cerca
                </Button>
              </CardSection>
              <View>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                  <Row data={tableHead} style={styles.head} />
                  {
                  tableData.map((rowData, index) => (
                  <TableWrapper key={index} style={styles.row}>
                    {
                      //<Row
                      //key={index}
                      //data={index === 3 ? element(rowData, index) : rowData}
                      //style={[styles.text, rowData[2].includes("(v)") && {backgroundColor: '#EFE33E'}]}
                      //textStyle={styles.text}
                      rowData.map((cellData, cellIndex) => (
                        <Cell key={cellIndex} style={[styles.text, rowData[2].includes("(v)") && {backgroundColor: '#EFE33E'}]} data={cellIndex === 3 ? element(cellData, index, rowData[2].includes("(v)")) : cellData} />
                      ))
                    }
                  </TableWrapper>
                  ))
                }
                </Table>
              </View>
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
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFF1C1'
  },
  head: {
      height: 40,
      backgroundColor: '#f1f8ff',
  },
  text: { flex: 1, backgroundColor: '#FFFFFF'}
})

const mapStateToProps= ({auth}) => {
  const{ email, password, error, loading, user} = auth;
  return { email, password, error, loading, user};
};

export default connect(mapStateToProps, { textChanged }) (FindTicketForm);
