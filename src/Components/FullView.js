import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Image,ListView,TouchableOpacity,ImageBackground,TouchableHighlight,AsyncStorage,ActivityIndicator, Dimensions, TouchableWithoutFeedback
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Col, Row, Grid } from 'react-native-easy-grid';
import VideoPlayer from 'react-native-video-player';
import Orientation from 'react-native-orientation';
import { ImageCacheManager } from "react-native-cached-image";
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class FullView extends Component {

	static navigationOptions= {
		header: null
	};

	constructor(props) {
		super(props);
		this.state= {
			cachedVideoURI: this.props.navigation.state.params.thumbnail.streamingUrl
		};
	}

	onStart = () => {
		ImageCacheManager({})
		.downloadAndCacheUrl(this.props.navigation.state.params.thumbnail.streamingUrl)
		.then(res => {
		  this.setState({ cachedVideoURI: res });
		 })
		.catch(err => {
		  // console.log("Caching", err);
		});
	}

	render() {
		var videoInfo = this.props.navigation.state.params.thumbnail
		return(
			<View style={{flex: 1}}>
			<VideoPlayer
                disableSeek
                defaultMuted= {false}
                endWithThumbnail
                thumbnail={{ uri: videoInfo.thumbnail }}
                video={{ uri: this.state.cachedVideoURI}}
                style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT-10
                  }}
                resizeMode={'cover'}
                disableFullscreen= {false}
                playWhenInactive= {false}
                playInBackground= {false}
                pauseOnPress
                onStart={this.onStart}
              />
				<View style={{position: 'absolute', justifyContent: 'center', alignIItems: 'center', top: 8, left: 8, zIndex: 1000}}>
					<MaterialIcons name= "arrow-back" size= {28} color= "white" style= {{alignSelf: 'center'}} onPress= {()=> this.props.navigation.goBack()} />
				</View>
            </View>
		);
	}
}

export default FullView;