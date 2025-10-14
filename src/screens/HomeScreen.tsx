import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchPosts , resetAll } from '../config/redux/postSlice';
import PostItem, { ITEM_HEIGHT } from '../components/postItem';
import { Post } from '../utils/types';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { items, loading, refreshing, error, page, hasMore } = useAppSelector(
    (s) => s.posts
  );

  useEffect(() => {
    // initial load
    if (items.length === 0) {
      dispatch(fetchPosts({ page: 1 }));
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loading || refreshing || !hasMore) return;
    // page in state is the next page to request (see slice)
    dispatch(fetchPosts({ page }));
  }, [loading, refreshing, hasMore, page]);

  const handleRefresh = useCallback(() => {
    dispatch(resetAll());
    dispatch(fetchPosts({ page: 1 }));
  }, []);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No posts available.</Text>
        {error ? (
          <>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={() => dispatch(fetchPosts({ page: 1 }))}
              style={styles.retryBtn}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={(item: Post) => item.id.toString()}
        renderItem={({ item }) => <PostItem item={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f3f4f6', paddingTop: 12 },
  footer: { padding: 12, alignItems: 'center' },
  empty: { padding: 24, alignItems: 'center' },
  emptyText: { fontSize: 16, marginBottom: 8 },
  errorText: { color: 'red', marginBottom: 12 },
  retryBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryText: { color: '#fff', fontWeight: '600' },
});
