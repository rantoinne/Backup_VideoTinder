import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Image,ListView,TouchableOpacity,ImageBackground,TouchableHighlight,AsyncStorage,ActivityIndicator, Dimensions, TouchableWithoutFeedback
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {saveUserData, saveNewVideosData, updateVideosData } from '../redux/reducers/tasks';
import { connect } from 'react-redux';
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

class VideoCard extends Component{

    static navigationOptions = {
       header: false,       
    };

  constructor(props) {
    super(props);
    this.state = {
      follow: this.props.videoInfo.followingUser,
      cachedVideoURI: this.props.videoInfo.streamingUrl,
      opacity: 0,
      socialise: true
    };
    this.volume = 0.0;
  }

  componentDidUpdate() {
    // this.volume = 1.0;
  }

  componentWillUnmount() {
    // this.player.pause();
  }

  onLoadStart1 = () => {
    this.setState({opacity: 1});
  }
  onStart = () => {
    ImageCacheManager({})
    .downloadAndCacheUrl(this.props.videoInfo.streamingUrl)
    .then(res => {
      // console.log("imagecaching", res)
      this.setState({ cachedVideoURI: res });
     })
    .catch(err => {
      // console.log("Caching", err);
    });
    let index = this.checkMeBeforeIndex();
    if(index === this.props.index) {
      this.volume = 1.0;
    }
    else {
      this.player.pause();
    }

  }

onLoad = () => {
    this.setState({opacity: 0});
}

onBuffer = ({isBuffering}) => {
    this.setState({opacity: isBuffering ? 1 : 0});
}

  updateTitleStatus = (followedId, action) => {
        if (action == "follow") {
           this.props.followRequest(followedId);
        }
        else {
          this.props.unFollowRequest(followedId);
        }
        this.setState({
          follow : !this.state.follow
        });
    }

    renderProfilePic(data) {
      if(data.userProfilePic) {
        return (  
              <TouchableOpacity style= {{justifyContent: 'center', alignItems: 'center'}} onPress={()=> this.props.navigation.navigate('ViewProfile', {user: data} )}>     
              <Thumbnail source={{uri: data.userProfilePic}} style={{height: 40, width: 40}} />
              </TouchableOpacity>
        )
      }

      else {
        return (
          <View style= {{ width: 46, height: 46, borderRadius: 23, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 4, elevation: 4}}>
          <Entypo name= 'user' size = {34} color= 'gray' style= {{alignSelf: 'center'}} 
          onPress={()=> this.props.navigation.navigate('ViewProfile', {user: data} )}
          />
          </View>
        )
      }
    }

    judgeVideo(index) {
      if(!this.state.socialise) {
        this.props.like(index, this.props.videos[index]);
      }
      else {
        this.props.dislike(index, this.props.videos[index]);
      }
      this.setState({ socialise: !this.state.socialise });
    }

    onSwipeRight = (cardIndex) => {
    this.setState({socialise: !this.state.socialise});
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/likeVideo', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                      videoId: this.props.videos[cardIndex]._id
                  })
                }).then(response => {
                  console.log("that's the response", response)
              })
        } catch(error) {
            console.log("error " + error);
      }
      this.props.fetchAgain();
  };

  onSwipeLeft = (cardIndex) => {
    // alert('press')
    this.setState({socialise: !this.state.socialise});
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/dislikeVideo', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                      videoId: this.state.videos[cardIndex]._id
                  })
                }).then(response => {
                  // console.log("that's the response", response)
              })
        } catch(error) {
            // console.log("error " + error);
      }
      this.props.fetchAgain();
      // alert('Done')
  };

  checkMeBeforeIndex() {
    var indexa = -1;
    this.props.videos.map((item, index)=> {
      if(item.streamingUrl === this.props.videoInfo.streamingUrl) {
        // alert(index)
        indexa = index
      }
    });
    return indexa;
  }

  checkCurrentIndex(index) {
    let indexIncoming = this.checkMeBeforeIndex()
    if(index === indexIncoming) {
      alert('match')
    }
    if(this.props.index === indexIncoming) {
      // this.volume = 1.0;
    }
    else {
      // this.volume= 0.0;
    }
  }

  render() {
    const videoInfo = this.props.videoInfo;
   // console.log("checker", this.props.followers.username, this.props.followers.following)
    return (
            <View style={{marginTop: 12}}>
            <CardItem style={{height: 50, borderWidth:0}}>
              <Left>
              {
                this.renderProfilePic(videoInfo)
              }
                
                <Body>
                  <Text style={styles.uploaderName}>{videoInfo.username}</Text>
                </Body>
              </Left>
              <Right>
              { this.props.videoInfo.followingUser || this.state.follow ?
                this.props.videoInfo.followingUser == 'self' ?
                  <Text></Text>
                :
                <View style={{height: 25, width: 45, borderRadius: 14,padding: 4, backgroundColor: '#f5f6fa', justifyContent: 'center', alignItems: 'center', marginRight: 4}}>
                <TouchableWithoutFeedback
                  onPress={()=>this.updateTitleStatus(videoInfo.userId, "unfollow")}>
                  <Feather
                    size={23}
                    style= {{marginRight: 2}}
                    color= '#E91E63'
                    name= 'user-check'
                  />
                </TouchableWithoutFeedback>
                </View>
                :
                <View style={{height: 25, width: 45, borderRadius: 14,padding: 4, backgroundColor: '#f5f6fa', justifyContent: 'center', alignItems: 'center', marginRight: 4}}>
                <TouchableWithoutFeedback
                    onPress={()=>this.updateTitleStatus(videoInfo.userId, "follow")}>
                  <Feather
                    size={23}
                    color= 'black'
                    style= {{marginRight: 2}}
                    name= 'user-plus'
                  />
                </TouchableWithoutFeedback>
                </View>
              }
              </Right>
            </CardItem>
            <ImageBackground source={{ uri: videoInfo.thumbnail }} style={{width: null,height: null}}>
              <ActivityIndicator
                animating={true}
                size={30}
                color="#ff0046"
                style={[styles.activityIndicator, {opacity: this.state.opacity}]}
              />
              <TouchableOpacity onPress={()=> this.checkCurrentIndex(this.props.index)} >
              <VideoPlayer
                disableSeek
                defaultMuted= {false}
                endWithThumbnail
                volume={this.volume}
                ref={r => this.player = r}
                thumbnail={{ uri: videoInfo.thumbnail }}
                video={{ uri: this.state.cachedVideoURI}}
                style={{
                    width: SCREEN_WIDTH,
                    height: 250
                  }}
                disableControlsAutoHide= {false}
                resizeMode={'cover'}
                disableFullscreen= {false}
                playWhenInactive= {false}
                playInBackground= {false}
                pauseOnPress
                onBuffer={this.onBuffer}
                onLoadStart={this.onLoadStart1}
                onLoad={this.onLoad}
                onStart={this.onStart}
              />
              </TouchableOpacity>

            
            </ImageBackground>
           <CardItem style={{height: 40,borderWidth:0}}>
            <Left>
              {!this.state.socialise ? <IonIcon name="md-heart" size={28} color="#000" onPress= {()=> this.judgeVideo(this.props.index)} /> : <IonIcon name="md-heart" size={28} color="#f00039" onPress= {()=> this.judgeVideo(this.props.index)} /> }
              <Text style={{marginLeft:4,fontFamily: 'Montserrat-Regular',fontSize: 14, color: '#36292a'}}>{videoInfo.likesCount}</Text>
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
                  <Text style={styles.status}>{videoInfo.description ? videoInfo.description : "" }</Text>
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

export default connect(state => ({
     user: state.tasks.user,
     newVideos: state.tasks.newVideos
}), {
  saveUserData: saveUserData,
  updateVideosData: updateVideosData,
  saveNewVideosData: saveNewVideosData,
})(VideoCard)