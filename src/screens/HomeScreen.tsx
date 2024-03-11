// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { authorizationActions } from '../api/api.slice';
import { calculateKarat } from '../calculateKaratForItems';
import { useNavigation } from '@react-navigation/native';
import { calculateKaratForItems } from '../calculateKaratForItems';
import { isEmpty } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import Layouts from '../component/layouts';
import { Navigation } from '../component/navigation';
import { RefreshControl } from 'react-native';
import Slider from './HomeAtom';

type ReduxProps = ConnectedProps<typeof connector>;

const PricesSection = ({ oncePrice, price24K, price22K, price21K }: any) => {
    return (
        <View style={styles.secondSection}>
            <Text style={styles.secondSectionText}>
                <Text style={styles.priceLabel}>سعر الأونصة بالدينار:</Text> {oncePrice} دينار
            </Text>
            <Text style={styles.secondSectionText}>
                <Text style={styles.priceLabel}>سعر عيار 24 قيراط: </Text> {price24K} دينار
            </Text>
            <Text style={styles.secondSectionText}>
                <Text style={styles.priceLabel}>سعر عيار 22 قيراط: </Text> {price22K} دينار
            </Text>
            <Text style={styles.secondSectionText}>
                <Text style={styles.priceLabel}>سعر عيار 21 قيراط: </Text> {price21K} دينار
            </Text>
        </View>
    );
};

const HomeScreen = ({ getAllCategories, getInternationalGoldPriceLatest, getAllItems, getItemOncePriceLatest, route, getAllSlider }: ReduxProps & any) => {
    const navigation = useNavigation();
    const { userData } = route.params;

    const [refreshing, setRefreshing] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [itemData, setItemData] = useState<any>([]);
    const [goldInternationalPriceKwd, setGoldInternationalPriceKwd] = useState<any>();
    const [currentPage, setCurrentPage] = useState(1);
    const [sliders, setSliders] = useState([]);
    const itemsPerPage = 10;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = itemData?.slice(startIndex, endIndex);

    const fetchPrice = async () => {
        const getInternationalGoldPriceLatestApi = await getInternationalGoldPriceLatest();
        const getInternationalGoldPriceLatestRes = getInternationalGoldPriceLatestApi?.payload?.data?.goldPrices;
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

    const fetchData = async () => {
        const getAllSliderApi = await getAllSlider();
        setSliders(getAllSliderApi?.payload?.data?.sliders)

        const getAllCategoriesApi = await getAllCategories();
        const getAllCategoriesRes = getAllCategoriesApi?.payload?.data?.categories;
        const categoryArr = [] as any;
        getAllCategoriesRes?.map((e: any, index: any) => {
            const newObj = {} as any;
            newObj.id = e?.id;
            newObj.name = e?.arabicName;
            newObj.englishName = e?.englishName;
            newObj.imagePath = `https://apii.test.sultangold.net/public${e?.imagePath}`;

            categoryArr.push(newObj)
        })
        setCategoryData(categoryArr);
    }

    const CategoriesSection = () => {
        const handleCategoryPress = (category: any) => {
            // @ts-ignore
            navigation.navigate('Category', { category });
        };

        return (
            <View style={styles.categoriesContainer}>
                {categoryData?.length === 0 ? (
                    <CategorySkeleton />
                ) : (
                    <FlatList
                        data={categoryData}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }: any) => (
                            <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item)}>
                                <Image source={{ uri: item.imagePath }} style={styles.categoryImage} />
                                <Text style={styles.categoryName}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        );
    };

    const handleCategoryPress = (item: any) => {
        // @ts-ignore
        navigation.navigate('Item', { item });
    };

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        fetchPrice();
        const intervalId = setInterval(() => {
            fetchPrice()
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchItemsData = async () => {
        const getAllItemsApi = await getAllItems();
        const getItemByCategoryIdRes = getAllItemsApi?.payload?.data?.items;
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
            setItemData(itemsData);
        }
    }

    useEffect(() => {
        fetchItemsData();
    }, []);

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

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchItemsData();
        await fetchPrice();
        setRefreshing(false);
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <View style={styles.content}>
                <View style={styles.sliderContainer}>
                    <Slider data={sliders} />
                </View>
                <Text style={styles.sectionTitle}>الفئات</Text>
                <CategoriesSection />
                <Text style={styles.sectionTitle}>أسعار الذهب</Text>
                <PricesSection
                    oncePrice={goldInternationalPriceKwd?.price}
                    price24K={goldInternationalPriceKwd?.twentyFour}
                    price22K={goldInternationalPriceKwd?.twentyTwo}
                    price21K={goldInternationalPriceKwd?.twentyOne}
                />
                <Text style={styles.sectionTitle}>قائمة المنتجات</Text>
                <>
                    <View style={styles.itemsContainer}>
                        {itemData?.length === 0 ? (
                            <CategorySkeleton />
                        ) : (
                            itemsToDisplay?.map((e: any, i: any) => {
                                return (
                                    <TouchableOpacity key={i} style={styles.item} onPress={() => handleCategoryPress(e)} >
                                        <Image
                                            source={{ uri: `https://apii.test.sultangold.net/public${e?.mainImage}` }}
                                            style={styles.itemImage}
                                        />
                                        <Text style={styles.itemPrice}>{e?.price} دينار</Text>
                                    </TouchableOpacity>
                                );
                            }))}
                    </View>
                    <Navigation
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        itemsData={itemData}
                        itemsPerPage={itemsPerPage}
                        endIndex={endIndex}
                    />
                </>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2024 Sultan Gold</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 24,
        color: '#c19858',
    },
    content: {
        flex: 1,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold'
    },
    CategorySkelelaton: {
        borderWidth: 1,
        borderColor: '#ddd',
        width: '45%',
        marginRight: '2%',
        height: 150,
        borderRadius: 16,
        overflow: 'hidden',
    },
    CategoryImageSkelelaton: {
        width: '100%',
        height: '100%',
    },
    categoriesContainer: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20
    },
    categoryItem: {
        margin: 10,
        alignItems: 'center',
    },
    categoryImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    categoryName: {
        marginTop: 5,
        textAlign: 'center',
        color: '#333',
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    footerText: {
        fontSize: 12,
        color: '#c19858',
    },
    secondSection: {
        backgroundColor: '#c19858',
        padding: 20,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 15
    },
    secondSectionText: {
        color: 'white',
        fontSize: 22,
        marginBottom: 10
    },
    priceLabel: {
        marginRight: 5,
        fontWeight: 'bold'
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
        height: 150,
    },
    itemPrice: {
        fontSize: 20,
        color: '#c19858',
        marginLeft: 12,
        fontWeight: '400',
        marginVertical: 8,
    },
    CategoriesContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        marginTop: 30,
        marginBottom: 100

    },
    sliderContainer: {
        height: 400
    }
});

const mapDispatchToProps = {
    getAllCategories: authorizationActions?.getAllCategories,
    getInternationalGoldPriceLatest: authorizationActions?.getInternationalGoldPriceLatest,
    getAllItems: authorizationActions?.getAllItems,
    getItemOncePriceLatest: authorizationActions?.getItemOncePriceLatest,
    getAllSlider: authorizationActions?.getAllSlider
};

const connector = connect(undefined, mapDispatchToProps);
const HomeScreenRedux = connector(HomeScreen);

export { HomeScreenRedux as HomeScreen };