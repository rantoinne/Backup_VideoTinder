import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,TouchableOpacity,ImageBackground,TouchableHighlight,ListView
} from 'react-native';

import { TabNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Container, Header, Content, Card, Separator, ListItem, CardItem, Thumbnail, Button, Left, Body, Right } from 'native-base';

export default class SuggestedScreen extends Component {
   
    static navigationOptions = { 
      headerTitle: 'Suggested Friends',      
      headerTitleStyle: {
          color: '#36292a',
          fontFamily: 'Montserrat-Regular',
          fontWeight: '300',
          marginLeft: 0, 
          },
        };

   constructor(props) {
      super(props);
    }

   

render() {
  var {navigate} = this.props.navigation;
    return (         
          <Container style={{backgroundColor: '#fefefe'}}>
            <Content>
              <Separator bordered style={{backgroundColor: '#e5e3e4', height: 45}}>
                <Text style={{fontFamily: 'Montserrat-Light', fontSize: 14, color: '#36292a'}}>On Flipclip (3)</Text>
              </Separator>
              <CardItem style={{height:72,borderWidth:0,backgroundColor: '#fefefe',borderBottomWidth:1,borderColor: '#dadddf' }}>
                    <Left>
                      <Thumbnail source={{ uri: 'https://i.pinimg.com/564x/a5/4d/4d/a54d4d37522a76a67002fa25b8e51515.jpg'}} style={{height: 40, width: 40}} />
                      <Body>
                        <Text style={styles.uploaderName}>Amrita Arora</Text>
                      </Body>
                    </Left>
                    <Right>
                    <Feather
                        name= 'user-plus'
                        color= 'black'
                        size= {30}
                        style={{alignSelf: 'center'}}
                      />
                    </Right>
                </CardItem>             
                
                <CardItem style={{height:72,borderWidth:0,backgroundColor: '#fefefe',borderBottomWidth:1,borderColor: '#dadddf' }}>
                    <Left>
                      <Thumbnail source={{ uri: 'https://i.pinimg.com/564x/a5/4d/4d/a54d4d37522a76a67002fa25b8e51515.jpg'}} style={{height: 40, width: 40}} />
                      <Body>
                        <Text style={styles.uploaderName}>Amrita Arora</Text>
                      </Body>
                    </Left>
                    <Right>
                      <Feather
                        name= 'user-plus'
                        color= 'black'
                        size= {30}
                        style={{alignSelf: 'center'}}
                      />
                    </Right>
                </CardItem>             
                
                <CardItem style={{height:72,borderWidth:0,backgroundColor: '#fefefe',borderBottomWidth:1,borderColor: '#dadddf' }}>
                    <Left>
                      <Thumbnail source={{ uri: 'https://i.pinimg.com/564x/a5/4d/4d/a54d4d37522a76a67002fa25b8e51515.jpg'}} style={{height: 40, width: 40}} />
                      <Body>
                        <Text style={styles.uploaderName}>Amrita Arora</Text>
                      </Body>
                    </Left>
                    <Right>
                      <Feather
                        name= 'user-check'
                        color= 'black'
                        size= {30}
                        style={{alignSelf: 'center'}}
                      />
                    </Right>
                </CardItem>                  
                
                <Separator bordered style={{backgroundColor: '#e5e3e4', height: 45}}>
                  <Text style={{fontFamily: 'Montserrat-Light', fontSize: 14, color: '#36292a'}}>Other friends (1)</Text>
                </Separator>                 
                
                <CardItem style={{height:72,borderWidth:0,backgroundColor: '#fefefe',borderBottomWidth:1,borderColor: '#dadddf' }}>
                    <Left>
                      <Thumbnail source={{ uri: 'https://i.pinimg.com/564x/a5/4d/4d/a54d4d37522a76a67002fa25b8e51515.jpg'}} style={{height: 40, width: 40}} />
                      <Body>
                        <Text style={styles.uploaderName}>Amrita Arora</Text>
                      </Body>
                    </Left>
                    <Right>
                      <Feather
                        name= 'user-plus'
                        color= 'black'
                        size= {30}
                        style={{alignSelf: 'center'}}
                      />
                    </Right>
                </CardItem>                 
            </Content>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  uploaderName:{
    fontSize: 14,
    color: '#36292a',
    fontFamily: 'Montserrat-Regular',
  },
});