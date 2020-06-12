import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Switch,
    Image,
    Platform,
} from 'react-native';
import PropTypes from 'prop-types';

export default class GDSettingsCell extends Component {
    static propTypes = {
        leftTitle: PropTypes.string,
        isShowSwitch: PropTypes.bool,
    }

    constructor(props) {
        super(props);
        this.state = {
            isOn: false,
        }
    }

    renderRightContent() {
        let component ;
        if (this.props.isShowSwitch) {
            component = <Switch value={this.state.isOn} onValueChange={() => {this.setState({isOn: !this.state.isOn})}} />
        } else {
            component = <Image source={{uri: 'icon_cell_rightArrow'}} style={styles.arrowStyle} />
        }
        return component;
    }

    render() {
        return (
            <View style={styles.container} >
                <View>
                    <Text>{this.props.leftTitle}</Text>
                </View>
                <View style={styles.rightViewStyle}>
                    {this.renderRightContent()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: Platform.OS === 'ios' ? 44 : 36,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        marginLeft: 15,
    },
    rightViewStyle: {
        marginRight: 15,
    },
    arrowStyle: {
        width: 10,
        height: 10,
    }
})