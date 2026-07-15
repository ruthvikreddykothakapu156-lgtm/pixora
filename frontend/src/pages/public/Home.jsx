import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Users, ShieldCheck, Award } from "lucide-react";
import { getPhotographers } from "../../services/photographerService";
import { getTopRatedPhotographers } from "../../services/reviewService";
import { getAlbums } from "../../services/albumService";
import PhotographerCard from "../../components/gallery/PhotographerCard";
import AlbumCard from "../../components/gallery/AlbumCard";
import heroImage from "../../assets/hero.jpg";

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const [topPhotographers, setTopPhotographers] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
  const [loadingSections, setLoadingSections] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const [ratedRes, albumsRes] = await Promise.all([
          getTopRatedPhotographers(4),
          getAlbums({ sort: "views" }),
        ]);

        let photographers = ratedRes.data.data;

        if (photographers.length === 0) {
          const fallback = await getPhotographers({ sort: "newest" });
          photographers = fallback.data.data.slice(0, 4);
        }

        setTopPhotographers(photographers);
        setTopAlbums(albumsRes.data.data.slice(0, 4));
      } catch (err) {
        // fail silently
      } finally {
        setLoadingSections(false);
      }
    };
    fetchSections();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/photographers?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/photographers");
    }
  };

  return (
    <div>
      {/* Hero — full-bleed image, no card border, fades into background */}
      <section className="relative overflow-hidden">
        {/* Background image, full width/height of hero, positioned right */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover object-center opacity-90 lg:object-[75%_center]"
          />
          {/* Fades: left-to-right into bg color, plus bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/70 to-transparent lg:from-bg lg:via-bg/40 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto max-w-8xl px-6 py-24 lg:px-10 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <h1 className="text-5xl font-extrabold leading-[1.1] lg:text-6xl">
              <span className="bg-accent-gradient-3 bg-clip-text text-transparent">Capture</span> Moments.
              <br />
              Cherish Forever.
            </h1>
            <p className="mt-6 max-w-md text-lg text-text-muted">
              Discover talented photographers, explore stunning portfolios, and book the perfect photographer for your special moments.
            </p>

            <form
              onSubmit={handleSearch}
              className="glass mt-8 flex max-w-lg items-center gap-2 rounded-2xl p-2"
            >
              <Search size={18} className="ml-3 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search photographers, locations..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
              />
              <button
                type="submit"
                className="rounded-xl bg-accent-gradient-3 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accent/25 transition hover:shadow-xl hover:shadow-accent/40"
              >
                Search
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-8xl px-6 lg:px-10">
        {/* Top Rated Photographers */}
        {!loadingSections && topPhotographers.length > 0 && (
          <section className="py-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Top Rated Photographers</h2>
              <Link to="/photographers" className="text-sm font-medium text-accent">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {topPhotographers.map((p) => (
                <PhotographerCard key={p._id} photographer={p} />
              ))}
            </div>
          </section>
        )}

        {/* Top Albums */}
        {!loadingSections && topAlbums.length > 0 && (
          <section className="py-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Most Viewed Albums</h2>
              <Link to="/photographers" className="text-sm font-medium text-accent">
                Explore more →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {topAlbums.map((album) => (
                <AlbumCard key={album._id} album={album} />
              ))}
            </div>
          </section>
        )}

        {/* Why Choose Us */}
        <section className="py-16">
          <h2 className="mb-8 text-2xl font-bold">Why Choose Us?</h2>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {[
              { icon: Users, title: "Top Photographers", desc: "Verified and talented professionals" },
              { icon: Search, title: "Easy Booking", desc: "Simple and secure booking process" },
              { icon: ShieldCheck, title: "Secure Payments", desc: "Safe and trusted payment system" },
              { icon: Award, title: "Quality Guaranteed", desc: "Premium quality photography" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-gradient-3 text-white shadow-lg shadow-accent/25">
                  <Icon size={20} />
                </div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs text-text-muted">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <Link
            to="/photographers"
            className="inline-block rounded-2xl bg-accent-gradient-3 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-accent/30 transition hover:scale-105"
          >
            Browse Photographers
          </Link>
        </section>
      </div>
    </div>
  );
}