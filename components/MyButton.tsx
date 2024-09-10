import React from 'react';
import { View,StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { ColorProperties } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const MyButton = ({ handleRedirect, buttonText }: { handleRedirect: () => void; buttonText: string }) => {
    return (
        <View style={styles.btn}>
        <Button mode="contained" onPress={handleRedirect}>
            {buttonText}
        </Button>
        </View>
    );
};

const styles = StyleSheet.create({    
    btn: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: 10,
    },
});

export default MyButton;
