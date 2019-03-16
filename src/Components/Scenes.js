import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Image,ListView,TouchableOpacity,ImageBackground,AsyncStorage,ActivityIndicator, Dimensions
} from 'react-native';
import {saveUserData, saveNewVideosData, updateVideosData} from '../redux/reducers/tasks';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Video from 'react-native-af-video-player';
import Swiper from "react-native-deck-swiper";
import LikesVideoCard from "./LikesVideoCard.js"
import UploadIndicator from "./UploadIndicator.js"
import ImageResizer from 'react-native-image-resizer';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const theme = {
    title: '#FFF',
    more: 'transparent',
    center: 'transparent',
    volume: 'transparent',
    scrubberThumb: 'transparent',
    scrubberBar: 'transparent',
    seconds: 'transparent',
    duration: 'transparent',
    progress: 'transparent',
    loading: 'transparent'
  };

const width = Dimensions.get('window').width;

class Scenes extends Component{

  constructor(props) {
    super(props);
    this.state = {
      videoPlay : true,
      uploader: '',
      swipedAllCards: false,
      swipeDirection: "",
      isSwipingBack: false,
      cardIndex: 0,
      uploadingBackground: false,
      newVideos: [],
      loader: true,
      data: Boolean,
      progress: 0
    };
    this.callMeASAP = this.callMeASAP.bind(this);
    this.storeVideo = this.storeVideo.bind(this);
  }

  static navigationOptions = {
  tabBarLabel: 'New',
  tabBarIcon: ({ tintColor }) => (
      <MaterialCommunityIcons
        name= 'movie-roll'
        size= {26}
        color= '#f5f6fa'
        style={{tintColor: tintColor}}
      />
    ),
  };

  storeVideo() {
    const { VideoPath, picturePath, user, description } = this.props.navigation.state.params;
    alert('sopeana')
    this.setState({
      data : false,
      // progress: 10
    });
         let formData = new FormData();
          formData.append("video", {
            name: moment().unix() + '_video.mp4',
            uri: VideoPath,
            type: 'video/mp4'
        });
          // this.setState({progress: 30})
        alert('resizedImageUri')
        ImageResizer.createResizedImage(picturePath, 1000, 1000, 'JPEG', 50, rotation=0, null)
        .then((resizedImageUri) => {
          formData.append("thumbnail", {
          uri: resizedImageUri.uri,
          type: 'image/jpeg',
          name:  resizedImageUri.name
          });
          formData.append("userId", user._id);
          formData.append("description", description)
        });
          var taggedIds = [];
          // this.setState({progress: 50})
        try {
          // this.setState({progress: 75})
            fetch("http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/upload", {
                method: 'post',
                body: formData
            }).then(response => {
               this.props.navigation.navigate('profile');
               var userObj = user;
               var newUser = {...userObj, postsCount: userObj.postsCount + 1}
               this.props.saveUserData(newUser)
                if (response.ok) {
                  this.setState({
                    data : true
                  })
                  return response.json().then(response => ({ response }));
                }
                return response.json().then(error => ({ error }));
              })
        }
        catch (error) {
            return error;
      }
    // });
  }

  onSwipedAllCards = () => {
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/displayNewVideos', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                  })
                }).then(response => {
                  this.setState({newVideos: JSON.parse(response._bodyText),loader: false})
                  this.props.saveNewVideosData(JSON.parse(response._bodyText))
              })
        } catch(error) {
            console.log("error " + error);
      }
  };

  onSwipeRight = (cardIndex) => {
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/likeVideo', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                      videoId: this.state.newVideos[cardIndex]._id
                  })
                }).then(response => {
                  console.log("that's the response", response)
              })
        } catch(error) {
            console.log("error " + error);
      }
  };

  onSwipeLeft = (cardIndex) => {
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/dislikeVideo', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                      videoId: this.state.newVideos[cardIndex]._id
                  })
                }).then(response => {
                  console.log("that's the response", response)
              })
        } catch(error) {
            console.log("error " + error);
      }
  };

  swipeBack = () => {
    if (!this.state.isSwipingBack) {
      this.setIsSwipingBack(true, () => {
        this.swiper.swipeBack(() => {
          this.setIsSwipingBack(false);
        });
      });
    }
  };

  setIsSwipingBack = (isSwipingBack, cb) => {
    this.setState(
      {
        isSwipingBack: isSwipingBack
      },
    );
  };

  jumpTo = () => {
    this.swiper.jumpToCardIndex(2);
  };

  callMeASAP() {
    this.setState({uploadingBackground: false});
  }

  componentWillMount= async()=> {

        try {
          let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/userInfo', {
                      method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          userId: this.props.user._id,
                      })
                    }).then(response => {
                      // alert(JSON.stringify(response))
                  })
            } catch(error) {
          }

        try {
          let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/displayNewVideos', {
                      method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          userId: this.props.user._id,
                      })
                    }).then(response => {
                      this.setState({newVideos: JSON.parse(response._bodyText),loader: false})
                      this.props.saveNewVideosData(JSON.parse(response._bodyText))
                  })
            } catch(error) {
          }
}

componentDidMount(){

  if(this.props.navigation.state.params) {

          this.setState({ uploadingBackground: true });

          // alert(Object.keys(this.props.navigation.state.params).length)
          this.storeVideo();

          this.setState({ uploadingBackground: false });
          // let that = this;
          // setTimeout(()=> {
          //   that.callMeASAP();
          // }, 2000);

        }

this.timer = setInterval(()=> {
  try {
    let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/displayNewVideos', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.props.user._id,
                })
              }).then(response => {
                this.setState({newVideos: JSON.parse(response._bodyText)})
                this.props.saveNewVideosData(JSON.parse(response._bodyText))
            })
      } catch(error) {
    }
}, 5000)
}

  Capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
  }

   componentWillUnmount () {
    this.setState ({
        videoPlay : false
    })
  }

  renderCard = (card,cardIndex) => {
    return (
        <View style= {{ flex: 1, height: '100%'}}>
          <LikesVideoCard card={card} cardIndex={cardIndex} followRequest={this.followRequest} unFollowRequest={this.unFollowRequest} navigation= {this.props.navigation} />
        </View>
    );
  };

  wrapToSend(popularVideos) {
    this.props.navigation.navigate('FullView', { thumbnail: popularVideos });
  }

  followRequest = (followedId, cardIndex) => {
    this.setState({cardIndex: cardIndex})
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
                  console.log("that's the response", response)
              })
        } catch(error) {
            console.log("error " + error);
      }
  }


  unFollowRequest = (unFollowedId, cardIndex) => {
    this.setState({cardIndex: cardIndex})
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
                  console.log("that's the response", response)
              })
        } catch(error) {
            console.log("error " + error);
      }
  }

  async storeVideo() {
    this.setState({
      data : false,
      progress: 10
    })
         let formData = new FormData();
          formData.append("video", {
            name: moment().unix() + '_video.mp4',
            uri: VideoPath,
            type: 'video/mp4'
        });
          this.setState({progress: 30})
        ImageResizer.createResizedImage(this.state.picturePath, 1000, 1000, 'JPEG', 50, rotation=0, null)
        .then((resizedImageUri) => {
          // console.log("1234567890",resizedImageUri);
          formData.append("thumbnail", {
          uri: resizedImageUri.uri,
          type: 'image/jpeg',
          name:  resizedImageUri.name
          });
          //   formData.append("thumbnail", {
          //     name: moment().unix() + '_picture.jpg',
          //     uri: this.state.picturePath,
          //     type: 'image/jpg'
          // });
          formData.append("userId", this.props.user._id);
          formData.append("description", this.state.description)
          var taggedIds = [];
          this.setState({progress: 50})
        if(this.state.tagList.length > 0){

          for(var j = 0; j < this.state.tagList.length; j++){
            taggedIds.push(this.state.tagList[j].id)
          }
          formData.append("tags", JSON.stringify(taggedIds))
        }
        try {
          // console.log("thumbups", formData);
          this.setState({progress: 75})
            let response = fetch("http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/upload", {
                method: 'post',
                body: formData
            }).then(response => {
               this.props.navigation.navigate('profile');
               var userObj = this.props.user;
               var newUser = {...userObj, postsCount: userObj.postsCount + 1}
               this.props.saveUserData(newUser)
                if (response.ok) {
                  this.setState({
                    data : true,
                    progress: 100
                  })
                  return response.json().then(response => ({ response }));
                }
                return response.json().then(error => ({ error }));
              })
        }
        catch (error) {
            // console.log('error : ' + error);
            return error;
      }
    });
  }

  render() {
    var {navigate} = this.props.navigation;
    // alert(JSON.stringify(this.props.user))
    return (
      <View style={{flex: 1}}>
        
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
          this.state.newVideos.length == 0 ?
          <View style={styles.noVideo}>
            <Text style={styles.noVideoText}>
              There are no more videos at this moment. You are free to post your video and get featured.
            </Text>
          </View>
          :
          <Swiper
          style={styles.swiper}
          ref={swiper => {
            this.swiper = swiper;
          }}
          showSecondCard = {true}
          cardVerticalMargin={20}
          cardHorizontalMargin={20}
          stackSize={2}
          stackSeparation={1}
          stackAnimationFriction={4}
          stackAnimationTension={7}
          backgroundColor= {'#f5f5f5'}
          marginTop={0}
          marginBottom={0}
          onSwiped={(cardIndex) => {console.log(cardIndex)}}
          cards={this.state.newVideos}
          cardIndex={this.state.cardIndex}
          renderEmpty={() =>
          <View style={{alignSelf: "center"}}>
              <Text>Over</Text>
          </View>}
          renderCard={(card, cardIndex)=>this.renderCard(card, cardIndex)}
          onSwipedAll={this.onSwipedAllCards}
          onSwipedLeft={(cardIndex) => this.onSwipeLeft(cardIndex)}
          onSwipedRight={(cardIndex) => this.onSwipeRight(cardIndex)}
          verticalSwipe={false}
          infinite={false}
          animateCardOpacity={true}
          animateOverlayLabelsOpacity={true}
          overlayLabelStyle={{
              fontSize: 50,
              fontWeight: 'bold',
              borderRadius: 10,
              paddingHorizontal: 25,
              paddingVertical: 10,
              elevation: 5,
              overflow: 'hidden'
          }
        }
          overlayLabels={
        {
          right: {
          title: 'LIKE',
            style: {
              label: {
                backgroundColor: '#72DA98',
                borderColor: '#72DA98',
                color: '#fff',
                borderWidth: 2,
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginLeft: 30,
                marginTop: 30,
                elevation: 5,
                transform: [{ rotate: '-30deg'}],

              }
            }
          },
          left: {
          title: 'NOPE',
            style: {
              label: {
                backgroundColor: '#f00039',
                borderColor: '#f00039',
                color: '#fff',
                borderWidth: 2
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                elevation: 5,
                marginRight: 30,
                marginTop: 30,
                transform: [{ rotate: '20deg'}],
              }
            }
          },
        }
      }
      >
    </Swiper>
        }
        <View style= {{width: '100%', height: 50, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#ff0046', position: 'absolute', bottom: 0, zIndex: 1000}}>
        {this.state.uploadingBackground ? (
          <View style= {{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 2, borderRadius: 10, alignSelf: 'center', elevation: 4 }}>
            <ActivityIndicator size= {30} color= 'white' style= {{ alignSelf: 'center', marginLeft: 4 }} />
          </View>): null}


        <View
          style= {{width: 50, height: 50, borderRadius: 25, backgroundColor: '#ff0046', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigate ("VideoCapture", {})}>

          <MaterialIcons name='videocam' size={30} style={styles.actionButtonIcon} />
          </TouchableOpacity>
        </View>


        </View>
      </View>
    );
  }
}

export default connect(state => ({
     user: state.tasks.user,
     newVideos: state.tasks.newVideos
}), {
  saveUserData: saveUserData,
  updateVideosData: updateVideosData,
  saveNewVideosData: saveNewVideosData
})(Scenes)

const styles = StyleSheet.create({
  uploaderName:{
    fontSize: 16,
    color: '#36292a',
    fontFamily: 'Montserrat-Regular',
  },
  actionButtonIcon: {
    color: '#fefefe',
  },
  preview: {
    height: 395,
    width: 395,
  },
  backgroundVideo: {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  height: 395,
  width: 395
 },
 cardswipe: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  container: {
    marginTop: 10,
    flex: 1,
    backgroundColor: '#fefefe',
  },
  noVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 74,
  },
  noVideoText: {
    fontSize: 18,
    color: '#f00039',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center'
  }

});