import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAlbumById } from "../../services/albumService";
import { getPhotosByAlbum } from "../../services/photoService";
import Lightbox from "../../components/gallery/Lightbox";

export default function AlbumView() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [albumRes, photosRes] = await Promise.all([
          getAlbumById(id),
          getPhotosByAlbum(id),
        ]);
        setAlbum(albumRes.data.data);
        setPhotos(photosRes.data.data);
      } catch (err) {
        setError("Could not load this album.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-text-muted">Loading...</p>;
  }

  if (error || !album) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-red-500">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link
        to={`/photographers/${album.photographer}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft size={14} />
        Back to profile
      </Link>

      <h1 className="text-2xl font-bold">{album.title}</h1>
      {album.description && (
        <p className="mt-1 text-sm text-text-muted">{album.description}</p>
      )}
      <p className="mt-1 text-xs text-text-muted">{photos.length} photos</p>

      {photos.length === 0 ? (
        <p className="mt-10 text-sm text-text-muted">No photos uploaded to this album yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((photo, index) => (
            <button
              key={photo._id}
              onClick={() => setLightboxIndex(index)}
              className="aspect-square overflow-hidden rounded-lg border border-border"
            >
              <img
                src={photo.url}
                alt=""
                className="h-full w-full object-cover transition hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        photos={photos}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}