import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    InteractionManager,
    DeviceEventEmitter,
    Modal,
    FlatList,
} from 'react-native';
//获取屏幕尺寸
const {width, height} = Dimensions.get('window');
//引用外部文件
import CommunalNavBar from '../main/GDCommunalNavBar';
import CommunalHotCell from '../main/GDCommunalHotCell';
import CommunalDetail from '../main/GDCommunalDetail';
import NoDataView from '../main/GDNoDataView';

//第三方
import {PullList} from 'react-native-pull';
import PropTypes from 'prop-types';

export default class GDHalfHourHot extends Component {
    static propTypes = {
        removeModal: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [], //new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2})
            loaded: true,
        };
        this.fetchData = this.fetchData.bind(this);
    }

    fetchData(resolve) {
        HTTPBase.get('http://guangdiu.com/api/gethots.php')
        .then(res => {
            this.setState({
                dataSource: this.state.dataSource.concat(res.data),
                loaded: true,
            })
            if (resolve !== undefined) {
                let timer = setTimeout(() => {
                    resolve();
                }, 1000);
            }
        }).catch(err => {});
    }
    popToHome(data) {
        if(this.props.navigator.getCurrentRoutes().length > 1) {
            this.props.navigator.pop();
        }
    }
    pushToDetail(value) {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigator.push({
                component: CommunalDetail,
                params: {
                    url: `https://guangdiu.com/api/showdetail.php?d=${value}`
                }
            });
        });
    }

    renderTitleItem() { //返回中间按钮
        return(
            <Text style={styles.navbarTitleItemStyle}>近半小时热门</Text>
        )
    }
    renderRightItem() { //返回右边按钮
        return (
            <TouchableOpacity
                onPress = {() => {this.popToHome(false)}}
                >
                    <Text style={styles.navbarRightItemStyle}>关闭</Text>
             </TouchableOpacity>
        )
    }

    renderListView() {//根据网络状态决定是否渲染ListView
        if (this.state.loaded === false) {
            return (
                <NoDataView />
            )
        } else {
            return <FlatList
                data={this.state.dataSource}
                scrollsToTop={true}
                keyExtractor={(item, index) => index + '_' + item.id}
                renderItem={({item, index}) => this.renderRow(item, index)}
                ListEmptyComponent={NoDataView}
            />
        }
    }
    renderRow(rowData, idx) {//返回每一行的cell样式
        return (
            <TouchableOpacity ke={idx}
                onPress={() => this.pushToDetail(rowData.id)}
                >
                <CommunalHotCell
                    image={rowData.image}
                    title={rowData.title}
                />
            </TouchableOpacity>
        )
    }
    renderHeader() {//返回ListView头部
        return (
            <View style={styles.headerPromptStyle} >
                <Text>根据每条折扣的点击进行统计,每5分钟更新一次</Text>
            </View>
        )
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerPromptStyle}>
                    <Text>根据每条折扣的点击进行统计，每5分钟更新一次。</Text>
                </View>
                <CommunalNavBar
                    titleItem = {() => this.renderTitleItem()}
                    rightItem = {() => this.renderRightItem()}
                />
                {this.renderListView()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    navbarTitleItemStyle: {
        fontSize: 17,
        color: 'black',
        marginLeft: 50,
    },
    navbarRightItemStyle: {
        fontSize: 17,
        color: 'rgba(123, 178, 114, 1.0)',
        marginRight: 15,
    },
    listViewStyle: {
        width: width,
    },
    headerPromptStyle: {
        height: 44,
        width: width,
        backgroundColor: 'rgba(239, 239, 239, .5)',
        justifyContent: 'center',
        alignItems: 'center',
    }
})