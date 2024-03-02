import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { connect, ConnectedProps } from 'react-redux';

import InfoScreen from './accountScreens/InfoScreen';
import { OrdersScreen } from './accountScreens/OrdersScreen';

type ReduxProps = ConnectedProps<typeof connector>;

const Tab = createBottomTabNavigator();

const AccountScreen = ({ route, setSelectedMode }: ReduxProps & any) => {
    const { userData } = route.params;

    useEffect(() => {
        setSelectedMode('Auth')
    }, [userData])

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelPosition: "beside-icon",
                tabBarLabelStyle: {
                    fontWeight: "700",
                    fontSize: 15,
                    color: '#c19858'
                },
                tabBarIconStyle: { display: "none" },
            }}
        >
            <Tab.Screen
                name="INFO"
                component={InfoScreen}
                initialParams={{ userData: userData }}
            />
            <Tab.Screen
                name="ORDERS"
                component={OrdersScreen}
                initialParams={{ userData: userData }}
            />
        </Tab.Navigator>
    );
};

const mapDispatchToProps = {};

const connector = connect(undefined, mapDispatchToProps);
const AccountScreenRedux = connector(AccountScreen);

export { AccountScreenRedux as AccountScreen };
