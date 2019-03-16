import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,TouchableOpacity,Image, Dimensions,ScrollView,TouchableHighlight
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Left, Body, Right, Tab, Tabs } from 'native-base';

var width = Dimensions.get('window').width;
export default class Repost extends Component {

  static navigationOptions = {
    header: false,
  }

  render() {
    return (
      <ScrollView automaticallyAdjustContentInsets={false} style={styles.scrollView}>      
          <Grid>
            <Col style={{ backgroundColor: '#00CE9F',width:width/3, height:width/3,borderRightWidth:3, borderBottomWidth:3,borderColor: '#fff' }}></Col>           
          </Grid>     
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView:{
    backgroundColor: '#f5f5f5',
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

});
