import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Image,ListView,TouchableOpacity,ImageBackground,TouchableHighlight,AsyncStorage,ActivityIndicator
} from 'react-native';
import {saveUserData} from '../redux/reducers/tasks';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';
import FollowingCards from './FollowingCards.js'

class Following extends Component{

  static navigationOptions = {
      headerTitle: 'Following',
      headerTitleStyle: {
          color: '#36292a',
          fontFamily: 'WorkSans-Regular',
          fontWeight: '300',
          textAlign:'center',
          alignSelf:'center',
          flex:1
          },
      headerRight: <View/>
        };

  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      loader: true,
      following : []
    }
  }

  componentWillMount() {
    try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/followingList', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.user._id,
                  })
                }).then(response => {
                  this.setState({loader: false, following : JSON.parse(response._bodyText) })
               });
                // if (response.ok) {
                //   this.setState({
                //     data : true
                //   })
                //   return response.json().then(response => ({ response }));
                //   console.log(response);
                // }
                return response.json().then(error => ({ error }));
              }
              catch(error) {
                  // console.log("error " + error);
              }

    AsyncStorage.multiGet(['user']).then((data) => {
      if (data[0][1]) {
        user = data[0][1];
        return JSON.parse(user);
      }
    }).then((user) => {
      if(user) {
           this.setState({userId:user._id});
      }
      else {
        return null
      }
    }).catch(err => {
      // console.log("in error", err)
    })
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
              })
        } catch(error) {
            // console.log("error " + error);
      }
  }

  displayImages(following){
    var {navigate} = this.props.navigation;
    return(
    <View style={styles.container}>
         <FollowingCards following={following} unFollowRequest={this.unFollowRequest} followRequest={this.followRequest}/>
    </View>
    );
  }

  render() {
    const {navigate} = this.props.navigation;
    const { navigation } = this.props;
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var cloneUsers = ds.cloneWithRows(this.state.following)
    return (
    <View style={{flex: 1}}>
        <ListView
          style={styles.listView}
          dataSource={cloneUsers}
          renderRow={this.displayImages.bind(this)}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
    </View>

    );
  }
}

export default connect(state => ({
     user: state.tasks.user
}), {
  saveUserData: saveUserData,
})(Following)

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
  }

});
