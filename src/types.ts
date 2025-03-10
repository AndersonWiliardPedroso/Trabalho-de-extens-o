// src/types.ts
export type Order = {
  id: string;
  clientName: string;
  pastaType: string;
  quantity: string;
  date: string;
};

export type RootStackParamList = {
  Home: { orderToEdit?: Order }; 
  Orders: undefined;
};