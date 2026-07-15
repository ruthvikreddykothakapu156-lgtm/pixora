import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Image as ImageIcon, X } from "lucide-react";
import { getAlbumById, updateAlbum } from "../../services/albumService";
import { getPhotosByAlbum, uploadPhotos, deletePhoto } from "../../services/photoService";

export default function AlbumEditor() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchAll = async () => {
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

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const removeSelectedFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploadError("");
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      formData.append("album", id);

      await uploadPhotos(formData);

      setFiles([]);
      setPreviews([]);
      fetchAll();
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await deletePhoto(photoId);
      setPhotos((prev) => prev.filter((p) => p._id !== photoId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete photo.");
    }
  };

  const handleSetCover = async (photoUrl) => {
    try {
      await updateAlbum(id, { coverPhoto: photoUrl });
      setAlbum((prev) => ({ ...prev, coverPhoto: photoUrl }));
    } catch (err) {
      alert(err.response?.data?.message || "Could not set cover photo.");
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-text-muted">Loading...</p>;
  }

  if (error || !album) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-red-500">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link
        to="/dashboard/albums"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft size={14} />
        Back to My Albums
      </Link>

      <h1 className="text-2xl font-bold">{album.title}</h1>
      <p className="mt-1 text-sm text-text-muted">{photos.length} photos</p>

      {/* Upload box */}
      <div className="mt-6 rounded-xl border border-border bg-bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold">Upload Photos</h2>
        <p className="mb-3 text-xs text-text-muted">Select multiple images at once (up to 20).</p>

        {uploadError && (
          <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
            {uploadError}
          </div>
        )}

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-bg p-6 text-center hover:border-accent">
          <Upload size={18} className="text-text-muted" />
          <span className="text-sm text-text-muted">
            {files.length > 0 ? `${files.length} photo(s) selected` : "Click to select photos"}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
            {previews.map((src, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => removeSelectedFile(i)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 hover:bg-red-500 group-hover:opacity-100"
                  aria-label="Remove"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className="mt-4 w-full rounded-lg bg-accent-gradient px-6 py-3 text-sm font-medium text-white disabled:opacity-50 sm:w-auto"
        >
          {uploading ? "Uploading..." : `Upload ${files.length > 0 ? files.length : ""} Photo${files.length === 1 ? "" : "s"}`}
        </button>
      </div>

      {/* Photo grid */}
      <div className="mt-8">
        {photos.length === 0 ? (
          <p className="text-sm text-text-muted">No photos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo._id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                <img src={photo.url} alt="" className="h-full w-full object-cover" />
                {album.coverPhoto === photo.url && (
                  <span className="absolute left-2 top-2 rounded-full bg-accent-gradient px-2 py-0.5 text-[10px] font-medium text-white">
                    Cover
                  </span>
                )}
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleSetCover(photo.url)}
                    className="rounded-full bg-black/60 p-2 text-white hover:bg-accent"
                    aria-label="Set as cover"
                    title="Set as cover"
                  >
                    <ImageIcon size={14} />
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo._id)}
                    className="rounded-full bg-black/60 p-2 text-white hover:bg-red-500"
                    aria-label="Delete photo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}