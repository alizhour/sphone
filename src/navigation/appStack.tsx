import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '../screens/HomeScreen';
import { CategoriesScreen } from '../screens/Categories';
import { GoldScreen } from '../screens/GoldPrice';
import { NewsScreen } from '../screens/News';
import { OffersScreen } from '../screens/Offers';
import { TipsScreen } from '../screens/Tips';
import { CategoryScreen } from '../screens/Category';
import { ItemScreen } from '../screens/item';
import { CartScreen } from '../screens/cart';
import { NewScreen } from '../screens/New';
import { TipScreen } from '../screens/Tip';
import { AccountScreen } from '../screens/Account';
import { CheckoutScreen } from '../screens/Checkout';
import Layouts from '../component/layouts';

const Stack = createNativeStackNavigator();


const App = ({ userData }: any) => {
    return (
        <Layouts
            userData={userData}
        >
            <Stack.Navigator
                screenOptions={{ headerShown: false, animation: 'none' }}
                initialRouteName='Home'
            >
                <Stack.Screen name="Home" component={HomeScreen} initialParams={{ userData: userData }} />
                <Stack.Screen name="Categories" component={CategoriesScreen} initialParams={{ userData: userData }} />
                <Stack.Screen name="GoldPrice" component={GoldScreen} initialParams={{ userData: userData }} />
                <Stack.Screen name="News" component={NewsScreen} initialParams={{ userData: userData }} />
                <Stack.Screen name="Offers" component={OffersScreen} initialParams={{ userData: userData }} />
                <Stack.Screen name="Tips" component={TipsScreen} initialParams={{ userData: userData }} />
                <Stack.Screen name="Category" component={CategoryScreen} initialParams={{ userData: userData }} />
                <Stack.Screen name="Item" component={ItemScreen} initialParams={{ userData: userData }} />
                <Stack.Screen name="Cart" component={CartScreen} initialParams={{ userData: userData }} />
                <Stack.Screen name="New" component={NewScreen} initialParams={{ userData: userData }} />
                <Stack.Screen name="Tip" component={TipScreen} initialParams={{ userData: userData }} />
                <Stack.Screen name="Account" component={AccountScreen} initialParams={{ userData: userData }} />
                <Stack.Screen name="Checkout" component={CheckoutScreen} initialParams={{ userData: userData }} />
            </Stack.Navigator>
        </Layouts>
    );
};

export default App;