import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Image,ListView,TouchableOpacity,ImageBackground,TouchableHighlight,AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import {saveUserData} from '../redux/reducers/tasks';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

class HeaderProfilePic extends Component{
    
    static navigationOptions = {
       header: false,
    };

  render() {   
    console.log("pop", this.props.user);   
    return (       
          <Thumbnail source={{uri: this.props.user.imageUrl ? this.props.user.imageUrl : "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg" }} style={{width: 40, height: 40,marginRight: 18, borderWidth:1, marginTop: 4}} />
    );  
  }
}

export default connect(state => ({
     user: state.tasks.user
}), {
  saveUserData: saveUserData,
})(HeaderProfilePic)

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
  container: {
    flex: 1,
    backgroundColor: '#fefefe'
  },
  uploaderName:{
    fontSize: 16,
    color: '#36292a'
  },
  actionButtonIcon: {
    color: '#fefefe',  
  },
  followouter: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 90, 
      height: 25, 
      borderRadius: 4,  
      backgroundColor: '#f00039'
    },
  unfollowouter: {
    justifyContent: 'center',
      alignItems: 'center',
      width: 90, 
      height: 25, 
      borderRadius: 4, 
      borderWidth:1, 
      borderColor: '#999296',
      backgroundColor: '#fff'
  }

});