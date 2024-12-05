import React from 'react';
import { View, Text, TouchableOpacity, Modal, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import ArticleForm from './ArticleForm';

interface NewArticleModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (article: any) => void;
}

export default function NewArticleModal({ isVisible, onClose, onSubmit }: NewArticleModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-black bg-opacity-50">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end"
        >
          <View className="bg-white rounded-t-3xl p-6 h-5/6">
            <ArticleForm onSubmit={onSubmit} />
            <TouchableOpacity
              onPress={onClose}
              className="mt-4 bg-gray-200 py-3 rounded-lg"
            >
              <Text className="text-gray-700 text-center font-medium">Annuler</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}