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

export default class GDCommunalCell extends Component{
    static propTypes = {
        image: PropTypes.string,
        title: PropTypes.string,
        mall: PropTypes.string,
        pubTime: PropTypes.string,
        fromSite: PropTypes.string,
    }
    constructor(props) {
        super(props);
        this.renderDate = this.renderDate.bind(this);
    }
    //返回时间计算结果
    renderDate(pubTime, fromSite) {
        if (!pubTime) {
            return '';
        }
        let minute = 1000 * 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7,
            month = day * 30;

        let now = new Date().getTime();
        let diffValue = now - Date.parse(pubTime.replace(/-/gi, '/'));

        if(diffValue < 0) {
            return;
        }

        let monthC = diffValue / month, //相关了几个月
            weekC = diffValue / week,
            dayC = diffValue / day,
            hourC = diffValue / hour,
            minuteC = diffValue / minute;

        let result;
        if (monthC >= 1) {
            result = parseInt(monthC) + '月前';
        } else if (weekC >= 1) {
            result = parseInt(weekC) + '周前';
        } else if (dayC >= 1) {
            result = parseInt(dayC) + '天前';
        } else if (hourC >= 1) {
            result = parseInt(hourC) + '小时前';
        } else if (minuteC >= 1) {
            result = parseInt(minuteC) + '分钟前';
        } else {
            result = '刚刚';
        }
        return result + ' . ' + fromSite;
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={{uri: this.props.image === '' ? 'defaullt_thumb_83x83' : this.props.image}}
                    style={styles.imageStyle} defaultSource={defaultImg} />
                <View style={styles.centerViewStyle}>
                    <View>
                        <Text numberOfLines={3} style={styles.titleStyle}>{this.props.title}</Text>
                    </View>
                    <View style={styles.detailViewStyle}>
                        <Text style={styles.detailMallStyle}>{this.props.mall}</Text>
                        <Text style={styles.timeStyle} >{this.renderDate(this.props.pubTime, this.props.fromSite)}</Text>
                    </View>
                </View>
                <Image source={{uri: 'icon_cell_rightArrow'}} style={styles.arrowStyle} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        height: 120,
        width: width,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
        marginLeft: 15,
        overflow: 'hidden',
    },
    imageStyle: {
        width: 90,
        height: 90,
    },
    centerViewStyle: {
        height: 90,
        justifyContent: 'space-around',
    },
    titleStyle: {
        width: width * 0.6,
    },
    detailViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailMallStyle: {
        fontSize: 11,
        color: 'green',
    },
    timeStyle: {
        fontSize: 11,
        color: 'gray',
    },
    allowStyle: {
        width: 10,
        height: 10,
        marginRight: 30,
    }
})