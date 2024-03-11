import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { authorizationActions } from '../api/api.slice';
import { calculateKarat } from '../calculateKaratForItems';
import { DateTime } from 'luxon';
import Layouts from '../component/layouts';
import { RefreshControl } from 'react-native';

type ReduxProps = ConnectedProps<typeof connector>;

const GoldScreen = ({ getInternationalGoldPriceLatest, route }: ReduxProps & any) => {
    const { userData } = route.params;
    const [goldInternationalPrice, setGoldInternationalPrice] = useState<any>();
    const [goldInternationalPriceKwd, setGoldInternationalPriceKwd] = useState<any>();
    const [refreshing, setRefreshing] = useState(false);

    const fetchPrice = async () => {
        const getInternationalGoldPriceLatestApi = await getInternationalGoldPriceLatest();
        const getInternationalGoldPriceLatestRes = getInternationalGoldPriceLatestApi?.payload?.data?.goldPrices;
        const res = calculateKarat(getInternationalGoldPriceLatestRes?.price);
        const newObj = {} as any;
        newObj.created_at = getInternationalGoldPriceLatestRes?.created_at;
        newObj.price = getInternationalGoldPriceLatestRes?.price;
        newObj.twentyFour = res?.twentyFour;
        newObj.twentyTwo = res?.twentyTwo;
        newObj.twentyOne = res?.twentyOne;
        newObj.eightTeen = res?.eightTeen;
        newObj.high_price = getInternationalGoldPriceLatestRes?.high_price;
        newObj.low_price = getInternationalGoldPriceLatestRes?.low_price;
        newObj.open_price = getInternationalGoldPriceLatestRes?.open_price;

        const dateString = getInternationalGoldPriceLatestRes?.created_at;
        const dt = DateTime.fromSQL(dateString).plus({ hours: 3 });
        const newDateString = dt.toFormat("yyyy-MM-dd HH:mm");
        newObj.update = newDateString;
        setGoldInternationalPrice(newObj);

        const kwd = getInternationalGoldPriceLatestRes?.kwdPrice;
        const kwdOnce = getInternationalGoldPriceLatestRes?.price;
        const additionalKwd = getInternationalGoldPriceLatestRes?.additionalOnce * kwd;
        const totalOnce = kwdOnce + additionalKwd;
        const resKwd = calculateKarat(totalOnce);
        const newObjKwd = {} as any;
        newObjKwd.kwdPrice = kwd;
        newObjKwd.created_at = getInternationalGoldPriceLatestRes?.created_at;
        newObjKwd.price = (totalOnce as any / kwd).toFixed(3);
        newObjKwd.twentyFour = (resKwd?.twentyFour as any / kwd).toFixed(3);
        newObjKwd.twentyTwo = (resKwd?.twentyTwo as any / kwd).toFixed(3);
        newObjKwd.twentyOne = (resKwd?.twentyOne as any / kwd).toFixed(3);
        newObjKwd.eightTeen = (resKwd?.eightTeen as any / kwd).toFixed(3);
        setGoldInternationalPriceKwd(newObjKwd);
    }

    useEffect(() => {
        fetchPrice();
        const intervalId = setInterval(() => {
            fetchPrice()
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPrice();
        setRefreshing(false);
    };

    return (
        <ScrollView
            style={styles.sectionContainer}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <Text style={styles.sectionTitle}>أسعار الذهب</Text>
            <View style={styles.CategoriesContainer}>
                <View style={styles.priceBoxTime}>
                    <Text style={styles.priceBoxTimeTitle}>آخر تحديث</Text>
                    <Text style={styles.priceBoxTimeValue}>{goldInternationalPrice?.update}</Text>
                </View>
                <View style={styles.flexPrice}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceContainerTitle}>دينار</Text>
                        <View style={styles.priceBox}>
                            <Text style={styles.priceBoxTitle}>سعر الأونصة: </Text>
                            <Text style={styles.priceBoxValue}>{goldInternationalPriceKwd?.price} دينار</Text>
                        </View>
                        <View style={styles.priceBox}>
                            <Text style={styles.priceBoxTitle}>سعر عيار 24 قيراط: </Text>
                            <Text style={styles.priceBoxValue}>{goldInternationalPriceKwd?.twentyFour} دينار</Text>
                        </View>
                        <View style={styles.priceBox}>
                            <Text style={styles.priceBoxTitle}>سعر عيار 22 قيراط: </Text>
                            <Text style={styles.priceBoxValue}>{goldInternationalPriceKwd?.twentyTwo} دينار</Text>
                        </View>
                        <View style={styles.priceBox}>
                            <Text style={styles.priceBoxTitle}>سعر عيار 21 قيراط: </Text>
                            <Text style={styles.priceBoxValue}>{goldInternationalPriceKwd?.twentyOne} دينار</Text>
                        </View>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceContainerTitle}>دولار</Text>
                        <View style={styles.priceBox}>
                            <Text style={styles.priceBoxTitle}>سعر الأونصة: </Text>
                            <Text style={styles.priceBoxValue}>{goldInternationalPrice?.price} دولار</Text>
                        </View>
                        <View style={styles.priceBox}>
                            <Text style={styles.priceBoxTitle}>سعر الافتتاح: </Text>
                            <Text style={styles.priceBoxValue}>{goldInternationalPrice?.open_price} دولار</Text>
                        </View>
                        <View style={styles.priceBox}>
                            <Text style={styles.priceBoxTitle}>أعلى سعر:</Text>
                            <Text style={styles.priceBoxValue}>{goldInternationalPrice?.high_price} دولار</Text>
                        </View>
                        <View style={styles.priceBox}>
                            <Text style={styles.priceBoxTitle}>أدنى سعر: </Text>
                            <Text style={styles.priceBoxValue}>{goldInternationalPrice?.low_price} دولار</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 24,
        color: '#555',
        fontWeight: 'bold'
    },
    CategoriesContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: 12,
        flexWrap: 'wrap',
        marginTop: 30,
        marginBottom: 100,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        borderColor: '#ddd',
        borderWidth: 1,
        direction: 'rtl'

    },
    priceBoxTime: {
        flexDirection: 'row-reverse',
        marginTop: 20,
    },
    priceBoxTimeTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#646464',
    },
    priceBoxTimeValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#646464',
    },
    flexPrice: {
        flexDirection: 'column',
        gap: 20,
    },
    priceContainer: {
        width: '100%',
        flexDirection: 'column',
    },
    priceBox: {
        flexDirection: 'row-reverse',
        gap: 10,
        marginTop: 20,
    },
    priceBoxTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#555',
    },
    priceBoxValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#c6a166',
    },
    priceContainerTitle: {
        fontSize: 18,
        marginTop: 20,
        fontWeight: 'bold',
        color: '#c6a166',
    },

})

const mapDispatchToProps = {
    getInternationalGoldPriceLatest: authorizationActions?.getInternationalGoldPriceLatest,
};

const connector = connect(undefined, mapDispatchToProps);
const GoldScreenRedux = connector(GoldScreen);

export { GoldScreenRedux as GoldScreen };