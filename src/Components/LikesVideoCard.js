import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Image,ListView,TouchableOpacity,ImageBackground,TouchableHighlight,AsyncStorage,ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Col, Row, Grid } from 'react-native-easy-grid';
import VideoPlayer from 'react-native-video-player';
import Orientation from 'react-native-orientation';
import { ImageCacheManager } from "react-native-cached-image";
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const theme = {
    title: '#FFF',
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

export default class LikesVideoCard extends Component{

    static navigationOptions = {
       header: false,
    };

  constructor(props) {
    super(props);
    this.state = {
      follow: this.props.card.followingUser,
      opacity: 0,
      cachedVideoURI: this.props.card.streamingUrl,
    };
  }

  onLoadStart = () => {
    console.log("HELLO I AM LOAD and start");
    this.setState({opacity: 1});
  }

  onLoad = () => {
    this.setState({opacity: 0});
  }

  onStart = () => {
    console.log("I am activityindicator with starting")
    console.log("HELLO I AM LOADING AND CACHE");
    ImageCacheManager({})
    .downloadAndCacheUrl(this.props.card.streamingUrl)
    .then(res => {
      console.log("imagecaching", res)
      this.setState({ cachedVideoURI: res });
     })
    .catch(err => {
      console.log("Caching", err);
    });
  }

  onBuffer = ({isBuffering}) => {
      this.setState({opacity: isBuffering ? 1 : 0});
  }


  updateTitleStatus = (followedId, action) => {
        if (action == "follow") {
           this.props.followRequest(followedId, this.props.cardIndex);
        }
        else {
          this.props.unFollowRequest(followedId, this.props.cardIndex);
        }
        this.setState({
          follow : !this.state.follow
        });
    }

  Capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  render() {
    const card =  this.props.card;
   // console.log("checker", this.props.followers.username, this.props.followers.following)
    return (
          <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
            <CardItem style={{height: 48,borderWidth:0}}>
              <Left>
              <Thumbnail source={{uri: card.userProfilePic ? card.userProfilePic : "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg"}} style={{height: 40, width: 40}} />
                <Body>
                  <Text style={styles.uploaderName}>{this.Capitalize(card.username)}</Text>
                </Body>
              </Left>
              <Right>
              { this.state.follow ?
                this.state.follow == 'self' ?
                  <Text></Text>
                :
                <TouchableHighlight underlayColor = '#fff' onPress={()=>this.updateTitleStatus(card.userId, "unfollow")}>
                  <Image
                    source={require('./unfollow.png')}
                    style={{height: 23, width: 42}}
                  />
                </TouchableHighlight>
                :
                <TouchableHighlight underlayColor = '#fff' onPress={()=>this.updateTitleStatus(card.userId, "follow")}>
                  <Image
                    source={require('./follow.png')}
                    style={{height: 23, width: 42}}
                  />
                </TouchableHighlight>
              }
              </Right>
            </CardItem>
            <ImageBackground source={{uri: card.thumbnail}} style={{width: null,height: null}}>
              <ActivityIndicator
                animating={true}
                size={30}
                color="#ff0046"
                style={[styles.activityIndicator, {opacity: this.state.opacity}]}
              />
              <VideoPlayer
                disableSeek
                defaultMuted
                endWithThumbnail
                thumbnail={{ uri: card.thumbnail }}
                video={{ uri: this.state.cachedVideoURI}}
                videoHeight={1250}
                resizeMode={'cover'}
                disableFullscreen
                pauseOnPress
                onBuffer={this.onBuffer}
                onLoadStart={this.onLoadStart}
                onLoad={this.onLoad}
                onStart={this.onStart}
              />
              </ImageBackground>
            <CardItem style={{height: 48,borderWidth:0,}}>
              <Left>
                  {card.likesCount === 0 ? <Icon style={{color:'#000'}} name={'md-heart'} size={20}/> : <Icon style={{color:'#f00039'}} name={'md-heart'} size={20}/>  }
                <Text style={{marginLeft:4,fontFamily: 'Montserrat-Regular',fontSize: 12, color: '#36292a'}}>{card.likesCount}</Text>
                {/* <Image
                    source={require('./mention.png')}
                    style={{height: 20, width: 20, marginLeft: 15}}
                /> */}
              </Left>
              <Body>
                <Button transparent>

                </Button>
              </Body>
              <Right>

              </Right>
            </CardItem>
            <CardItem style={{borderWidth:0,paddingBottom:4}}>
              <Left style={{marginTop: -15}}>
                  <Text style={styles.status}>{card.description ? card.description : "" }</Text>
              </Left>
            </CardItem>
         </View>
    );
  }
}

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
  },
  activityIndicator : {
    position: 'absolute',
        top: 20,
        right: 10,
  },
  status: {
    fontSize: 16,
    fontFamily: 'Montserrat-regular',
    color: '#36292a',
  }
});
