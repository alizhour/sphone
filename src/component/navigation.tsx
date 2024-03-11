import React from 'react'
import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native'

interface INavigation {
    setCurrentPage?: any,
    currentPage?: any,
    itemsData?: any,
    itemsPerPage?: any,
    endIndex?: any
}

export const Navigation = ({ setCurrentPage, currentPage, itemsData, itemsPerPage, endIndex }: INavigation) => {
    const styles = StyleSheet.create({
        container: {
            marginTop: -50,
            marginBottom: 100
        }
    });

    return (
        <View style={styles.container} >
            <TouchableOpacity
                onPress={() => setCurrentPage(currentPage + 1)}
                disabled={endIndex >= itemsData?.length}
                style={[
                    {
                        backgroundColor: endIndex >= itemsData?.length ? '#ccc' : '#c19858',
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 8,
                    },
                ]}
            >
                <Text
                    style={{
                        color: endIndex >= itemsData?.length ? '#888' : '#fff',
                        fontSize: 16,
                    }}
                >
                    التالي
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={[
                    {
                        backgroundColor: currentPage === 1 ? '#ccc' : '#c19858',
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 8,
                        marginTop: 16
                    },
                ]}
            >
                <Text
                    style={{
                        color: currentPage === 1 ? '#888' : '#fff',
                        fontSize: 16,
                    }}
                >
                    السابق
                </Text>
            </TouchableOpacity>
            <Text style={{ color: '#777', marginTop: 5, marginLeft: 5 }}>
                الصفحة {currentPage} من {Math.ceil(itemsData?.length / itemsPerPage)}
            </Text>
        </View >
    )
}

