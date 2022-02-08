import React, { useState, useEffect } from 'react';
import storage from '@react-native-firebase/storage';
import { Alert } from 'react-native';

import { FlatList } from 'react-native';

import { Container, PhotoInfo } from './styles';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';
import { File, FileProps } from '../../components/File';

export function Receipts() {
  const [photos, setPhotos] = useState<FileProps[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [photoInfo, setPhotoInfo] = useState('');

  async function handleShowImage(path: string) {
    const urlImage = await storage().ref(path).getDownloadURL();
    setSelectedPhoto(urlImage);

    const info = await storage().ref(path).getMetadata();
    setPhotoInfo(`Upload realizado em ${info.timeCreated}`);
  }

  async function fetchImages() {
    storage()
      .ref('images')
      .list()
      .then((result) => {
        const files: FileProps[] = [];

        result.items.forEach((file) => {
          files.push({
            name: file.name,
            path: file.fullPath,
          });
        });

        setPhotos(files);
      });
  }

  async function handleDeleteImage(path: string) {
    await storage()
      .ref(path)
      .delete()
      .then(() => {
        Alert.alert('Imagem excluída com sucesso!');
        fetchImages();
      })
      .catch((error) => {
        Alert.alert('Oops!', 'Erro ao excluir a imagem');
        console.error(error);
      });
  }

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <Container>
      <Header title='Comprovantes' />

      <Photo uri={selectedPhoto} />

      <PhotoInfo>{photoInfo}</PhotoInfo>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <File
            data={item}
            onShow={() => handleShowImage(item.path)}
            onDelete={() => handleDeleteImage(item.path)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', padding: 24 }}
      />
    </Container>
  );
}
