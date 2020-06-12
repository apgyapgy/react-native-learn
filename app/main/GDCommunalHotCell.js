import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Platform,
    Image,
} from 'react-native';
import PropTypes from 'prop-types';
let defaultImg = require('./images/defaullt_thumb_250x250.png');

const {width, height} = Dimensions.get('window');

export default class GDCommunalHotCell extends Component{
    static propTypes = {
        image: PropTypes.string,
        title: PropTypes.string,
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={{uri: this.props.image === '' ? 'defaullt_thumb_83x83' : this.props.image}}
                    style={styles.imageStyle} defaultSource={defaultImg} />
                <View>
                   <Text numberOfLines={3} style={styles.titleStyle} >{this.props.title}</Text>
                </View>
                <Image source={{uri: 'icon_cell_rightArrow'}} style={styles.arrowStyle} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
        height:120,
        width:width,
        borderBottomWidth:0.5,
        borderBottomColor:'gray',
        marginLeft:15,
        overflow:'hidden',
    },

    imageStyle: {
        width:90,
        height:90,
    },
    titleStyle: {
        width:width * 0.60,
    },
    arrowStyle: {
        width:10,
        height:10,
        marginRight:30
    }
});
