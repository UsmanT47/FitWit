import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import { SPACING, FONT_SIZES, LAYOUT } from '../../constants/dimensions';

const ScanBarcodeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setIsLoading(true);
    
    // In a real app, we would make an API call to fetch food data using the barcode
    // For now, simulate a delay and then return to previous screen with the data
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Barcode Detected',
        `Barcode Type: ${type}\nData: ${data}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setScanned(false),
          },
          {
            text: 'Use This',
            onPress: () => {
              // Here we would normally pass the food data back to the FoodLogScreen
              navigation.goBack();
            },
          },
        ]
      );
    }, 1500);
  };
  
  const toggleFlash = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  };
  
  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
        <ActivityIndicator size="large" color={theme.text.accent} />
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
        <View style={styles.noPermissionContainer}>
          <Ionicons name="warning-outline" size={60} color={theme.status.warning} />
          <Text style={[styles.noPermissionText, { color: theme.text.primary }]}>
            Camera permission is required to scan barcodes
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: theme.button.primary.background }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.permissionButtonText, { color: theme.button.primary.text }]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        flashMode={flashMode}
        barCodeScannerSettings={{
          barCodeTypes: [
            BarCodeScanner.Constants.BarCodeType.ean13,
            BarCodeScanner.Constants.BarCodeType.ean8,
            BarCodeScanner.Constants.BarCodeType.upc_e,
            BarCodeScanner.Constants.BarCodeType.upc_a,
          ],
        }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.background.secondary }]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={24} color={theme.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.flashButton, { backgroundColor: theme.background.secondary }]}
              onPress={toggleFlash}
            >
              <Ionicons
                name={flashMode === Camera.Constants.FlashMode.torch ? "flash" : "flash-off"}
                size={24}
                color={theme.text.primary}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scanAreaContainer}>
            <View style={styles.scanArea}>
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                  <Text style={styles.loadingText}>Searching for product...</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Position barcode within the frame to scan
            </Text>
            
            {scanned && !isLoading && (
              <TouchableOpacity
                style={[styles.rescanButton, { backgroundColor: theme.button.primary.background }]}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.rescanButtonText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.MEDIUM,
    marginTop: SPACING.LARGE,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanAreaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: SPACING.MEDIUM,
    borderRadius: 10,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: SPACING.SMALL,
    fontSize: FONT_SIZES.SMALL,
  },
  instructionContainer: {
    alignItems: 'center',
    padding: SPACING.LARGE,
    marginBottom: SPACING.LARGE,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.MEDIUM,
    textAlign: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  rescanButton: {
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.LARGE,
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
    marginTop: SPACING.MEDIUM,
  },
  rescanButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: '600',
  },
  noPermissionContainer: {
    alignItems: 'center',
    padding: SPACING.LARGE,
  },
  noPermissionText: {
    fontSize: FONT_SIZES.MEDIUM,
    textAlign: 'center',
    marginTop: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
  },
  permissionButton: {
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.LARGE,
    borderRadius: LAYOUT.CARD_BORDER_RADIUS,
  },
  permissionButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: '600',
  },
});

export default ScanBarcodeScreen;