import React, { useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { fetchPosts, resetAll } from "../config/redux/postSlice";
import PostItem, { ITEM_HEIGHT } from "../components/postItem";
import { Post } from "../utils/types";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { items, loading, refreshing, error, page, hasMore } = useAppSelector(
    (s) => s.posts
  );

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchPosts({ page: 1 }));
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loading || refreshing || !hasMore) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      console.log(" Loading more Page...", page);
      dispatch(fetchPosts({ page }));
    }, 100);
  }, [loading, refreshing, hasMore]);

  const handleRefresh = useCallback(() => {
    console.log("Refresh triggered...");
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
        onEndReachedThreshold={0.6}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
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
  screen: { flex: 1, backgroundColor: "#f3f4f6", paddingTop: 12 },
  footer: { padding: 12, alignItems: "center" },
  empty: { padding: 24, alignItems: "center" },
  emptyText: { fontSize: 16, marginBottom: 8 },
  errorText: { color: "red", marginBottom: 12 },
  retryBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryText: { color: "#fff", fontWeight: "600" },
});
