# TODO: Implement User Profile Caching

## Tasks

- [ ] Modify `getUserProfile` in `services/api.ts` to check AsyncStorage for cached profile before making API call
- [ ] Store fetched profile in AsyncStorage after successful API call
- [ ] Clear cached profile on logout in `logout` method
- [ ] Update cached profile on profile update in `updateUserProfile` method
- [ ] Test caching behavior on page loads and after logout/update

## Notes

- Cache key: 'userProfile'
- Cache until logout or profile update
- No expiry time, as per requirement
