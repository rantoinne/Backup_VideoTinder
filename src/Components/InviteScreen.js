import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,TouchableOpacity,ImageBackground,TouchableHighlight,ListView,Alert
} from 'react-native';

import { TabNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ContactsWrapper from 'react-native-contacts-wrapper';
import Feather from 'react-native-vector-icons/Feather';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Dialog from "react-native-dialog";

export default class InviteScreen extends Component {

    static navigationOptions = {
      headerTitle: 'Invite',
      headerTitleStyle: {
          color: '#36292a',
          fontFamily: 'Montserrat-Regular',
          fontWeight: '300',
          marginLeft: 0,
          textAlign:'center',
          alignSelf:'center',
          flex:1
          },
      headerRight: <View/>
        };

   constructor(props) {
      super(props);
      this.state = {
        phone: '',
        dialogVisible: false
      }
    }

  importingContactInfo = false;
  invite() {

    if (!this.importingContactInfo) {
      this.importingContactInfo = true;
      ContactsWrapper.getContact()
        .then((contact) => {
          this.importingContactInfo = false;
          let phone = contact.phone.replace(/\D/g, '');
          if(phone.length > 10) {
            phone = phone.substr(phone.length - 10)
          }
          this.setState({phone: "+91"+phone, dialogVisible: true})
          })
        .catch((error) => {
          this.importingContactInfo = false;
          console.log("ERROR MESSAGE: ", error.message);
        });
    }
  }

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  sendInvite = () => {
    var phoneNumbers = [];
    this.setState({ dialogVisible: false });
    phoneNumbers.push(this.state.phone)
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/sendInvite', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.props.navigation.state.params.username,
                phoneNumbers: phoneNumbers,
            })
          }).then(res => {
            if (res.status == 200) {

      Alert.alert(
      'Invite Sent'
      );
    }
          });

} catch(error) {
  console.log("error " + error);
}
  }

render() {
  var {navigate} = this.props.navigation;
    return (
          <View style={{flex:1,backgroundColor: '#fefefe'}}>
            { /*<TouchableHighlight onPress = { () => navigate ("SuggestedScreen", {}) } underlayColor = '#DFE1E3'>
              <View style={styles.container}>
                <View style={styles.leftContainer}>
                  <View style={styles.subLeftContainer}>
                    <Image
                        style={{width: 50, height: 50 }}
                        source={require('./Capture.png')}
                    />
                  </View>
                  <View style={styles.subRightOLContainer}>
                    <Text style={styles.profileName}>Suggested friends</Text>
                    <Text style={styles.profileDesignation}>Find your friends and follow</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight> */}

            <TouchableHighlight onPress={this.invite.bind(this)} underlayColor = '#DFE1E3'>
              <View style={styles.container}>
                <View style={styles.leftContainer}>
                  <View style={{justifyContent: 'center',alignItems: 'center',height: 50, width:50,backgroundColor: '#f00039',borderRadius: 25}}>
                    <Feather style={{color:'#fff'}} name={'users'} size={24}/>
                  </View>
                  <View style={styles.subRightOLContainer}>
                    <Text style={styles.profileName}>Invite Friends</Text>
                    <Text style={styles.profileDesignation}>Invite your friends to join</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            <View>
              <Dialog.Container visible={this.state.dialogVisible}>
                <Dialog.Title>Send Invite</Dialog.Title>
                <Dialog.Description>
                  Send invite to {this.state.phone} ?
                </Dialog.Description>
                <Dialog.Button label="No" onPress= {() => this.handleCancel()} />
                <Dialog.Button label="Yes" onPress= {() => this.sendInvite()} />
              </Dialog.Container>
            </View>
          </View>
    );
  }
}


const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical:17,
    backgroundColor: '#fefefe',
    height: 78,
    borderBottomWidth: 1,
    borderColor: '#dadddf'
  },
  leftContainer:{
    flex:1,
    flexDirection: 'row',
  },
  subRightOLContainer:{
    marginLeft: 17
  },
  rightContainer:{
    flex:2,
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  profileName:{
    color:'#36292a',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 24,
  },
  profileDesignation:{
    color:'#999296',
    fontSize: 12,
    fontFamily: 'Montserrat-Light',
    lineHeight: 20,
  },
});
