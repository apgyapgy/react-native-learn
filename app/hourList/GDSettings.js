import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import PropTypes from 'prop-types';

import CommunalNavBar from '../main/GDCommunalNavBar';
import SettingsCell from './GDSettingsCell';

export default class GDSettings extends Component {
    pop() {
        this.props.navigator.pop();
    }

    renderTitleItem() {
        return(
            <Text style={styles.navbarTitleItemStyle}>设置</Text>
        );
    }

    renderLeftItem() {
        return(
            <TouchableOpacity onPress={() => this.pop()}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: 'back'}} style={styles.navbarLeftItemStyle} />
                    <Text>返回</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return(
            <View style={styles.container}>
                <CommunalNavBar
                    leftItem = {() => this.renderLeftItem()}
                    titleItem = {() => this.renderTitleItem()}
                />
                <ScrollView style={styles.scrollViewStyle}>
                    <SettingsCell   leftTitle="淘宝天猫快捷下单"
                        isShowSwitch={true}
                    />
                    <SettingsCell
                        leftTitle="清理图片缓存"
                        isShowSwitch={false}
                    />
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navbarLeftItemStyle: {
        width: 20,
        height: 20,
        marginLeft: 15,
    },
    navbarTitleItemStyle: {
        fontSize: 17,
        color: 'black',
        marginRight: 50,
    },
    scrollViewStyle: {
        backgroundColor: 'white',
    }
})