import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';

import { Container, Account, Title, Subtitle } from './styles';
import { ButtonText } from '../../components/ButtonText';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Alert } from 'react-native';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignInAnonymously() {
    const { user } = await auth().signInAnonymously();
    console.log(user);
  }

  async function handleSignInWithEmailAndPassword() {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        console.log(user);
      })
      .catch((error) => {
        console.log('sign in error', error.code);

        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password'
        ) {
          Alert.alert('Usuário não encontrado. E-mail e/ou senha inválidos');
        }
      });
  }

  function handleCreateUserAccount() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('Usuário criado com sucesso');
      })
      .catch((error) => {
        console.error(error);
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('E-mail não disponível. Favor escolher outro!');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('E-mail inválido!');
        } else if (error.code === 'auth/weak-password') {
          Alert.alert('A senha deve ter no mínimo 6 dígitos');
        } else {
          Alert.alert('Oops...', 'Erro ao criar usuário');
        }
      });
  }

  return (
    <Container>
      <Title>MyShopping</Title>
      <Subtitle>monte sua lista de compra te ajudar nas compras</Subtitle>

      <Input
        placeholder='e-mail'
        keyboardType='email-address'
        onChangeText={setEmail}
      />

      <Input placeholder='senha' secureTextEntry onChangeText={setPassword} />

      <Button title='Entrar' onPress={handleSignInWithEmailAndPassword} />

      <Account>
        <ButtonText title='Recuperar senha' onPress={() => {}} />
        <ButtonText
          title='Criar minha conta'
          onPress={handleCreateUserAccount}
        />
      </Account>
    </Container>
  );
}
