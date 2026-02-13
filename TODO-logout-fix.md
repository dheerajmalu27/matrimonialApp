# TODO: Fix Logout Functionality

## Steps to Complete

- [x] Update app/\_layout.tsx to check for "accessToken" instead of "userToken"
- [x] Update app/(tabs)/\_layout.tsx logout to use apiService.logout() for consistency
- [x] Test logout functionality

## Information Gathered

- Root layout checks for "userToken" but login stores "accessToken"
- Two different logout implementations (one calls API, one doesn't)
- API logout properly clears tokens

## Plan

- Update app/\_layout.tsx to check for "accessToken" instead of "userToken"
- Update app/(tabs)/\_layout.tsx logout to use apiService.logout() for consistency

## Dependent Files to be edited

- app/\_layout.tsx
- app/(tabs)/\_layout.tsx

## Followup steps

- Test logout functionality
