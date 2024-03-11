import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { useFormik } from 'formik';
import { connect, ConnectedProps } from 'react-redux';

import InputField from '../component/InputField';
import CustomButton from '../component/CustomButton';
import { authorizationActions } from '../api/api.slice';

type ReduxProps = ConnectedProps<typeof connector>;

const RegisterScreen = ({ navigation, register, login }: any & ReduxProps) => {
    const imageUrl = require('../assets/images/logo.png');
    const emailIcon = require('../assets/images/login/mail.png');
    const passwordIcon = require('../assets/images/login/padlock.png');
    const profileIcon = require('../assets/images/login/user.png');
    const phoneIcon = require('../assets/images/login/telephone.png');


    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            fullName: ''
        },
        onSubmit: async (values) => {
            setLoading(true);
            const words = values?.fullName?.split(' ');
            let firstName = '' as any;
            let lastName = '' as any;
            if (words.length >= 2) {
                firstName = words[0];
                lastName = words.slice(1).join(' ');
            } else {
                firstName = words;
                lastName = words;
            }
            const body = {
                email: values?.email,
                password: values?.password,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: values.phoneNumber,
            }
            const registerApi = await register(body);
            if (registerApi?.payload?.status === 201) {
                const body = {
                    email: values?.email,
                    password: values?.password,
                };
                try {
                    const loginApi = await login(body) as any;
                    if (loginApi?.payload?.status !== 200) {
                        setError('Login failed, try again! ');
                    }
                } catch (error: any) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            }
            else {
                setError('ERROR, Try again later');
                setLoading(false);
            }
        },
    });

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 25, paddingTop: 25 }}>
                <View style={{ alignItems: 'center', paddingBottom: 25 }}>
                    <Image source={imageUrl} style={styles.image} />
                </View>
                <Text
                    style={{
                        fontFamily: 'Roboto-Medium',
                        fontSize: 28,
                        fontWeight: '500',
                        color: '#333',
                        marginBottom: 30,
                    }}>
                    Register
                </Text>
                <InputField
                    label={'Full Name'}
                    icon={<Image source={profileIcon} style={styles.emailIcon} />}
                    keyboardType="text"
                    onChangeText={formik.handleChange('fullName')}
                    onBlur={formik.handleBlur('fullName')}
                    value={formik.values.fullName}
                />
                <InputField
                    label={'Email address'}
                    icon={<Image source={emailIcon} style={styles.emailIcon} />}
                    keyboardType="email-address"
                    onChangeText={formik.handleChange('email')}
                    onBlur={formik.handleBlur('email')}
                    value={formik.values.email}
                />
                <InputField
                    label={'Password'}
                    icon={<Image source={passwordIcon} style={styles.emailIcon} />}
                    inputType="password"
                    onChangeText={formik.handleChange('password')}
                    onBlur={formik.handleBlur('password')}
                    value={formik.values.password}
                />
                <InputField
                    label={'Phone Number'}
                    icon={<Image source={phoneIcon} style={styles.emailIcon} />}
                    keyboardType="text"
                    onChangeText={formik.handleChange('phoneNumber')}
                    onBlur={formik.handleBlur('phoneNumber')}
                    value={formik.values.phoneNumber}
                />
                <CustomButton label={'Register'} onPress={() => { formik.handleSubmit() }} />
                {loading && <ActivityIndicator size="large" color="#333" />}

                {error !== '' && (
                    <Text style={{ color: 'red', marginBottom: 20 }}>{error}</Text>
                )}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 30,
                    }}>
                    <Text style={{ color: '#666', paddingRight: 5 }}>Already registered?</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={{ color: '#c19858', fontWeight: '700' }}> Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200
    },
    image: {
        width: 200,
        height: 170,
    },
    emailIcon: {
        width: 25,
        height: 25,
        marginRight: 10
    }
});

const mapDispatchToProps = {
    register: authorizationActions?.register,
    login: authorizationActions?.login,
};

const connector = connect(undefined, mapDispatchToProps);
const RegisterScreenRedux = connector(RegisterScreen);

export { RegisterScreenRedux as RegisterScreen };
