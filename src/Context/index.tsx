import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import * as RNIap from 'react-native-iap';
import { productSkus, requestPurchaseOption } from '../constansts';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IAPProps {
  hasPurchased: boolean;
  products:
    | RNIap.Product[]
    | RNIap.ProductSubscription[]
    | RNIap.ProductOrSubscription[]
    | null;
  requestPurchase: () => void;
  checkPurchases: (bool: boolean) => void;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const IAPContext = createContext<IAPProps | null>(null);

const STORAGE_KEY = 'IN_APP_PURCHASE';

const IAPProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasPurchased, setHasPurchased] = useState(false);
  const [products, setProducts] = useState<IAPProps['products']>(null);
  const [visible, setVisible] = useState(false);
  const readyRef = useRef(false);

  // Load cached flag
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(v =>
      setHasPurchased(v === productSkus),
    );
  }, []);

  const requestPurchase = useCallback(async () => {
    if (!readyRef.current) {
      Alert.alert(
        'Please wait',
        'Store is still loading. Try again in a moment.',
      );
      return;
    }
    try {
      await RNIap.requestPurchase(requestPurchaseOption); // dispatch only
    } catch (error: any) {
      Alert.alert('Message', error.message);
    }
  }, []);

  const checkPurchases = useCallback(
    async (showAlerts: boolean) => {
      try {
        const purchases = await RNIap.getAvailablePurchases();
        const premium = purchases.some(p => p.productId === productSkus);

        if (premium) {
          await AsyncStorage.setItem(STORAGE_KEY, productSkus as string);
          setHasPurchased(true);
          setVisible(false);
          if (showAlerts) {
            Alert.alert(
              'Purchase Restored',
              'Your purchase has been successfully restored.',
            );
          }
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY);
          setHasPurchased(false);
          if (showAlerts) {
            Alert.alert(
              'No Purchase Found',
              'You do not have any purchases. Would you like to make a purchase?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                  onPress: () => setVisible(false),
                },
                { text: 'Purchase', onPress: () => requestPurchase() },
              ],
              { cancelable: false },
            );
          }
        }
      } catch (error) {
        console.error('Error checking purchases: ', error);
      }
    },
    [requestPurchase],
  );

  // One effect: listeners first, then connect. No endConnection on cleanup.
  useEffect(() => {
    const updateSub = RNIap.purchaseUpdatedListener(async purchase => {
      if (purchase.productId !== productSkus) return;
      try {
        // TODO: verify on your server here
        await RNIap.finishTransaction({ purchase, isConsumable: false });
        Alert.alert(
          'Completed',
          'The transaction has been completed successfully',
        );
        await checkPurchases(false);
        setVisible(false);
      } catch (error) {
        console.error('Error completing transaction', error);
      }
    });

    const errorSub = RNIap.purchaseErrorListener(error => {
      setVisible(false);
      if (error.code !== RNIap.ErrorCode.UserCancelled) {
        Alert.alert('Purchase failed', error.message);
      }
    });

    (async () => {
      try {
        await RNIap.initConnection();
        const available = await RNIap.fetchProducts({
          skus: [productSkus as string],
        });
        setProducts(available);
        readyRef.current = true;
        await checkPurchases(false); // restore state on launch
      } catch (error) {
        console.warn('Error during IAP initialization', error);
      }
    })();

    return () => {
      updateSub.remove();
      errorSub.remove();
    };
  }, [checkPurchases]);

  return (
    <IAPContext.Provider
      value={{
        hasPurchased,
        products,
        requestPurchase,
        checkPurchases,
        visible,
        setVisible,
      }}
    >
      {children}
    </IAPContext.Provider>
  );
};

export default IAPProvider;
