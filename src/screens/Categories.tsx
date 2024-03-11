import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Layouts from '../component/layouts';

import { authorizationActions } from '../api/api.slice';

type ReduxProps = ConnectedProps<typeof connector>;

const CategoriesScreen = ({ getAllCategories, route }: ReduxProps & any) => {
    const navigation = useNavigation();
    const { userData } = route.params;
    const [categoryData, setCategoryData] = useState([]);

    const fetchData = async () => {
        const getAllCategoriesApi = await getAllCategories();
        setCategoryData(getAllCategoriesApi?.payload?.data?.categories);
    }

    const handleCategoryPress = (category: any) => {
        // @ts-ignore
        navigation.navigate('Category', { category });
    };

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <ScrollView style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>الفئات</Text>
            <View style={styles.CategoriesContainer}>
                {categoryData?.length === 0 ? (
                    <CategorySkeleton />
                ) : (
                    categoryData?.map((e: any, i) => {
                        return (
                            <TouchableOpacity key={i} style={styles.Category} onPress={() => handleCategoryPress(e)}>
                                <Image
                                    source={{ uri: `https://apii.test.sultangold.net/public${e?.imagePath}` }}
                                    style={styles.CategoryImage}
                                />
                                <Text style={styles.CategoryName}>{e?.arabicName}</Text>
                            </TouchableOpacity>
                        )
                    }))}
            </View>
        </ScrollView>
    );
};

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
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        marginTop: 30,
        marginBottom: 100

    },
    Category: {
        borderWidth: 1,
        borderColor: '#c19858',
        width: '45%',
        marginRight: '2%',
        height: 150,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between'
    },
    CategoryImage: {
        width: '100%',
        height: '100%'
    },
    CategoryName: {
        fontSize: 20,
        fontStyle: 'italic',
        position: 'absolute',
        bottom: 10,
        left: 10,
        color: '#555',
        fontWeight: 'bold',
        textShadowColor: '#555'
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
})

const mapDispatchToProps = {
    getAllCategories: authorizationActions?.getAllCategories
};

const connector = connect(undefined, mapDispatchToProps);
const CategoriesScreenRedux = connector(CategoriesScreen);

export { CategoriesScreenRedux as CategoriesScreen };