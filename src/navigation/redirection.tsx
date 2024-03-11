import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import AuthStack from './authStack';
import AppStack from './appStack';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

const Redirection = () => {
    const [selectedMode, setSelectedMode] = useState('loading')
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [userData, setUserData] = useState({});


    const someData = useSelector((state: any) => state?.api?.userData);

    useEffect(() => {
        setTimeout(() => {
            setLoadingComplete(true);
        }, 1500);
    }, []);

    useEffect(() => {
        console.log('someData========>', someData)
        setUserData(someData);
        setSelectedMode('App');
    }, [someData])

    useEffect(() => {
        console.log('selectedMode========>', selectedMode)
    }, [selectedMode])

    if (!loadingComplete) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#c19858" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {selectedMode === 'App' ? (
                <AppStack
                    userData={userData}
                    setSelectedMode={setSelectedMode}
                />
            ) : selectedMode === 'Auth' ? (
                <AuthStack
                    setSelectedMode={setSelectedMode}
                />
            ) : null}
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Redirection
