import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useFormik } from 'formik';
import { connect, ConnectedProps } from 'react-redux';
import axios from 'axios';

import InputField from '../component/InputField';
import { authorizationActions } from '../api/api.slice';
import { isEmpty } from 'lodash';
import { calculateKaratForItems } from '../calculateKaratForItems';

type ReduxProps = ConnectedProps<typeof connector>;

const CheckoutScreen = ({ route, getCart, geItemById, getItemOncePriceLatest, setSelectedMode }: ReduxProps & any) => {
    const { userData } = route.params;

    const [cartData, setCartData] = useState<any>([]);
    const [cartTotal, setCartTotal] = useState<any>("0");


    const formik = useFormik({
        initialValues: {
            address: '',
            phoneNumber: '',
            note: '',
        },
        onSubmit: async (values) => {
            console.log(values)
        },
    });

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

    const calculateCartTotal = () => {
        let total = 0;
        for (const item of cartData) {
            total += item.price * item.quantitySelected;
        }
        return total;
    };

    const makeApiCall = async () => {
        Linking.openURL(`https://www.sultangold.net/paying/${userData?.access_token}`);
    };

    useEffect(() => {
        const total = calculateCartTotal();
        setCartTotal(total);
    }, [cartData]);

    useEffect(() => {
        if (!userData) {
            setSelectedMode('Auth')
        } else {
            fetchData()
        }
    }, [userData])

    return (
        <ScrollView
            style={styles.sectionContainer}
        >
            <Text style={styles.title}>Pay Process</Text>
            {/* <View style={styles.paper}>
                <InputField
                    label={'Address'}
                    keyboardType="address"
                    onChangeText={formik.handleChange('address')}
                    onBlur={formik.handleBlur('address')}
                    value={formik.values.address}
                />
                <InputField
                    label={'Phone Number'}
                    keyboardType="phoneNumber"
                    onChangeText={formik.handleChange('phoneNumber')}
                    onBlur={formik.handleBlur('phoneNumber')}
                    value={formik.values.phoneNumber}
                />
                <InputField
                    label={'Notes'}
                    keyboardType="note"
                    onChangeText={formik.handleChange('note')}
                    onBlur={formik.handleBlur('note')}
                    value={formik.values.note}
                />
            </View> */}
            <View style={styles.detail}>
                <Text style={styles.price}>Subtotal: {cartTotal}KWD</Text>
                <Text style={styles.price}>Delivery Charge: {5}KWD</Text>
                <Text style={styles.total}>Total: {cartTotal + 5}KWD</Text>
                <Text style={styles.note}>NOTE: We will redirect you to our website to complete the paying process.</Text>
            </View>
            <TouchableOpacity style={styles.payContainer}>
                <Text style={styles.pay} onPress={() => { makeApiCall() }}>PAY NOW</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#555',
    },
    paper: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#c19858',
        borderRadius: 12,
        backgroundColor: '#fff'
    },
    detail: {
        marginTop: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        paddingHorizontal: 10
    },
    price: {
        color: '#555',
        fontWeight: 'bold',
        fontSize: 18
    },
    total: {
        color: '#c19858',
        fontWeight: 'bold',
        fontSize: 18
    },
    note: {
        color: 'red',
        fontSize: 16
    },
    payContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24
    },
    pay: {
        color: '#fff',
        backgroundColor: '#c19858',
        fontSize: 22,
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 12

    }
})

const mapDispatchToProps = {
    getCart: authorizationActions?.getCart,
    geItemById: authorizationActions?.geItemById,
    getItemOncePriceLatest: authorizationActions?.getItemOncePriceLatest,
    geItemImagesById: authorizationActions?.geItemImagesById,
    removeCart: authorizationActions?.removeCart
};

const connector = connect(undefined, mapDispatchToProps);
const CheckoutScreenRedux = connector(CheckoutScreen);

export { CheckoutScreenRedux as CheckoutScreen };