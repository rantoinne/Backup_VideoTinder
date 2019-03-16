import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Dimensions,Image,TouchableOpacity, AsyncStorage
} from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './src/redux/reducers';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { TabNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavigatorScreen from './src/Components/NavigatorScreen.js'
import Favourites from './src/Components/Favourites.js'
import FullView from './src/Components/FullView.js'
import Scenes from './src/Components/Scenes.js'
import Likes from './src/Components/Likes.js'
import OnboardingSlider from './src/onboarding/component/onboardingSlider';
import profile from './src/Components/profile.js'
import VideoCapture from './src/Components/VideoCapture.js'
import FullScreenVid from './src/Components/FullScreenVid.js'
import Notifications from './src/Components/Notification.js'
import InviteScreen from './src/Components/InviteScreen.js'
import SuggestedScreen from './src/Components/SuggestedScreen.js'
import Settings from './src/Components/Settings.js'
import EditProfile from './src/Components/EditProfile.js'
import ViewProfile from './src/Components/ViewProfile.js'
import PasswordChange from './src/Components/PasswordChange.js'
import Followers from './src/Components/Followers.js'
import Following from './src/Components/Following.js'
import Landing from './src/Components/Landing.js'
import Login from './src/Components/Login.js'
import NotMyVideoView from './src/Components/NotMyVideoView.js'
import SignUp from './src/Components/SignUp.js'
import Repost from './src/Components/Repost.js'
import ProfileVideo from './src/Components/ProfileVideo.js'
import FollowCards from './src/Components/FollowCards.js'
import FollowingCards from './src/Components/FollowingCards'
import VideoCard from './src/Components/VideoCard.js'
import Splash from './src/Components/Splash.js'
import LikesVideoCard from './src/Components/LikesVideoCard.js'
import HeaderProfilePic from './src/Components/HeaderProfilePic.js'


const Navigation = StackNavigator ({
  Splash: {
    screen: Splash
  },
  Landing :{
    screen : Landing
  },
  OnboardingSlider: {
    screen: OnboardingSlider,
    navigationOptions: {
      header: null
    }
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
          headerLeft:  <Icon style={{marginLeft:18, color:'#000'}} name={'ios-notifications-outline'} size={35} onPress= {()=> navigation.navigate('Notifications')} />,
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
  Notifications: {
    screen: Notifications
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
  NotMyVideoView: {
    screen :NotMyVideoView
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
  FullView: {
    screen: FullView
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
  },
  ViewProfile: {
    screen: ViewProfile
  }
});



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

const persistConfig= {
  key: 'root',
  storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(
  persistedReducer,
  undefined,
  );

const persistor = persistStore(store)

const App = () =>
  <Provider store= {store}>
  <PersistGate persistor= {persistor}>
    <Navigation />
    </PersistGate>
  </Provider>;

export default App;
