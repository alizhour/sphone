import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, Linking } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { StyleSheet } from 'react-native';
import { isEmpty } from 'lodash';
import { Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { authorizationActions } from '../api/api.slice';
import { calculateKaratForItems } from '../calculateKaratForItems';
import Layouts from '../component/layouts';

type ReduxProps = ConnectedProps<typeof connector>;

const CartScreen = ({ getCart, geItemById, getItemOncePriceLatest, geItemImagesById, route, removeCart }: ReduxProps & any) => {
    const { userData } = route.params;
    const navigation = useNavigation();

    const [cartData, setCartData] = useState<any>([]);
    const [cartTotal, setCartTotal] = useState<any>("0");
    const [visible, setVisible] = useState(false);

    const showSnackbar = () => {
        setVisible(true);
    };

    const hideSnackbar = () => {
        setVisible(false);
    };

    const fetchData = async () => {
        const getCartApi = await getCart(userData?.access_token);
        const getCartRes = getCartApi?.payload?.data?.cart;
        console.log('My getCartRes:', JSON.stringify(getCartRes, null, 2));

        const arr = [] as any;
        if (!isEmpty(getCartRes)) {
            await Promise.all(
                getCartRes?.map(async (e: any) => {
                    const geItemByIdApi = await geItemById(e?.item_id);
                    const geItemByIdRes = geItemByIdApi?.payload?.data?.item;

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

                    const geItemImagesByIdApi = await geItemImagesById(geItemByIdRes?.id)
                    console.log('My geItemImagesByIdApi:', JSON.stringify(geItemImagesByIdApi, null, 2));
                    geItemByIdRes.mainImage = geItemImagesByIdApi?.payload?.data?.itemImage?.[0]?.imagePath;
                    if (geItemByIdRes?.karat === 24) {
                        geItemByIdRes.price = (((parseFloat(pricesObj?.twentyFour) + geItemByIdRes?.profitPrice + geItemByIdRes?.handPrice) * geItemByIdRes?.weight))?.toFixed(3);
                        geItemByIdRes.initialPrice = (((parseFloat(pricesObj?.twentyFour) + geItemByIdRes?.profitPrice + geItemByIdRes?.handPrice) * geItemByIdRes?.weight))?.toFixed(3);
                    }
                    if (geItemByIdRes?.karat === 22) {
                        geItemByIdRes.price = (((parseFloat(pricesObj?.twentyTwo) + geItemByIdRes?.profitPrice + geItemByIdRes?.handPrice) * geItemByIdRes?.weight))?.toFixed(3);
                        geItemByIdRes.initialPrice = (((parseFloat(pricesObj?.twentyTwo) + geItemByIdRes?.profitPrice + geItemByIdRes?.handPrice) * geItemByIdRes?.weight))?.toFixed(3);
                    }
                    if (geItemByIdRes?.karat === 21) {
                        geItemByIdRes.price = (((parseFloat(pricesObj?.twentyOne) + geItemByIdRes?.profitPrice + geItemByIdRes?.handPrice) * geItemByIdRes?.weight))?.toFixed(3);
                        geItemByIdRes.initialPrice = (((parseFloat(pricesObj?.twentyOne) + geItemByIdRes?.profitPrice + geItemByIdRes?.handPrice) * geItemByIdRes?.weight))?.toFixed(3);
                    }
                    if (geItemByIdRes?.karat === 18) {
                        geItemByIdRes.price = (((parseFloat(pricesObj?.eightTeen) + geItemByIdRes?.profitPrice + geItemByIdRes?.handPrice) * geItemByIdRes?.weight))?.toFixed(3);
                        geItemByIdRes.initialPrice = (((parseFloat(pricesObj?.eightTeen) + geItemByIdRes?.profitPrice + geItemByIdRes?.handPrice) * geItemByIdRes?.weight))?.toFixed(3);
                    }

                    geItemByIdRes.cartId = e?.id;
                    geItemByIdRes.UUID = e?.id;
                    geItemByIdRes.quantitySelected = 1;
                    if (geItemByIdRes?.quantity > 0) {
                        arr.push(geItemByIdRes)
                    }
                })
            );
            let total = 0;
            arr?.map((e: any) => {
                total = parseFloat(e?.price) + total;

                return undefined;
            })
            const totalFixed = (total).toFixed(3);
            setCartTotal(totalFixed)
            setCartData(arr)
            console.log(arr)
        }
        else {
            setCartTotal("0.000")
        }
    }

    const removeFromCart = async (id: any) => {
        const token = userData?.access_token;
        const body = { id, token }
        const removeCartApi = await removeCart(body);
        if (removeCartApi?.payload?.status === 200) {
            showSnackbar();
            fetchData();
        }
    }

    const QuantityInput = ({ quantity, onDecrease, onIncrease }: any) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity onPress={onDecrease}>
                    <Text style={{ fontSize: 25, color: '#c19858' }}>-</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16, marginHorizontal: 10, color: '#555' }}>{quantity}</Text>
                <TouchableOpacity onPress={onIncrease}>
                    <Text style={{ fontSize: 25, color: '#c19858' }}>+</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const updateQuantity = (itemId: any, symbol: any) => {
        const updatedCartData = cartData.map((item: any) => {
            if (item.id === itemId) {
                if (symbol === '+') {
                    return { ...item, quantitySelected: item?.quantitySelected + 1 };
                }
                if (symbol === 'minus') {
                    return { ...item, quantitySelected: item?.quantitySelected - 1 };
                }
            }

            return item;
        });
        setCartData(updatedCartData);
    };
    // totalPrice = totalPrice + (item?.price * item?.quantitySelected);

    const calculateCartTotal = () => {
        let total = 0;
        for (const item of cartData) {
            total += item.price * item.quantitySelected;
        }
        return total;
    };

    // Whenever the cartData changes, update the cartTotal
    useEffect(() => {
        const total = calculateCartTotal();
        setCartTotal(total);
    }, [cartData]);

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <ScrollView style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                    Cart
                </Text>
                {cartData.length > 0 ? (
                    <View style={styles.cardItems}>
                        {cartData?.map((e: any, index: any) => (
                            <>
                                <View style={styles.cardItem} key={index}>
                                    <Image
                                        source={{ uri: `https://api.sultangold.net/public/${e.mainImage}` }}
                                        style={styles.itemImage}
                                    />
                                    <Text style={styles.detailsName}>{e.englishName}</Text>
                                    <View style={styles.detailsRow}>
                                        <Text style={styles.detailsName}>Weight:</Text>
                                        <Text style={styles.detailsValue}>{e.weight.toFixed(2)} Gram</Text>
                                    </View>
                                    <View style={styles.detailsRow}>
                                        <Text style={styles.detailsName}>Karat:</Text>
                                        <Text style={styles.detailsValue}>{e.karat}K</Text>
                                    </View>
                                    <QuantityInput
                                        quantity={e.quantitySelected}
                                        onDecrease={() => {
                                            if (e.quantitySelected > 1) {
                                                updateQuantity(e.id, 'minus');
                                            }
                                        }}
                                        onIncrease={() => updateQuantity(e.id, '+')}
                                    />
                                    <Text style={styles.removeButton}>{e?.price * e?.quantitySelected} KWD</Text>
                                    <Text style={styles.removeButtonRed} onPress={() => { removeFromCart(e?.cartId) }}>Remove</Text>
                                </View>
                            </>
                        ))}
                        <View style={styles.detailsRowTotal}>
                            <Text style={styles.detailsNameTotal}>Total:</Text>
                            <Text style={styles.detailsValueTotal}>{cartTotal} KWD</Text>
                        </View>
                        <Text style={styles.note}>NOTE: We will redirect you to our website to complete the paying process.All this process are secure!</Text>
                        <TouchableOpacity onPress={() => {
                            Linking.openURL(`https://www.sultangold.net/paying/${userData?.access_token}`);
                        }}>
                            <Text style={styles.detailsValueCheckout}>
                                CHECKOUT
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View >
                        <Text style={styles.detailsValueTotal}>Cart Empty!</Text>
                    </View>
                )}
            </ScrollView >
            <Snackbar
                visible={visible}
                onDismiss={hideSnackbar}
                duration={2000}
                action={{
                    label: 'Dismiss',
                    onPress: hideSnackbar,
                }}
            >
                Item Removed from your cart
            </Snackbar>
        </>
    );
}

const { width } = Dimensions.get('window');
const newWidth = width / 2;

const styles = StyleSheet.create({
    sectionContainer: {
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 24,
        color: '#555',
        fontWeight: 'bold',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        paddingBottom: 12
    },
    cardItems: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 100
    },
    note: {
        color: '#c19858',
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 24
    },
    cardItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: newWidth,
        height: 'auto',
        paddingBottom: 16,
        gap: 16,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        marginTop: 16
    },
    ItemImageContainer: {
        width: '100%',
        height: 'auto',

    },
    itemImage: {
        width: newWidth,
        minHeight: newWidth,
    },
    detailsRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        color: '#555',
        marginBottom: -7
    },
    detailsRowTotal: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        color: '#555',
        marginTop: 20
    },
    detailsNameTotal: {
        color: '#555',
        fontSize: 20,
        fontWeight: 'bold'
    },
    detailsValueTotal: {
        color: '#c19858',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 25
    },
    detailsName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555'
    },
    detailsValue: {
        fontSize: 16,
        color: '#555'
    },
    removeButton: {
        color: '#c19858',
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    removeButtonRed: {
        color: '#d9534f',
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    detailsValueCheckout: {
        backgroundColor: '#c19858',
        color: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
        fontWeight: 'bold',
        marginVertical: 16
    }
});


const mapDispatchToProps = {
    getCart: authorizationActions?.getCart,
    geItemById: authorizationActions?.geItemById,
    getItemOncePriceLatest: authorizationActions?.getItemOncePriceLatest,
    geItemImagesById: authorizationActions?.geItemImagesById,
    removeCart: authorizationActions?.removeCart
};

const connector = connect(undefined, mapDispatchToProps);
const CartScreenRedux = connector(CartScreen);

export { CartScreenRedux as CartScreen };