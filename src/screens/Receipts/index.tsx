import React, { useState, useEffect } from 'react';
import storage from '@react-native-firebase/storage';

import { FlatList } from 'react-native';

import { Container, PhotoInfo } from './styles';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';
import { File, FileProps } from '../../components/File';

export function Receipts() {
  const [photos, setPhotos] = useState<FileProps[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState('');

  async function handleShowImage(path: string) {
    const urlImage = await storage().ref(path).getDownloadURL();
    setSelectedPhoto(urlImage);
  }

  useEffect(() => {
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
  }, []);

  return (
    <Container>
      <Header title='Comprovantes' />

      <Photo uri={selectedPhoto} />

      <PhotoInfo>Informações da foto</PhotoInfo>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <File
            data={item}
            onShow={() => handleShowImage(item.path)}
            onDelete={() => {}}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', padding: 24 }}
      />
    </Container>
  );
}
