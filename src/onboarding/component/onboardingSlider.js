import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text } from 'react-native'
// NOTE: INSTALL REACT-NATIVE-SNAP-CAROUSEL FROM NPM
import Carousel from 'react-native-snap-carousel'
const { width: sliderWidth } = Dimensions.get('window')

const styles = StyleSheet.create({
  slide: {
    flex: 1
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    width: sliderWidth
  }
})

const images= [
      { uri: require('../assets/onboardingpics/1.jpg') },
      { uri: require('../assets/onboardingpics/2.jpg') },
      { uri: require('../assets/onboardingpics/3.jpg') },
      { uri: require('../assets/onboardingpics/4.jpg') },
      { uri: require('../assets/onboardingpics/5.jpg') }
    ];

class OnboardingSlider extends Component {

  constructor(props) {
    super(props);
    this.state= {
      floatingButton: false
    };
  }

  _renderItem=({ item, index })=> {
    return (
      <View style={styles.slide}>
        <Image style={styles.image} source={item.uri} />
      {
        index===4 ? (
                    <View style={{position: 'absolute', zIndex: 1000, bottom: 10, right: 10, padding: 4 }}>
                      <TouchableOpacity 
                        onPress={()=> this.props.navigation.navigate('Landing')}
                        style={{width: 70, height: 70, borderRadius: 35, backgroundColor: '#ff0046', elevation: 4, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: 'Montserrat-Black', fontSize: 14, color: 'white' }}>
                          Go!
                        </Text>
                      </TouchableOpacity>
                    </View>
                    ): null
      }
      </View>
    )
  }

  render() {
    return (
      <View style= {{ flex: 1 }}>
        <Carousel
          ref={(c) => {
            this._carousel = c
          }}
          data={images}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth-8}
          itemWidth={sliderWidth - 30}
          layout={'stack'}
          pagingEnabled = {true}
          layoutCardOffset={18}
        />

        

      </View>
    )
  }
}

export default OnboardingSlider
