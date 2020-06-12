import React, {Component} from 'react';
import TabNavigator from 'react-native-tab-navigator';
import {
    StyleSheet,
    Image,
    Text,
    View,
    Platform,
    DeviceEventEmitter,
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import AsyncStorage from '@react-native-community/async-storage';
import GDCommunalNavBar from './GDCommunalNavBar';

import Home from '../home/GDHome';
import HT from '../ht/GDHt';
import HourList from '../hourList/GDHourList';
import HTTP from '../http/HTTPBase';
import RealmStorage from '../storage/realmStorage';

export default class GD extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedTab:'home', //首选页面
            isHiddenTabBar: false,
            cnbadgeText: '',//首页Items角标文本
            usbadgeText: '', //海淘Items角标文本
        }
    }

    // 设置 Navigator 转场动画
    setNavAnimationType(route) {
        if (route.animationType) {      // 有值
            return Navigator.SceneConfigs.PushFromRight;
            let conf = route.animationType;
            conf.gestures = null;           // 关闭返回手势
            return conf;
        }else {
            return Navigator.SceneConfigs.FloatFromRight; //PushFromRight;    // 默认转场动画
        }
    }

    loadDataNumber() { //获取最新数据个数网络请求
        // 取出id
        AsyncStorage.multiGet(['cnfirstID', 'usfirstID'], (error, stores) => {
            // 拼接参数
            let params = {
                "cnmaxid" : stores[0][1],
                "usmaxid" : stores[1][1],
            };

            // 请求数据
            HTTPBase.get('http://guangdiu.com/api/getnewitemcount.php', params)
                .then((responseData) => {
                    this.setState({
                        cnbadgeText: responseData.cn,
                        usbadgeText: responseData.us
                    })
                })
                .catch((error) => {

                })
        });
    }
    hiddenTabBar(data) {// 隐藏 TabBar
        this.setState({
            isHiddenTabBar:data,
        });
    }

    clickItem(selectedTab, subscription) { //点击了Item
        if (subscription !== '' && this.state.selectedTab == selectedTab) {
            DeviceEventEmitter.emit(subscription);//发送通知
        }
        this.setState({
            selectedTab: selectedTab, //渲染页面
        });
    }

    componentDidMount() {
        //注册通知
        this.subscription = DeviceEventEmitter.addListener('isHiddenTabBar', (data) => {
            this.hiddenTabBar(data);
        });
        // 最新数据的个数
        let timer = setInterval(() => {
            this.loadDataNumber();
        }, 30000);
    }
    componentWillUnmount() {
        this.subscription.remove();
    }
    // 返回TabBar的Item
    renderTabBarItem(title, selectedTab, image, selectedImage, component, badgeText, subscription) {
        return(
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                badgeText={badgeText == 0 ? '' : badgeText}
                selectedTitleStyle={{color:'black'}}
                renderIcon={() => <Image source={{uri:image}} style={styles.tabbarIconStyle} />}
                renderSelectedIcon={() => <Image source={{uri:selectedImage}} style={styles.tabbarIconStyle} />}
                onPress={() => this.clickItem(selectedTab, subscription)}
                >
                <Navigator
                    initialRoute={{
                        name: selectedTab,
                        component: component
                    }}
                    renderScene={(route, navigator) => {
                        let Component = route.component;
                        return (
                            <Component {...route.params} navigator={navigator}
                                loadDataNumber={() => this.loadDataNumber()}
                                />
                         )
                    }}
                />
            </TabNavigator.Item>
        )
    }
    //configureScene={(route) => {
     //   this.setNavAnimationType(route);
    //}}
    render() {
        return (
            <TabNavigator
                tabBarStyle={this.state.isHiddenTabBar !== true ? styles.empty : styles.tabBarStyle}
                sceneStyle={this.state.isHiddenTabBar !== true ? styles.empty : styles.sceneStyle}
                >
                {this.renderTabBarItem("首页", 'home', 'tabbar_home_30x30', 'tabbar_home_selected_30x30', Home, this.state.cnbadgeText, 'clickHomeItem')}
                {this.renderTabBarItem("海淘", 'ht', 'tabbar_abroad_30x30', 'tabbar_abroad_selected_30x30', HT, this.state.usbadgeText, "clickHTItem")}
                {this.renderTabBarItem("小时风云榜", 'hourlist', 'tabbar_rank_30x30', 'tabbar_rank_selected_30x30', HourList)}
            </TabNavigator>
        )
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
        },
        tabbarIconStyle: {
            width:Platform.OS === 'ios' ? 30 : 25,
            height:Platform.OS === 'ios' ? 30 : 25,
        },
        empty: {},
        tabBarStyle: {
            height: 0,
            overflow: 'hidden',
        },
        sceneStyle: {
            paddingBottom: 0,
        }
    }
);