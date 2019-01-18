import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,TouchableOpacity,ImageBackground,TouchableHighlight,ListView,AsyncStorage
} from 'react-native';
import {saveUserData} from '../redux/reducers/tasks';
import { connect } from 'react-redux';
import { TabNavigator, StackNavigator } from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Dialog from "react-native-dialog";

class Settings extends Component {

    static navigationOptions = {
      headerTitle: 'Settings',
      headerTitleStyle: {
          color: '#36292a',
          fontFamily: 'WorkSans-Regular',
          fontWeight: '300',
          textAlign:'center',
          alignSelf:'center',
          flex:1
          },
      headerRight: <View/>
        };

   constructor(props) {
      super(props);
      this.state={
        dialogVisible: false,
      }
    }

   confirmDialog = () => {
    //this.props.saveUserData({});
    this.setState({dialogVisible: true})
   }

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  removeToken = () => {
    this.setState({ dialogVisible: false });
    try{
       AsyncStorage.multiRemove(
          ['token', 'user']);
          this.props.navigation.navigate('Landing');
    } catch (error) {
      console.log("Something went wrong", error)
    }
  }

render() {
  var {navigate} = this.props.navigation;
    return (
          <View style={{flex:1,backgroundColor: '#fefefe'}}>
            <TouchableOpacity onPress = { () => navigate ("EditProfile", {}) } underlayColor = '#DFE1E3'>
              <CardItem style={{borderBottomWidth:1,borderColor:'#dadddf', height: 60}}>
                <Left>
                  <Text style={{color: '#36292a', fontSize: 14,fontFamily: 'Montserrat-Regular',}}>Edit Profile</Text>
                </Left>
                <Body>
                  <Button transparent>
                  </Button>
                </Body>
                <Right>
                  <IonIcon name="ios-arrow-forward" size={28} color="#999296"/>
                </Right>
              </CardItem>
            </TouchableOpacity>

            <TouchableOpacity onPress = { () => navigate ("PasswordChange", {}) } underlayColor = '#DFE1E3'>
              <CardItem style={{borderBottomWidth:1,borderColor:'#dadddf',height: 60}}>
                <Left>
                  <Text style={{color: '#36292a', fontSize: 14,fontFamily: 'Montserrat-Regular',}}>Change Password</Text>
                </Left>
                <Body>
                  <Button transparent>
                  </Button>
                </Body>
                <Right>
                  <IonIcon name="ios-arrow-forward" size={28} color="#999296"/>
                </Right>
              </CardItem>
            </TouchableOpacity>

            <TouchableOpacity onPress = { () => this.confirmDialog() } underlayColor = '#DFE1E3'>
              <CardItem style={{borderBottomWidth:1,borderColor:'#dadddf', height: 60}}>
                <Left>
                  <Text style={{color: '#36292a', fontSize: 14,fontFamily: 'Montserrat-Regular',}}>Logout</Text>
                </Left>
                <Body>
                  <Button transparent>
                  </Button>
                </Body>
                <Right>
                  <IonIcon name="ios-arrow-forward" size={28} color="#999296"/>
                </Right>
              </CardItem>
            </TouchableOpacity>
            <View>
              <Dialog.Container visible={this.state.dialogVisible}>
                <Dialog.Title>Logout</Dialog.Title>
                <Dialog.Description>
                  Do you really want to logout?
                </Dialog.Description>
                <Dialog.Button label="No" onPress= {() => this.handleCancel()} />
                <Dialog.Button label="Yes" onPress= {() => this.removeToken()} />
              </Dialog.Container>
            </View>
          </View>
    );
  }
}

export default connect(state => ({
     user: state.tasks.user
}), {
  saveUserData: saveUserData,
})(Settings)

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
    fontFamily: 'WorkSans-Medium',
    lineHeight: 24,
  },
  profileDesignation:{
    color:'#999296',
    fontSize: 12,
    fontFamily: 'WorkSans-Regular',
    lineHeight: 20,
  },
});
