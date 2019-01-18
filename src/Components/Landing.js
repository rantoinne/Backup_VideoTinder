import React, { Component } from 'react';
import {saveUserData} from '../redux/reducers/tasks';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Platform,
  Text,
  Image,
  View,TouchableOpacity,ImageBackground,AsyncStorage
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


import { TabNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';

class Landing extends Component {

    static navigationOptions = {
        header: false
        };

   constructor(props) {
      super(props);
    }

    componentWillMount() {
    var token;
    AsyncStorage.multiGet(['token', 'user']).then((data) => {
      if (data[0][1]) {
        token = data[0][1];
        user = data[1][1];
        return [token, user];
      }
      else return null
    }).then((user) => {
      console.log("tyuiop",user)
      if(user){
         console.log("land if",user);
        try {
          let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/userInfo', {
                      method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          userId: JSON.parse(user[1])._id,
                      })
                    }).then(response => {
                      console.log("loginnnnn", JSON.parse(response._bodyText));
                      this.props.saveUserData(JSON.parse(response._bodyText)[0]);
                      //On success we will store the access_token in the AsyncStorage
                      AsyncStorage.setItem('user', JSON.stringify(JSON.parse(response._bodyText)[0]));
                      this.props.navigation.navigate('Scenes');
                  })
        } catch(error) {
            console.log("error " + error);
        }
    }
      else
        console.log("land else",user);
        //this.props.saveUserData({});
    }).catch(err => {
      console.log("in error", err)
    })
  }

    render() {
      const {goBack} = this.props.navigation;
      var {navigate} = this.props.navigation;
        return (
            <ImageBackground source={require('./landing.png')}
                  style={styles.backgroundImage}>
              <View  style={{backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-start', alignItems: 'center', flex:1}} >
                 <Text style={styles.welcome}>
                    Welcome to Flipclip
                  </Text>
                  <View style={{justifyContent: 'center'}}>
                    <Button block transparent style={styles.LoginButton} onPress = { () => navigate ("Login", {}) } >
                    <Text style={styles.logintext}>Sign In</Text>
                  </Button>
                  </View>

                  <View style={{justifyContent: 'center'}}>
                    <Text style={styles.SignUpResendOtpText}>
                      Don’t have an account?&nbsp;
                      <Text style={styles.SignUpResendOtpLink} onPress = { () => navigate ("SignUp", {}) }>
                        Sign Up
                      </Text>
                    </Text>
                  </View>
                </View>
            </ImageBackground>
        )
    }
}

export default connect(state => ({
     user: state.tasks.user
}), {
  saveUserData: saveUserData,
})(Landing)

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
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
    marginBottom: 145,
    fontFamily: 'FredokaOne-Regular'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  LoginButton: {
    borderWidth: 2 ,
    borderColor: '#ff0046',
    width: 310,
    borderRadius:100,
    marginBottom: 20,
  },
  logintext:{
    color: '#f5f5f5',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium'
  },
  SignUpResendOtpText: {
      color: '#f5f5f5',
      textAlign: 'center',
      fontSize: 14,
      fontFamily: 'Montserrat-Regular'
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
});
