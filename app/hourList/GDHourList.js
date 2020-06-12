import React, {Component, PropTypes} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    InteractionManager,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Settings from './GDSettings'
import CommunalDetail from '../main/GDCommunalDetail';
import CommunalCell from '../main/GDCommunalCell';
import CommunalNavBar from '../main/GDCommunalNavBar';
import NoDataView from '../main/GDNoDataView';

const {width, height} = Dimensions.get('window');

export default class GDHourList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loaded: false,
            prompt: '',
            isNextTouch: false,//下一小时按钮状态
            refreshing: false,
        };
        this.nexthourhour = '';
        this.nexthourdate = '';
        this.lasthourhour = '';
        this.lasthourdate = '';
        this.loadData = this.loadData.bind(this);
    }

    loadData(resolve, date, hour) {
        let params = {};
        if (date) {
            params = {
                'date': date,
                'hour': hour
            };
        }
        this.setState({
            refreshing: true,
        });
        HTTPBase.get('http://guangdiu.com/api/getranklist.php', params)
        .then(res => {
            let isNextTouch = true;
            if (res.hasnexthour == 1) {
                isNextTouch = false;
            }
            this.setState({
                dataSource: res.data,
                loaded: true,
                prompt: res.displaydate + res.rankhour + '点档(' + res.rankduring + ')',
                isNextTouch: isNextTouch,
                refreshing: false,
            });
            if (resolve !== undefined) {
                let timer = setTimeout(() => {
                    resolve();
                }, 1000);
            }
            //暂时保留一些数据
            this.nexthourhour = res.nexthourhour;
            this.nexthourdate = res.nexthourdate;
            this.lasthourhour = res.lasthourhour;
            this.lasthourdate = res.lasthourdate;
        });
    }

    pushToSettings() {//跳转到设置
        InteractionManager.runAfterInteractions(() => {
            this.props.navigator.push({
                component: Settings,
            })
        });
    }

    renderTitleItem() {
        return (
            <Image source={{uri: 'navtitle_rank_106x20'}} style={styles.navbarTitleItemStyle} />
        )
    }
    renderRightItem() {
        return (
            <TouchableOpacity onPress={() => {this.pushToSettings()}} >
                <Text style={styles.navbarRightItemStyle} >设置</Text>
            </TouchableOpacity>
        )
    }

    renderListView() {
        if (this.state.loaded === false) {
            return (
                <NoDataView />
            )
        } else {
            return <FlatList
                data={this.state.dataSource}
                renderItem={({item, index}) => this.renderRow(item, index)}
                onRefresh={() => this.loadData()}
                refreshing={this.state.refreshing}
            />
        }
    }
    renderRow(rowData, idx) {
        return (
            <TouchableOpacity onPress={() => this.pushToDetail(rowData)} key={idx} >
                <CommunalCell
                    image={rowData.image}
                    title={rowData.title}
                    mall={rowData.mall}
                    pubTime={rowData.pubtime}
                    fromSite={rowData.fromsite}
                    />
            </TouchableOpacity>
        )
    }

    pushToDetail(value) {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigator.push({
                component: CommunalDetail,
                params: {
                    uri: `https://guangdiu.com/api/showdetail.php?id=${value}`,
                }
            });
        });
    }

    lastHour() {
        this.loadData(undefined, this.lasthourdate, this.lasthourhour);
    }
    nextHour() {
        this.loadData(undefined, this.nexthourdate, this.nexthourhour);
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        return (
            <View style={styles.container} >
                <CommunalNavBar
                    titleItem={() => this.renderTitleItem()}
                    rightItem={() => this.renderRightItem()}
                    />
                {/*提醒栏*/}
                <View style={styles.promptViewStyle}>
                    <Text>{this.state.prompt}</Text>
                </View>
                {this.renderListView()}
                {/*操作栏*/}
                <View style={styles.operationViewStyle}>
                    <TouchableOpacity onPress={() => this.lastHour()}>
                        <Text style={styles.lastHourBtn}>
                            上一小时
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.nextHour()}
                        disabled={this.state.isNextTouch}
                        >
                        <Text style={styles.nextHourBtn}>
                            下一小时
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    navbarTitleItemStyle: {
        width: 106,
        height: 20,
        marginLeft: 50,
    },
    navbarRightItemStyle: {
        fontSize: 17,
        color: 'rgba(123, 178, 114, 1)',
        marginRight: 15,
    },
    promptViewStyle: {
        width: width,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(251, 251, 251, 1)',
    },
    operationViewStyle: {
        width: width,
        height: 44,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lastHourBtn: {
        marginRight: 10,
        fontSize: 17,
        color: 'green',
    },
    nextHourBtn: {
        marginLeft: 10,
        fontSize: 17,
        color: 'green',
    }
})