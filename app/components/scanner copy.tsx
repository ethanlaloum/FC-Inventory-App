import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
} from 'react-native';
import React, { useState, useCallback, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';

export default function ScannerScreen() {
    const { email } = useLocalSearchParams();
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(true);
    const cameraRef = useRef(null);
    const [permission, requestPermission] = useCameraPermissions();
    const isPermissionGranted = Boolean(permission?.granted);

    const resetScanning = useCallback(() => {
        setIsScanning(false);
        setIsCameraActive(true);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            resetScanning();
            return () => {
                setIsCameraActive(false);
            };
        }, [resetScanning])
    );

    const handleBarCodeScanned = ({ data }) => {
        if (isScanning) {
            setIsScanning(false);
            console.log("UPC scanned:", data);
            router.push({
                pathname: '/ProductDetails',
                params: { upcCode: data, email: email }
            });
        }
    };

    const backButton = () => {
        setIsScanning(false);
        setIsCameraActive(false);
        router.back();
    };

    const startScanning = () => {
        setIsScanning(true);
    };

    if (isPermissionGranted == false) {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    onPress={requestPermission}
                    style={styles.permissionButton}
                >
                    <Text style={styles.permissionButtonText}>Request Permission</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={StyleSheet.absoluteFillObject}>
                <StatusBar hidden />
                {isCameraActive ? (
                    <CameraView
                        ref={cameraRef}
                        style={StyleSheet.absoluteFillObject}
                        facing="back"
                        onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
                    />
                ) : (
                    <View style={StyleSheet.absoluteFillObject} />
                )}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={backButton}
                >
                    <FontAwesome name='arrow-left' color="white" size={24} />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={startScanning}
                >
                    <Text style={styles.scanButtonText}>Scan</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    permissionButtonText: {
        color: 'white',
        fontSize: 16,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    backButtonText: {
        color: 'white',
        marginLeft: 8,
        fontSize: 16,
    },
    scanButton: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 40,
    },
    scanButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});