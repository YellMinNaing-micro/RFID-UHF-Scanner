import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RouteProp} from '@react-navigation/native';
import type {RootStackParamList} from '../App';
import {products} from '../../data/product';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// Correct types for navigation and route
type DetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Detail'
>;
type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

interface ProductDetailProps {
  navigation: DetailScreenNavigationProp;
  route: DetailScreenRouteProp;
}

export default function DetailScreen({navigation, route}: ProductDetailProps) {
  const insets = useSafeAreaInsets();
  const {id} = route.params;
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundText}>Product not found</Text>
      </View>
    );
  }

  const handleGoBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      {/* Image Header */}
      <View style={[styles.imageContainer, {paddingTop: insets.top}]}>
        <Image
          source={
            typeof product.image === 'string'
              ? {uri: product.image}
              : product.image
          }
          style={styles.image}
          resizeMode="stretch"
        />
        <View
          style={[
            styles.topIcons,
            {
              paddingTop: insets.top + 4,
              paddingLeft: insets.left + 10,
              paddingRight: insets.right + 10,
            },
          ]}>
          <Pressable onPress={handleGoBack} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={20} color="black" />
          </Pressable>
          <View style={styles.rightIcons}>
            <Pressable style={styles.iconButton}>
              <Ionicons name="heart-outline" size={20} color="black" />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Ionicons name="bag-handle-outline" size={20} color="black" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Scrollable Product Details */}
      <ScrollView
        style={[
          styles.detailsContainer,
          {paddingLeft: insets.left + 10, paddingRight: insets.right + 10},
        ]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.productName} allowFontScaling={false}>
          {product.name}
        </Text>
        <Text style={styles.collectionText}>From: Uphaar Collection</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price}</Text>
          {product.oldPrice && (
            <Text style={styles.oldPrice}>${product.oldPrice}</Text>
          )}
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
          )}
        </View>

        <View style={styles.ratingRow}>
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < product.rating ? 'star' : 'star-outline'}
              size={16}
              color={i < product.rating ? '#facc15' : '#d1d5db'}
            />
          ))}
          <Text style={styles.reviewText}>({product.reviews})</Text>
        </View>

        <Text style={styles.infoText}>
          434 People Bought This Item Recently
        </Text>

        <View style={styles.promoBox}>
          <Ionicons
            name="bag-handle-outline"
            size={16}
            style={{marginRight: 8}}
          />
          <Text style={styles.promoText}>
            New Users - Flat 15% OFF On Your First Transaction
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.productSpecs}>
          <Text style={styles.specTitle}>The Paanita Ring</Text>
          <View style={styles.specRow}>
            <View>
              <Text style={styles.specLabel}>Product Code</Text>
              <Text style={styles.specLabel}>Height</Text>
              <Text style={styles.specLabel}>Width</Text>
              <Text style={styles.specLabel}>Product Weight (Approx)</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.specValue}>026409-5705875</Text>
              <Text style={styles.specValue}>20.7 mm</Text>
              <Text style={styles.specValue}>6.0 mm</Text>
              <Text style={styles.specValue}>2.14 gram</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add To Cart Button */}
      <View style={[styles.addToCartContainer, {paddingBottom: insets.bottom}]}>
        <Pressable
          style={styles.addToCartButton}
          onPress={() => navigation.navigate('UhfScanner')}>
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={styles.addToCartText}>Add To Cart</Text>
        </Pressable>
      </View>
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F3F4F6'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  notFoundText: {fontSize: 18, fontWeight: 'bold'},
  imageContainer: {position: 'relative'},
  image: {width: '100%', height: 350},
  topIcons: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 8,
    borderRadius: 50,
    marginLeft: 5,
  },
  rightIcons: {flexDirection: 'row'},
  detailsContainer: {
    flex: 1,
    marginTop: -20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  productName: {fontSize: 24, marginBottom: 8, fontFamily: 'Pyidaungsu-Bold'},
  collectionText: {fontSize: 14, color: '#6B7280', marginBottom: 8},
  priceRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  price: {fontSize: 22, fontWeight: 'bold', color: '#111827', marginRight: 8},
  oldPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  discountText: {color: '#fff', fontSize: 12},
  ratingRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  reviewText: {marginLeft: 6, fontSize: 12, color: '#6B7280'},
  infoText: {fontSize: 12, color: '#6B7280', marginBottom: 8},
  promoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FECACA',
    padding: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  promoText: {fontSize: 12, color: '#374151'},
  divider: {height: 1, backgroundColor: '#E5E7EB', marginVertical: 8},
  productSpecs: {marginBottom: 16},
  specTitle: {fontSize: 16, fontWeight: '600', marginBottom: 8},
  specRow: {flexDirection: 'row', justifyContent: 'space-between'},
  specLabel: {fontSize: 12, color: '#6B7280', marginBottom: 2},
  specValue: {fontSize: 12, color: '#111827', marginBottom: 2},
  addToCartContainer: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center', // center horizontally
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 24,
    width: '100%', // full width
    justifyContent: 'center', // centers icon + text horizontally
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});
