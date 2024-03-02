import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import { authorizationActions } from '../api/api.slice';
import Layouts from '../component/layouts';

type ReduxProps = ConnectedProps<typeof connector>;

const TipScreen = ({ getTipById, getAllTipsCategoryById, getTipArticleById, route }: ReduxProps & any) => {
    const routeParam = useRoute();
    const { userData } = route.params;
    const navigation = useNavigation();
    const { category } = routeParam.params as any;

    const [newData, setNewData] = useState<any>([]);
    const [newArticleData, setNewArticleData] = useState<any>([]);
    const [categoryData, setCategoryData] = useState<any>("");

    function convertToCustomFormat(dateString: any) {
        const dateObject = new Date(dateString);

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const day = String(dateObject.getDate()).padStart(2, '0');
        const hours = String(dateObject.getHours()).padStart(2, '0');
        const minutes = String(dateObject.getMinutes()).padStart(2, '0');
        const seconds = String(dateObject.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const fetchData = async () => {
        const getTipByIdApi = await getTipById(category);
        console.log(getTipByIdApi?.payload?.data?.tip)
        setNewData(
            {
                ...getTipByIdApi?.payload?.data?.tip,
                date: convertToCustomFormat(getTipByIdApi?.payload?.data?.tip?.created_at)
            });
        const getAllTipsCategoryByIdApi = await getAllTipsCategoryById(getTipByIdApi?.payload?.data?.tip?.categoryId)
        setCategoryData(getAllTipsCategoryByIdApi?.payload?.data?.category?.arabicName)
        const getTipArticleByIdApi = await getTipArticleById(category);
        setNewArticleData(getTipArticleByIdApi?.payload?.data?.tipArticles)
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{newData?.title}</Text>
            <Text style={styles.publishDate}>{newData?.date}</Text>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: `https://apii.test.sultangold.net/public${newData?.imagePath}` }}
                    style={styles.newImage}
                />
            </View>
            {newArticleData
                ?.sort((a: any, b: any) => a.contentOrder - b.contentOrder) // Sort the array based on contentOrder
                .map((e: any, index: any) => {
                    return (
                        <View style={styles.newArticle} key={index}>
                            <Text style={styles.newArticleTitle}>{e?.subTitle}</Text>
                            <Text style={styles.newArticleText}>{e?.content}</Text>
                        </View>
                    );
                })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
        marginTop: 0,
    },
    publishDate: {
        color: '#6e7690',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'right'
    },
    imageContainer: {
        width: '100%',
        height: 300,
        marginTop: 24,
        overflow: 'hidden',
        borderRadius: 12

    },
    newImage: {
        width: '100%',
        height: 300,
    },
    newArticle: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginVertical: 60
    },
    newArticleTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
    },
    newArticleText: {
        fontSize: 20,
        color: '#222',
        marginTop: 24
    },


});

const mapDispatchToProps = {
    getTipById: authorizationActions?.getTipById,
    getAllTipsCategoryById: authorizationActions?.getAllTipsCategoryById,
    getTipArticleById: authorizationActions?.getTipArticleById
};

const connector = connect(undefined, mapDispatchToProps);
const TipScreenRedux = connector(TipScreen);

export { TipScreenRedux as TipScreen };