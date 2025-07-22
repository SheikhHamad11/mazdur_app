import React from 'react';
import { Text, StyleSheet } from 'react-native';

const AppText = ({ children, style, font = 'regular', ...props }) => {
    const fontMap = {
        regular: 'Metropolis-Regular',
        bold: 'Metropolis-Bold',
        medium: 'Metropolis-Medium',
        light: 'Metropolis-Light',
    };

    return (
        <Text
            style={[styles.defaultText, { fontFamily: fontMap[font] || fontMap.regular }, style]}
            {...props}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    defaultText: {
        color: '#000', // Optional default text color
        fontSize: 16,
    },
});

export default AppText;
