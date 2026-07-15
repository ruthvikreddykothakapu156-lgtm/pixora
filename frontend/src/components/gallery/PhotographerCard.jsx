import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, MapPin, Camera } from "lucide-react";

export default function PhotographerCard({ photographer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/photographers/${photographer._id}`}
        className="glass-card group block overflow-hidden rounded-2xl"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-surface">
          {photographer.coverPhoto ? (
            <img
              src={photographer.coverPhoto}
              alt={photographer.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-muted">
              <Camera size={28} className="opacity-40" />
              <span className="text-xs">No cover photo yet</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

          <button
            onClick={(e) => e.preventDefault()}
            className="glass absolute right-3 top-3 rounded-full p-2 text-white transition hover:scale-110"
            aria-label="Save"
          >
            <Heart size={14} />
          </button>

          <div className="glass absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white">
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            {photographer.averageRating || "New"}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold">{photographer.name}</h3>

          {photographer.location && (
            <div className="mt-1 flex items-center gap-1 text-xs text-text-muted">
              <MapPin size={12} />
              {photographer.location}
            </div>
          )}

          {photographer.specializations?.length > 0 && (
            <p className="mt-1 text-xs capitalize text-text-muted">
              {photographer.specializations.slice(0, 2).join(", ")}
            </p>
          )}

          {photographer.priceRange && (
            <p className="mt-2 text-xs font-semibold bg-accent-gradient-3 bg-clip-text text-transparent">
              {photographer.priceRange}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}