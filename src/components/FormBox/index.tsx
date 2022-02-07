import React, { useState } from 'react';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { Container } from './styles';
import { ButtonIcon } from '../ButtonIcon';
import { Input } from '../Input';

export function FormBox() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);

  async function handleAddProduct() {
    firestore()
      .collection('products')
      .add({
        description,
        amount,
        done: false,
      })
      .then(() => {
        Alert.alert('Produto adicionado com sucesso!');
      })
      .catch((error) => console.error(error));
  }

  return (
    <Container>
      <Input
        placeholder='Nome do produto'
        size='medium'
        onChangeText={setDescription}
      />

      <Input
        placeholder='0'
        keyboardType='numeric'
        size='small'
        style={{ marginHorizontal: 8 }}
        onChangeText={(value) => setAmount(Number(value))}
      />

      <ButtonIcon
        size='large'
        icon='add-shopping-cart'
        onPress={handleAddProduct}
      />
    </Container>
  );
}
