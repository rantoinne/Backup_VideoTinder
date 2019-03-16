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
import Entypo from 'react-native-vector-icons/Entypo';

class HeaderProfilePic extends Component{
    
    static navigationOptions = {
       header: false,
    };

  render() {   
    // console.log("pop", this.props.user);   
    if(this.props.user.imageUrl) {
      return (       
            <Thumbnail source={{uri: this.props.user.imageUrl}} style={{width: 40, height: 40,marginRight: 18, borderWidth:1, marginTop: 4}} />
      );  
    }

    else {
      return (
        <View style= {{ width: 44, height: 44, borderRadius: 23, backgroundColor: 'white', marginRight: 18, justifyContent: 'center', alignItems: 'center', padding: 4, elevation: 2}}>
        <Entypo name= 'user' size = {32} color= 'gray' style= {{alignSelf: 'center'}} />
        </View>
      );
    }
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