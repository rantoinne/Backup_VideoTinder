import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,TouchableOpacity,ImageBackground,TouchableHighlight,ListView,ScrollView,AsyncStorage,ActivityIndicator,Dimensions
} from 'react-native';

import { TabNavigator, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import {saveUserData} from '../redux/reducers/tasks';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ImageResizer from 'react-native-image-resizer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PhotoUpload from 'react-native-photo-upload';
import { TextField } from 'react-native-material-textfield';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dropdown } from 'react-native-material-dropdown';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';

class EditProfile extends Component {

    static navigationOptions = {
       header: false,
    };

    // static navigationOptions = {
    //   headerTitle: 'Edit Profile',
    //   headerTitleStyle: {
    //       color: '#36292a',
    //       fontFamily: 'Montserrat-Regular',
    //       fontWeight: '300',
    //       marginLeft: 0
    //       },
    //   headerRight: <TouchableHighlight underlayColor = '#DFE1E3'>
    //                   <MaterialIcons style={{color:'#36292a',marginRight: 15}} name={'done'} size={24} />
    //                </TouchableHighlight>
    //     };

   constructor(props) {
      super(props);
      this.state = {
        username: this.props.user.username ,
        bio: this.props.user.bio ? this.props.user.bio : "" ,
        email: this.props.user.email,
        filename: '',
        imageUrl: this.props.user.imageUrl? this.props.user.imageUrl: "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg",
        type: '',
        loader: false,
      };
    }


    async storeToken(accessToken, userObj){
    try{
        await AsyncStorage.multiSet([
          ['token', accessToken],
          ['user', userObj]
        ]);
        //this.getToken();
    } catch (error) {
      // console.log("Something went wrong", error)
    }
  }

    fieldValue(fieldSegment , event) {
      const nameRegex = /^[a-zA-Z]{1,15}$/;
      if(fieldSegment == 'username'){
        this.setState({
          username : event,
        });
         if(!nameRegex.test(event)){
           this.setState({usernameError: 'Field is required', username: false});
         }
         else {
           this.setState({username: event, usernameError: ""});
         }
        }
        else if(fieldSegment == 'bio'){
        this.setState({
          bio : event,
          // fieldError: '',
        });
      }
        else if(fieldSegment == 'email'){
        this.setState({
          email : event,
          // fieldError: '',
        });
       if(!nameRegex.test(event)){
         this.setState({emailError: 'Field is required', email: false});
       }
       else {
         this.setState({email: event, emailError: ""});
       }
      }
    }

    async storeProfile(accessToken, userObj){
    try{
        await AsyncStorage.multiSet([
          ['token', accessToken],
          ['user', userObj]
        ]);
        //this.getToken();
    } catch (error) {
      // console.log("Something went wrong", error)
    }
  }

    async submitProfileForm() {
      this.setState({loader: true})
      let formData = new FormData();
          formData.append("username", this.state.username);
          formData.append("bio", this.state.bio);
          formData.append("email", this.state.email);
          formData.append("userId", this.props.user._id);
          //formData.append('image', {uri: fileURL, name: 'image.jpg', type: 'image/jpg'})
          if(this.state.imageUrl && this.state.imageUrl != "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg" && this.state.imageUrl != this.props.user.imageUrl){
          ImageResizer.createResizedImage("file://"+this.state.imageUrl, 1000, 1000, 'JPEG', 50, rotation=0, null)
          .then((resizedImageUri) => {
            // console.log("resizedImageUri",resizedImageUri);
            formData.append("image", {
            uri: resizedImageUri.uri,
            type: this.state.type,
            name: resizedImageUri.name
          });
          try {
              console.log("hyhyhy",formData);
              let response = fetch("http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/editProfile", {
                  method: 'post',
                  body: formData,
              }).then (response => {
                var userData = this.props.user;
                var data = JSON.parse(response._bodyText)
                var profile = {
                  ...userData,
                  imageUrl : data.editedProfile.imageUrl ? data.editedProfile.imageUrl : '' ,
                  username:  data.editedProfile.username,
                  bio:  data.editedProfile.bio,
                  email:  data.editedProfile.email
                }
                this.props.saveUserData(profile);
                this.setState({loader : false})
                this.props.navigation.navigate('profile');
                }).catch(function(error) {
                // console.log('There has been a problem with your fetch operation: ' + error);
                 // ADD THIS THROW error
                  throw error;
                });
            }
          catch (error) {
              // console.log('error : ' + error);
              return error;
          }
        }).catch((err) => {
          // console.log("error in resizing image", err);
        });
      }
      else {
          try {
              // console.log("hyhyhy",formData);
              let response = fetch("http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/editProfile", {
                  method: 'post',
                  body: formData,
              }).then (response => {
                var userData = this.props.user;
                var data = JSON.parse(response._bodyText)
                var profile = {
                  ...userData,
                  imageUrl : data.editedProfile.imageUrl ? data.editedProfile.imageUrl : '' ,
                  username:  data.editedProfile.username,
                  bio:  data.editedProfile.bio,
                  email:  data.editedProfile.email
                }
                this.props.saveUserData(profile);
                this.setState({loader : false})
                this.props.navigation.navigate('profile');
                }).catch(function(error) {
                // console.log('There has been a problem with your fetch operation: ' + error);
                 // ADD THIS THROW error
                  throw error;
                });
            }
          catch (error) {
              // console.log('error : ' + error);
              return error;
          }

        }
    }

render() {
  var {navigate} = this.props.navigation;
  const {goBack} = this.props.navigation;
    return (
      <View style={{flex:1,backgroundColor: '#fefefe'}}>
                <View style={{ height: 52, backgroundColor: '#fefefe', paddingHorizontal: 18, paddingVertical: 10, shadowColor: 'black',
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  shadowOffset: {
                    height: 5,
                  },
                  elevation: 4,
                  zIndex: -1,
                  overflow: 'visible'}}>
                  <View style={styles.innerContainer}>
                    <TouchableHighlight onPress={() => goBack()} underlayColor = '#fff'>
                        <Icon style={{color:'#36292a'}} name={'arrow-back'} size={30} />
                    </TouchableHighlight>
                        <Text style={styles.centerTitle}>Edit Profile</Text>
                    <TouchableHighlight underlayColor = '#fff' onPress={this.submitProfileForm.bind(this)}>
                        <Icon style={{color:'#36292a'}} name={'done'} size={30} />
                    </TouchableHighlight>
                  </View>
                </View>
            <ScrollView automaticallyAdjustContentInsets={false} style={styles.scrollView}>
              <View style= {{flex:1,marginTop: 15,alignItems: 'flex-start'}}>
                  <PhotoUpload
                 onPhotoSelect={avatar => {
                   if (avatar) {
                     console.log('Image base64 string: ', avatar)
                   }
                 }}
                 onResponse={avatar => {
                     if(!avatar.didCancel)
                     this.setState({
                      imageUrl: avatar.path,
                      filename: avatar.fileName,
                      type: avatar.type
                     })
                 }}
               >
                <Image
                  style={{
                    marginLeft: 0,
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                   }}
                   resizeMode='cover'
                   source={{
                     uri: ( this.state.imageUrl ? this.state.imageUrl.includes("flipclip") ? this.state.imageUrl : "file://"+this.state.imageUrl : "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg" )
                   }}
                 />
                <MaterialIcons style={{color:'#ff0046', position : 'absolute', right: -2, bottom : -2,borderWidth: 2, width: 30, height: 30, borderRadius: 15, borderColor: '#fff'}} name={'add-circle'} size={30} />
               </PhotoUpload>
              </View>

              <TextField
                label='User Name'
                onChangeText={(event) => this.fieldValue('username' , event)}
                titleFontSize={16}
                value={this.state.username}
                textColor='#373737'
                fontSize= {18}
                labelFontSize={14}
                tintColor='#aaaeae'
                baseColor='#aaaeae'
                ContainerStyle={{
                  padding: 0
                }}
              />

              <TextField
                label='Bio'
                onChangeText={(event) => this.fieldValue('bio' , event)}
                value={this.state.bio}
                titleFontSize={16}
                textColor='#373737'
                fontSize= {18}
                labelFontSize={14}
                tintColor='#aaaeae'
                baseColor='#aaaeae'
                maxLength= {32}
              />

              <TextField
                label='Email Address'
                onChangeText={(event) => this.fieldValue('email' , event)}
                titleFontSize={16}
                textColor='#373737'
                keyboardType='email-address'
                value={this.state.email}
                fontSize= {18}
                labelFontSize={14}
                tintColor='#aaaeae'
                baseColor='#aaaeae'
              />
            </ScrollView>
              { this.state.loader &&
                 <View style={styles.loading}>
                    <ActivityIndicator
                      animating={true}
                      size="large"
                      color="#ff0046"
                      />
                </View>
              }
      </View>
    )
  }
}

export default connect(state => ({
     user: state.tasks.user
}), {
  saveUserData: saveUserData,
})(EditProfile)


const styles = StyleSheet.create({
  scrollView:{
    backgroundColor: '#fefefe',
    paddingLeft: 15,
    paddingRight: 35,
  },
  innerContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
  centerTitle: {
    color: '#36292a',
    fontFamily: 'WorkSans-Regular',
    fontWeight: '300',
    marginLeft: 0,
    fontSize: 20,
    marginTop: 2,
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
  }

});
