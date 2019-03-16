import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Image,ListView,ImageBackground,TouchableOpacity,FlatList,ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import {saveUserData, saveLikedVideosData, updateVideosData} from '../redux/reducers/tasks';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Video from 'react-native-af-video-player';
import VideoCard from './VideoCard.js';

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

 class Likes extends Component{

  static navigationOptions = {
    tabBarLabel: 'Likes',
    tabBarIcon: ({ tintColor }) => (
      <FontAwesomeIcon
        name= 'heart-o'
        color= '#f5f6fa'
        size= {26}
        style={{tintColor: tintColor}}
      />
    ),
  };


  constructor(props) {
    super(props);
    this.state = {
      likedVideos : [],
      loader: true
    };
    this.volume = 1.0;
  }

  onSwipeRight = (cardIndex, video) => {
    // alert('like')
    // var a = Object.assign(this.state.likedVideos)
    // a.splice(cardIndex,1);
    // this.setState({likedVideos : a});
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/likeVideo', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                      videoId: video._id
                  })
                }).then(response => {
                  // console.log("that's the response", response)
              })
        } catch(error) {
            // console.log("error " + error);
      }
  };

  onSwipeLeft = (cardIndex, video) => {
    alert(JSON.stringify(this.state.likedVideos[cardIndex]))
    // var a = Object.assign(this.state.likedVideos)
    // a.splice(cardIndex,1);
    // this.setState({likedVideos : a});
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/dislikeVideo', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                      videoId: video._id
                  })
                }).then(response => {
                  // console.log("that's the response", response)
              })
        } catch(error) {
            // console.log("error " + error);
      }
  };

  fetchAgain() {
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/displayLikedVideos', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                  })
                }).then(response => {
                  this.setState({
                    likedVideos : JSON.parse(response._bodyText)
                  })
                  this.props.saveLikedVideosData(JSON.parse(response._bodyText))

                return response.json().then(error => ({ error }));
              })
    } catch(error) {
        console.log("error " + error);
    }
    // alert('fetched');
  }

  componentWillMount() {
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/displayLikedVideos', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                  })
                }).then(response => {
                  this.setState({
                    likedVideos : JSON.parse(response._bodyText),
                    loader: false
                  })
                  this.props.saveLikedVideosData(JSON.parse(response._bodyText))

                return response.json().then(error => ({ error }));
              })
    } catch(error) {
        // console.log("error " + error);
    }
  }
  componentWillUnmount() { 
    this.volume = 0.0;
    // alert('unmount')
  }

  componentDidMount(){
    // alert('mount')
    this.volume = 1.0;
  this.timer = setInterval(()=> {
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/displayLikedVideos', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                  })
                }).then(response => {
                  this.setState({
                    likedVideos : JSON.parse(response._bodyText)
                  })
                  this.props.saveLikedVideosData(JSON.parse(response._bodyText))

                return response.json().then(error => ({ error }));
              })
    } catch(error) {
        console.log("error " + error);
    }
  }, 5000)
  }


  followRequest = (followedId) => {
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/follow', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                      followedId: followedId
                  })
                }).then(response => {
                  var userObj = this.props.user;
                  var newUser = {...userObj, followingCount: userObj.followingCount + 1}
                  this.props.saveUserData(newUser)
                  this.props.updateVideosData(followedId, true)
              })
        } catch(error) {
            // console.log("error " + error);
      }
  }

  unFollowRequest = (unFollowedId) => {
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/unFollow', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                      unFollowedId: unFollowedId
                  })
                }).then(response => {
                  var userObj = this.props.user;
                  var newUser = {...userObj, followingCount: userObj.followingCount - 1}
                  this.props.saveUserData(newUser)
                  this.props.updateVideosData(unFollowedId, false)
              })
        } catch(error) {
            // console.log("error " + error);
      }
  }

  changeVolume(index) {
    alert('go')
  }

displayImages(likedVideos, index){
  var {navigate} = this.props.navigation;
    return(
    <View style={styles.container}>
    <TouchableOpacity onPress={()=> this.changeVolume(index)}>
         <VideoCard changeVolume= {this.changeVolume} volume= {this.volume} videos = {this.state.likedVideos} videoInfo = {likedVideos} index= {index} fetchAgain={this.fetchAgain}
          dislike= {this.onSwipeLeft} like= {this.onSwipeRight} followRequest = {this.followRequest} unFollowRequest = {this.unFollowRequest} navigation= {this.props.navigation} />
         <View style= {{justifyContent: 'center', alignItems: 'center', padding: 4, position: 'absolute', bottom: 14, right: 4}}>
            <Entypo name="resize-full-screen" size= {24} color= 'red' style={{alignSelf: 'center'}} onPress={()=> this.wrapToSend(likedVideos)} />
          </View>
    </TouchableOpacity>
   </View>
    );
  }

  wrapToSend(popularVideos) {
    this.props.navigation.navigate('FullView', { thumbnail: popularVideos });
  }

  render() {
    var {navigate} = this.props.navigation;
    // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    // var cloneUsers = ds.cloneWithRows(this.props.likedVideos);
    return (
    <View style={{flex: 1,}}>
      {
           this.state.loader ?
            <View style={styles.noVideo}>
                <ActivityIndicator
                  animating={true}
                  size={50}
                  color="#ff0046"
                  />
            </View>
          :
        <FlatList
          style={styles.listView}
          data={this.state.likedVideos}
          renderItem={({item, index}) => this.displayImages(item, index)}
          ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
      }
        <ActionButton
          buttonColor="#ff0046"
          offsetY = {30}
          offsetX = {30}
          size ={56}
          onPress={() => navigate ("VideoCapture", {})}
          icon={<MaterialIcons name='videocam' size={28} style={styles.actionButtonIcon} />}>
        </ActionButton>
        </View>
    );
  }
}

export default connect(state => ({
     user: state.tasks.user,
     likedVideos: state.tasks.likedVideos
}), {
  saveUserData: saveUserData,
  saveLikedVideosData: saveLikedVideosData,
  updateVideosData: updateVideosData
})(Likes)

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
     alignItems: 'stretch',
  },
  uploaderName:{
    fontSize: 16,
    color: '#36292a',
    fontFamily: 'Montserrat-Regular',
  },
  paragraph: {
    textAlign: 'center',
    color: 'white'
  },
  actionButtonIcon: {
    color: '#fefefe',
  },
  uploaderName:{
    fontSize: 14,
    color: '#36292a'
  },
  status:{
    fontFamily: 'Montserrat-Light',
    fontSize: 14,
    color: '#36292a',
  },
  noVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 74,
  },

});
