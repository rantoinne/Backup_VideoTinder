import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

class UploadIndicator extends Component {
	render() {
		return (
			<View style= {{ marginTop: 8}}>
				<Text>
					Uploading!
				</Text>
				<ActivityIndicator size= {28} color= 'green' style= {{ alignSelf: 'center' }} />
			</View>
		);
	}
}

export default UploadIndicator;