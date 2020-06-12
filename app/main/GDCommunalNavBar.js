import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    Platform,
    Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

export default class GDCommunalNavBar extends Component {
    static propTypes = {
        leftItem: PropTypes.func,
        titleItem: PropTypes.func,
        rightItem: PropTypes.func
    }
    //左边
    renderLeftItem() {
        if (this.props.leftItem === undefined) {
            return;
        }
        return this.props.leftItem();
    }
    //中间
    renderTitleItem() {
        if (this.props.titleItem === undefined) {
            return;
        }
        return this.props.titleItem();
    }
    //右边 componentWillReceiveProps
    renderRightItem() {
        if(this.props.rightItem === undefined) {
            return;
        }
        return this.props.rightItem();
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    {this.renderLeftItem()}
                </View>
                <View>
                    {this.renderTitleItem()}
                </View>
                <View>
                    {this.renderRightItem()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: Platform.OS === 'ios' ? 64 : 44,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
        paddingTop: Platform.OS === 'ios' ? 15 : 0,
    },
})