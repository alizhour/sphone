import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

const AuthStack = ({ setSelectedMode }) => {

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                setSelectedMode('App');
                return true; // Prevent default behavior (exiting the app)
            };

            // Add event listener for hardware back press
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [setSelectedMode])
    );

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
};

export default AuthStack;
