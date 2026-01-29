import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"; // <- vector icons
import { Product, products } from "../../data/product";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import {SafeAreaView} from 'react-native-safe-area-context';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface HomeProps {
    navigation: HomeScreenNavigationProp;
}

interface ProductCardProps {
    product: Product;
    navigation: HomeScreenNavigationProp;
}

const ProductCard = ({ product, navigation }: ProductCardProps) => {
    const imageSource =
        typeof product.image === "string" ? { uri: product.image } : product.image;

    return (
        <View style={styles.card}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.newBadge}>
            <Text style={styles.newText}>New</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{product.name}</Text>
            {/*<Text style={styles.cardDesc}>{product.description}</Text>*/}
            <View style={styles.cardFooter}>
              <Text style={styles.cardPrice}>${product.price}</Text>
              <Pressable
                style={styles.plusButton}
                onPress={() => navigation.navigate('Detail', {id: product.id})}>
                <Ionicons name="add" size={16} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
    );
};

export default function HomeScreen({ navigation }: HomeProps) {
    const [selectedOption, setSelectedOption] = useState("Payment");
    const [isLogoutVisible, setIsLogoutVisible] = useState(false);

    const menuOptions = [
        { label: "Payment", icon: "cart-outline" },
        { label: "Secure Logistics", icon: "cube-outline" },
        { label: "Contract", icon: "document-text-outline" },
        { label: "Setting", icon: "settings-outline" },
        { label: "Secure", icon: "lock-closed-outline" },
        { label: "Just", icon: "clipboard-outline" },
    ];

    const animatedValues = useRef(
        menuOptions.reduce((acc, option) => {
            acc[option.label] = new Animated.Value(option.label === selectedOption ? 1 : 0);
            return acc;
        }, {} as Record<string, Animated.Value>)
    ).current;

    useEffect(() => {
        menuOptions.forEach((option) => {
            Animated.timing(animatedValues[option.label], {
                toValue: option.label === selectedOption ? 1 : 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        });
    }, [selectedOption]);

    const handleLogout = () => {
        setIsLogoutVisible(false);
        navigation.replace("Login");
    };

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{flex: 1, backgroundColor: '#F3F4F6'}}>
          <StatusBar
            barStyle="dark-content"
            translucent
            backgroundColor="transparent"
          />
          <View style={styles.header}>
            <Text style={styles.heading}>Shopping Bag</Text>
            <View style={styles.headerIcons}>
              <Pressable style={styles.iconButton}>
                <Ionicons name="search-outline" size={24} color="#000" />
              </Pressable>
              <Pressable
                style={styles.iconButton}
                onPress={() => setIsLogoutVisible(true)}>
                <Ionicons name="settings-outline" size={24} color="#000" />
              </Pressable>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.menuScroll}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {menuOptions.map(option => {
                const animatedBg = animatedValues[option.label].interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#E5E7EB', '#3B82F6'],
                });
                const isSelected = selectedOption === option.label;
                const textColor = isSelected ? '#FFFFFF' : '#1F2937';
                const iconColor = isSelected ? '#FFFFFF' : '#000000';

                return (
                  <Pressable
                    key={option.label}
                    onPress={() => setSelectedOption(option.label)}
                    style={{marginRight: 10}}>
                    <Animated.View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                        borderRadius: 9999,
                        backgroundColor: animatedBg,
                      }}>
                      <Ionicons
                        name={option.icon}
                        size={16}
                        color={iconColor}
                      />
                      <Text
                        style={{
                          color: textColor,
                          marginLeft: 8,
                          fontSize: 16,
                          marginTop: -2,
                        }}>
                        {option.label}
                      </Text>
                    </Animated.View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <FlatList
            data={products}
            renderItem={({item}) => (
              <ProductCard product={item} navigation={navigation} />
            )}
            keyExtractor={item => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 16, paddingHorizontal: 8}}
            columnWrapperStyle={{justifyContent: 'space-between'}}
          />

          {/*<Pressable*/}
          {/*    style={{*/}
          {/*        backgroundColor: "#3B82F6",*/}
          {/*        margin: 16,*/}
          {/*        padding: 16,*/}
          {/*        borderRadius: 12,*/}
          {/*        alignItems: "center",*/}
          {/*    }}*/}
          {/*    onPress={() => navigation.navigate("UhfScanner")} // ✅ navigate*/}
          {/*>*/}
          {/*    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>*/}
          {/*        Go to Scanner*/}
          {/*    </Text>*/}
          {/*</Pressable>*/}

          {isLogoutVisible && (
            <View style={styles.logoutOverlay}>
              <View style={styles.logoutDialog}>
                <Text style={styles.logoutTitle}>Logout</Text>
                <Text style={styles.logoutText}>
                  Are you sure you want to log out?
                </Text>
                <View style={{flexDirection: 'row', marginTop: 16}}>
                  <Pressable
                    style={[styles.logoutButton, {backgroundColor: '#E5E7EB'}]}
                    onPress={() => setIsLogoutVisible(false)}>
                    <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.logoutButton, {backgroundColor: '#EF4444'}]}
                    onPress={handleLogout}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                      }}>
                      Logout
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {fontSize: 24, fontWeight: 'bold'},
  headerIcons: {flexDirection: 'row'},
  iconButton: {padding: 8, borderRadius: 9999},
  menuScroll: {marginVertical: 16, paddingLeft: 10, paddingRight: 10},
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newText: {color: '#fff', fontWeight: 'bold', fontSize: 12},
  cardContent: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    marginTop: 8,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  cardDesc: {fontSize: 12, color: '#6B7280', marginBottom: 4},
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardPrice: {fontWeight: 'bold', color: '#3B82F6'},
  plusButton: {backgroundColor: '#3B82F6', borderRadius: 9999, padding: 8},
  logoutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutDialog: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  logoutTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 8},
  logoutText: {fontSize: 14, color: '#6B7280', textAlign: 'center'},
  logoutButton: {flex: 1, padding: 12, borderRadius: 9999, marginHorizontal: 4},
});
