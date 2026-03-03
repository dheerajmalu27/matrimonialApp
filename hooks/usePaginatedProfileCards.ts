import { useCallback, useMemo, useRef, useState } from "react";
import { mapMatchToProfileCard, type ProfileCardItem } from "@/utils/profileCardMapper";

type MatchesPayload = {
  matches: any[];
  hasMore: boolean;
};

type MatchesResponseLike = {
  success?: boolean;
  message?: string;
  data?: MatchesPayload;
  matches?: any[];
  hasMore?: boolean;
};

type FetchProfilesFn = (
  limit: number,
  offset: number,
) => Promise<MatchesResponseLike>;

/**
 * Reusable hook for profile list screens that support pagination and `ProfileCard` rendering.
 */
export function usePaginatedProfileCards(fetchProfilesFn: FetchProfilesFn, pageSize = 20) {
  const [profiles, setProfiles] = useState<ProfileCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);

  const fetchProfiles = useCallback(
    async (loadMore = false) => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const requestOffset = loadMore ? offsetRef.current : 0;
        const response = await fetchProfilesFn(pageSize, requestOffset);

        const payload: MatchesPayload | null = response?.data?.matches
          ? response.data
          : response?.matches
            ? {
                matches: response.matches,
                hasMore: Boolean(response.hasMore),
              }
            : null;

        if (!payload) {
          setErrorMessage(response?.message || "Failed to load profiles");
          return;
        }

        // Normalize backend matches once so all list screens receive a consistent card shape.
        const mappedProfiles = payload.matches.map(mapMatchToProfileCard);

        setProfiles((previous) => (loadMore ? [...previous, ...mappedProfiles] : mappedProfiles));
        const nextOffset = requestOffset + mappedProfiles.length;
        setOffset(nextOffset);
        offsetRef.current = nextOffset;
        setHasMore(Boolean(payload.hasMore));
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to load profiles");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProfilesFn, pageSize],
  );

  const resetProfiles = useCallback(() => {
    setProfiles([]);
    setOffset(0);
    offsetRef.current = 0;
    setHasMore(true);
  }, []);

  const loadMoreProfiles = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchProfiles(true);
    }
  }, [fetchProfiles, hasMore, isLoading]);

  return useMemo(
    () => ({
      profiles,
      isLoading,
      errorMessage,
      hasMore,
      fetchProfiles,
      loadMoreProfiles,
      resetProfiles,
      setProfiles,
    }),
    [profiles, isLoading, errorMessage, hasMore, fetchProfiles, loadMoreProfiles, resetProfiles],
  );
}

// TODO: Add optional stale-time cache to prevent re-fetch on quick tab switches.
// TODO: Replace response-like loose typing with shared response interfaces from the API layer.
