import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator, // Import ActivityIndicator for the loader
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { useFormik } from 'formik';

import CustomButton from '../component/CustomButton';
import InputField from '../component/InputField';
import { authorizationActions } from '../api/api.slice';

type ReduxProps = ConnectedProps<typeof connector>;

interface ILoginScreen {
    navigation?: any;
}

const LoginScreen = ({ navigation, login }: ILoginScreen & ReduxProps) => {
    const imageUrl = require('../assets/images/logo.png');
    const emailIcon = require('../assets/images/login/mail.png');
    const passwordIcon = require('../assets/images/login/padlock.png');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values) => {
            // Show the loader when the login button is pressed
            setLoading(true);

            const body = {
                email: values?.email,
                password: values?.password,
            };

            try {
                const loginApi = await login(body) as any;
                console.log(JSON.stringify(loginApi, null, 2));
                if (loginApi?.payload?.status !== 200) {
                    setError('Login failed, try again! ');
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                // Hide the loader when the login process is completed
                setLoading(false);
            }
        },
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ paddingHorizontal: 25 }}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={imageUrl} style={styles.image} />
                </View>
                <Text
                    style={{
                        fontFamily: 'Roboto-Medium',
                        fontSize: 28,
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: 30,
                    }}>
                    تسجيل دخول
                </Text>
                <InputField
                    label={'البريد الإلكتروني'}
                    icon={<Image source={emailIcon} style={styles.emailIcon} />}
                    keyboardType="email"
                    onChangeText={formik.handleChange('email')}
                    onBlur={formik.handleBlur('email')}
                    value={formik.values.email}
                />
                <InputField
                    label={'كلمة المرور'}
                    icon={<Image source={passwordIcon} style={styles.emailIcon} />}
                    inputType="password"
                    onChangeText={formik.handleChange('password')}
                    onBlur={formik.handleBlur('password')}
                    value={formik.values.password}
                />
                <CustomButton label={"تسجيل دخول"} onPress={() => formik.handleSubmit()} />

                {loading && <ActivityIndicator size="large" color="#333" />}

                {error !== '' && (
                    <Text style={{ color: 'red', marginBottom: 20 }}>{error}</Text>
                )}

                <View
                    style={{
                        flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        marginBottom: 30,
                    }}>
                    <Text style={{ color: '#666', paddingRight: 5 }}>
                        ليس لديك حساب؟
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={{ color: '#c19858', fontWeight: '700' }}>
                            إنشاء حساب
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
    },
    image: {
        width: 200,
        height: 170,
    },
    emailIcon: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
});

const mapDispatchToProps = {
    login: authorizationActions?.login,
};

const connector = connect(undefined, mapDispatchToProps);
const LoginScreenRedux = connector(LoginScreen);

export { LoginScreenRedux as LoginScreen };
