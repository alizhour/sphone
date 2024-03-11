import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

const InfoScreen = ({ route }: any) => {
    const { userData } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.infoItem}>
                <Text style={[styles.label, { color: '#c19858' }]}>First Name:</Text>
                <Text style={[styles.value, { color: '#555' }]}>{userData?.user?.firstName} </Text>
            </View>
            <View style={styles.infoItem}>
                <Text style={[styles.label, { color: '#c19858' }]}>Last Name:</Text>
                <Text style={[styles.value, { color: '#555' }]}>{userData?.user?.lastName}</Text>
            </View>
            <View style={styles.infoItem}>
                <Text style={[styles.label, { color: '#c19858' }]}>Email:</Text>
                <Text style={[styles.value, { color: '#555' }]}>{userData?.user?.email}</Text>
            </View>
            <View style={styles.infoItem}>
                <Text style={[styles.label, { color: '#c19858' }]}>Phone Number:</Text>
                <Text style={[styles.value, { color: '#555' }]}>{userData?.user?.phoneNumber}</Text>
            </View>
            <View style={styles.infoItem}>
                <Text style={[styles.label, { color: '#c19858' }]}>Civil Number:</Text>
                <Text style={[styles.value, { color: '#555' }]}>{userData?.user?.civilNumber}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f1f1f1',
    },
    infoItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    label: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 19
    },
    value: {
        flex: 2,
        fontSize: 19
    },
});

export default InfoScreen
