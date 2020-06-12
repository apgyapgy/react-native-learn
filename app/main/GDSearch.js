import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    Modal,
    TextInput,
    DeviceEventEmitter,
    Keyboard,
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');//获取屏幕尺寸

import CommunalNavBar from '../main/GDCommunalNavBar';
import CommunalCell from '../main/GDCommunalCell';
import CommunalDetail from '../main/GDCommunalDetail';
import NoDataView from '../main/GDNoDataView';

export default class GDSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loaded: false,
        };
        this.data = [];
        this.changeText = '';
        this.loadData = this.loadData.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    loadData(resolve) {
        if(!this.changeText) return;
        let params = {
            'q': this.changeText,
        };
        HTTPBase.get('http://guangdiu.com/api/getresult.php', params)
        .then(res => {
            this.data = [];
            this.data = this.data.concat(res.data);
            this.setState({
                dataSource: this.data,
                loaded: true,
            });
            if (resolve !== undefined) {
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    resolve();
                }, 1000);
            }
            let searchLastID = res.data[res.data.length -1].id;
            AsyncStorage.setItem('searchLastID', searchLastID.toString());
        });
    }
    loadMoreData(value) {
        let params = {
            'q': this.changeText,
            'sinceid': value,
        };
        HTTPBase.get('http://guangdiu.com/api/getresult.php', params)
        .then(res => {
            this.data = this.data.concat(res.data);
            this.setState({
                dataSource: this.data,
                loaded: true,
            });
            let searchLastID = res.data[res.data.length - 1].id;
            AsyncStorage.setItem('searchLastID', searchLastID.toString());
        });
    }
    loadMore() {
        AsyncStorage.getItem('searchLastID')
        .then(value => {
            this.loadMoreData(value);
        });
    }

    pop() {
        Keyboard.dismiss();//回收键盘
        this.props.navigator.pop();
    }
    pushToDetail(value) {
        this.props.navigator.push({
            component: CommunalDetail,
            params: {
                uri: `https://guangdiu.com/api/showdetail.php?id=${value}`
            }
        });
    }

    renderLeftItem() {
        return(
            <TouchableOpacity onPress={() => this.pop()}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: 'back'}} style={styles.navBarLeftItemStyle}/>
                    <Text>返回</Text>
                </View>
            </TouchableOpacity>
        )
    }
    renderTitleItem() {
        return(
            <Text style={styles.navBarTitleItemStyle}>搜索全网折扣</Text>
        )
    }
    renderFooter() {
        return(
            <View style={{height: 100}} >
                <ActivityIndicator />
            </View>
        )
    }

    renderRow(rowData, idx) {
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
    renderListView() {
        if (this.state.loaded === false) {
            return(
                <NoDataView />
            )
        } else {
            return this.state.dataSource.map((item, idx) => {
                return this.renderRow(item, idx);
            });
        }
    }

    componentWillMount() {
        DeviceEventEmitter.emit('isHiddenTabBar', true);
    }
    componentWillUnmount() {
        DeviceEventEmitter.emit('isHiddenTabBar', false);
    }

    render() {
        return (
            <View style={styles.container}>
                <CommunalNavBar
                    leftItem = {() => this.renderLeftItem()}
                    titleItem = {() => this.renderTitleItem()}
                    />
                <View style={styles.toolsViewStyle}>
                    <View style={styles.inputViewStyle} >
                        <Image source={{uri: 'search_icon_20x20'}} style={styles.searchImageStyle} />
                        <TextInput
                            style={styles.textInputStyle}
                            keyboardType="default"
                            placeholder="请输入搜索商品关键字"
                            placeholderTextColor='gray'
                            autoFocus={true}
                            clearButtonMode="while-editing"
                            onChangeText={text => {this.changeText = text}}
                            onEndEditing={() => this.loadData()}
                            underlineColorAndroid={'transparent'}
                            />
                    </View>
                    <View style={{marginRight: 10}}>
                        <TouchableOpacity onPress={() => this.pop()}>
                            <Text style={{color: 'green'}}>取消</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView>
                    {this.renderListView()}
                </ScrollView>
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
    navBarLeftItemStyle: {
        width: 20,
        height: 20,
        marginLeft: 15,
    },
    navBarTitleItemStyle: {
        fontSize: 17,
        color: 'black',
        marginRight: 50,
    },
    toolsViewStyle: {
        width: width,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputViewStyle: {
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(239, 239, 241, 1)',
        marginLeft: 10,
        borderRadius: 5,
    },
    searchImageStyle: {
        width: 15,
        height: 15,
        marginLeft: 8,
    },
    textInputStyle: {
        paddingVertical: 0,
        width: width * 0.75,
        height: 35,
        marginLeft: 8,
    },
    listViewStyle: {
        width: width,
    }
})