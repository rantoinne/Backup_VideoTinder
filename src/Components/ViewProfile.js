import React, { Component } from 'react';
import { connect } from 'react-redux';
import {saveUserData} from '../redux/reducers/tasks';
import {
  Platform,
  StyleSheet,
  Text,
  View,TouchableOpacity,Image, Dimensions,ScrollView,TouchableHighlight,AsyncStorage,ActivityIndicator
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ProfileVideo from './ProfileVideo.js'
import LinearGradient from 'react-native-linear-gradient';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Tab, Tabs } from 'native-base';

class ViewProfile extends Component {

  static navigationOptions = {
    header: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      uploader: '',
      imageUrl: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      bio: '',
      userId: '',
      loader: false,
      selfVideos: [],
      archivedVideos: [],
      UserInform: [],
      refresh: false
    };
  }

  componentDidMount() {
        try {
      let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/displaySelfVideos', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: this.props.navigation.state.params.user.userId,
                  })
                }).then(response => {
                  this.setState({
                    selfVideos : JSON.parse(response._bodyText)
                  })
                // if (response.ok) {
                //   this.setState({
                //     data : true
                //   })
                //   return response.json().then(response => ({ response }));
                //   console.log(response);
                // }
                return response.json().then(error => ({ error }));
              })
    } catch(error) {
        // console.log("error " + error);
    }

    try {
  let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/displayArchivedVideos', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  userId: this.props.navigation.state.params.user.userId,
              })
            }).then(response => {
              this.setState({
                archivedVideos : JSON.parse(response._bodyText)
              })
          return response.json().then(error => ({ error }));
          })
} catch(error) {
    // console.log("error " + error);
}


  try {
  let response = fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/userInfo', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  userId: this.props.navigation.state.params.user.userId,
              })
            }).then(response => {
              // alert(JSON.stringify(response));
              this.setState({
                UserInform : JSON.parse(response._bodyText)
              })
          return response.json().then(error => ({ error }));
          })
} catch(error) {
    // console.log("error " + error);
}
this.setState({refresh: true})
  }

  Capitalize(name) {
  return name 
  }

  render() {
    const {goBack} = this.props.navigation;
     var {navigate} = this.props.navigation;
    return (
      <ScrollView automaticallyAdjustContentInsets={false} style={styles.scrollView}>
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#f79633', '#f05d30', '#d3182d', '#b71b50']} style={styles.linearGradient}>
          <View style={styles.innerContainer}>
            <TouchableOpacity onPress={() => navigate("Favourites")}>
                <MaterialIcons style={{color:'#fff'}} name={'arrow-back'} size={30} />
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
             
            </View>
          </View>
          <View style={{flex: 1,flexDirection: 'column',justifyContent:'center',alignItems: 'center',marginTop: 15, marginBottom: 20}}>
             <Thumbnail large source={{uri : this.props.navigation.state.params.user.userProfilePic ? this.props.navigation.state.params.user.userProfilePic : "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg" }}
             style={{width:100, height:100, borderRadius: 50, borderWidth: 2, borderColor: '#979797'}} />
          </View>
          <View style={{flex: 1,flexDirection: 'column',justifyContent:'center',alignItems: 'center',marginBottom:30}}>
            <Text style={{color:'#fefefe',fontSize: 16,fontFamily: 'Montserrat-Regular',fontSize: 16}}>{this.state.UserInform.username}</Text>
            <Text style={{color:'#fefefe',fontSize: 13,fontFamily: 'Montserrat-Regular', fontSize: 13}}>{this.state.UserInform.bio ? this.state.UserInform.bio : ""}</Text>
          </View>
          <View style={{ flex:1,flexDirection: 'row', justifyContent:'space-around',alignItems: 'flex-end'}}>
              <View style={{flex:1,flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.textCircular}><Text style={{color:'#fefefe',fontFamily: 'Montserrat-Regular',fontSize: 14}}>{this.state.selfVideos.length}</Text></View>
                <Text style={{color:'#fefefe',fontFamily: 'Montserrat-Regular',fontSize: 12}}>Posts</Text>
              </View>

             <View style={{flex:1,flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>
                             <TouchableOpacity underlayColor = '#DFE1E3' >
                               <View style={styles.textCircular}><Text style={{color:'#fefefe',fontFamily: 'Montserrat-Regular',fontSize: 14}}>{this.state.UserInform.followersCount ? this.state.UserInform.followersCount : 0}</Text></View>
                             </TouchableOpacity>
                               <Text style={{color:'#fefefe',fontFamily: 'Montserrat-Regular',fontSize: 12}}>Followers</Text>
                           </View>
                           <View style={{flex:1,flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>
                             <TouchableOpacity underlayColor = '#DFE1E3' >
                               <View style={styles.textCircular}><Text style={{color:'#fefefe',fontFamily: 'Montserrat-Regular',fontSize: 14}}>{this.state.UserInform.followingCount ? this.state.UserInform.followingCount : 0}</Text></View>
                             </TouchableOpacity>
                               <Text style={{color:'#fefefe',fontFamily: 'Montserrat-Regular',fontSize: 12}}>Following</Text>
                           </View>
          </View>
          { this.state.loader &&
                 <View style={styles.loading}>
                    <ActivityIndicator
                      animating={true}
                      size="large"
                      color="#ff0046"
                      />
                </View>
              }
          </LinearGradient>
          <Tabs initialPage={0}
              tabBarUnderlineStyle={{
                backgroundColor : '#000',
                  height : 0
              }}
            >
            <Tab heading="Video" 
                tabStyle={{
                  backgroundColor: '#fefefe'
                }}
                activeTabStyle={{
                    backgroundColor: '#DF332E'
                }}
              >
                <ProfileVideo selfVideos={this.state.selfVideos} navigation={this.props.navigation} archived = {false} notMe= {true} />
              </Tab>

              <Tab heading="Archive"
                tabStyle={{
                  backgroundColor: '#fefefe'
                }}
                activeTabStyle={{
                    backgroundColor: '#DF332E'
                }}
                >
                <ProfileVideo selfVideos={this.state.archivedVideos} navigation={this.props.navigation} archived = {true}/>
          </Tab>
        </Tabs>
      </ScrollView>
    );
  }
}

export default connect(state => ({
     user: state.tasks.user
}), {
  saveUserData: saveUserData,
})(ViewProfile)

const styles = StyleSheet.create({
  scrollView:{
    backgroundColor: '#fff',
  },
  innerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    textCircular: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth:2,
      borderColor: '#fefefe'
    },
    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)',
    },
    linearGradient: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 18
  },
});
