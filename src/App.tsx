import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import OrdersScreen from './screens/OrdersScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Registrar Pedido' }} />
        <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Pedidos Registrados' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;