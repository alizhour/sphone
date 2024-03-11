import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const ImageSlider = ({ imageUrls }: any) => {
    return (
        <Swiper
            style={styles.wrapper}
            showsButtons={false}
            showsPagination={true}
            activeDotColor="#c19858"
            dotColor="#ddd"
        >
            {imageUrls.map((imageUrl: any, index: any) => (
                <View key={index} style={styles.slide}>
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                </View>
            ))}
        </Swiper>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    wrapper: {
        minWidth: '100%',
        minHeight: '100%',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        minWidth: '100%',
        minHeight: '100%',
    },
    image: {
        minWidth: '100%',
        minHeight: '100%',
    },
});

export default ImageSlider;
