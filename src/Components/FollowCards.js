import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Image,ListView,TouchableOpacity,ImageBackground,TouchableHighlight,AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';

export default class FollowCards extends Component{

    static navigationOptions = {
       header: false,
    };

  constructor(props) {
    super(props);
    this.state = {
      follow: !this.props.followers.following,
    };
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

  render() {
    const followers = this.props.followers;
    return (
            <CardItem style={{height: 78,borderBottomWidth:1,borderColor: '#dadddf'}}>
                <Left>
                  <Thumbnail source={{uri: followers.imageUrl ? followers.imageUrl : "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg" }} style={{height: 40, width: 40}} />
                  <Body>
                    <Text style={styles.uploaderName}>{followers.username}</Text>
                  </Body>
                </Left>
                <Right>
                  {
                    this.state.follow ?
                      <TouchableHighlight underlayColor = '#fff' onPress={()=>this.updateTitleStatus(followers.userId, "follow")}>
                          <View style={styles.followouter}>
                            <Text style={{color:'#fefefe',fontSize: 12}}>Follow</Text>
                          </View>
                      </TouchableHighlight>
                      :
                      <TouchableHighlight underlayColor = '#fff' onPress={()=>this.updateTitleStatus(followers.userId, "unfollow")}>
                        <View style={styles.unfollowouter}>
                          <Text style={{color:'#36292a',fontSize: 12}}>Unfollow</Text>
                        </View>
                      </TouchableHighlight>
                  }
                </Right>
            </CardItem>
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
  }

});
