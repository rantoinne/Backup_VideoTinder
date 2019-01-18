import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Dimensions,Image
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

import { TabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Favourites from './Favourites.js'
import Scenes from './Scenes.js'
import Likes from './Likes.js'

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

var MainScreenNavigator = TabNavigator ({
  Favourites: {screen: Favourites},
  Scenes: {screen: Scenes},
  Likes: {screen: Likes}
 },
 {
  tabBarPosition: 'top',
  swipeEnabled: false,
  tabBarOptions: {
    inactiveTintColor: '#ffa0b1',
    activeTintColor: '#fefefe',
    elevation: 5,
    style: {
      backgroundColor: '#f00039',
      height: (Platform.OS === 'ios') ? 48 : 60 // I didn't use this in my app, so the numbers may be off.
    },
    labelStyle:{
      fontSize: 10,
      fontWeight: '400',
      fontFamily: 'Montserrat-Regular',
    },
    showIcon: true,
    showLabel: true,
    tabStyle: {

    },
    indicatorStyle: {
      backgroundColor : 'transparent',
      height : 0
    },
  },
}
);

MainScreenNavigator.navigationOptions ={

};

export default MainScreenNavigator;
