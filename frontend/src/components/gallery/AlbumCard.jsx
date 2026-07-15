import { Link } from "react-router-dom";
import { Image as ImageIcon, Eye } from "lucide-react";

export default function AlbumCard({ album }) {
  return (
    <Link
      to={`/albums/${album._id}`}
      className="card-hover group overflow-hidden rounded-xl border border-border bg-bg-surface"
    >
      <div className="flex aspect-square items-center justify-center overflow-hidden bg-bg text-text-muted">
        {album.coverPhoto ? (
          <img
            src={album.coverPhoto}
            alt={album.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <ImageIcon size={24} />
        )}
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-medium">{album.title}</h3>
        <div className="mt-1 flex items-center justify-between text-xs text-text-muted">
          <span className="capitalize">{album.category}</span>
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {album.views || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}