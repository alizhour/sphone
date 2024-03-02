import React, { useEffect, useRef, useState } from 'react'
import {
    DrawerLayoutAndroid,
    Text,
    StyleSheet,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setData } from '../api/apiStore';
import { DrawerActions } from '@react-navigation/native';

const Layouts = ({ userData, children }: any) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const profile = require('../assets/images/navigation/user.png')
    const homeIcon = require('../assets/images/navigation/home.png');
    const categoriesIcon = require('../assets/images/navigation/category.png');
    const NewsIcon = require('../assets/images/navigation/newspaper.png');
    const TipsIcon = require('../assets/images/navigation/discount.png');
    const priceIcon = require('../assets/images/navigation/investing.png');
    const offerIcon = require('../assets/images/navigation/discount.png');
    const logoutIcon = require('../assets/images/navigation/logout.png');
    const imageUrl = require('../assets/images/logo.png');
    const bagIcon = require('../assets/images/navigation/bag.png');
    const menuIcon = require('../assets/images/navigation/menu.png');

    const homeIconNav = require('../assets/images/bottomNavbar/home.png');
    const homeIconNavActive = require('../assets/images/bottomNavbar/homeActive.png');
    const categoryIconNav = require('../assets/images/bottomNavbar/category.png');
    const categoryIconNavActive = require('../assets/images/bottomNavbar/categoryActive.png');
    const bagIconNav = require('../assets/images/bottomNavbar/shopping.png');
    const bagIconNavActive = require('../assets/images/bottomNavbar/shoppingActive.png');
    const userIconNav = require('../assets/images/bottomNavbar/user.png');
    const userIconNavActive = require('../assets/images/bottomNavbar/userActive.png');

    const drawer = useRef<DrawerLayoutAndroid>(null);

    const sideBarData = [
        {
            index: 'Home',
            title: 'Home Page',
            icon: homeIcon
        },
        {
            index: 'Categories',
            title: 'Categories',
            icon: categoriesIcon
        },
        {
            index: 'News',
            title: 'News',
            icon: NewsIcon
        },
        {
            index: 'Tips',
            title: 'Tips',
            icon: TipsIcon
        },
        {
            index: 'GoldPrice',
            title: 'Gold Price',
            icon: priceIcon
        },
        {
            index: 'Offers',
            title: 'Offers',
            icon: offerIcon
        },
        {
            index: 'Account',
            title: 'My Account',
            icon: userIconNav
        },
    ]

    const [bottomIndex, setBottomIndex] = useState(0);

    const closeDrawerIfOpen = () => {
        if (drawer.current) {
            drawer.current.closeDrawer();
        }
    };

    const navigationView = () => (
        <View style={layoutStyles.navigationContainer}>
            <View style={layoutStyles.navigationContainerHeader}>
                <Image source={profile} style={{ width: 35, height: 35 }} />
                <View style={layoutStyles.navigationProfile}>
                    <Text style={layoutStyles.navigationContainerHeaderText}>{userData?.user?.firstName} {userData?.user?.lastName}</Text>
                    <Text style={layoutStyles.navigationContainerHeaderEmail}>{userData?.user?.email}</Text>
                </View>
            </View>
            <View style={layoutStyles.navigationItemsContainer}>
                {
                    sideBarData?.map((item, i) => {
                        if (item.index === 'Account' && !userData) {
                            return (<></>);
                        }
                        else {
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={layoutStyles.navigationItem}
                                    onPress={() => {
                                        closeDrawerIfOpen();
                                        //@ts-ignore
                                        navigation.navigate(item?.index);
                                    }}
                                >
                                    <View style={layoutStyles.navigationItemIcon}>
                                        <Image source={item?.icon} style={{ width: 25, height: 25 }} />
                                    </View>
                                    <Text style={layoutStyles.navigationItemName}>{item?.title}</Text>
                                </TouchableOpacity>
                            )
                        }
                    })
                }
            </View>
            <TouchableOpacity style={layoutStyles.navigationFooter}>
                <View style={layoutStyles.navigationItemIcon}>
                    <Image source={logoutIcon} style={{ width: 25, height: 25 }} />
                </View>
                <Text style={layoutStyles.navigationItemName} onPress={() => {
                    dispatch(setData(null));
                }}>Logout</Text>
            </TouchableOpacity>
        </View>
    );


    const TopNav = () => (
        <View style={layoutStyles.navBar}>
            <TouchableOpacity style={{ paddingLeft: 12, justifyContent: 'center', width: '33.33%' }}
                onPress={() => {
                    //@ts-ignore
                    if (drawer.current) {
                        drawer.current.openDrawer();
                    }
                }}
            >
                <Image source={menuIcon} style={{ width: 35, height: 35 }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: '33.33%' }} onPress={() => {
                // @ts-ignore
                navigation.navigate('Home');
            }}>
                <Image source={imageUrl} style={{ width: 60, height: 50 }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '33.33%', display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }} onPress={() => {
                // @ts-ignore
                navigation.navigate('Cart');
            }}>
                <Image source={bagIcon} style={{ width: 30, height: 30, marginRight: 12 }} />
            </TouchableOpacity>
        </View>
    )

    const BottomNav = () => (
        <View style={layoutStyles.bottomNavBar}>
            <TouchableOpacity style={{}}
                onPress={() => {
                    // @ts-ignore
                    navigation.navigate('Home');
                    setBottomIndex(0)
                }}
            >
                {bottomIndex === 0 ? (
                    <Image source={homeIconNavActive} style={{ width: 35, height: 35 }} />
                ) : (
                    <Image source={homeIconNav} style={{ width: 35, height: 35 }} />
                )}
            </TouchableOpacity>
            <TouchableOpacity style={{}}
                onPress={() => {
                    // @ts-ignore
                    navigation.navigate('Categories');
                    setBottomIndex(1)
                }}
            >
                {bottomIndex === 1 ? (
                    <Image source={categoryIconNavActive} style={{ width: 35, height: 35 }} />
                ) : (
                    <Image source={categoryIconNav} style={{ width: 35, height: 35 }} />
                )}
            </TouchableOpacity>
            <TouchableOpacity style={{}}
                onPress={() => {
                    // @ts-ignore
                    navigation.navigate('Cart');
                    setBottomIndex(2)
                }}
            >
                {bottomIndex === 2 ? (
                    <Image source={bagIconNavActive} style={{ width: 35, height: 35 }} />
                ) : (
                    <Image source={bagIconNav} style={{ width: 35, height: 35 }} />
                )}
            </TouchableOpacity>
            {userData && (
                <TouchableOpacity style={{}}
                    onPress={() => {
                        // @ts-ignore
                        navigation.navigate('Account');
                        setBottomIndex(3)
                    }}
                >
                    {bottomIndex === 3 ? (
                        <Image source={userIconNavActive} style={{ width: 35, height: 35 }} />
                    ) : (
                        <Image source={userIconNav} style={{ width: 35, height: 35 }} />
                    )}
                </TouchableOpacity>
            )}
        </View>
    )

    return (
        <DrawerLayoutAndroid
            ref={drawer}
            drawerWidth={300}
            drawerPosition={'left'}
            renderNavigationView={navigationView}
        >
            <TopNav />
            {children}
            <BottomNav />
        </DrawerLayoutAndroid>
    )
}

const layoutStyles = StyleSheet.create({
    bottomNavBar: {
        width: '100%',
        borderWidth: 1,
        height: 70,
        borderColor: '#ddd',
        overflow: 'hidden',
        backgroundColor: '#f1f1f1',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    navigationContainer: {
        backgroundColor: '#fff',
        position: 'relative',
        height: '100%'
    },
    navBar: {
        height: 70,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    navigationContainerHeader: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#c19858'
    },
    navigationContainerHeaderText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold'
    },
    navigationContainerHeaderEmail: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '600'
    },
    navigationItemsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 14,
    },
    navigationItem: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 8,
        alignItems: 'center'
    },
    navigationItemIcon: {

    },
    navigationItemName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333'
    },
    navigationProfile: {
        display: 'flex',
        flexDirection: 'column'
    },
    navigationFooter: {
        borderTopWidth: 1,
        borderColor: '#ccc',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 18,
        alignItems: 'center',
    }
});

export default Layouts