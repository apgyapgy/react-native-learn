import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
//    WebView,
} from 'react-native';
import PropTypes from 'prop-types';
import {WebView} from 'react-native-webview';

import CommunalNavBar from './GDCommunalNavBar';

export default class GDCommunalDetail extends Component {
    static propTypes = {
        uri: PropTypes.string,
    }

    pop() { //返回
        this.props.navigator.pop();
    }

    renderLeftItem() {
        return (
            <TouchableOpacity onPress={() => {this.pop()}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}} >
                    <Image source={{uri: 'back'}} style={styles.navBarLeftItemStyle} />
                    <Text>返回</Text>
                </View>
            </TouchableOpacity>
        )
    }

    UNSAFE_componentWillMount() {
        DeviceEventEmitter.emit('isHiddenTabBar', true);
    }
    componentWillUnmount() {
        DeviceEventEmitter.emit('isHiddenTabBar', false);
    }

    render() {
        return (
            <View style={styles.container}>
                <CommunalNavBar
                    leftItem={() => this.renderLeftItem()} />
                <WebView
                    style={styles.webViewStyle}
                    source={{uri: this.props.uri, method: 'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                    />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    webViewStyle: {
        flex:1
    },
    navBarLeftItemStyle: {
        width:20,
        height:20,
        marginLeft:15,
    },
});