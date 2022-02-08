import React, { useState } from 'react';
import storage from '@react-native-firebase/storage';

import { Alert } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';

import { Container, Content, Progress, Transferred } from './styles';

export function Upload() {
  const [image, setImage] = useState('');
  const [bytesTransferred, setBytesTransferred] = useState('');
  const [progress, setProgress] = useState('0');

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status == 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  }

  async function handleUpload() {
    const filename = new Date().getTime();
    const reference = storage().ref(`/images/${filename}.png`);

    // reference
    //   .putFile(image)
    //   .then(() => Alert.alert('Upload concluído'))
    //   .catch((error) => console.error(error));

    const uploadTask = reference.putFile(image);

    uploadTask.on('state_changed', (taskSnapshot) => {
      const percent = (
        (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(percent);

      setBytesTransferred(
        `${taskSnapshot.bytesTransferred} transferido de ${taskSnapshot.totalBytes}`
      );
    });

    uploadTask
      .then(async () => {
        const imageUrl = reference.getDownloadURL();
        //TODO: save image on a local database
        console.log(imageUrl);
        Alert.alert('Upload concluído com sucesso');
      })
      .catch((error) => console.error(error));
  }

  return (
    <Container>
      <Header title='Upload de Fotos' />

      <Content>
        <Photo uri={image} onPress={handlePickImage} />

        <Button title='Fazer upload' onPress={handleUpload} />

        <Progress>{progress}%</Progress>

        <Transferred>{bytesTransferred}</Transferred>
      </Content>
    </Container>
  );
}
