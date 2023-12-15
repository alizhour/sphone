import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native'

interface IInputField {
    label?: any
    icon?: any
    inputType?: any
    keyboardType?: any
    fieldButtonLabel?: any
    fieldButtonFunction?: any
    onBlur?: any
    onChangeText?: any
    value?: any
}

export default function InputField({
    label,
    icon,
    inputType,
    keyboardType,
    onChangeText,
    onBlur,
    value
}: IInputField) {
    return (
        <View
            style={{
                flexDirection: 'row',
                borderBottomColor: '#ccc',
                borderBottomWidth: 1,
                paddingBottom: 5,
                marginBottom: 25,
                alignItems: 'center'
            }}>
            {icon}
            {inputType == 'password' ? (
                <TextInput
                    placeholder={label}
                    keyboardType={keyboardType}
                    style={{ flex: 1, paddingVertical: 0, color: '#333', height: 40 }}
                    secureTextEntry={true}
                    placeholderTextColor="#ccc"
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    value={value}
                />
            ) : (
                <TextInput
                    placeholder={label}
                    keyboardType={keyboardType}
                    style={{ flex: 1, paddingVertical: 0, color: '#333', height: 40 }}
                    placeholderTextColor="#ccc"
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    value={value}
                />
            )}
        </View>
    );
}
