import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({ photos, currentIndex, onClose, onNavigate }) {
  if (currentIndex === null) return null;

  const photo = photos[currentIndex];

  const goPrev = () => {
    onNavigate(currentIndex === 0 ? photos.length - 1 : currentIndex - 1);
  };

  const goNext = () => {
    onNavigate(currentIndex === photos.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95">
      <div className="flex items-center justify-between p-4">
        <span className="text-sm text-white/70">
          {currentIndex + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-6 pb-6">
        <button
          onClick={goPrev}
          className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>

        <img
          src={photo.url}
          alt=""
          className="max-h-full max-w-full rounded-lg object-contain"
        />

        <button
          onClick={goNext}
          className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto p-4">
        {photos.map((p, i) => (
          <button
            key={p._id}
            onClick={() => onNavigate(i)}
            className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border-2 ${
              i === currentIndex ? "border-accent" : "border-transparent opacity-60"
            }`}
          >
            <img src={p.url} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}