import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,TouchableOpacity,Image, Dimensions,ScrollView,TouchableHighlight
} from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import GridView from 'react-native-super-grid';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Tab, Tabs } from 'native-base';
import VideoPlayer from 'react-native-video-player';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
var width = Dimensions.get('window').width;

const theme = {
    title: 'transparent',
    more: 'transparent',
    center: '#7B8F99',
    volume: 'transparent',
    scrubberThumb: 'transparent',
    scrubberBar: 'transparent',
    seconds: 'transparent',
    duration: 'transparent',
    progress: 'transparent',
    loading: 'transparent',
    fullscreen: 'transparent',
  };

export default class ProfileVideo extends Component {

  static navigationOptions = {
    header: false,
  }

  render() {
    return (
      <ScrollView automaticallyAdjustContentInsets={false} style={styles.scrollView}>
        <GridView
          items={this.props.selfVideos}
          style={styles.gridView}
          spacing= {5}
          renderItem={item => (
            <TouchableOpacity onPress = { () => this.props.navigation.navigate('FullScreenVid', {items: item, archived: this.props.archived}) }>
                <View style={{flex: 1}}>
                  <Image
                    style={{width: width/3, height: width/3}}
                    source={{uri: item.thumbnail}}
                  />
                  <MaterialIcons name={'play-circle-outline'} style={{position: 'absolute', top: 15, right:15, color: '#fff'}} size={26}/>
                </View>
            </TouchableOpacity>
        )}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView:{

  },
  innerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    textCircular: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth:2,
      borderColor: '#fefefe'
    },
    gridView: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
  },
});
