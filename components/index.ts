/**
 * Barrel export for components
 * Provides clean imports throughout the application
 */

// Export all components - using named exports where applicable
export { default as ProfileCard, ProfileCardProps } from './ProfileCard';
export { ProfileList } from './profile-list';
export { default as SearchFilter, FilterOptions } from './SearchFilter';
export { UserForm, UserFormData } from './UserForm';
export { ImageSlider } from './ImageSlider';
export { ExternalLink } from './external-link';
export { HapticTab } from './haptic-tab';
export { HelloWave } from './hello-wave';
export { default as ParallaxScrollView } from './parallax-scroll-view';
export { ThemedText } from './themed-text';
export { ThemedView } from './themed-view';
export {
	ProfileListEmpty,
	ProfileListError,
	ProfileListInitialLoading,
	ProfileListLoadingMore,
} from './profile-list-state';

// UI Components
export { Collapsible } from './ui/collapsible';
export { IconSymbol } from './ui/icon-symbol';
export { default as TabBarBackground, useTabBarHeight } from './ui/TabBarBackground';
