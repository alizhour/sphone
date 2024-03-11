import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ScrollView, Text } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient';

import ImageSlider from '../component/imageSlider'
import { authorizationActions } from '../api/api.slice';
import { Snackbar } from 'react-native-paper';
import Layouts from '../component/layouts';

type ReduxProps = ConnectedProps<typeof connector>;

const ItemScreen = ({ addCart }: ReduxProps) => {
    const route = useRoute();
    const { item, userData } = route.params as any;

    const [images, setImages] = useState([]);
    const [visible, setVisible] = useState(false);

    const showSnackbar = () => {
        setVisible(true);
    };

    const hideSnackbar = () => {
        setVisible(false);
    };

    const fetchData = () => {
        const arr = [] as any;
        item?.images?.map((e: any) => {
            arr.push(`https://apii.test.sultangold.net/public${e?.imagePath}`)
        })
        setImages(arr)
    }

    const addItemToCart = async () => {
        const body = {
            token: userData?.access_token,
            data: { itemId: item?.id }
        }
        const addCartApi = await addCart(body);
        if (addCartApi?.payload?.status === 201) {
            showSnackbar()
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <ScrollView style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{item?.arabicName}</Text>
                <View style={styles.sliderContainer}>
                    {images.length < 1 ? (
                        <CategorySkeleton />
                    ) : (
                        <ImageSlider imageUrls={images} />
                    )}
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsValuePrice}>{item?.price} دينار</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsName}>الوزن:</Text>
                        <Text style={styles.detailsValue}>{item?.weight} غرام</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsName}>العيار:</Text>
                        <Text style={styles.detailsValue}>{item?.karat}K</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsName}>البلد:</Text>
                        <Text style={styles.detailsValue}>{item?.country}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsName}>الكود:</Text>
                        <Text style={styles.detailsValue}>{item?.code}</Text>
                    </View>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={[styles.detailsName]}>الوصف:</Text>
                    <Text style={[styles.description]}>
                        {item?.arabicDescription}
                    </Text>
                </View>
                {
                    userData ? (
                        <>
                            {item?.quantity > 0 ? (
                                <TouchableOpacity style={styles.actionContainer} onPress={() => { addItemToCart() }}>
                                    <Text style={styles.addToCardButton}>اضف الى السلة</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.actionContainer}>
                                    <Text style={styles.outOfStock}>انتهت الكمية</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <>
                            <View style={styles.actionContainerMargin}>
                            </View>
                        </>
                    )
                }
            </ScrollView>
            <Snackbar
                visible={visible}
                onDismiss={hideSnackbar}
                duration={2000}
                action={{
                    label: 'حسنا',
                    onPress: hideSnackbar,
                }}
            >
                تم اضافة المنتج للسلة!!
            </Snackbar>
        </>
    )
}

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const CategorySkeleton = () => {
    return (
        <>
            <View style={styles.skeleton}>
                <ShimmerPlaceholder style={styles.skeleton} />
            </View>
        </>
    )
}

const { width } = Dimensions.get('window');
const adjustedWidth = width - 30;

const styles = StyleSheet.create({
    sectionContainer: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 24,
        color: '#555',
        fontWeight: 'bold',
        lineHeight: 33,
        marginBottom: 0
    },
    sliderContainer: {
        marginTop: 30,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
        borderRadius: 8,
        width: adjustedWidth,
        height: adjustedWidth,
    },
    skeleton: {
        minWidth: '100%',
        height: '100%',
    },
    detailsContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginTop: 24,
        paddingLeft: 12,
        direction: 'rtl',
    },
    detailsRow: {
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: 12,
        color: '#555',
        marginBottom: 8,
        direction: 'rtl',
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
    detailsValuePrice: {
        fontSize: 20,
        color: '#c19858',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    descriptionContainer: {
        width: '100%',
        paddingLeft: 12
    },
    description: {
        color: '#555',
        lineHeight: 22,
        marginTop: 10,
        fontSize: 16,
        backgroundColor: '#ddd',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 12,
    },
    actionContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    actionContainerMargin: {
        marginBottom: 250
    },
    addToCardButton: {
        width: '90%',
        color: '#fff',
        backgroundColor: '#c19858',
        textAlign: 'center',
        marginVertical: 50,
        marginHorizontal: 'auto',
        paddingVertical: 10,
        borderRadius: 10
    },
    outOfStock: {
        width: '90%',
        color: '#fff',
        backgroundColor: '#DC3545',
        textAlign: 'center',
        marginVertical: 50,
        marginHorizontal: 'auto',
        paddingVertical: 10,
        borderRadius: 10
    }
});

const mapDispatchToProps = {
    addCart: authorizationActions?.addCart
};

const connector = connect(undefined, mapDispatchToProps);
const ItemScreenRedux = connector(ItemScreen);

export { ItemScreenRedux as ItemScreen };
