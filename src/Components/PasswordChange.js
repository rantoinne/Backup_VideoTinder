import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,TouchableOpacity,ImageBackground,TouchableHighlight,ListView,Alert,AsyncStorage,ActivityIndicator
} from 'react-native';

import { TabNavigator, StackNavigator } from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextField } from 'react-native-material-textfield';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right,Form, Item, Input, Label  } from 'native-base';

export default class PasswordChange extends Component {

     constructor(props) {
      super(props);
      this.state = {
        currentPass: '',
        newPass:'',
        reNewPass: '',
        uploader: '',
        loader: false,
      };
    }

    static navigationOptions = {
       header: false,
      };

    // static navigationOptions = {
    //   headerTitle: 'Change Password',
    //   headerTitleStyle: {
    //       color: '#36292a',
    //       fontFamily: 'WorkSans-Regular',
    //       fontWeight: '300',
    //       marginLeft: 0
    //       },
    //   headerRight: <TouchableHighlight underlayColor = '#DFE1E3'  >
    //                   <MaterialIcons style={{color:'#36292a',marginRight: 15}} name={'done'} size={24}/>
    //                </TouchableHighlight>
    //     };

     async submitForm(e) {
        this.setState({loader: true})
        if(this.state.currentPass == '' || this.state.newPass == '' || this.state.reNewPass == '')
          Alert.alert('All Fields are necessary');
          else
            try {
      let response = await fetch('http://ec2-34-227-16-178.compute-1.amazonaws.com:3000/changePassword', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      username: this.state.uploader,
                      password: this.state.currentPass,
                      newPassword: this.state.newPass
                  })
                });
      let res = await response.text();
      if (response.status == 200) {
          //Handle success
          this.setState({loader : false})
          this.props.navigation.navigate('Settings');
      } else {
          //Handle error
          let error = res;
          console.log("error", error)
          Alert.alert(
          'Invalid current Password'
          )
      }
    } catch(error) {
        this.removeToken();
        this.setState({error: error});
        console.log("error " + error);
    }
  }

      componentWillMount() {
        var user;
        AsyncStorage.multiGet(['user']).then((data) => {
          if (data[0][1]) {
            user = data[0][1];
            return JSON.parse(user);
          }
        }).then((user) => {
          if(user) {
            this.setState({
                uploader: user.username
            });
          }
          else {
            return null
          }
        }).catch(err => {
          console.log("in error", err)
        })
      }

    fieldValue(fieldSegment , event) {
      const nameRegex = /^[a-zA-Z]{1,15}$/;
      if(fieldSegment == 'currentPass'){
        this.setState({
          currentPass : event,
        });
         if(!nameRegex.test(event)){
           this.setState({currentPassError: 'Field is required', currentPass: false});
         }
         else {
           this.setState({currentPass: event, currentPassError: ""});
         }
        }
        else if(fieldSegment == 'newPass'){
        this.setState({
          newPass : event,
          // fieldError: '',
        });
         if(!nameRegex.test(event)){
           this.setState({newPassError: 'Field is required', newPass: false});
         }
         else {
           this.setState({newPass: event, newPassError: ""});
         }
      }
      else if(fieldSegment == 'reNewPass'){
        this.setState({
          reNewPass : event,
          // fieldError: '',
        });
       if(!nameRegex.test(event)){
         this.setState({reNewPassError: 'Field is required', reNewPass: false});
       }
       else {
         this.setState({reNewPass: event, reNewPassError: ""});
       }
      }
    }


render() {
  const {goBack} = this.props.navigation;
  var {navigate} = this.props.navigation;
    return (
          <View style={{flex:1,backgroundColor: '#fefefe'}}>
              <View style={{height: 52, backgroundColor: '#fefefe', paddingHorizontal: 18, paddingVertical: 10, shadowColor: 'black',
                shadowOpacity: 0.1,
                shadowRadius: 5,
                shadowOffset: {
                  height: 5,
                },
                elevation: 4,
                zIndex: -1,
                overflow: 'visible'}}>
                <View style={styles.innerContainer}>
                  <TouchableHighlight onPress={() => goBack()} underlayColor = '#aaaeae'>
                      <Icon style={{color:'#36292a'}} name={'arrow-back'} size={30} />
                  </TouchableHighlight>
                      <Text style={styles.centerTitle}>Change Password</Text>
                  <TouchableHighlight underlayColor = '#DFE1E3' onPress={this.submitForm.bind(this)}>
                      <Icon style={{color:'#36292a'}} name={'done'} size={30} />
                  </TouchableHighlight>
                </View>
              </View>


            <View style={{paddingLeft: 15, paddingRight: 35}}>
              <TextField
                label='Current Password'
                onChangeText={(event) => this.fieldValue('currentPass' , event)}
                titleFontSize={16}
                value={this.state.currentPass}
                textColor='#373737'
                fontSize= {18}
                labelFontSize={14}
                tintColor='#aaaeae'
                baseColor='#aaaeae'
                error = {this.state.currentPassError}
              />

              <TextField
                label='New Password'
                onChangeText={(event) => this.fieldValue('newPass' , event)}
                titleFontSize={16}
                textColor='#373737'
                value={this.state.newPass}
                fontSize= {18}
                labelFontSize={14}
                tintColor='#aaaeae'
                baseColor='#aaaeae'
                error = {this.state.newPassError}
              />

              <TextField
                label='Re-enter Password'
                onChangeText={(event) => this.fieldValue('reNewPass' , event)}
                titleFontSize={16}
                textColor='#373737'
                value={this.state.reNewPass}
                fontSize= {18}
                labelFontSize={14}
                tintColor='#aaaeae'
                baseColor='#aaaeae'
                error = {this.state.reNewPassError}
              />
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
          </View>
    );
  }
}


const styles = StyleSheet.create({
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
