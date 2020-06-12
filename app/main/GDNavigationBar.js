import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';

let NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState) {
        if (index > 0) {
            return (
                <TouchableOpacity onPress={() => navigator.pop()} >
                    <Text>返回</Text>
                </TouchableOpacity>
            )
        }
    },
    RightBUtton(route, navigator, index, navState) {

    },
    Title(route, navigator, index, navState) {
        return(
            <Text>{route.name}</Text>
        )
    }
}
export default(
    <Navigator.NavigationBarRouteMapper style={{backgroundColor: 'green'}}
        routeMapper={NavigationBarRouteMapper} />
)