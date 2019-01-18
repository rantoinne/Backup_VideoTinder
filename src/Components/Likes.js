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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Video from 'react-native-af-video-player';
import VideoCard from './VideoCard.js';
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

 class Likes extends Component{

  static navigationOptions = {
    tabBarLabel: 'Likes',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./heart.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };


  constructor(props) {
    super(props);
    this.state = {
      likedVideos : [],
      loader: true
    };
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
        console.log("error " + error);
    }
  }

  componentDidMount(){
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
            console.log("error " + error);
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
            console.log("error " + error);
      }
  }


displayImages(likedVideos){
  var {navigate} = this.props.navigation;
    return(
    <View style={styles.container}>
         <VideoCard videoInfo = {likedVideos} followRequest = {this.followRequest} unFollowRequest = {this.unFollowRequest} />
       </View>
    );
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
          renderItem={({item}) => this.displayImages(item)}
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
