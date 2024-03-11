import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { connect, ConnectedProps } from 'react-redux';
import { isEmpty } from 'lodash';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { Navigation } from '../component/navigation'
import { calculateKaratForItems } from '../calculateKaratForItems';
import { authorizationActions } from '../api/api.slice';
import Layouts from '../component/layouts';

type ReduxProps = ConnectedProps<typeof connector>;

const CategoryScreen = ({ getItemByCategoryId, getItemOncePriceLatest, route }: ReduxProps & any) => {
    const routeParam = useRoute();
    const navigation = useNavigation();
    const { userData } = route.params;
    const { category } = routeParam.params as any;
    const [itemsData, setItemsData] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = itemsData?.slice(startIndex, endIndex);

    const fetchData = async () => {
        const getItemByCategoryIdApi = await getItemByCategoryId(category?.id);
        const getItemByCategoryIdRes = getItemByCategoryIdApi?.payload?.data?.items;

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
        if (getItemByCategoryIdRes) {
            const itemPromises = getItemByCategoryIdRes?.map(async (item: any) => {
                item.mainImage = item?.images?.[0]?.imagePath;
                if (!isEmpty(item?.images?.[1])) {
                    item.secondImage = item?.images?.[1]?.imagePath;
                }
                else {
                    item.secondImage = item?.images?.[0]?.imagePath;
                }
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

                return item;
            });
            const itemsData = await Promise?.all(itemPromises);
            setItemsData(itemsData);
        }
    }

    const handleCategoryPress = (item: any) => {
        // @ts-ignore
        navigation.navigate('Item', { item });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ScrollView style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{category?.arabicName}</Text>
            <View style={styles.itemsContainer}>
                {itemsData?.length === 0 ? (
                    <CategorySkeleton />
                ) : (
                    itemsToDisplay?.map((e: any, i: any) => {
                        return (
                            <TouchableOpacity key={i} style={styles.item} onPress={() => handleCategoryPress(e)} >
                                <Image
                                    source={{ uri: `https://apii.test.sultangold.net/public${e?.mainImage}` }}
                                    style={styles.itemImage}
                                />
                                <Text style={styles.itemPrice}>{e?.price} KWD</Text>
                            </TouchableOpacity>
                        );
                    }))}
            </View>
            {itemsData?.length > 10 && (
                <Navigation
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    itemsData={itemsData}
                    itemsPerPage={itemsPerPage}
                    endIndex={endIndex}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 24,
        color: '#555',
        fontWeight: 'bold',
        lineHeight: 33
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
    item: {
        borderWidth: 1,
        borderColor: '#c19858',
        width: '45%',
        marginRight: '2%',
        height: 190,
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
        fontWeight: '400',
        marginVertical: 8
    },
    CategorySkelelaton: {
        borderWidth: 1,
        borderColor: '#ddd',
        width: '45%',
        marginRight: '2%',
        height: 190,
        borderRadius: 16,
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginTop: 10
    },
    CategoryImageSkelelaton: {
        width: '100%',
        height: 180,
    },
})

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

const CategorySkeleton = () => {
    return (
        <>
            <View style={styles.CategorySkelelaton}>
                <ShimmerPlaceholder
                    style={styles.CategoryImageSkelelaton}
                />
            </View>
            <View style={styles.CategorySkelelaton}>
                <ShimmerPlaceholder
                    style={styles.CategoryImageSkelelaton}
                />
            </View>
            <View style={styles.CategorySkelelaton}>
                <ShimmerPlaceholder
                    style={styles.CategoryImageSkelelaton}
                />
            </View>
            <View style={styles.CategorySkelelaton}>
                <ShimmerPlaceholder
                    style={styles.CategoryImageSkelelaton}
                />
            </View>
            <View style={styles.CategorySkelelaton}>
                <ShimmerPlaceholder
                    style={styles.CategoryImageSkelelaton}
                />
            </View>
            <View style={styles.CategorySkelelaton}>
                <ShimmerPlaceholder
                    style={styles.CategoryImageSkelelaton}
                />
            </View>
            <View style={styles.CategorySkelelaton}>
                <ShimmerPlaceholder
                    style={styles.CategoryImageSkelelaton}
                />
            </View>
            <View style={styles.CategorySkelelaton}>
                <ShimmerPlaceholder
                    style={styles.CategoryImageSkelelaton}
                />
            </View>
            <View style={styles.CategorySkelelaton}>
                <ShimmerPlaceholder
                    style={styles.CategoryImageSkelelaton}
                />
            </View>
        </>
    );
};

const mapDispatchToProps = {
    getCategoryById: authorizationActions?.getCategoryById,
    getItemByCategoryId: authorizationActions?.getItemByCategoryId,
    getItemOncePriceLatest: authorizationActions?.getItemOncePriceLatest
};

const connector = connect(undefined, mapDispatchToProps);
const CategoryScreenRedux = connector(CategoryScreen);

export { CategoryScreenRedux as CategoryScreen };
