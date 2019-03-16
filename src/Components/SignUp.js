import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,TouchableOpacity, TextInput, ImageBackground,TouchableHighlight,ListView,ScrollView,AsyncStorage,Alert,ActivityIndicator
} from 'react-native';

import { TabNavigator, StackNavigator } from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ImageResizer from 'react-native-image-resizer';
import PhotoUpload from 'react-native-photo-upload';
import { TextField } from 'react-native-material-textfield';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Dropdown } from 'react-native-material-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right,Item,Input } from 'native-base';

export default class SignUp extends Component {

    static navigationOptions = {
        headerTitle: 'Sign Up',
        headerRight: <Image borderRadius={14}
                            style={{marginRight:40 ,width: 28, height: 0, opacity: 0,}}
                            source={{uri : 'https://s3.amazonaws.com/uifaces/faces/twitter/nuraika/128.jpg'}}
                          />,
        headerStyle:{
            backgroundColor: '#fefefe',
            shadowOpacity: 0,
            shadowOffset: {
              height: 0,
              width:0
            },
            shadowRadius: 0,
            elevation: 0,
          },
        headerTitleStyle: {
            color: '#36292a',
            fontFamily: 'WorkSans-Regular',
            fontWeight: '300',
            fontSize: 16,
            alignSelf: 'center',
            marginRight: 23
          },
        };

   constructor(props) {
      super(props);
      this.state = {
        username: "",
        email: "",
        password: "",
        errors: [],
        filename: '',
        imageUrl: null,
        loader: false,
      };
    }

    fieldValue(fieldSegment , event) {
      if(fieldSegment == 'fName'){
        this.setState({
          fName : event,
          // fieldError: '',
        });
      }
        else if(fieldSegment == 'mNumber'){
        this.setState({
          mNumber : event,
          // fieldError: '',
        });
      }
        else if(fieldSegment == 'eMail'){
        this.setState({
          eMail : event,
          // fieldError: '',
        });
      }
      else if(fieldSegment == 'Designation'){
        this.setState({
          Designation : event,
          // fieldError: '',
        });
      }
    }

async onSignupPressed(){


  var regExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
     if( regExp.test(this.state.email) == false || this.state.email === null ) {
        Alert.alert(
          '',
          'Enter valid email',
          [            
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
     }
     else {

  this.setState({loader: true})
  let formData = new FormData();
          formData.append("username", this.state.username);
          formData.append("password", this.state.password);
          formData.append("email", this.state.email);
          //formData.append('image', {uri: fileURL, name: 'image.jpg', type: 'image/jpg'})
          if(this.state.imageUrl) {
            // console.log("yes")
            ImageResizer.createResizedImage("file://"+this.state.imageUrl, 1000, 1000, 'JPEG', 50, rotation=0, null)
            .then((resizedImageUri) => {
              // console.log("resizedImageUri",resizedImageUri);
              formData.append("image", {
              uri: resizedImageUri.uri,
              type: 'image/jpeg',
              name: resizedImageUri.name
            });

        try {
            // console.log("yes form", formData)
            let response = fetch('http://localhost:8000/register', {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                  }).then(response => {
                    // console.log("response ....",response)
                      if (response.status == 200) {
                        this.setState({loader : false});
                        this.props.navigation.navigate('Login');
                    } else {
                        // console.log("error");
                    }
                  });
            // let res = await response.text()
        } catch (error) {
          //errors are in JSON form so we must parse them first.
            let formErrors = JSON.parse(errors);
            //We will store all the errors in the array.
            let errorsArray = [];
            for(var key in formErrors) {
              //If array is bigger than one we need to split it.
              if(formErrors[key].length > 1) {
                  formErrors[key].map(error => errorsArray.push(`${key} ${error}`));
              } else {
                  errorsArray.push(`${key} ${formErrors[key]}`);
              }
            }
            this.setState({errors: errorsArray})
          }
            })
        }
        else {
          // console.log("No")
          try {
            let response = await fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/register', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
              },
              body: formData,
            });
            let res = await response.text()
            if (response.status == 200) {
              this.setState({loader : false});
              this.props.navigation.navigate('Login');
            } else {
              //Handle error
              let error = res;
              throw error;
            }
          } catch (error) {
            //errors are in JSON form so we must parse them first.
            let formErrors = JSON.parse(errors);
            //We will store all the errors in the array.
            let errorsArray = [];
            for(var key in formErrors) {
              //If array is bigger than one we need to split it.
              if(formErrors[key].length > 1) {
                formErrors[key].map(error => errorsArray.push(`${key} ${error}`));
              } else {
                errorsArray.push(`${key} ${formErrors[key]}`);
              }
            }
            this.setState({errors: errorsArray})
          }
        }
     }
  }

render() {
  var {navigate} = this.props.navigation;
  let data = [{
      value: 'Female',
    }, {
      value: 'Male',
    }];
    return (
    //25/01/2018  code edited on gmail sub - sign up screen scenes
      <ScrollView automaticallyAdjustContentInsets={false} style={styles.scrollView} keyboardShouldPersistTaps='always'>
              <View style= {{flex:1,marginTop: 20,alignItems: 'center', marginLeft: 18}}>
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
                 <Entypo
                  style={{
                    
                    alignSelf: 'center',
                    borderRadius: 45,
                   }}
                   size= {80}
                   color = 'black'
                   name= 'user'
                 />
                 <MaterialIcons style={{color:'#ff0046', position : 'absolute', right: -2, bottom : -2, borderWidth: 2, width: 30, height: 30, borderRadius: 15, borderColor: '#fff'}} name={'add-circle'} size={30} />
               </PhotoUpload>
              </View>

              <View style = {{flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%',
              paddingVertical: 20}}>
              <TextInput
                style = {{width: '100%', color: '#373737',fontSize: 16}}
                underlineAndroidColor= '#aaaeae'
                placeholder='Username'
                placeholderTextColor= '#aaaeae'
                placeholderTextSize= {18}
                onChangeText={ (text)=> this.setState({username: text})}
              />

             <TextInput
                style = {{width: '100%', color: '#373737',fontSize: 16}}
                underlineAndroidColor= '#aaaeae'
                placeholder='Email'
                placeholderTextColor= '#aaaeae'
                placeholderTextSize= {18}
                onChangeText={ (text)=> this.setState({email: text})}
                keyboardType= 'email-address'
              />


              <TextInput
                style = {{width: '100%', color: '#373737',fontSize: 16}}
                underlineAndroidColor= '#aaaeae'
                placeholder='Password'
                placeholderTextColor= '#aaaeae'
                placeholderTextSize= {18}
                secureTextEntry={true}
                onChangeText={ (text)=> this.setState({password: text})}
              />
              </View>

               <Errors errors={this.state.errors}/>
              <Button block style={styles.LoginButton} onPress = {this.onSignupPressed.bind(this)} >
                <Text style={styles.logintext}>Create Account</Text>
              </Button>

              <View style={{justifyContent: 'center'}}>
                <Text style={styles.SignUpResendOtpText}>
                  Already have an account?&nbsp;
                  <Text style={styles.SignUpResendOtpLink} onPress = { () => navigate ("Login", {}) }>
                    Sign In
                  </Text>
                </Text>
              </View>

              <View style={{justifyContent: 'center',opacity: 0,}}>
                <Text style={styles.SignUpResendOtpText}>
                  Don’t have an account?&nbsp;
                  <Text style={styles.SignUpResendOtpLink} onPress = { () => navigate ("SignUp", {}) }>
                    Sign In!
                  </Text>
                </Text>
              </View>

              <View style={{justifyContent: 'center',opacity: 0,}}>
                <Text style={styles.SignUpResendOtpText}>
                  Don’t have an account?&nbsp;
                  <Text style={styles.SignUpResendOtpLink} onPress = { () => navigate ("SignUp", {}) }>
                    Sign In!
                  </Text>
                </Text>
              </View>

              <View style={{justifyContent: 'center',opacity: 0,}}>
                <Text style={styles.SignUpResendOtpText}>
                  Don’t have an account?&nbsp;
                  <Text style={styles.SignUpResendOtpLink} onPress = { () => navigate ("SignUp", {}) }>
                    Sign In!
                  </Text>
                </Text>
              </View>

              <View style={{justifyContent: 'center',opacity: 0,}}>
                <Text style={styles.SignUpResendOtpText}>
                  Already have an account?&nbsp;
                  <Text style={styles.SignUpResendOtpLink} onPress = { this.onSignupPressed.bind(this) }>
                    Sign In!
                  </Text>
                </Text>
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
      </ScrollView>
    )
  }
}



const Errors = (props) => {
    return (
      <View>
        {props.errors.map((error, i) => <Text key={i} style={styles.error}> {error} </Text>)}
      </View>
    );
  }


const styles = StyleSheet.create({
  scrollView:{
    backgroundColor: '#fefefe',
    paddingLeft: 15,
    paddingRight: 35,
    flex: 1
  },
  LoginButton: {
    borderRadius:100,
    backgroundColor: '#ff0046',
    marginTop: 30,
    marginBottom: 20
  },
  logintext:{
    color: '#f5f5f5',
    fontSize: 14
  },
  SignUpResendOtpText: {
      color: '#36292a',
      textAlign: 'center',
      fontSize: 14,
      fontFamily: 'WorkSans-Light'
  },
  SignUpResendOtpLink:{
      color: '#ff0046',
      textAlign: 'center',
      fontSize: 14,
      fontFamily: 'WorkSans-Regular',
      textDecorationLine: 'none',
      textDecorationStyle: 'solid',
      textDecorationColor: '#000'
  },
  error: {
    color: 'red',
    paddingTop: 10
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradient: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 18
  },
});
