import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Image,ListView,TouchableOpacity,ImageBackground,AsyncStorage,ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {saveUserData, saveNewVideosData, updateVideosData} from '../redux/reducers/tasks';
import { connect } from 'react-redux';
import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import Video from 'react-native-af-video-player';
import Swiper from "react-native-deck-swiper";
import LikesVideoCard from "./LikesVideoCard.js"

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


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
      newVideos: [],
      loader: true
    };
  }

  static navigationOptions = {
  tabBarLabel: 'New',
  tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./video.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

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
      cb
    );
  };

  jumpTo = () => {
    this.swiper.jumpToCardIndex(2);
  };

  componentWillMount() {
    console.log("only only", this.props.user);
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
}

componentDidMount(){
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
          console.log("error " + error);
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
        <View style={{flex: 1, elevation: 5}}>
          <LikesVideoCard card={card} cardIndex={cardIndex} followRequest={this.followRequest} unFollowRequest={this.unFollowRequest} />
        </View>
    );
  };

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

  render() {
    var {navigate} = this.props.navigation;
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
          this.props.newVideos.length == 0 ?
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
          cardVerticalMargin={40}
          cardHorizontalMargin={15}
          stackSize={3}
          stackSeparation={2}
          stackAnimationFriction={4}
          stackAnimationTension={80}
          backgroundColor= {'#f5f5f5'}
          marginTop={0}
          marginBottom={0}
          onSwiped={(cardIndex) => {console.log(cardIndex)}}
          cards={this.props.newVideos}
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
     newVideos: state.tasks.newVideos
}), {
  saveUserData: saveUserData,
  updateVideosData: updateVideosData,
  saveNewVideosData: saveNewVideosData
})(Scenes)

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
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
