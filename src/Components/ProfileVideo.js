import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,TouchableOpacity,Image, Dimensions,ScrollView,TouchableHighlight, FlatList
} from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FlatGrid from 'react-native-super-grid';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Tab, Tabs } from 'native-base';
import VideoPlayer from 'react-native-video-player';

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

  checkUser(item) {
    if(this.props.notMe) {
      this.props.navigation.navigate('NotMyVideoView', { items: item, archived: this.props.archived }) 
    }

    else {
      this.props.navigation.navigate('FullScreenVid', { items: item, archived: this.props.archived }) 
    }
  }

  render() {
    return (
      <View style= {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ScrollView automaticallyAdjustContentInsets={true} contentContainerStyle={styles.scrollView}>
        <FlatGrid
          items={this.props.selfVideos}
          style={styles.gridView}
          spacing= {0}
          renderItem={item => (
            <TouchableOpacity onPress = { () => this.checkUser(item)}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView:{
    justifyContent: 'center',
    alignItems: 'center'
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
    marginTop: 10,
  },
  itemContainer: {
    justifyContent: 'flex-end',
  },
});
