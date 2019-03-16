import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,TouchableOpacity,ImageBackground,Dimensions
} from 'react-native';

import { TabNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import VideoPlayer from 'react-native-video-player';
import Dialog from "react-native-dialog";

const {height, width} = Dimensions.get('window');
export default class NotMyVideoView extends Component {

  static navigationOptions = ({navigation}) => {
      const {params = {}} = navigation.state;
       return {
        headerTintColor: 'white',
        headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 },
        headerRight: null
        };
      };

   constructor(props) {
      super(props);
      this.state = {
        heightScaled : height,
        screenWidth : width,
        dialogVisible: false,
      };
    }

    onArchiveVideo = () => {
      this.setState({dialogVisible: true})
    }

    handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleDelete = () => {
    const item = this.props.navigation.getParam('items');
    this.setState({ dialogVisible: false });
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/archiveVideo', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    videoId: item._id,
                    userId: item.userId,
                })
              }).then(response => {
                this.props.navigation.navigate('profile')
              })

    } catch(error) {
        // console.log("error " + error);
    }
  }

    componentWillMount() {
      this.props.navigation.setParams({
        onArchiveVideo : this.onArchiveVideo
      })
    }

    render() {
        const {goBack} = this.props.navigation;
        const item = this.props.navigation.getParam('items');
        return (
              <View style={styles.container}>
                <VideoPlayer
                  disableSeek
                  autoplay= {true}
                  endWithThumbnail
                  thumbnail={{ uri: item.thumbnail }}
                  video={{ uri: item.streamingUrl }}
                  style={{
                    width: this.state.screenWidth,
                    height: this.state.heightScaled
                  }}
                  resizeMode={'cover'}
                  disableFullscreen
                  pauseOnPress
                />
                <CardItem style={{borderWidth:0, backgroundColor: 'transparent', position: 'absolute', bottom: 75}}>
                  <Left>
                    <Thumbnail source={{uri: item.userProfilePic}} style={{height: 45, width: 45, borderWidth:0,elevation: 3}} />
                    <Body>
                      <Text style={styles.uploaderName}>{item.username}</Text>
                    </Body>
                  </Left>
                  <Right>
                    <Text style={styles.likeCounter}>{item.likesCount}</Text>
                    {item.likesCount === 0 ? <Icon style={{color:'#000'}} name={'md-heart'} size={28}/> : <Icon style={{color:'#f00039'}} name={'md-heart'} size={28}/> }
                  </Right>
                </CardItem>
                <CardItem style={{borderWidth:0, backgroundColor: 'transparent',position: 'absolute', bottom: 35}}>
                  <Left>
                      <Text style={styles.uploaderName}>{item.description}</Text>
                  </Left>
                </CardItem>

                <View>
                  <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>Archive Video</Dialog.Title>
                    <Dialog.Description>
                      Do you want to archive this video? You cannot undo this action.
                    </Dialog.Description>
                    <Dialog.Button label="Cancel" onPress= {() => this.handleCancel()} />
                    <Dialog.Button label="Delete" onPress= {() => this.handleDelete()} />
                  </Dialog.Container>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
        height: null,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    text: {
      color: 'white',
      fontSize: 32,
    },
  likeCounter:{
    color:'#fefefe',
    fontSize: 18,
    fontFamily: 'WorkSans-Regular',
    marginRight: 3
  },
  chatTime:{
    color:'#fefefe',
    fontSize: 12,
    fontFamily: 'WorkSans-Regular',
  },
  messageCounter:{
    position: 'absolute',
    top: 30,
    color:'#000',
    fontSize: 12,
    fontFamily: 'WorkSans-Medium',
    backgroundColor: '#05be18',
    width: 18,
    height: 18,
    borderRadius: 9,
    textAlign: 'center',
    paddingTop: 2
  },
  uploaderName:{
    fontSize: 18,
    color: '#fefefe'
  },
});
