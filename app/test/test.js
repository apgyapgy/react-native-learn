import React, {Component, useState, useEffect} from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Text,
    View,
    Image,
    Button,
    Platform,
    PermissionsAndroid,
    NativeModules,
    LayoutAnimation,
} from 'react-native';
const {UIManager} = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

export default class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            w: 100,
            h: 100,
        };
        this.test = this.test.bind(this);
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    async test() {
        LayoutAnimation.spring();
        this.setState({
            w: this.state.w + 15,
            h: this.state.h + 15,
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{width: this.state.w, height: this.state.h, backgroundColor: 'red'}}>
                    <TouchableOpacity onPress={this.test}>
                        <View style={{backgroundColor: 'black', paddingHorizontal: 20, paddingVertical: 15, marginTop: 15}}>
                            <Text style={{color: '#fff', fontWeight: 'bold'}}>Press me!</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header:{
        height: 64,
        paddingTop: 14,
        backgroundColor:'white',
        flexDirection:'row',
    },
    textStyle:{
        fontSize: 15,
        marginLeft: 5,
        padding: 5,
    },
    divideLine:{
        height: 1,
        backgroundColor: '#e8e8e8',
    },
});
{/*

import Immutable from 'immutable';
const initArr = Immutable.fromJS([
    {date:'8月',income:'12345元',expenditure:'2520元',children:[
        {date:'8月12日',time:'18:25',orderCode:'SO18081200005',transCode:'123456',weight:'69.5Kg',money:'+241.00元',type:'收入'},
        {date:'8月10日',time:'12:01',orderCode:'SO18081000004',transCode:'123789',weight:'968.6Kg',money:'+8834.00元',type:'收入'},
        {date:'8月2日',time:'10:08',orderCode:'SO18080200003',transCode:'309876',weight:'465.6Kg',money:'-2520.00元',type:'支出'},
        {date:'8月1日',time:'09:30',orderCode:'SO18080100002',transCode:'783456',weight:'169.3Kg',money:'+1526.00元',type:'收入'},
        {date:'8月1日',time:'06:47',orderCode:'SO18080100001',transCode:'456234',weight:'395.6Kg',money:'+3234.00元',type:'收入'}
    ]},
    {date:'7月',income:'16365元',expenditure:'4525元',children:[
        {date:'7月31日',time:'18:25',orderCode:'SO18071200005',transCode:'123456',weight:'69.5Kg',money:'+241.00元',type:'收入'},
        {date:'7月20日',time:'12:01',orderCode:'SO18071200004',transCode:'123789',weight:'968.6Kg',money:'+8834.00元',type:'收入'},
        {date:'7月16日',time:'10:08',orderCode:'SO18071200003',transCode:'309876',weight:'465.6Kg',money:'-2520.00元',type:'支出'},
        {date:'7月12日',time:'09:30',orderCode:'SO18071200002',transCode:'783456',weight:'169.3Kg',money:'+7526.00元',type:'收入'},
        {date:'7月5日',time:'06:47',orderCode:'SO18070500001',transCode:'456234',weight:'395.6Kg',money:'+3234.00元',type:'收入'},
        {date:'7月3日',time:'10:08',orderCode:'SO18070300007',transCode:'309876',weight:'465.6Kg',money:'-2520.00元',type:'支出'}
        ]},
    {date:'6月',income:'23940元',expenditure:'11560元',children:[
        {date:'6月31日',time:'18:25',orderCode:'SO18061200005',transCode:'123456',weight:'69.5Kg',money:'+241.00元',type:'收入'},
        {date:'6月20日',time:'12:01',orderCode:'SO18061200004',transCode:'123789',weight:'968.6Kg',money:'+8834.00元',type:'收入'},
        {date:'6月16日',time:'10:08',orderCode:'SO18061200003',transCode:'309876',weight:'465.6Kg',money:'-2520.00元',type:'支出'},
        {date:'6月12日',time:'09:30',orderCode:'SO18061200002',transCode:'783456',weight:'169.3Kg',money:'+7526.00元',type:'收入'},
        {date:'6月5日',time:'06:47',orderCode:'SO18060500001',transCode:'456234',weight:'395.6Kg',money:'+3234.00元',type:'收入'},
        {date:'6月3日',time:'10:08',orderCode:'SO18060300007',transCode:'309876',weight:'465.6Kg',money:'-520.00元',type:'支出'}
    ]},
    {date:'5月',income:'12005元',expenditure:'8520元',children:[
        {date:'5月31日',time:'18:25',orderCode:'SO18051200005',transCode:'123456',weight:'69.5Kg',money:'+241.00元',type:'收入'},
        {date:'5月20日',time:'12:01',orderCode:'SO18051200004',transCode:'123789',weight:'968.6Kg',money:'+8834.00元',type:'收入'},
        {date:'5月16日',time:'10:08',orderCode:'SO18051200003',transCode:'309876',weight:'465.6Kg',money:'-2520.00元',type:'支出'},
        {date:'5月12日',time:'09:30',orderCode:'SO18051200002',transCode:'783456',weight:'169.3Kg',money:'+7526.00元',type:'收入'},
        {date:'5月5日',time:'06:47',orderCode:'SO18050500001',transCode:'456234',weight:'395.6Kg',money:'+3234.00元',type:'收入'},
        {date:'5月3日',time:'10:08',orderCode:'SO18050300007',transCode:'309876',weight:'465.6Kg',money:'-1520.00元',type:'支出'}
    ]},
    {date:'4月',income:'72367元',expenditure:'7890元',children:[
        {date:'4月31日',time:'18:25',orderCode:'SO18041200005',transCode:'123456',weight:'69.5Kg',money:'+241.00元',type:'收入'},
        {date:'4月20日',time:'12:01',orderCode:'SO18041200004',transCode:'123789',weight:'968.6Kg',money:'+8834.00元',type:'收入'},
        {date:'4月16日',time:'10:08',orderCode:'SO18041200003',transCode:'309876',weight:'465.6Kg',money:'-2520.00元',type:'支出'},
        {date:'4月12日',time:'09:30',orderCode:'SO18041200002',transCode:'783456',weight:'169.3Kg',money:'+7526.00元',type:'收入'},
        {date:'4月5日',time:'06:47',orderCode:'SO18040500001',transCode:'456234',weight:'395.6Kg',money:'+3234.00元',type:'收入'},
        {date:'4月3日',time:'10:08',orderCode:'SO18040300007',transCode:'309876',weight:'465.6Kg',money:'-2520.00元',type:'支出'}
    ]},
    {date:'3月',income:'12390元',expenditure:'78520元',children:[
        {date:'3月31日',time:'18:25',orderCode:'SO18031200005',transCode:'123456',weight:'69.5Kg',money:'+241.00元',type:'收入'},
        {date:'3月20日',time:'12:01',orderCode:'SO18031200004',transCode:'123789',weight:'968.6Kg',money:'+8834.00元',type:'收入'},
        {date:'3月16日',time:'10:08',orderCode:'SO18031200003',transCode:'309876',weight:'465.6Kg',money:'-2520.00元',type:'支出'},
        {date:'3月12日',time:'09:30',orderCode:'SO18031200002',transCode:'783456',weight:'169.3Kg',money:'+7526.00元',type:'收入'},
        {date:'3月5日',time:'06:47',orderCode:'SO18030500001',transCode:'456234',weight:'395.6Kg',money:'+3234.00元',type:'收入'},
        {date:'3月3日',time:'10:08',orderCode:'SO18030300007',transCode:'309876',weight:'465.6Kg',money:'-22520.00元',type:'支出'},
        {date:'3月3日',time:'10:08',orderCode:'SO18030300007',transCode:'309876',weight:'465.6Kg',money:'-22520.00元',type:'支出'}
    ]},
    {date:'2月',income:'56340元',expenditure:'9527元',children:[
        {date:'2月31日',time:'18:25',orderCode:'SO18021200005',transCode:'123456',weight:'69.5Kg',money:'-241.00元',type:'支出'},
        {date:'2月20日',time:'12:01',orderCode:'SO18021200004',transCode:'123789',weight:'968.6Kg',money:'+8834.00元',type:'收入'},
        {date:'2月16日',time:'10:08',orderCode:'SO18021200003',transCode:'309876',weight:'465.6Kg',money:'-2520.00元',type:'支出'},
        {date:'2月12日',time:'09:30',orderCode:'SO18021200002',transCode:'783456',weight:'169.3Kg',money:'+7526.00元',type:'收入'},
        {date:'2月5日',time:'06:47',orderCode:'SO18020500001',transCode:'456234',weight:'395.6Kg',money:'+3234.00元',type:'收入'},
        {date:'2月3日',time:'10:08',orderCode:'SO18020300007',transCode:'309876',weight:'465.6Kg',money:'-2520.00元',type:'支出'}
    ]},
]);
    constructor(props) {
        ...
        this.state = {
            dataSource: initArr.toJS(), //sectionList
        }
        //sectionList
        for(let i = 0; i < this.state.dataSource.length; i++) {
            this.state.dataSource[i]['data'] = [];
            this.state.dataSource[i]['key'] = i;
            this.state.dataSource[i]['isShow'] = 'off';
            delete this.state.dataSource[i]['children'];
        }
        this.renderItem = this.renderItem.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
    }
    //sectionList方法
    renderItem(data) {
        console.log('renderItem:', data);
        return(
            <View style={{backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 5, paddingVertical: 10}}>
                <View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.textStyle}>{data.item.date}</Text>
                        <Text style={styles.textStyle}>{data.item.orderCode}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.textStyle}>{data.item.time}</Text>
                        <Text style={[styles.textStyle,{fontWeight:'bold'}]}>{data.item.money}</Text>
                        <Text style={styles.textStyle}>{data.item.weight}</Text>
                    </View>
                </View>
                <Text style={{alignSelf:'center',fontSize:16,color: '#FA5741', marginRight:15}}>{data.item.type}</Text>
            </View>
        )
    }
    show(data){
        if (data.isShow === 'off') {
            this.state.dataSource[data.key]['data'] = initArr.toJS()[data.key].children;
            this.state.dataSource[data.key]['isShow'] = 'on';
            this.setState({
                dataSource:this.state.dataSource,
            });
        } else {
            this.state.dataSource[data.key]['data'] = [];
            this.state.dataSource[data.key]['isShow'] = 'off';
            this.setState({
                dataSource: this.state.dataSource,
            });
        }
    }
    renderSectionHeader({section}){
        return(
            <TouchableOpacity
                style={{
                    backgroundColor:'#f1f2f3',
                    justifyContent: 'center',
                    borderBottomWidth:1,
                    borderBottomColor:'#e8e8e8',
                    padding: 5
                }}
                onPress={() => this.show(section)}>
                <View>
                    <Text style={{fontSize:18,padding:5}}>{section.date}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:15,padding:5}}>收入：{section.income}</Text>
                        <Text style={{fontSize:15,marginLeft:25,padding:5}}>支出：{section.expenditure}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    renderItemSeparator() {
        return (
            <View style={styles.divideLine} ></View>
        );
    }
    renderSectionSeparator() {
        return (
            <View style={{height: 1, backgroundColor: 'red'}} />
        );
    }
    extraUniqueKey(item, index){
         return index + item;
    }
     <SectionList
         sections={this.state.dataSource}// 数据源
         renderItem={this.renderItem} // 渲染每一个section中的每一个列表项
         keyExtractor = {this.extraUniqueKey}// 生成一个不重复的key
         renderSectionHeader={this.renderSectionHeader}// 渲染每个section的头部
         scrollEnabled={true}//默认是true，false禁止滚动
         ItemSeparatorComponent={this.renderItemSeparator.bind(this)}// item分隔线组件
         SectionSeparatorComponent={this.renderSectionSeparator.bind(this)} // section分隔线组件
    >
     </SectionList>
//
*/}