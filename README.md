# React Native Developer Test

## Project Overview
A React Native mobile application that demonstrates core mobile development concepts including data fetching, state management, push notifications, and comprehensive testing.

## Section 1: Core Mobile App Development ✅

### State Management (Redux)
- **Redux Setup**: Implemented comprehensive Redux store with proper TypeScript integration
- **Async Operations**: Used Redux Toolkit's `createAsyncThunk` for handling API calls
- **State Structure**: Clean separation of concerns with dedicated post slice managing loading, error, and pagination states

### FlatList Implementation
- **Data Source**: Fetches posts from `https://jsonplaceholder.typicode.com/posts`
- **Infinite Scrolling**: Implemented pagination with `onEndReached` functionality
- **State Handling**: Proper loading and error state management with user feedback
- **Pull-to-Refresh**: Integrated `RefreshControl` for manual data refresh

### Performance Optimizations
- **FlatList Optimizations**: 
  - `keyExtractor` for unique item identification
  - `initialNumToRender={10}` for initial rendering control
  - `maxToRenderPerBatch={10}` for batch rendering
  - `windowSize={10}` for memory management
  - `removeClippedSubviews={true}` for performance
- **Debounced Loading**: Implemented debounced load more functionality to prevent excessive API calls

### Code Quality
- **Separation of Concerns**: Clear folder structure with dedicated directories for components, hooks, Redux, API, and utilities
- **Custom Hooks**: Type-safe Redux hooks (`useAppDispatch`, `useAppSelector`)
- **Modular Components**: Reusable `PostItem` component with consistent styling
- **TypeScript**: Full TypeScript implementation for type safety

![Screenshot](./assets/mobile.png)

## Section 2: Push Notifications ✅

### Firebase Cloud Messaging Integration
- **FCM Setup**: Configured Firebase Cloud Messaging for push notifications
- **Permission Handling**: Implemented user permission request flow
- **Token Management**: Proper FCM token generation and logging

### Notification Handling
- **Foreground Notifications**: Alert-based notification display when app is active
- **Background Notifications**: Background message handler implementation
- **App Launch Handling**: 
  - Initial notification detection for cold app starts
  - Background-to-foreground notification handling

### Implementation Details
- **Firebase Console**: Used Firebase console for manual notification triggering
- **Cross-Platform**: Compatible notification setup for both iOS and Android
- **State Management**: Integrated notification handling without disrupting existing functionality

*Note: Testing was limited due to build constraints, but full notification infrastructure is implemented and ready for production testing. I could not test it because the limit of EAS build has been reached and it was asking for pad tier, but we can test it after making the build of this application*

## Section 3: Unit Testing ✅

### Testing Framework
- **Jest**: Primary testing framework for unit and integration tests
- **Comprehensive Coverage**: Tests cover critical application logic

### Unit Tests
- **Redux Slice Testing**: Complete test suite for post slice including:
  - Initial state validation
  - Action creators (fetchPosts, resetAll)
  - Async thunk lifecycle (pending, fulfilled, rejected)
  - Pagination logic validation
  - Error handling scenarios

### Integration Tests
- **API + Redux Integration**: End-to-end testing of API calls with Redux state management
- **Real API Testing**: Tests against actual JSONPlaceholder API
- **Multi-page Testing**: Validation of pagination functionality
- **Error Handling**: Testing of error scenarios and recovery

### Test Coverage
- **High Coverage**: Comprehensive test coverage across critical application components
- **Edge Cases**: Tests include edge cases and error scenarios
- **Maintainable Tests**: Well-structured test suite with proper mocking and setup

![TestCases](./assets/test.png)

## Technical Architecture

### Folder Structure
```
src/
├── api/              # API layer
├── components/       # Reusable UI components
├── config/redux/     # Redux store and slices
├── hooks/           # Custom React hooks
├── screens/         # Screen components
├── utils/           # Utility functions and types
└── __test__/        # Test files
```

### Key Features
- Type-safe Redux implementation
- Efficient FlatList with performance optimizations
- Comprehensive error handling and loading states
- Firebase push notification integration
- Robust testing suite with high coverage
- Clean, maintainable code architecture

## Installation & Setup

1. Install dependencies: `npm install`
2. Configure Firebase for push notifications
3. Run tests: `npm test`
4. Start the Local Server `npx expo start` and run it in expo go or andriod simulator.

This implementation demonstrates proficiency in modern React Native development practices, state management, performance optimization, and comprehensive testing methodologies.