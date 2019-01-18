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

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


import { TabNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Item, Input } from 'native-base';

const ACCESS_TOKEN = 'access_token';

class Login extends Component {

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


  async storeToken(accessToken, userObj){
    try {
        await AsyncStorage.multiSet([
          ['token', accessToken],
          ['user', userObj]
        ]);
        //this.getToken();
    } catch (error) {
      console.log("something went wrong", error)
    }
  }


  async onLoginPressed() {
    this.setState({showProgress: true, loader: true})
    try {
      let response = await fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/login', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      username: this.state.username,
                      password: this.state.password,
                  })
                });
      let res = await response.text();
      if (response.status == 200) {
          //Handle success
          this.setState({loader : false, error: ""})
          let result = JSON.parse(res);
          let userObj = {
            bio: result.user.bio,
            city: result.user.city,
            phone: result.user.phone,
            followersCount: result.user.followersCount,
            followingCount: result.user.followingCount,
            postsCount: result.user.postsCount,
            _id: result.user._id,
            username: result.user.username,
            email: result.user.email,
            imageUrl: result.user.imageUrl ? result.user.imageUrl : null
          }
          let accessToken = result.token;
          this.storeToken(accessToken, JSON.stringify(userObj));
          this.props.saveUserData(userObj);
          //On success we will store the access_token in the AsyncStorage
          this.props.navigation.navigate('Scenes');
      } else {
          //Handle error
          let error = res;
          Alert.alert(
         'Incorrect username or password'
          )
          this.setState({loader : false})
      }
    } catch(error) {
        this.removeToken();
        this.setState({error: error});
        console.log("error " + error);
    }
  }

    render() {
      const {goBack} = this.props.navigation;
      var {navigate} = this.props.navigation;
        return (
            <ImageBackground source={require('./landing.png')} style={styles.backgroundImage}>
              <ScrollView automaticallyAdjustContentInsets={false} keyboardShouldPersistTaps='always' style={styles.scrollView}>
                 <Text style={styles.welcome}>
                    Welcome to Flipclip
                  </Text>
                  <View style={{alignItems: 'center', flex: 1,marginBottom: 60}}>
                    <Item style={{width: 310,marginBottom: 10}}>
                      <EvilIcons style={{color:'#fefefe'}} name='user' size={20} />
                      <Input
                        style={{color: '#f5f5f5',fontSize: 14,fontFamily: 'Montserrat-Regular',}}
                        placeholder='User Name'
                        placeholderTextColor= '#f5f5f5'
                        onChangeText={ (text)=> this.setState({username: text}) }
                      />
                    </Item>
                    <Item style={{width: 310}}>
                      <Icon style={{color:'#fefefe'}} name='ios-lock-outline' size={20}/>
                      <Input
                        style={{color: '#f5f5f5',fontSize: 14, marginLeft: 5,fontFamily: 'Montserrat-Regular',}}
                        placeholder='Password'
                        placeholderTextColor= '#f5f5f5'
                        secureTextEntry={true}
                        onChangeText={ (text)=> this.setState({password: text})}
                      />
                    </Item>
                  </View>
                  <View style={{alignSelf: 'center', flex: 1}}>
                    <Button block transparent style={styles.LoginButton} onPress = { this.onLoginPressed.bind(this) } >
                      <Text style={styles.logintext}>Sign In</Text>
                    </Button>
                  </View>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={styles.SignUpResendOtpText}>
                      Don’t have an account?&nbsp;
                      <Text style={styles.SignUpResendOtpLink}  onPress = { () => navigate ("SignUp", {}) }>
                        Sign Up
                      </Text>
                    </Text>
                  </View>

                  <Text style={styles.error}>
                    {this.state.error}
                  </Text>
              </ScrollView>
              { this.state.loader &&
                 <View style={styles.loading}>
                    <ActivityIndicator
                      animating={true}
                      size="large"
                      color="#ff0046"
                      />
                </View>
              }
            </ImageBackground>
        )
    }
}
export default connect(state => ({
     user: state.tasks.user
}), {
  saveUserData: saveUserData,
})(Login)

const styles = StyleSheet.create({
    scrollView:{
      backgroundColor: 'rgba(0,0,0,0.7)',
      flex:1,
    },
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
