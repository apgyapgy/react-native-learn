import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

import Main from './GDMain';

export default class GDLaunchPage extends Component {
    componentDidMount() {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            this.props.navigator.replace({
                component: Main,
            });
        })
    }

    render() {
        return(
            <Image source={{uri: 'launchimage'}} style={styles.imageStyle} />
        )
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        width: width,
        height: height,
    },
});