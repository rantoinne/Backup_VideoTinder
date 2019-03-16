import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Image,ListView,TouchableOpacity,ImageBackground,TouchableHighlight,AsyncStorage,ActivityIndicator, Dimensions, TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-action-button';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Col, Row, Grid } from 'react-native-easy-grid';
import VideoPlayer from 'react-native-video-player';
import Orientation from 'react-native-orientation';
import { ImageCacheManager } from "react-native-cached-image";
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
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
    this.volume = 1.0;
  }

  onLoadStart = () => {
    // console.log("HELLO I AM LOAD and start");
    this.setState({opacity: 1});
  }

  onLoad = () => {
    this.setState({opacity: 0});
  }

  onStart = () => {
    // console.log("I am activityindicator with starting")
    // console.log("HELLO I AM LOADING AND CACHE");
    ImageCacheManager({})
    .downloadAndCacheUrl(this.props.card.streamingUrl)
    .then(res => {
      // console.log("imagecaching", res)
      this.setState({ cachedVideoURI: res });
     })
    .catch(err => {
      // console.log("Caching", err);
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

  componentDidUnmount() {
    this.volume = 0.0;
    // alert('solo')
  }

  renderProfilePic(data) {
      if(data.userProfilePic) {
        return (       
            <TouchableOpacity style= {{justifyContent: 'center', alignItems: 'center'}} onPress={()=> this.props.navigation.navigate('ViewProfile', {user: data} )}>
              <Thumbnail source={{uri: data.userProfilePic}} style={{height: 40, width: 40, marginHorizontal: 10}} />
            </TouchableOpacity>
        );
      }

      else {
        return (
          <View style= {{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 4, elevation: 4}}>
            <Entypo name= 'user' size = {34} color= 'gray' style= {{alignSelf: 'center'}} onPress={()=> this.props.navigation.navigate('ViewProfile', {user: data} )} />
          </View>
        );
      }
    }

    componentDidMount() {
      // alert('solo')
    }

  render() {
    const card =  this.props.card;
    // alert(JSON.stringify(card))
    return (
          <View >
            
            <ImageBackground source={{uri: card.thumbnail}} style={{width: SCREEN_WIDTH - 40,height: null}}>
              <ActivityIndicator
                animating={true}
                size={30}
                color="#ff0046"
                style={[styles.activityIndicator, {opacity: this.state.opacity}]}
              />
              <VideoPlayer
                defaultMuted= {false}
                volume={this.volume}
                ref={r => this.player = r}
                endWithThumbnail
                thumbnail={{ uri: card.thumbnail }}
                video={{ uri: this.state.cachedVideoURI}}
                videoHeight={SCREEN_HEIGHT * 2.4}
                fullScreenOnLongPress= {true}
                resizeMode={'cover'}
                pauseOnPress
                onBuffer={this.onBuffer}
                onLoadStart={this.onLoadStart}
                disableControlsAutoHide={true}
                onLoad={this.onLoad}
                autoplay={false}
              />
              <View style= {{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' , width: '100%', height: 50, top: 4, left: 4, position: 'absolute', zIndex: 1000, padding: 4}}>

              <View style= {{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>

              {
                this.renderProfilePic(card)
              }

              </View>

              <View style= {{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

              { this.state.follow ?
                this.state.follow == 'self' ?
                  <Text></Text>
                :
                <View style={{height: 25, width: 45, borderRadius: 14, padding: 4, backgroundColor: '#f5f6fa', justifyContent: 'center', alignItems: 'center', marginRight: 4}}>
                <TouchableWithoutFeedback
                  onPress={()=>this.updateTitleStatus(card.userId, "unfollow")}>
                  <Feather
                    size={23}
                    style= {{marginRight: 4}}
                    color= '#E91E63'
                    name= 'user-check'
                  />
                </TouchableWithoutFeedback>
                </View>
                :
                <View style={{height: 25, width: 45, borderRadius: 14,padding: 4, backgroundColor: '#f5f6fa', justifyContent: 'center', alignItems: 'center', marginRight: 4}}>
                <TouchableWithoutFeedback
                    onPress={()=>this.updateTitleStatus(card.userId, "follow")}>
                  <Feather
                    size={23}
                    color= 'black'
                    style= {{marginRight: 4}}
                    name= 'user-plus'
                  />
                </TouchableWithoutFeedback>
                </View>
              }
              </View>
              </View>


              <View style= {{ flexDirection: 'row', justifyContent: 'flex-start', width: '80%', height: 65, bottom: 28, left: 0, position: 'absolute', zIndex: 1000, marginHorizontal: 20, alignSelf:'flex-start' }}>

              <View style= {{ flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                <Text style={styles.uploaderName}>{this.Capitalize(card.username)}</Text>
                <Text style={styles.uploaderDesc}>{card.description === "" ? "No Description": card.description}</Text>
              </View>
              </View>

              <View style= {{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 50, right: 8, position: 'absolute' }}>
                {card.likesCount === 0 ? <Icon style={{color:'#000'}} name={'md-heart'} size={50}/> : <Icon style={{color:'#f00039'}} name={'md-heart'} size={50}/>  }
                <Text style={{fontFamily: 'Montserrat-Regular',fontSize: 16, color: 'white', position: 'absolute', top: 12}}>{card.likesCount}</Text>
              </View>


              </ImageBackground>
                 
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
    fontSize: 18,
    fontFamily: 'Montserrat-Light',
    color: 'white',
    alignSelf: 'flex-start'
  },
  uploaderDesc:{
    fontSize: 14,
    fontFamily: 'Montserrat-Light',
    color: 'white',
    alignSelf: 'flex-start',
    opacity: 0.8
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
        right: (SCREEN_WIDTH / 2) - 50 ,
  },
  status: {
    fontSize: 16,
    fontFamily: 'Montserrat-regular',
    color: '#36292a',
  }
});
