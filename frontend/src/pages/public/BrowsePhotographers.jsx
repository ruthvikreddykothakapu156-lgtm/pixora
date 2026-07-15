import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { getPhotographers, searchPhotographers } from "../../services/photographerService";
import PhotographerCard from "../../components/gallery/PhotographerCard";

export default function BrowsePhotographers() {
  const [searchParams] = useSearchParams();

  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchPhotographers = async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (searchQuery.trim()) {
        res = await searchPhotographers(searchQuery.trim());
      } else {
        res = await getPhotographers({
          location: location || undefined,
          specialization: specialization || undefined,
          sort,
        });
      }
      setPhotographers(res.data.data);
    } catch (err) {
      setError("Could not load photographers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotographers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, specialization, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPhotographers();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-2xl font-bold">Find Your Perfect Photographer</h1>
      <p className="mt-1 text-sm text-text-muted">
        Discover and connect with talented photographers
      </p>

      <form
        onSubmit={handleSearchSubmit}
        className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-bg-surface p-3"
      >
        <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2">
          <Search size={16} className="text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, location, specialty..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
          />
        </div>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none"
        >
          <option value="">All Locations</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
        </select>

        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none"
        >
          <option value="">All Specialities</option>
          <option value="wedding">Wedding</option>
          <option value="portrait">Portrait</option>
          <option value="wildlife">Wildlife</option>
          <option value="landscape">Landscape</option>
          <option value="corporate">Corporate</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
        </select>

        <button
          type="submit"
          className="rounded-lg bg-accent-gradient px-4 py-2 text-sm font-medium text-white"
        >
          Search
        </button>
      </form>

      {loading && (
        <p className="mt-10 text-center text-sm text-text-muted">Loading photographers...</p>
      )}

      {error && (
        <p className="mt-10 text-center text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && photographers.length === 0 && (
        <p className="mt-10 text-center text-sm text-text-muted">
          No photographers found. Try adjusting your filters.
        </p>
      )}

      {!loading && !error && photographers.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photographers.map((p) => (
            <PhotographerCard key={p._id} photographer={p} />
          ))}
        </div>
      )}
    </div>
  );
}