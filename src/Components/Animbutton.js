import React, { Component } from 'react';
import {
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import * as Animatable from 'react-native-animatable';
export default class Animbutton extends Component {
  constructor(props) {
     super(props);
     this.state ={
       status: false
     }
   }
   _onPress(){
     this.props._onPress(!this.state.status)
     this.setState({ status: !this.state.status})
     switch (this.props.effect) {
       case 'bounce':
         this.refs.view.bounce(800)
         break;
       case 'flash':
         this.refs.view.flash(800)
         break;
       case 'jello':
         this.refs.view.jello(800)
         break;
       case 'pulse':
         this.refs.view.pulse(800)
         break;
       case 'rotate':
         this.refs.view.rotate(800)
         break;
       case 'rubberBand':
         this.refs.view.rubberBand(800)
         break;
       case 'shake':
         this.refs.view.shake(800)
         break;
       case 'swing':
         this.refs.view.swing(800)
         break;
       case 'tada':
         this.refs.view.tada(800)
         break;
       case 'wobble':
         this.refs.view.wobble(800)
         break;
     }

   }
  render() {
    return (
      <TouchableWithoutFeedback onPress = { () => navigate ("Register", {}) }>
        <Animatable.View ref="view" style={{ borderRadius:100,
          width: 310, 
          marginBottom: 20,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center', backgroundColor: this.state.status ? this.props.onColor : "#ff0046", borderRadius:100}}>
          <Text style={{color: this.state.status ? "#f5f5f5" : "#f5f5f5", fontSize: 14,fontFamily: 'Montserrat-Medium',}}>{this.props.text}</Text>
        </Animatable.View>
      </TouchableWithoutFeedback>
    );
  }
}