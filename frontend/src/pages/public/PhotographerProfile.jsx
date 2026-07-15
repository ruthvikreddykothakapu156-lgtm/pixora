import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Star, BadgeCheck, Image as ImageIcon } from "lucide-react";
import { getPhotographerById } from "../../services/photographerService";
import { getAlbumsByPhotographer } from "../../services/albumService";
import { getReviewsByPhotographer } from "../../services/reviewService";
import { useAuth } from "../../context/AuthContext";
import ReviewList from "../../components/review/ReviewList";

export default function PhotographerProfile() {
  const { id } = useParams();
  const { user } = useAuth();

  const [photographer, setPhotographer] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [reviews, setReviews] = useState({ data: [], averageRating: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [photoRes, albumRes, reviewRes] = await Promise.all([
          getPhotographerById(id),
          getAlbumsByPhotographer(id),
          getReviewsByPhotographer(id),
        ]);
        setPhotographer(photoRes.data.data);
        setAlbums(albumRes.data.data);
        setReviews(reviewRes.data);
      } catch (err) {
        setError("Could not load this photographer's profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-text-muted">Loading...</p>;
  }

  if (error || !photographer) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="relative h-56 w-full overflow-hidden bg-bg-surface md:h-72">
        {photographer.coverPhoto && (
          <img
            src={photographer.coverPhoto}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="relative -mt-12 flex flex-col gap-4 rounded-xl bg-bg p-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-bg bg-bg-surface">
              {photographer.profilePhoto ? (
                <img src={photographer.profilePhoto} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-text-muted">
                  {photographer.name?.[0]}
                </div>
              )}
            </div>
            <div className="pb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{photographer.name}</h1>
                {photographer.isVerified && (
                  <BadgeCheck size={18} className="text-accent" />
                )}
              </div>
              {photographer.location && (
                <div className="mt-1 flex items-center gap-1 text-sm text-text-muted">
                  <MapPin size={14} />
                  {photographer.location}
                </div>
              )}
              {photographer.priceRange && (
                <p className="mt-1 text-sm font-medium text-accent">{photographer.priceRange}</p>
              )}
              <div className="mt-1 flex items-center gap-1 text-sm">
                <Star size={14} className="fill-accent text-accent" />
                <span className="font-medium">{reviews.averageRating || "New"}</span>
                <span className="text-text-muted">({reviews.count} reviews)</span>
              </div>
            </div>
          </div>

          {user ? (
            <Link
              to={`/photographers/${id}/book`}
              className="rounded-lg bg-accent-gradient px-6 py-2.5 text-sm font-medium text-white"
            >
              Book Now
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-accent-gradient px-6 py-2.5 text-sm font-medium text-white"
            >
              Login to Book
            </Link>
          )}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-5 text-center">
          <div>
            <div className="text-lg font-bold">{albums.length}</div>
            <div className="text-xs text-text-muted">Albums</div>
          </div>
          <div>
            <div className="text-lg font-bold">{photographer.views || 0}</div>
            <div className="text-xs text-text-muted">Profile Views</div>
          </div>
          <div>
            <div className="text-lg font-bold">{reviews.count}</div>
            <div className="text-xs text-text-muted">Reviews</div>
          </div>
        </div>

        {photographer.bio && (
          <div className="mt-8">
            <h2 className="mb-2 text-sm font-semibold">About</h2>
            <p className="text-sm text-text-muted">{photographer.bio}</p>
          </div>
        )}

        {photographer.specializations?.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {photographer.specializations.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border bg-bg-surface px-3 py-1 text-xs capitalize text-text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {photographer.pricing?.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold">Pricing</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {photographer.pricing.map((p) => (
                <div
                  key={p.eventType}
                  className="flex items-center justify-between rounded-lg border border-border bg-bg-surface px-4 py-2 text-sm"
                >
                  <span className="capitalize text-text-muted">{p.eventType}</span>
                  <span className="font-semibold text-accent">₹{p.price.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold">Reviews ({reviews.count})</h2>
          <ReviewList reviews={reviews.data} />
        </div>

        <div className="mt-10 pb-16">
          <h2 className="mb-4 text-sm font-semibold">Portfolio</h2>
          {albums.length === 0 ? (
            <p className="text-sm text-text-muted">No albums published yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {albums.map((album) => (
                <Link
                  key={album._id}
                  to={`/albums/${album._id}`}
                  className="group overflow-hidden rounded-xl border border-border bg-bg-surface"
                >
                  <div className="flex aspect-square items-center justify-center overflow-hidden bg-bg text-text-muted">
                    {album.coverPhoto ? (
                      <img src={album.coverPhoto} alt={album.title} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon size={24} />
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="truncate text-sm font-medium">{album.title}</h3>
                    <p className="text-xs text-text-muted">{album.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}