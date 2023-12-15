import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { authorizationActions } from '../api/api.slice';
import { useNavigation } from '@react-navigation/native';
import Layouts from '../component/layouts';

type ReduxProps = ConnectedProps<typeof connector>;

const TipsScreen = ({ getAllTips, route }: ReduxProps & any) => {
    const { userData } = route.params;
    const navigation = useNavigation();
    const [allNewsData, setAllNewsData] = useState([]);

    const fetchData = async () => {
        const getAllNewsApi = await getAllTips();
        const getAllNewsRes = getAllNewsApi?.payload?.data?.tip;
        setAllNewsData(getAllNewsRes.reverse());
    }

    const handleCategoryPress = (category: any) => {
        // @ts-ignore
        navigation.navigate('Tip', { category });
    };

    const renderItem = ({ item }: any) => {
        const createdAgo = formatCreatedAt(item.created_at);

        return (
            <TouchableOpacity style={styles.newsItem} onPress={() => handleCategoryPress(item?.id)}>
                <Image
                    source={{ uri: `https://api.sultangold.net/public/${item.imagePath}` }}
                    style={styles.newsImage}
                />
                <View style={styles.newsInfo}>
                    <Text style={styles.newsTitle}>{item.title}</Text>
                    <Text style={styles.newsDate}>{createdAgo}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const formatCreatedAt = (createdAt: any) => {
        const currentDate = new Date() as any;
        const date = new Date(createdAt) as any;
        const elapsed = currentDate - date;
        const seconds = Math.floor(elapsed / 1000);
        if (seconds < 60) {
            return "الان";
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return `منذ ${minutes} دقيقة`;
        } else if (seconds < 86400) {
            const hours = Math.floor(seconds / 3600);
            return `منذ ${hours} ساعة`;
        } else {
            const days = Math.floor(seconds / 86400);
            return `منذ ${days} يوم`;
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                data={allNewsData}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    newsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#fff',
        marginTop: 5,
        borderRadius: 8,
        paddingRight: 15,
        overflow: 'hidden'
    },
    newsImage: {
        width: 100,
        height: 100,
        marginRight: 16,
    },
    newsInfo: {
        flex: 1,
    },
    newsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#555',
    },
    newsDate: {
        color: '#888',
    },
});

const mapDispatchToProps = {
    // getAllNews: authorizationActions?.getAllNews,
    getAllTips: authorizationActions?.getAllTips
};

const connector = connect(undefined, mapDispatchToProps);
const TipsScreenRedux = connector(TipsScreen);

export { TipsScreenRedux as TipsScreen };