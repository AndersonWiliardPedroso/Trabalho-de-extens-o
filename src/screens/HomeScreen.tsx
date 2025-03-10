import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, View } from 'react-native';
import { Button, TextInput, Card, Title, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Order, RootStackParamList } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const { colors } = useTheme();
  const [clientName, setClientName] = useState('');
  const [pastaType, setPastaType] = useState('tortei');
  const [quantity, setQuantity] = useState('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();

  useEffect(() => {
    if (route.params?.orderToEdit) {
      const order = route.params.orderToEdit;
      setEditingOrder(order);
      setClientName(order.clientName);
      setPastaType(order.pastaType);
      setQuantity(order.quantity);
    }
  }, [route.params?.orderToEdit]);

  const saveOrder = async () => {
    if (!clientName.trim()) {
      Alert.alert('Erro', 'Por favor, insira o nome do cliente.');
      return;
    }

    const quantityNumber = parseFloat(quantity);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      Alert.alert('Erro', 'A quantidade deve ser um número válido e maior que zero.');
      return;
    }

    const newOrder: Order = {
      id: editingOrder ? editingOrder.id : Date.now().toString(),
      clientName,
      pastaType,
      quantity: quantityNumber.toString(),
      date: new Date().toLocaleDateString(),
    };

    const savedOrders = await loadOrdersFromStorage();
    const updatedOrders = editingOrder
      ? savedOrders.map((order: Order) => (order.id === editingOrder.id ? newOrder : order))
      : [...savedOrders, newOrder];

    await saveOrdersToStorage(updatedOrders);

    setClientName('');
    setQuantity('');
    setEditingOrder(null);
    Alert.alert('Sucesso', 'Pedido salvo com sucesso!');
    navigation.navigate('Orders');
  };

  const saveOrdersToStorage = async (orders: Order[]) => {
    try {
      const jsonValue = JSON.stringify(orders);
      await AsyncStorage.setItem('@orders', jsonValue);
    } catch (e) {
      console.error('Erro ao salvar pedidos:', e);
      Alert.alert('Erro', 'Não foi possível salvar o pedido. Tente novamente.');
    }
  };

  const loadOrdersFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@orders');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Erro ao carregar pedidos:', e);
      return [];
    }
  };

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>
              <Icon name="notebook-edit" size={24} color={colors.primary} />{' '}
              {editingOrder ? 'Editar Pedido' : 'Registrar Pedido'}
            </Title>

            <TextInput
              label="Nome do Cliente"
              value={clientName}
              onChangeText={setClientName}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon={({ size, color }) => <Icon name="account" size={size} color={color} />} />}
            />

            <Title style={styles.label}>Tipo de Massa:</Title>
            <Button
              mode={pastaType === 'tortei' ? 'contained' : 'outlined'}
              onPress={() => setPastaType('tortei')}
              style={styles.button}
            >
              Tortei
            </Button>
            <Button
              mode={pastaType === 'capeletti' ? 'contained' : 'outlined'}
              onPress={() => setPastaType('capeletti')}
              style={styles.button}
            >
              Capeletti
            </Button>
            <Button
              mode={pastaType === 'macarrao' ? 'contained' : 'outlined'}
              onPress={() => setPastaType('macarrao')}
              style={styles.button}
            >
              Macarrão
            </Button>

            <TextInput
              label="Quantidade (kg)"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon={({ size, color }) => <Icon name="weight" size={size} color={color} />} />}
            />

            <Button
              mode="contained"
              onPress={saveOrder}
              style={styles.saveButton}
              labelStyle={styles.saveButtonLabel}
              icon={() => <Icon name="content-save" size={20} color="#fff" />}
            >
              {editingOrder ? 'Atualizar Pedido' : 'Salvar Pedido'}
            </Button>

            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Orders')}
              style={styles.viewOrdersButton}
              icon={() => <Icon name="format-list-bulleted" size={20} color="#6200ee" />}
            >
              Ver Pedidos
            </Button>
          </Card.Content>
        </Card>
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
    flexGrow: 1, // Faz o conteúdo do ScrollView ocupar toda a altura
    padding: 16,
  },
  card: {
    margin: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#6200ee', // Cor primária
  },
  saveButtonLabel: {
    color: '#fff', // Texto branco
  },
  viewOrdersButton: {
    marginTop: 8,
    borderColor: '#6200ee', // Cor primária
  },
});

export default HomeScreen;