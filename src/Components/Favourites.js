import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Image,ImageBackground,TouchableOpacity, FlatList, ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import {saveUserData, savePopularVideosData, updateVideosData} from '../redux/reducers/tasks';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Video from 'react-native-af-video-player';
import VideoCard from './VideoCard.js';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';

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

class Favourites extends Component{

  static navigationOptions = {
    tabBarLabel: 'Popular',
    tabBarIcon: ({ tintColor }) => (
      <EvilIcons
        name= 'star'
        size= {30}
        color= '#f5f6fa'
        style={{tintColor: tintColor}}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      popularVideos : [],
      loader: true
    };
  }


  componentWillMount() {
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/displayPopularVideos', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id
                  })
                }).then(response => {
                  this.setState({
                    popularVideos : JSON.parse(response._bodyText),
                    loader: false
                  })
                  this.props.savePopularVideosData(JSON.parse(response._bodyText))

                return response.json().then(error => ({ error }));
              })
    } catch(error) {
        // console.log("error " + error);
    }
  }

  componentDidMount(){
  this.timer = setInterval(()=> {
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/displayPopularVideos', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id
                  })
                }).then(response => {
                  this.setState({
                    popularVideos : JSON.parse(response._bodyText)
                  })
                  this.props.savePopularVideosData(JSON.parse(response._bodyText))

                return response.json().then(error => ({ error }));
              })
    } catch(error) {
        // console.log("error " + error);
    }
  }, 10000)
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

displayImages(popularVideos, index){
  var {navigate} = this.props.navigation;
    return(
      <View style={styles.container}>
         <VideoCard videos = {this.state.popularVideos} videoInfo = {popularVideos} index= {index} dislike= {this.onSwipeLeft} like= {this.onSwipeRight} followRequest = {this.followRequest} unFollowRequest = {this.unFollowRequest} navigation= {this.props.navigation} />
          <View style= {{justifyContent: 'center', alignItems: 'center', padding: 4, position: 'absolute', bottom: 18, right: 4}}>
            <Entypo name="resize-full-screen" size= {28} color= 'red' style={{alignSelf: 'center'}} onPress={()=> this.wrapToSend(popularVideos)} />
          </View>
      </View>
    );
  }

  wrapToSend(popularVideos) {
      // alert("hey")
      this.props.navigation.navigate('FullView', { thumbnail: popularVideos });
  }

  onSwipeRight = (cardIndex) => {
    // alert('like')
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/likeVideo', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                      videoId: this.state.popularVideos[cardIndex]._id
                  })
                }).then(response => {
                  console.log("that's the response", response)
              })
        } catch(error) {
            console.log("error " + error);
      }
  };

  onSwipeLeft = (cardIndex) => {
    // alert('dislike')
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/dislikeVideo', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                      videoId: this.state.popularVideos[cardIndex]._id
                  })
                }).then(response => {
                  console.log("that's the response", response)
              })
        } catch(error) {
            console.log("error " + error);
      }
  };

  render() {
    var {navigate} = this.props.navigation;
    // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    // var cloneUsers = ds.cloneWithRows(this.props.popularVideos);
    // alert(JSON.stringify(this.state.popularVideos[0]));
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
          data={this.state.popularVideos}
          renderItem={({item}) => this.displayImages(item)}
          ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
      }
        <View
          style= {{ position: 'absolute', right: 6, bottom: 6, zIndex: 1000, width: 50, height: 50, borderRadius: 25, backgroundColor: '#ff0046', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigate ("VideoCapture", {})}>

          <MaterialIcons name='videocam' size={30} style={styles.actionButtonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(state => ({
     user: state.tasks.user,
     popularVideos: state.tasks.popularVideos
}), {
  saveUserData: saveUserData,
  savePopularVideosData: savePopularVideosData,
  updateVideosData: updateVideosData
})(Favourites)

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
  listView: {
    padding: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
