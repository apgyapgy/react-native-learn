import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Platform,
    Animated,
} from 'react-native';
import PropTypes from 'prop-types';

const {width, height} = Dimensions.get('window');

export default class GDCommunalSiftMenu extends Component {
    static defaultProps = {
        removeModal: {},
        loadSiftData: {},
    }
    static propTypes = {
        data: PropTypes.array,
    }
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        }
    }

    popToHome(data) {
        this.props.removeModal(data);
    }

    siftData(mall, cate) {//点击事件
        this.props.loadSiftData(mall, cate);
        this.popToHome(false);
    }

    loadData() {
        let data = [];
        for (let i = 0; i < this.props.data.length; i++) {
            data.push(this.props.data[i]);
        }
        this.setState({
            dataSource: data,
        });
    }
    renderRow(rowData, idx) {
        return(
            <View style={styles.itemViewStyle} key={idx}>
                <TouchableOpacity
                    onPress={() => this.siftData(rowData.mall, rowData.cate)} >
                    <View style={styles.itemViewStyle} >
                        <Image source={{uri: rowData.image}} style={styles.itemImageStyle} />
                        <Text style={{fontSize: 13, marginTop: 5}}>{rowData.title}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        return (
            <TouchableOpacity
                onPress={() => this.popToHome(false)}
                activeOpacity={1}
                >
                <View style={styles.container}>
                    <FlatList  style={styles.contentViewStyle}
                        data={this.state.dataSource}
                        renderItem={({item, index}) => this.renderRow(item, index)}
                        numColumns={4}
                    />
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
    },
    contentViewStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: width,
        top: Platform.OS === 'ios' ? 64 : 44,
    },
    itemViewStyle: {
        width: width * 0.25,
        height: 70,
        backgroundColor: 'rgba(249, 249, 249, 1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemImageStyle: {
        width: 40,
        height: 40,
    }
})