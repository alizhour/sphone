import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { authorizationActions } from '../api/api.slice';
import { calculateKaratForItems } from '../calculateKaratForItems';
import { useNavigation } from '@react-navigation/native';
import Layouts from '../component/layouts';

type ReduxProps = ConnectedProps<typeof connector>;

const OffersScreen = ({ getOfferItem, getItemOncePriceLatest, route }: ReduxProps & any) => {
    const { userData } = route.params;
    const navigation = useNavigation();
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [itemsData, setItemsData] = useState([]);

    const fetchPrice = async () => {
        const getOfferItemApi = await getOfferItem();
        const getOfferItemRes = getOfferItemApi?.payload?.data?.items;

        const getItemOncePriceLatestApi = await getItemOncePriceLatest();
        const getItemOncePriceRes = getItemOncePriceLatestApi?.payload?.data?.goldPrices;
        const res = calculateKaratForItems(getItemOncePriceRes?.price, getItemOncePriceRes?.commission);
        const kwd = getItemOncePriceRes?.kwd;
        const pricesObj = {} as any;
        pricesObj.kwdPrice = kwd;
        pricesObj.created_at = getItemOncePriceRes?.created_at;
        pricesObj.price = (getItemOncePriceRes?.price as any / kwd).toFixed(3);
        pricesObj.twentyFour = (res?.twentyFour as any / kwd).toFixed(3);
        pricesObj.twentyTwo = (res?.twentyTwo as any / kwd).toFixed(3);
        pricesObj.twentyOne = (res?.twentyOne as any / kwd).toFixed(3);
        pricesObj.eightTeen = (res?.eightTeen as any / kwd).toFixed(3);

        const finalArr = [] as any;
        getOfferItemRes?.map(async (item: any) => {
            //Set Images
            item.mainImage = item?.images?.[0]?.imagePath;
            if (!isEmpty(item?.images?.[1])) {
                item.secondImage = item?.images?.[1]?.imagePath;
            }
            else {
                item.secondImage = item?.images?.[0]?.imagePath;
            }
            //Set Price
            // after
            if (item?.karat === 24) {
                item.price = (((parseFloat(pricesObj?.twentyFour) + item?.profitPrice + item?.handPrice) * item?.weight))?.toFixed(3);
            }
            if (item?.karat === 22) {
                item.price = (((parseFloat(pricesObj?.twentyTwo) + item?.profitPrice + item?.handPrice) * item?.weight))?.toFixed(3);
            }
            if (item?.karat === 21) {
                item.price = (((parseFloat(pricesObj?.twentyOne) + item?.profitPrice + item?.handPrice) * item?.weight))?.toFixed(3);
            }
            if (item?.karat === 18) {
                item.price = (((parseFloat(pricesObj?.eightTeen) + item?.profitPrice + item?.handPrice) * item?.weight))?.toFixed(3);
            }
            // before
            if (item?.karat === 24) {
                item.offerPrice = (((parseFloat(pricesObj?.twentyFour) + item?.profitPrice + item?.handPrice - item?.offerPrice) * item?.weight))?.toFixed(3);
            }
            if (item?.karat === 22) {
                item.offerPrice = (((parseFloat(pricesObj?.twentyTwo) + item?.profitPrice + item?.handPrice - item?.offerPrice) * item?.weight))?.toFixed(3);
            }
            if (item?.karat === 21) {
                item.offerPrice = (((parseFloat(pricesObj?.twentyOne) + item?.profitPrice + item?.handPrice - item?.offerPrice) * item?.weight))?.toFixed(3);
            }
            if (item?.karat === 18) {
                item.offerPrice = (((parseFloat(pricesObj?.eightTeen) + item?.profitPrice + item?.handPrice - item?.offerPrice) * item?.weight))?.toFixed(3);
            }
            finalArr.push(item)
            return undefined;
        })

        setItemsData(finalArr);
    }

    useEffect(() => {
        fetchPrice();
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    function calculateTimeLeft() {
        const now = new Date() as any;
        const midnight = new Date() as any;
        midnight.setHours(24, 0, 0, 0);

        const timeDifference = midnight - now;
        const hours = Math.floor(timeDifference / 3600000);
        const minutes = Math.floor((timeDifference % 3600000) / 60000);
        const seconds = Math.floor((timeDifference % 60000) / 1000);

        return { hours, minutes, seconds };
    }

    const handleCategoryPress = (item: any) => {
        // @ts-ignore
        navigation.navigate('Item', { item });
    };

    return (
        <ScrollView style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>العروضات</Text>
            <View style={styles.container}>
                <Text style={styles.timerTitle}>الكمية محدودة! و العرض قد ينتهي بعد:</Text>
                <Text style={styles.timerText}>
                    {timeLeft.hours.toString().padStart(2, '0')}:
                    {timeLeft.minutes.toString().padStart(2, '0')}:
                    {timeLeft.seconds.toString().padStart(2, '0')}
                </Text>
            </View>
            <View style={styles.itemsContainer}>
                {itemsData?.map((e: any, i: any) => {
                    return (
                        <TouchableOpacity key={i} style={styles.item} onPress={() => handleCategoryPress(e)} >
                            <Image
                                source={{ uri: `https://apii.test.sultangold.net/public${e?.mainImage}` }}
                                style={styles.itemImage}
                            />
                            <View style={styles.containerLine}>
                                <Text style={styles.underlinedText}>{e?.price} دينار</Text>
                                <View style={styles.line}></View>
                            </View>
                            <Text style={styles.itemPrice}>{e?.offerPrice} دينار</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    containerLine: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    underlinedText: {
        fontSize: 20,
        color: 'gray',
        marginLeft: 12,
        fontWeight: 'bold',
        marginVertical: 8,

    },
    line: {
        backgroundColor: 'gray',
        height: 2,
        width: '100%',
        position: 'absolute',
        top: '50%',
    },
    itemsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        marginTop: 30,
        marginBottom: 100,
    },
    sectionContainer: {
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 24,
        color: '#555',
        fontWeight: 'bold'
    },
    container: {
        backgroundColor: '#c6a166',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 10,
        marginTop: 20
    },
    timerTitle: {
        color: 'white',
        fontSize: 18,
    },
    timerText: {
        fontSize: 36,
        color: 'white',
    },
    item: {
        borderWidth: 1,
        borderColor: '#c19858',
        width: '45%',
        marginRight: '2%',
        height: 250,
        borderRadius: 16,
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginTop: 10
    },
    itemImage: {
        width: '100%',
        height: 150
    },
    itemPrice: {
        fontSize: 20,
        color: '#c19858',
        marginLeft: 12,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    itemOldPrice: {
        fontSize: 20,
        color: 'gray',
        marginLeft: 12,
        fontWeight: 'bold',
        marginVertical: 8,
    },
})

const mapDispatchToProps = {
    getOfferItem: authorizationActions?.getOfferItem,
    getItemOncePriceLatest: authorizationActions?.getItemOncePriceLatest
};

const connector = connect(undefined, mapDispatchToProps);
const OffersScreenRedux = connector(OffersScreen);

export { OffersScreenRedux as OffersScreen };