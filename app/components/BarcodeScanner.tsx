import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { CameraView } from 'expo-camera';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface BarcodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    return () => {
      setIsScanning(false);
    };
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (isScanning) {
      setIsScanning(false);
      onScan(data);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={onClose}
      >
        <FontAwesome name='arrow-left' color="white" size={24} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={startScanning}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="barcode-scan" size={28} color="white" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.scanButtonText}>Ajouter un code UPC</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#FC0000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  iconContainer: {
    position: 'absolute',
    left: 16,
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});