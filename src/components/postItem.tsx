import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Post } from '../utils/types';

const ITEM_HEIGHT = 90; 

interface Props {
  item: Post;
}

const PostItemInner: React.FC<Props> = ({ item }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.body} numberOfLines={3}>{item.body}</Text>
    </View>
  );
};

const PostItem = React.memo(PostItemInner);
export { ITEM_HEIGHT };
export default PostItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  body: {
    fontSize: 13,
    color: '#444',
  },
});
