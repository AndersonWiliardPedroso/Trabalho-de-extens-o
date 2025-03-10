import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Title, Button, useTheme, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Order, RootStackParamList } from '../types';

const OrdersScreen = () => {
  const { colors } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadOrders = async () => {
      const savedOrders = await loadOrdersFromStorage();
      setOrders(savedOrders);
    };
    loadOrders();
  }, []);

  const loadOrdersFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@orders');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Erro ao carregar pedidos:', e);
      return [];
    }
  };

  const deleteOrder = async (id: string) => {
    const updatedOrders = orders.filter((order) => order.id !== id);
    await saveOrdersToStorage(updatedOrders);
    setOrders(updatedOrders);
  };

  const editOrder = (order: Order) => {
    navigation.navigate('Home', { orderToEdit: order });
  };

  const saveOrdersToStorage = async (orders: Order[]) => {
    try {
      const jsonValue = JSON.stringify(orders);
      await AsyncStorage.setItem('@orders', jsonValue);
    } catch (e) {
      console.error('Erro ao salvar pedidos:', e);
    }
  };

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Title style={styles.title}>
          <Icon name="format-list-bulleted" size={24} color={colors.primary} />{' '}
          Pedidos Registrados
        </Title>

        {orders.map((order) => (
          <Card key={order.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.orderText}>Cliente: {order.clientName}</Text>
              <Text style={styles.orderText}>Tipo de Massa: {order.pastaType}</Text>
              <Text style={styles.orderText}>Quantidade: {order.quantity} kg</Text>
              <Text style={styles.orderText}>Data: {order.date}</Text>

              <View style={styles.buttonsContainer}>
                <Button
                  mode="contained"
                  onPress={() => editOrder(order)}
                  style={styles.editButton}
                  icon={() => <Icon name="pencil" size={20} color="#fff" />}
                >
                  Editar
                </Button>
                <Button
                  mode="contained"
                  onPress={() => deleteOrder(order.id)}
                  style={styles.deleteButton}
                  icon={() => <Icon name="delete" size={20} color="#fff" />}
                >
                  Deletar
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1, 
    backgroundColor: '#f5f5f5', 
  },
  scrollContainer: {
    flexGrow: 1, 
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#6200ee', // Cor primária
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#ff4444', // Cor de erro
  },
});

export default OrdersScreen;