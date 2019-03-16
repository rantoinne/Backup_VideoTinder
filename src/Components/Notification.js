import React, { Component } from 'react';
import { View, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

class Notifications extends Component {

	static navigationOptions= {
		headerStyle: {
			backgroundColor: '#ff0046'
		},
		title: 'Notifications'
	};

	constructor(props) {
		super(props);
		this.state= {
			firstLaunch: false,
			persistData: ''
		};
	}

	componentDidMount=async()=>{
        try {
		      var asyncVar = await AsyncStorage.getItem("@AAA:firstLaunch");
		      // alert("Fetched " + asyncVar);
		      this.setState({persistData: asyncVar});
		      
		    }catch(e) {
		      // alert("FetchError " + e);
		    }
		    if(this.state.persistData === "Launched") {
		      this.setState({ firstLaunch: true });
		    }
		    else {
		    	try {
				      await AsyncStorage.setItem("@AAA:firstLaunch", "Launched");
				      // alert("token " + token);
				      this.setState({ firstLaunch: false });
			        }catch(e) {
				      // alert("storeItemError " + e);
				    }
		    }
    }

	render() {
		if(this.state.firstLaunch) {
			return(
			<View style= {{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
				<Text style={{fontFamily: 'Montserrat-Black', fontSize: 14, marginTop: 20 }}>
					No New Notifications!
				</Text>

				<SimpleLineIcons name= "exclamation" size= {150} color= "#ff0046" style= {{alignSelf: 'center', position: 'absolute', bottom: 150}} />
			</View>
			);
		}

		else {
			return(
				<View style={{flex: 1, alignItems: 'center' }}>
					<View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, elevation: 4, width: '99%', height: null, backgroundColor: '#f5f6fa', marginBottom: 8}}>
						<Text style= {{fontFamily: 'Montserrat-Black', fontSize: 18}}>Welcome to the World of FlipClip Where Talent Meets Opportunity! Vote For Your Friends, 
						Post And Get a Chance To Set New Trends. Whatever You Like You get to Keep.</Text>
					</View>

					<View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, elevation: 4, width: '99%', height: null, backgroundColor: '#f5f6fa', marginBottom: 8}}>
						<Text style= {{fontFamily: 'Montserrat-Black', fontSize: 18}}>Why Don’t You Start Posting.</Text>
					</View>

					<View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, elevation: 4, paddingTop: 8, width: '99%', height: null, backgroundColor: '#f5f6fa', marginBottom: 8}}>
						<Text style= {{fontFamily: 'Montserrat-Black', fontSize: 18}}>Descending From Most Liked To Least Liked In The Popular Section.
						Flaunt Your Collection Of Videos From the Liked Section And Increase That Collection By Swiping Right.
						</Text>
					</View>

					<View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, paddingTop: 8, width: '99%', height: null, marginBottom: 8}}>
						<TouchableOpacity onPress= {()=> this.props.navigation.navigate('Scenes')} 
							style={{width: 50, height: 50, borderRadius: 25, backgroundColor: '#ff0046', elevation: 4, justifyContent: 'center', alignItems: 'center'}}
						>
							<Text style={{fontFamily: 'Montserrat-Black', fontSize: 14, color: 'white' }}>
								Go!
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				);
		}
	}
}

export default Notifications;