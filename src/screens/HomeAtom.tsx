import React from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';

const Slider = ({ data }: any) => {
    const navigation = useNavigation();

    return (
        <Swiper>
            {data.map((item: any, index: any) => (
                <View key={index} style={styles.slide}>
                    <Image source={{ uri: `https://apii.test.sultangold.net/public${item.imagePath}` }} style={styles.image} resizeMode="cover" />
                    <View style={styles.slideContent}>
                        <Text style={styles.title}>{item.arabicTitle}</Text>
                        <Text style={styles.description}>{item.arabicDescription}</Text>
                        <Button
                            title={item.arabicButtonName}
                            //@ts-ignore
                            onPress={() => { navigation.navigate('Offers') }}
                            color="#c19858"
                        />
                    </View>
                </View>
            ))}
        </Swiper>
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
    },
    image: {
        flex: 1,
        width: '100%',
        height: null,
    },
    slideContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
        marginTop: -30
    },
    description: {
        fontSize: 16,
        marginBottom: 16,
        color: '#555',
        marginTop: 16
    },
});

export default Slider;
