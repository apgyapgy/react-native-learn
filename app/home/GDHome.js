import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal,
    DeviceEventEmitter,
    InteractionManager,
    Animated,
    FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import {Navigator} from 'react-native-deprecated-custom-components';
import AsyncStorage from '@react-native-community/async-storage';

//获取屏幕尺寸
const {width, height} = Dimensions.get('window');

//数据
import HomeSiftData from '../data/HomeSiftData.json';

//第三方
import {PullList} from 'react-native-pull';

//引用外部组件
import CommunalNavBar from '../main/GDCommunalNavBar';
import CommunalCell from '../main/GDCommunalCell';
import CommunalDetail from '../main/GDCommunalDetail';
import CommunalSiftMenu from '../main/GDCommunalSiftMenu';
import HalfHourHot from './GDHalfHourHot';
import Search from '../main/GDSearch';
import NoDataView from '../main/GDNoDataView';


export default class GDHome extends Component {
    static defaultProps = {
        loadDataNumber: {}, //回调
    }
    componentDidMount() {
        this.loadData();
        this.subscription = DeviceEventEmitter.addListener('clickHomeItem', () => this.clickTabBarItem());
    }
    componentWillUnmount() {
        // 注销通知
        this.subscription.remove();
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [], //new ListView.dataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            loaded: true,
            isHalfHourHotModal: false, //近半小时热门状态
            isSiftModal: false, //筛选菜单状态
        }
        this.data = [];
        this.loadData = this.loadData.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.pushToDetail = this.pushToDetail.bind(this);
    }

    loadData(resolve) {
        let params = {'count': 10};
        HTTPBase.get('http://guangdiu.com/api/getlist.php', params)
        .then(res => {
            this.data = [];//清空数组
            this.data = res.data;
            this.setState({
                dataSource: res.data,
                loaded: true,
            });
            if(resolve !== undefined) { //关闭刷新动画
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    resolve();
                }, 1000);
            }
            this.loadDataNumber();//获取最新数据个数
            // 存储数组中最后一个元素的id
            let cnlastId = res.data[res.data.length - 1].id;
            AsyncStorage.setItem('cnlastId', cnlastId.toString());
            // 存储数组中第一个元素的id
            let cnfirstID = responseData.data[0].id;
            AsyncStorage.setItem('cnfirstID', cnfirstID.toString());
            //清除本地存储的数据
            RealmBase.removeAllData('HomeData');
            //存储数据到本地
            RealmBase.create('HomeData', res.data);
        }).catch(error => {
            this.data = RealmBase.loadAll('HomeData');
            this.setState({
                dataSource: this.data,
                loaded: true
            });
        });
    }
    loadMoreData(value) {//加载更多数据
        let params = {
             'count': 10,
             'sinceid': value
         };
         this.setState({
            refreshing: true,
         })
         HTTPBase.get('https://guangdiu.com/api/getlist.php', params)
         .then(res => {
             this.data = this.data.concat(res.data);
             this.setState({
                 dataSource: this.data,
                 loaded: true,
             });
             // 存储数组中最后一个元素的id
             let cnlastID = responseData.data[responseData.data.length - 1].id;
             AsyncStorage.setItem('cnlastID', cnlastID.toString());
         }).catch(error => {
         })
    }
    loadSiftData(mall, cate) {
        let params = {};
        if (mall === '' && cate === '') {
            this.loadData(undefined);
            return;
        }
        if (mall === '') {
            params = {
                'cate': cate,
            }
        } else {
            params = {
                'mall': mall
            }
        }
        HTTPBase.get('https://guangdiu.com/api/getlist.php', params)
        .then(res => {
            this.data = res.data;
            this.setState({
                dataSource: this.data,
                loaded: true,
            });
            let cnlastID = res.data[res.data.length - 1].id;
            AsyncStorage.setItem('cnlastID', cnlastID);
        }).cache(error => {})
    }
    loadDataNumber() {
        this.props.loadDataNumber();
    }
    loadMore() { //数据加载操作
        AsyncStorage.getItem('cnlastId')
        .then(value => {
            console.log('loadMore then:', value)
            this.loadMoreData(value);
        })
    }

    renderLeftItem() {
        return (
            <TouchableOpacity
                onPress= {() => this.pushToHalfHourHot()}
                >
                <Image source={{uri: 'hot_icon_20x20'}} style={styles.navBarLeftItemStyle} />
            </TouchableOpacity>
        )
    }
    renderTitleItem() {
        return (
            <TouchableOpacity
                onPress={() => {this.showSiftMenu()}}
                >
                <Image source={{uri: 'navtitle_home_down_66x20'}} style={styles.navBarTitleItemStyle}/>
            </TouchableOpacity>
        )
    }
    renderRightItem() {
        return(
            <TouchableOpacity onPress={() => this.pushToSearch()}>
                <Image source={{uri:'search_icon_20x20'}} style={styles.navBarRightItemStyle} />
            </TouchableOpacity>
        )
    }

    //模态到近半小时热门
    pushToHalfHourHot() {
        this.props.navigator.push({
            component: HalfHourHot,
            animationType: Navigator.SceneConfigs.SwipeFromLeft,
        });
    }
    pushToSearch() {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigator.push({
                component: Search,
            });
        });
    }
    pushToDetail(value) {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigator.push({
                component: CommunalDetail,
                params: {
                    uri: `https://guangdiu.com/api/showdetail.php?id=${value}`
                }
            });
        })
    }
    //显示筛选菜单
    showSiftMenu() {
        this.setState({
            isSiftModal: true,
        });
    }
    //安卓模态销毁处理
    onRequestClose() {
        this.setState({
            isHalfHourHotModal: false,
            isSiftModal: false,
        });
    }
    //关闭模态
    closeModal(data) {
        this.setState({
            isHalfHourHotModal: data,
            isSiftModal: data,
        });
    }

    clickTabBarItem() {//点击了Item
        this.loadData();return;
        let PullList = this.refs.pullList;
        if(PullList.scroll.scrollProperties.offset > 0) {
            PullList.scrollTo({y: 0});
        } else {
            //执行下拉刷新动画
            PullList.state.pullPan = new Animated.ValueXY({
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

    //根据网络状态决定是否渲染listview
    renderListView() {
        if (this.state.loaded === false) {//无数据
            return <NoDataView/>
        } else {//有数据
            return this.state.dataSource.map((item, idx) => {
                return this.renderRow(item, idx);
            });
            /*
                <PullList ref="pullList"
                    onPullRelease={(res) => this.loadData(res)} // 下拉刷新操作
                    dataSource={this.state.dataSource}  // 设置数据源
                    renderRow={this.renderRow.bind(this)}  // 根据数据创建相应 cell
                    showsHorizontalScrollIndicator={false}  // 隐藏水平指示器
                    style={styles.listViewStyle}
                    initialListSize={7}  // 优化:一次渲染几条数据
                    renderHeader={this.renderHeader}  // 设置头部视图
                    onEndReached={this.loadMore}  // 当接近底部特定距离时调用
                    onEndReachedThreshold={60}  // 当接近底部60时调用
                    renderFooter={this.renderFooter}  // 设置尾部视图
                    removeClippedSubviews={true}  // 优化
                />
            */
        }
    }
    renderRow(rowData, idx) { //返回每一行cell样式
        rowData = rowData.item;
        if (!rowData.title) {
            return;
        }
        return (
            <TouchableOpacity
                    key={idx}
                    onPress={() => this.pushToDetail(rowData.id)}
                >
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
    renderHeader() {}
    _keyExtractor = (item, index) => index + '_' + item.id;
    renderFooter() { //istView尾部
        return(
            <View style={{height: 100}}>
                <ActivityIndicator />
            </View>
        )
    }


    render() {
        return(
            <View style={styles.container}>
                {/*导航栏样式*/}
                <CommunalNavBar
                    leftItem = {() => this.renderLeftItem()}
                    titleItem = {() => this.renderTitleItem()}
                    rightItem = {() => this.renderRightItem()}
                />
                <FlatList
                    style={styles.listViewStyle}
                    data={this.state.dataSource}
                    scrollsToTop={true}
                    keyExtractor={this._keyExtractor}
                    renderItem={(item, index) => this.renderRow(item, index)}
                    ListEmptyComponent={NoDataView}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.2}
                    >
                </FlatList>
                {/*初始化筛选菜单 */}
                <Modal pointerEvents={'box-none'}
                    animationType='none'
                    transparent={true}
                    visible={this.state.isSiftModal}
                    onRequestClose={() => this.onRequestClose()}
                    >
                    <CommunalSiftMenu
                        removeModal={(data) => this.closeModal(data)}
                        data={HomeSiftData}
                        loadSiftData={(mall, cate) => this.loadSiftData(mall, cate)}
                        />
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        backgroundColor: 'white',
    },

    navBarLeftItemStyle: {
        width:20,
        height:20,
        marginLeft:15,
    },
    navBarTitleItemStyle: {
        width:66,
        height:20,
    },
    navBarRightItemStyle: {
        width:20,
        height:20,
        marginRight:15,
    },

    listViewStyle: {
        width:width,
    },
});
