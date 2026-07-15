import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getAlbumsByPhotographer,
  createAlbum,
  deleteAlbum,
} from "../../services/albumService";
import DashboardTabs from "../../components/dashboard/DashboardTabs";

export default function MyAlbums() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchAlbums = async () => {
    try {
      const res = await getAlbumsByPhotographer(user.photographerProfile);
      setAlbums(res.data.data);
    } catch (err) {
      setError("Could not load your albums.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setCreating(true);
    try {
      await createAlbum({
        title,
        description,
        category,
        visibility,
        photographer: user.photographerProfile,
      });
      setShowModal(false);
      setTitle("");
      setDescription("");
      setCategory("");
      setVisibility("public");
      fetchAlbums();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not create album.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (albumId) => {
    if (!confirm("Delete this album? This cannot be undone.")) return;
    try {
      await deleteAlbum(albumId);
      setAlbums((prev) => prev.filter((a) => a._id !== albumId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete album.");
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-text-muted">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <DashboardTabs />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Albums</h1>
          <p className="mt-1 text-sm text-text-muted">Organize your work into albums.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-accent-gradient px-4 py-2.5 text-sm font-medium text-white"
        >
          <Plus size={16} />
          New Album
        </button>
      </div>

      {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

      {!error && albums.length === 0 && (
        <p className="mt-10 text-sm text-text-muted">
          You haven't created any albums yet. Click "New Album" to get started.
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <div key={album._id} className="rounded-xl border border-border bg-bg-surface overflow-hidden">
            <Link to={`/dashboard/albums/${album._id}`}>
              <div className="flex aspect-video items-center justify-center bg-bg text-text-muted">
                {album.coverPhoto ? (
                  <img src={album.coverPhoto} alt={album.title} className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon size={24} />
                )}
              </div>
            </Link>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Link to={`/dashboard/albums/${album._id}`} className="font-semibold hover:text-accent">
                    {album.title}
                  </Link>
                  <p className="mt-0.5 text-xs capitalize text-text-muted">
                    {album.category} · {album.visibility}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(album._id)}
                  className="rounded-lg p-2 text-text-muted hover:bg-red-500/10 hover:text-red-500"
                  aria-label="Delete album"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-md rounded-xl border border-border bg-bg p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create New Album</h2>
              <button onClick={() => setShowModal(false)} aria-label="Close">
                <X size={18} className="text-text-muted" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              {formError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                  {formError}
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
                >
                  <option value="">Select category</option>
                  <option value="wedding">Wedding</option>
                  <option value="portrait">Portrait</option>
                  <option value="wildlife">Wildlife</option>
                  <option value="landscape">Landscape</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Visibility</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="mt-2 rounded-lg bg-accent-gradient px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create Album"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}