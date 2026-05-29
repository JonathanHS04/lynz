const albumMergeInflight = new Map<string, Promise<void>>();

export const enqueueAlbumMergeTask = (
  albumId: string,
  task: () => Promise<void>,
) => {
  const previous = albumMergeInflight.get(albumId);
  const promise = (previous ?? Promise.resolve())
    .catch(() => undefined)
    .then(task)
    .finally(() => {
      if (albumMergeInflight.get(albumId) === promise) {
        albumMergeInflight.delete(albumId);
      }
    });

  albumMergeInflight.set(albumId, promise);
  return promise;
};
