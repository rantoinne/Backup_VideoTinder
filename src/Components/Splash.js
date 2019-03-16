import React, { Component } from 'react';
import {saveUserData} from '../redux/reducers/tasks';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Platform,
  Text,
  Image,
  View,TouchableOpacity,ImageBackground,ScrollView,AsyncStorage,Alert,ActivityIndicator
} from 'react-native';

import { TabNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Item, Input } from 'native-base';

const ACCESS_TOKEN = 'access_token';

class Splash extends Component {

   constructor(props) {
      super(props);
      this.state = {
        username: "",
        password: "",
        error: "",
        loader: false,
      };
    }

    static navigationOptions = {
    header: false,
  }

  checkAuthToken() {
    AsyncStorage.getItem('token')
            .then((token) => {
                if(token !== null) {
                    setTimeout(()=> {
                      this.props.navigation.navigate('Scenes')
                    }, 1000);
                }
                else {
                  setTimeout(()=> {
                  this.props.navigation.navigate('Landing')
                  }, 1000);
                }
            })
            .catch(error => {
                this.setState({ error })
            })
  }

  componentDidMount=async()=>{

        try {
          var asyncVar = await AsyncStorage.getItem("@AAA:boarding");
          // alert("Fetched " + asyncVar);
          this.setState({persistData: asyncVar});
          
        }catch(e) {
        }
        if(this.state.persistData === "boarding") {
          // this.setState({ firstLaunch: true });
          this.checkAuthToken();
        }
        else {
          try {
              await AsyncStorage.setItem("@AAA:boarding", "boarding");
              // alert("token " + token);
              // this.setState({ firstLaunch: false });
              this.props.navigation.navigate('OnboardingSlider');
              }catch(e) {
              // alert("storeItemError " + e);
            }
        }

    
  }

    render() {
      const {goBack} = this.props.navigation;
      var {navigate} = this.props.navigation;
        return (
            <ImageBackground source={require('./landing.png')} style={styles.backgroundImage}>
            <View style= {{ width: '98%', height: '98%', backgroundColor: '#00000060'}}>
              <Image source= {require('./FLIPCLIP.png')} style= {{ width: '80%', alignSelf: 'center' }} resizeMode= 'cover' />
                
                    <ActivityIndicator
                      style= {{marginTop: 50}}
                      animating={true}
                      size={70}
                      color="#ff0046"
                      />
              </View>
            </ImageBackground>
        )
    }
}
export default connect(state => ({
     user: state.tasks.user
}), {
  saveUserData: saveUserData,
})(Splash)

const styles = StyleSheet.create({
    scrollView:{
      backgroundColor: 'rgba(0,0,0,0.7)',
      flex:1,
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center'
    },

    text: {
        color: 'white',
        fontSize: 32,
    },

  uploaderName:{
    fontSize: 16,
    color: '#fefefe'
  },
  welcome: {
    fontSize: 28,
    color: '#f5f5f5',
    textAlign: 'center',
    marginTop: 201,
    marginBottom: 135,
    fontFamily: 'FredokaOne-Regular'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  LoginButton: {
    borderRadius:100,
    backgroundColor: '#ff0046',
    width: 310,
    marginBottom: 20,
  },
  logintext:{
    color: '#f5f5f5',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
  error: {
    color: 'red',
    paddingTop: 10
  },
  SignUpResendOtpText: {
      color: '#f5f5f5',
      textAlign: 'center',
      fontSize: 14,
      fontFamily: 'Montserrat-Regular',
  },
  SignUpResendOtpLink:{
      color: '#ff0046',
      textAlign: 'center',
      fontSize: 14,
      fontFamily: 'Montserrat-Medium',
      textDecorationLine: 'none',
      textDecorationStyle: 'solid',
      textDecorationColor: '#000'
  },
  success: {
    color: 'green',
    paddingTop: 10
  },
   loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  }

});
