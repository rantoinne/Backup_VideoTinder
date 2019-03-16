import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Dimensions,Image,TouchableOpacity,TouchableHighlight,TextInput,ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

import {saveUserData} from '../redux/reducers/tasks';
import { connect } from 'react-redux';
import _ from 'lodash';
import { TabNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Camera from 'react-native-camera';
import Video from 'react-native-video';
import IonIcon from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'react-native-fetch-blob';
import moment from 'moment';
import SearchBar from 'react-native-searchbar';
import Entypo from 'react-native-vector-icons/Entypo';
import ImageResizer from 'react-native-image-resizer';

class VideoCapture extends Component {

  static navigationOptions = {
        headerTintColor: 'white',
        headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 }
      };

  constructor(props) {
    super(props);
    this.state = {
      cameraType : 'back',
      mirrorMode : false,
      path: null,
      data: true,
      startVid: true,
      description: "",
      isSearchText:false,
      tagList:[],
      userList:[],
      followers: [],
      minutes: "3",
      seconds: "00",
      cachedVideoURI: "",
      progress: 0
    };
    this.top = ''
    this.left = ''
    this.secondsRemaining;
    // method that triggers the countdown functionality
    this.startCountDown = this.startCountDown.bind(this);
    this.tick = this.tick.bind(this);
    this.volume = 1.0;
  }

  formatTime(timestamp) {
    return moment(timestamp).format('h:mm a');
  }

  componentDidMount() {
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/followersList', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                  })
                }).then(response => {
                  this.setState({loader : false, followers : JSON.parse(response._bodyText) })
                return response.json().then(error => ({ error }));
              })
    } catch(error) {
        // console.log("error " + error);
    }
  }

  handlePress(evt){
    this.top = (evt.nativeEvent.locationY*100)/screenHeight;
    this.left = (evt.nativeEvent.locationX*100)/screenWidth;
    setTimeout(()=>{
      this.setState({
        isSearchText:true
      })
    },100)
  }

  tagUser(user){
    let newView = {
      locationX:this.left,
      locationY:this.top,
      name:user.username,
      id:user.userId
    }
    this.setState({
        isSearchText:false,
        tagList: this.state.tagList.concat([newView])
      })
     }

  noTagUser = (e) => {
    e.preventDefault();
      this.setState({
        isSearchText:false
      });
  }

  removeUser(user){
    let tempUser = this.state.tagList;
    let index =  _.findIndex(tempUser, function(o) { return o._id == user._id });
    tempUser.splice(index, 1);
    this.setState({tagList: tempUser });
  }

  dynamicStyle(data) {
    let left = (screenWidth * data.locationX)/100;
    let top =  (screenHeight * data.locationY)/100;
    return {
      position:'absolute',
      top:top,
      left:left-22,
      justifyContent:'center'
    }
  }

  takeVid() {
    this.startCountDown();
    const option = {};
    var picturePath = "";
    this.setState({
        startVid : false
    });

    this.camera.capture().then((data) => {
      this.setState({picturePath: data.path})
      this.camera.capture({
      mode: Camera.constants.CaptureMode.video,
      captureTarget: Camera.constants.CaptureTarget.disk,
      totalSeconds: 180
    })
      .then((data) => {
         this.setState({ path: data.path})
         VideoPath = data.path;

     })
      .catch((err) => console.error(err));
      setInterval(() => {
        this.setState((prevState) => {
          return {
            timer: prevState.timer - 1
          };
        });
      }, 1000);
    });
  }

  stopVid(){
    this.camera.stopCapture();
  }

  changeCameraType() {
    if(this.state.cameraType === 'back') {
      this.setState({
        cameraType : 'front',
        mirrorMode : true
      })
    }
    else {
      this.setState({
        cameraType : 'back',
        mirrorMode : false
      })
    }
  }

  fieldValue(fieldSegment , event) {
        this.setState({
          description : event,
        })
    }

  tick() {
var min = Math.floor(this.secondsRemaining / 60);
var sec = this.secondsRemaining - (min * 60);
this.setState({
  minutes: min,
  seconds: sec
})
if (sec < 10) {
  this.setState({
    seconds: "0" + this.state.seconds,
  })
}
if (min < 10) {
this.setState({
  value: "0" + min,
 })
}
if (min === 0 & sec === 0) {
clearInterval(this.intervalHandle);
}
this.secondsRemaining--
}

  startCountDown() {
    this.intervalHandle = setInterval(this.tick, 1000);
    let time = this.state.minutes;
  this.secondsRemaining = time * 60;
  }

  renderCamera() {
    return (
      <Camera
           ref={(cam) => {
             this.camera = cam;
           }}
           style={styles.preview}
           aspect={Camera.constants.Aspect.fill}
           type={this.state.cameraType}
           flashMode={Camera.constants.FlashMode.on}
           //captureMode = {Camera.constants.CaptureMode.video}
           mirrorImage={this.state.mirrorMode}
           playSoundOnCapture={false}
           captureQuality={'480p'}
           keepAwake={true}
          >
          <View style={styles.cameraAssets}>
          <Text style={styles.assetsTime}>{this.state.minutes + ":" + this.state.seconds}</Text>

            <View style={styles.assetsCamera}>
              <TouchableOpacity onPress={this.state.startVid ? this.takeVid.bind(this) : this.stopVid.bind(this)}>
              <View style={{justifyContent: 'center',alignItems: 'center',height: 60, width:60,backgroundColor: '#f00039',borderRadius: 30}}>
                    <MaterialIcons name={this.state.startVid ? 'videocam' : 'stop'} size={40} color="#fff" />
              </View>
              </TouchableOpacity>
            </View>

            <View style={styles.assetsFlip}>
              <TouchableOpacity onPress={this.changeCameraType.bind(this)}>
                <IonIcon name="ios-reverse-camera-outline" size={35} color="#fefefe"/>
              </TouchableOpacity>
            </View>
          </View>
       </Camera>
    );
  }

  async transferPayload() {
    this.volume = 0.0;
    this.props.navigation.navigate('Scenes', { VideoPath: VideoPath, picturePath: this.state.picturePath,
      user: this.props.user, description: this.state.description });
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

  renderVideo() {
    return (
      <View style={{flex:1,flexDirection:'column'}}>
        <View style={{flex:1}}>
        <TouchableWithoutFeedback disabled={this.state.isSearchText}>
          <Video source={{ uri: this.state.path }}
             style={styles.preview}
             ref={(ref: Video) => { this.video = ref }}
             rate={1.0}
             volume={this.volume}
             muted={false}
             resizeMode={"cover"}
             onEnd={() => { console.log('Done!') }}
          />
          </TouchableWithoutFeedback>
        </View>
        { !this.state.data ?
            <ActivityIndicator
              animating={true}
              style={styles.indicator}
              size={30}
              color="#ff0046"
          />
          :
          <MaterialIcons onPress={()=>this.transferPayload()} name="send" style={styles.cancel} size={30} color="#f00039"/>
        }
        <View style={styles.MainContainer}>
          <TextInput
            placeholder="Write Something"
            onChangeText={(event) => this.fieldValue('description' , event)}
            underlineColorAndroid='transparent'
            placeholderTextColor= '#36292a'
            style={styles.TextInputStyleClass}
            multiline= {true}
            maxLength={32}
            value={this.state.description}
          />
          <TextInput
            placeholder="Tap on screen to tag"
            underlineColorAndroid='transparent'
            placeholderTextColor= '#36292a'
            style={styles.TextInputStyleClass}
            editable= {false}
          />
        </View>
      </View>
    );
  }

  render() {
    var {navigate} = this.props.navigation;
    var users = this.state.followers;

    return (
      <View style={styles.container}>
        {
          this.state.isSearchText && (
            <View style={styles.userSearch}>
              <View style={{ width:screenWidth,height: 52, backgroundColor: '#fefefe', paddingHorizontal: 18, paddingVertical: 10, shadowColor: 'black',
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  shadowOffset: {
                    height: 5,
                  },
                  elevation: 4,
                  zIndex: -1,
                  overflow: 'visible'}}>
                  <View style={styles.innerContainer}>
                        <Icon  onPress = {()=>this.setState({isSearchText: false})} style={{color:'#36292a', marginLeft: 30,height: 0, opacity: 0}} name={'arrow-back'} size={30} />
                        <Text style={styles.centerTitle}>Tag </Text>
                     <TouchableHighlight underlayColor = '#fff' onPress = {()=>this.setState({isSearchText: false})}>
                        <Entypo style={{color:'#36292a'}} name={'cross'} size={30} />
                    </TouchableHighlight>
                  </View>
                </View>
              <ScrollView>
              {
                users.map(user=>(
                    <TouchableOpacity
                       key={user.id}
                       onPress={()=>{this.tagUser(user)}}
                    >
                      <View  style={styles.userList}>
                          <Text style={styles.userListText}>{user.username}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                )
              }
              </ScrollView>
            </View>
            )
        }
        {this.state.path ? this.renderVideo() : this.renderCamera()}
        {
          this.state.tagList.map(list=>
            (
              <View key={list.id} style={this.dynamicStyle(list)}>
                <View style={styles.tagTriangle}>
                </View>
                <View style={styles.tagUserView}>
                  <Text style={styles.tagListText}> {list.name} </Text>
                    <TouchableOpacity
                       key={list.id}
                       style={styles.removeTagUser}
                       onPress={()=>{this.removeUser(list)}}
                    >
                      <Entypo style={{color:'#000'}} name={'cross'} size={12} style={styles.removeIcon}/>
                    </TouchableOpacity>
                </View>
              </View>
            )
          )
        }
      </View>
    );
  }
};

export default connect(state => ({
     user: state.tasks.user
}), {
  saveUserData: saveUserData,
})(VideoCapture)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#FFF',
    marginBottom: 15,
  },
  cancel: {
    position: 'absolute',
    right: 20,
    top: 16,
    backgroundColor: 'transparent',
  },
  stopText: {
    color: '#fefefe',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular'
  },
  MainContainer :{
    justifyContent: 'flex-end',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRightColor: '#e5e3e4',
    borderLeftColor: '#e5e3e4',
  },
 TextInputStyleClass:{
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e3e4',
    backgroundColor : "#FFFFFF",
    paddingLeft: 15
 },
 indicator: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'transparent',
 },
 flashToggleButton:{
    width:30,
    height:30,
   backgroundColor:'transparent',
    borderRadius:15,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    marginLeft: -10,
    marginTop: -30,
    paddingLeft:7
  },
  flashToggleIcon:{
    width:15,
    height:15
  },
  cameraAssets: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10
  },
  assetsTime:{
    color: '#fff',
    fontSize: 14,
    marginBottom: 4
  },
  assetsFlip: {
    flexDirection: 'row',
    marginHorizontal:10,
    marginBottom:15
  },
  assetsCamera:{
    alignSelf: 'center',
    paddingBottom: 30
  },
  imageContainer:{
    height: screenHeight/2,
    position:'absolute',
  },
  imageStyle:{
    width : screenWidth,
    height: screenHeight/2
  },
  tagTriangle:{
    height:0,
    width:0,
    left:15,
    borderLeftColor:'transparent',
    borderLeftWidth:7,
    borderRightColor:'transparent',
    borderRightWidth:7,
    borderBottomColor:'rgba(0,0,0,.30)',
    borderBottomWidth:7
  },
  tagUserView:{
    backgroundColor:'rgba(0,0,0,.30)',
    borderRadius:5,
    borderWidth: 1,
    borderColor:'rgba(0,0,0,.30)',
    paddingLeft:10,
    paddingRight:18,
    paddingTop:10,
    paddingBottom:10,
    flexDirection:'row'
  },
  tagListText:{
    color:'white',
    fontWeight:'800',
    fontSize: 18
  },
  removeTagUser:{
    backgroundColor:'white',
    height:20,
    position: 'absolute',
    width:20,
    top: 0,
    right: 0,
    borderRadius:10
  },
  removeIcon:{
    marginTop:3,
    marginLeft:4,
    color: '#000',
  },
  userSearch:{
    zIndex:99,
    backgroundColor:'rgba(225,225,225,0.85)'
  },
  userList:{
    padding:10,
    paddingLeft:20,
    borderWidth:1,
    borderColor: '#ccc',
  },
  userListText:{
    fontWeight:'600'
  },
  searchContainer:{
    flexDirection:'row',
    backgroundColor:'white',
    borderColor: '#999',
    borderWidth: 0,
    width:screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  searchIconStyle: {
    width: 20,
    height: 20,
    marginTop: 10,
    marginLeft:10,
  },
  closeIconStyle:{
    width: 20,
    height: 20,
    marginTop: 10,
    marginRight:10,
  },
  textInputStyle:{
    height: 40,
    marginLeft:10,
    alignItems: 'flex-start',
    width:250
  },
  innerContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  centerTitle: {
    color: '#36292a',
    fontFamily: 'WorkSans-Regular',
    fontWeight: '300',
    fontSize: 20,
    marginRight:11
   },
});
