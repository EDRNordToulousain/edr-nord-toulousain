export type GalleryPhoto = {
  src: string;
  alt: string;
};

export const galleryPhotos: readonly GalleryPhoto[] = Array.from(
  { length: 20 },
  (_, index) => ({
    src: `/images/gallery/ld-studio/ld-studio-${String(index + 1).padStart(2, "0")}.jpg`,
    alt: `Moment de vie à l’EDR Nord Toulousain — photographie ${index + 1}`,
  }),
);
