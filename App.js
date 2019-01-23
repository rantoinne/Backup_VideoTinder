import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Dimensions,Image,TouchableOpacity
} from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

import { TabNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavigatorScreen from './src/Components/NavigatorScreen.js'
import Favourites from './src/Components/Favourites.js'
import Scenes from './src/Components/Scenes.js'
import Likes from './src/Components/Likes.js'
import profile from './src/Components/profile.js'
import VideoCapture from './src/Components/VideoCapture.js'
import FullScreenVid from './src/Components/FullScreenVid.js'
import InviteScreen from './src/Components/InviteScreen.js'
import SuggestedScreen from './src/Components/SuggestedScreen.js'
import Settings from './src/Components/Settings.js'
import EditProfile from './src/Components/EditProfile.js'
import PasswordChange from './src/Components/PasswordChange.js'
import Followers from './src/Components/Followers.js';
import Following from './src/Components/Following.js'
import Landing from './src/Components/Landing.js'
import Login from './src/Components/Login.js'
import SignUp from './src/Components/SignUp.js'
import Repost from './src/Components/Repost.js'
import ProfileVideo from './src/Components/ProfileVideo.js'
import FollowCards from './src/Components/FollowCards.js'
import FollowingCards from './src/Components/FollowingCards'
import VideoCard from './src/Components/VideoCard.js'
import LikesVideoCard from './src/Components/LikesVideoCard.js'
import HeaderProfilePic from './src/Components/HeaderProfilePic.js'


const Navigation = StackNavigator ({
  Landing :{
    screen : Landing
  },
  Login:{
    screen: Login
  },
  SignUp: {
    screen: SignUp
  },
  Register: { screen: NavigatorScreen,
    navigationOptions : (props) => {
      console.disableYellowBox = true;
      const {navigation} = props;
         return ({
           headerTitle: (
              <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
                <Image
                  source={require('./FLIPCLIP.png')}
                  style={{width: 100, height: 30}}
                />
              </View>
            ),
          headerLeft:  <Icon style={{marginLeft:18, color:'#000'}} name={'ios-notifications-outline'} size={35}/>,
          headerRight: <TouchableOpacity onPress = {() => navigation.navigate ("profile", {}) }>
                          <HeaderProfilePic />
                        </TouchableOpacity>,
        headerTintColor: 'white',
        headerStyle:{
            backgroundColor: '#fff',
            shadowOpacity: 0,
            shadowOffset: {
              height: 0,
              width:0
            },
            shadowRadius: 0,
            elevation: 0,
          },
        headerTitleStyle: {
            color: '#36292a',
            fontFamily: 'Montserrat-Medium',
            fontWeight: '300',
            fontSize: 14,
            textAlign:'center',
            alignSelf:'center',
            flex:1
          },
      })

      }
    },

  profile: {
    screen: profile
  },
  VideoCapture: {
    screen: VideoCapture
  },
  FullScreenVid: {
    screen: FullScreenVid
  },
  InviteScreen: {
    screen: InviteScreen
  },
  SuggestedScreen: {
    screen: SuggestedScreen
  },
  Settings: {
    screen: Settings
  },
  EditProfile: {
    screen :EditProfile
  },
  PasswordChange: {
    screen :PasswordChange
  },
  Followers: {
    screen :Followers
  },
  Following: {
    screen: Following
  },
  FollowCards: {
    screen: FollowCards
  },
  FollowingCards: {
    screen: FollowingCards
  },
  VideoCard: {
    screen: VideoCard
  },
  LikesVideoCard: {
    screen: LikesVideoCard
  },
  HeaderProfilePic: {
    screen: HeaderProfilePic
  },
  ProfileVideo: {
    screen: ProfileVideo
  }
});

const App = () => (
    <Provider store={store}>
        <Navigation />
    </Provider>
);

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
