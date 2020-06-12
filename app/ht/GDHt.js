import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    ActivityIndicator,
    Modal,
    DeviceEventEmitter,
    InteractionManager,
    Animated,
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';

const {width, height} = Dimensions.get('window');

import USHalfHourHot from './GTUSHalfHourHot';
import Search from '../main/GDSearch';
import CommunalDetail from '../main/GDCommunalDetail';
import CommunalCell from '../main/GDCommunalCell';
import NoDataView from '../main/GDNoDataView';
import CommunalNavBar from '../main/GDCommunalNavBar';
import CommunalSiftMenu from '../main/GDCommunalSiftMenu';
//数据
import HTSiftData from '../data/HTSiftData.json';

export default class GDHt extends Component {
    static defaultProps = {
        loadDataNumber: {}
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loaded: false,
            isUSHalfHourHotModal: false,
            isSiftModal: false,
        };
        this.data = [];
        this.loadData = this.loadData.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    loadData(resolve) {
        let params = {
            'count': 10,
            'country': 'us'
        };
        HTTPBase.get('https://guangdiu.com/api/getlist.php', params)
        .then(res => {
            this.data = [];
            this.data = this.data.concat(res.data);
            this.setState({
                dataSource: this.state.dataSource.concat(res.data),
                loaded: true,
            });
            //关闭刷新动画
            if (resolve) {
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    resolve();
                }, 1000);
            }
            //获取最新数据个数
            this.loadDataNumber();
            //存储数组中最后一个元素的id
            let uslastID = res.data[res.data.length -1].id;
            AsyncStorage.setItem('uslastID', uslastID.toString());
            //存储数组中第一个元素的id
            let usfirstID = res.data[0].id;
            AsyncStorage.setItem('usfirstID', usfirstID.toString());
            //清除本地存储的数据
            RealmBase.removeAllData('HomeData');
            //存储数据到本地
            RealmBase.create('HomeData', res.data);
        }, res => {
            this.data = RealmBase.loadAll('HomeData');
            this.setState({
                dataSource: this.state.dataSource,
                loaded: true,
            });
        });
    }

    //加载更多数据的网络请求
    loadMoreData(value) {
        let params = {
            'count': 10,
            'sinceid': value,
            'country': 'us'
        };
        HTTPBase.get('https://guangdiu.com/api/getlist.php', params)
        .then(res => {
            this.data = this.data.concat(res.data);
            this.setState({
                dataSource: this.state.dataSource.concat(res.data),
                loaded: true,
            });
            let uslastID = res.data[res.data.length - 1].id;
            AsyncStorage.setItem('uslastId', uslastId.toString());
        }).cache(error => {});
    }

    loadSiftData(mall, cate) {//筛选数据
        let params = {};
        if (mall === '' && cate === '') { //全部
            this.loadData(undefined);
            return;
        }
        if (mall === '') {
            params = {
                'cate': cate,
                'country': 'us'
            };
        } else {
            params = {
                'mall': mall,
                'country': 'us'
            };
        }
        HTTPBase.get('https://guangdiu.com/api/getlist.php', params)
        .then(res => {
            this.data = [];
            this.data = this.data.concat(res.data);
            this.setState({
                dataSource: this.data,
                loaded: true,
            });
            let cnlastID = res.data[res.data.length - 1].id;
            AsyncStorage.setItem('cnlastID', cnlastID.toString());
        }).catch(error => {});
    }

    loadDataNumber() {
        this.props.loadDataNumber();
    }

    loadMore() { //加载更多数据操作
        AsyncStorage.getItem('uslastId')
        .then(value => {
            this.loadMoreData(value);
        });
    }

    pushToHalfHourHot() { //近半小时热门
        InteractionManager.runAfterInteractions(() => {
            this.props.navigator.push({
                component: USHalfHourHot
            });
        });
    }

    showSiftMenu() {//显示筛选菜单
        this.setState({
            isSiftModal: true,
        });
    }

    pushToSearch() { //跳转到搜索
        this.props.navigator.push({
            component: Search
        });
    }

    pushToDetail(value) { //跳转到详情页
        InteractionManager.runAfterInteractions(() => {
            this.props.navigator.push({
                component: CommunalDetail,
                params: {
                    uri:  `https://guangdiu.com/api/showdetail.php?id=${value}`,
                }
            });
        });
    }

    clickTabBarItem() {//点击了Item
        let PullList = this.refs.pullList;
        if(PullList.scroll.scrollProperties.offset > 0) { //不在顶部
            PullList.scrollTo({y: 0});
        } else {
            PullList.state.pullPan = new Animated.valueXY({
                x: 0,
                y: this.topIndicatorHeight * -1,
            });
            this.loadData();
            let timer = setTimeout(() => {
                clearTimeout(timer);
                PullList.resetDefaultXYHandler();
            }, 1000);
        }
    }

    onRequestClose() {//安卓模态销毁处理
        this.setState({
            isUSHalfHourHotModal: false,
            isSiftModal: false,
        })
    }

    closeModal(data) {
        this.setState({
            isUSHalfHourHotModal: data,
            isSiftModal: data,
        });
    }

    renderLeftItem() {
        return(
            <TouchableOpacity onPress={() => {this.pushToHalfHourHot()}} >
                <Image source={{uri: 'hot_icon_20x20'}} style={styles.navbarLeftItemStyle} />
            </TouchableOpacity>
        )
    }
    renderTitleItem() {
        return(
            <TouchableOpacity onPress={() => this.showSiftMenu()} >
                <Image source={{uri: 'navtitle_home_down_66x20'}} style={styles.navbarTitleItemStyle} />
            </TouchableOpacity>
        )
    }
    renderRightItem() {
        return(
            <TouchableOpacity onPress={() => {this.pushToSearch()}} >
                <Image source={{uri: 'search_icon_20x20'}} style={styles.navbarRightItemStyle} />
            </TouchableOpacity>
        )
    }
    renderFooter() { //ListView底部
        return (
            <View style={{height: 100}}>
                <ActivityIndicator />
            </View>
        )
    }

    renderRow(rowData, idx) { //返回每一行的cell的样式
        return(
            <TouchableOpacity onPress={() => this.pushToDetail(rowData.id)} key={idx}>
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

    renderListView() {//根据网络状态渲染ListView
        if (this.state.loaded === false) {
            return (
                <NoDataView />
            )
        } else {
            return <FlatList
                    data={this.state.dataSource}
                    renderItem={({item, index}) => this.renderRow(item, index)}
                    style={styles.listViewStyle}
                    onEndReached={() => this.loadMore()}
                    onEndReachedThreshold={0.2}
                />
        }
    }

    componentDidMount() {
        this.loadData();
        this.subscription = DeviceEventEmitter.addListener('clickHTItem', () => {
            this.clickTabBarItem();
        });
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    render() {
        return (
            <View style={styles.container}>
                <CommunalNavBar
                    leftItem = {() => this.renderLeftItem()}
                    titleItem = {() => this.renderTitleItem()}
                    rightItem = {() => this.renderRightItem()}
                    />
                {this.renderListView()}
                {/* 初始化近半小时热门 */}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isUSHalfHourHotModal}
                    onRequestClose={() => this.onRequestClose()}
                    >
                    <Navigator
                        initialRoute={{
                            name: 'usHalfHourHot',
                            component: USHalfHourHot,
                        }}
                        renderScene={(route, navigator) => {
                            let Component = route.component;
                            return <Component
                                removeModal ={(data) => this.closeModal(data)}
                                {...route.params}
                                navigator={navigator}
                                />
                        }}
                        />
                </Modal>
                {/* 初始化筛选菜单 */}
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={this.state.isSiftModal}
                    onRequestClose={() => this.onRequestClose()}
                    >
                    <CommunalSiftMenu
                        removeModal={(data) => this.closeModal(data)}
                        data={HTSiftData}
                        loadSiftData={(mall, cate) => this.loadSiftData(mall, cate)}
                        />
                </Modal>
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

    navbarLeftItemStyle: {
        width:20,
        height:20,
        marginLeft:15,
    },
    navbarTitleItemStyle: {
        width:66,
        height:20,
    },
    navbarRightItemStyle: {
        width:20,
        height:20,
        marginRight:15,
    },

    listViewStyle: {
        width:width,
    },
});
