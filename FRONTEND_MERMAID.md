# Frontend Mermaid - matrimonialApp

This file provides a quick visual map of the React Expo frontend architecture.

## App Layers

```mermaid
flowchart TD
  Screens[Expo Router Screens] --> Hooks[Custom Hooks]
  Screens --> Components[Reusable Components]
  Hooks --> Services[API Service Layer]
  Components --> Services
  Services --> Backend[Node/Express Backend]
  Screens --> Storage[AsyncStorage]
  Hooks --> Utils[Utilities]

  subgraph Shared_Refactor[Shared Refactor Artifacts]
    HookA[hooks/usePaginatedProfileCards.ts]
    UtilsA[utils/profileCardMapper.ts]
    CompA[components/profile-list-state.tsx]
  end

  Hooks --> HookA
  Utils --> UtilsA
  Components --> CompA
```

## List Screen Flow

```mermaid
sequenceDiagram
  participant Home as Home/MyCity/Shortlisted Screen
  participant Hook as usePaginatedProfileCards
  participant API as apiService
  participant BE as Backend Endpoint
  participant Mapper as mapMatchToProfileCard
  participant Card as ProfileCard

  Home->>Hook: fetchProfiles() or loadMoreProfiles()
  Hook->>API: getPotentialMatches / getSameCityUsers / getShortlistedProfiles
  API->>BE: HTTP Request
  BE-->>API: matches + hasMore payload
  API-->>Hook: ApiResponse
  Hook->>Mapper: normalize each match
  Mapper-->>Hook: ProfileCardItem[]
  Hook-->>Home: profiles, isLoading, errorMessage, hasMore
  Home->>Card: render profile list
```

## Interaction Flow (Interest / Shortlist / Message)

```mermaid
flowchart LR
  UserAction[User taps action] --> CardOrDetail[ProfileCard or profile/[id]]
  CardOrDetail --> InterestAPI[Interest APIs]
  CardOrDetail --> ShortlistAPI[Shortlist APIs]
  CardOrDetail --> ChatGate{Interest accepted?}
  ChatGate -->|Yes| ResolveConversation[Resolve conversationId]
  ResolveConversation --> OpenChat[Open chat/[conversationId]]
  ChatGate -->|No| BlockMessage[Show restriction / no navigation]
```

## TODO Notes

- TODO: Replace remaining loose response typing with shared DTO interfaces.
- TODO: Move hardcoded list-state colors to centralized theme tokens.
- TODO: Add tests for `usePaginatedProfileCards` and `profileCardMapper`.
