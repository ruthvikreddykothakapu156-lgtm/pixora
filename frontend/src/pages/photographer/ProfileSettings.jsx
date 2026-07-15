import { useEffect, useState } from "react";
import { QrCode, Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getPhotographerById,
  updatePhotographer,
  uploadQrCode,
  uploadProfilePhoto,
  uploadCoverPhoto,
} from "../../services/photographerService";
import DashboardTabs from "../../components/dashboard/DashboardTabs";

const specializationOptions = ["wedding", "portrait", "wildlife", "landscape", "corporate", "nature"];
const eventTypeOptions = ["wedding", "portrait", "corporate", "wildlife", "pre-wedding", "other"];

export default function ProfileSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [pricing, setPricing] = useState({});
  const [specializations, setSpecializations] = useState([]);
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [currentQr, setCurrentQr] = useState("");
  const [uploadingQr, setUploadingQr] = useState(false);

  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState("");
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);

  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [currentCoverPhoto, setCurrentCoverPhoto] = useState("");
  const [uploadingCoverPhoto, setUploadingCoverPhoto] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getPhotographerById(user.photographerProfile);
        const p = res.data.data;
        setName(p.name || "");
        setBio(p.bio || "");
        setLocation(p.location || "");
        setPriceRange(p.priceRange || "");
        setSpecializations(p.specializations || []);
        setInstagram(p.socialLinks?.instagram || "");
        setWebsite(p.socialLinks?.website || "");
        setCurrentQr(p.qrCodeImage || "");
        setCurrentProfilePhoto(p.profilePhoto || "");
        setCurrentCoverPhoto(p.coverPhoto || "");

        const pricingMap = {};
        (p.pricing || []).forEach((item) => {
          pricingMap[item.eventType] = item.price;
        });
        setPricing(pricingMap);
      } catch (err) {
        setError("Could not load your profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSpecialization = (spec) => {
    setSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handlePriceChange = (eventType, value) => {
    setPricing((prev) => ({ ...prev, [eventType]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveMessage("");
    setSaving(true);
    try {
      const pricingArray = Object.entries(pricing)
        .filter(([, price]) => price !== "" && price !== undefined)
        .map(([eventType, price]) => ({ eventType, price: Number(price) }));

      await updatePhotographer(user.photographerProfile, {
        name,
        bio,
        location,
        priceRange,
        specializations,
        pricing: pricingArray,
        socialLinks: { instagram, website },
      });
      setSaveMessage("Profile updated successfully.");
    } catch (err) {
      setSaveMessage(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleQrFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setQrFile(selected);
      setQrPreview(URL.createObjectURL(selected));
    }
  };

  const handleQrUpload = async () => {
    if (!qrFile) return;
    setUploadingQr(true);
    try {
      const formData = new FormData();
      formData.append("qrCode", qrFile);
      const res = await uploadQrCode(user.photographerProfile, formData);
      setCurrentQr(res.data.data.qrCodeImage);
      setQrFile(null);
      setQrPreview(null);
    } catch (err) {
      alert(err.response?.data?.message || "Could not upload QR code.");
    } finally {
      setUploadingQr(false);
    }
  };

  const handleProfilePhotoChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setProfilePhotoFile(selected);
      setProfilePhotoPreview(URL.createObjectURL(selected));
    }
  };

  const handleProfilePhotoUpload = async () => {
    if (!profilePhotoFile) return;
    setUploadingProfilePhoto(true);
    try {
      const formData = new FormData();
      formData.append("profilePhoto", profilePhotoFile);
      const res = await uploadProfilePhoto(user.photographerProfile, formData);
      setCurrentProfilePhoto(res.data.data.profilePhoto);
      setProfilePhotoFile(null);
      setProfilePhotoPreview(null);
    } catch (err) {
      alert(err.response?.data?.message || "Could not upload profile photo.");
    } finally {
      setUploadingProfilePhoto(false);
    }
  };

  const handleCoverPhotoChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setCoverPhotoFile(selected);
      setCoverPhotoPreview(URL.createObjectURL(selected));
    }
  };

  const handleCoverPhotoUpload = async () => {
    if (!coverPhotoFile) return;
    setUploadingCoverPhoto(true);
    try {
      const formData = new FormData();
      formData.append("coverPhoto", coverPhotoFile);
      const res = await uploadCoverPhoto(user.photographerProfile, formData);
      setCurrentCoverPhoto(res.data.data.coverPhoto);
      setCoverPhotoFile(null);
      setCoverPhotoPreview(null);
    } catch (err) {
      alert(err.response?.data?.message || "Could not upload cover photo.");
    } finally {
      setUploadingCoverPhoto(false);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-text-muted">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <DashboardTabs />

      <h1 className="text-2xl font-bold">Profile Settings</h1>
      <p className="mt-1 text-sm text-text-muted">Manage your public profile and payment details.</p>

      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-bg-surface p-6">
          <h2 className="mb-3 text-sm font-semibold">Profile Photo</h2>
          {currentProfilePhoto && (
            <img
              src={currentProfilePhoto}
              alt="Profile"
              className="mb-3 h-24 w-24 rounded-full border border-border object-cover"
            />
          )}
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-bg p-3 text-center hover:border-accent">
            <span className="text-xs text-text-muted">
              {profilePhotoFile ? profilePhotoFile.name : "Select image"}
            </span>
            <input type="file" accept="image/*" onChange={handleProfilePhotoChange} className="hidden" />
          </label>
          {profilePhotoPreview && (
            <img src={profilePhotoPreview} alt="Preview" className="mt-3 h-20 w-20 rounded-full object-cover" />
          )}
          <button
            onClick={handleProfilePhotoUpload}
            disabled={!profilePhotoFile || uploadingProfilePhoto}
            className="mt-3 w-full rounded-lg bg-accent-gradient px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
          >
            {uploadingProfilePhoto ? "Uploading..." : "Upload Profile Photo"}
          </button>
        </div>

        <div className="rounded-xl border border-border bg-bg-surface p-6">
          <h2 className="mb-3 text-sm font-semibold">Cover Photo</h2>
          {currentCoverPhoto && (
            <img
              src={currentCoverPhoto}
              alt="Cover"
              className="mb-3 h-24 w-full rounded-lg border border-border object-cover"
            />
          )}
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-bg p-3 text-center hover:border-accent">
            <span className="text-xs text-text-muted">
              {coverPhotoFile ? coverPhotoFile.name : "Select image"}
            </span>
            <input type="file" accept="image/*" onChange={handleCoverPhotoChange} className="hidden" />
          </label>
          {coverPhotoPreview && (
            <img src={coverPhotoPreview} alt="Preview" className="mt-3 h-20 w-full rounded-lg object-cover" />
          )}
          <button
            onClick={handleCoverPhotoUpload}
            disabled={!coverPhotoFile || uploadingCoverPhoto}
            className="mt-3 w-full rounded-lg bg-accent-gradient px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
          >
            {uploadingCoverPhoto ? "Uploading..." : "Upload Cover Photo"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-bg-surface p-6">
        {saveMessage && (
          <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
            {saveMessage}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="Tell clients about your style and experience..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="City, State"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Price Range (display text)</label>
          <input
            type="text"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="e.g. ₹15,000 – ₹50,000"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Specializations</label>
          <div className="flex flex-wrap gap-2">
            {specializationOptions.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => toggleSpecialization(spec)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${
                  specializations.includes(spec)
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-text-muted"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Pricing by Event Type</label>
          <div className="grid gap-3 sm:grid-cols-2">
            {eventTypeOptions.map((type) => (
              <div key={type}>
                <label className="mb-1 block text-xs capitalize text-text-muted">{type}</label>
                <input
                  type="number"
                  min="0"
                  value={pricing[type] || ""}
                  onChange={(e) => handlePriceChange(type, e.target.value)}
                  placeholder="₹ Amount"
                  className="w-full rounded-lg border border-border bg-bg px-4 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Instagram</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
              placeholder="https://..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-lg bg-accent-gradient px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <div className="mt-8 rounded-xl border border-border bg-bg-surface p-6">
        <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold">
          <QrCode size={16} />
          Payment QR Code
        </h2>
        <p className="mb-4 text-xs text-text-muted">
          Clients will scan this to pay for bookings (e.g. UPI/PhonePe QR).
        </p>

        {currentQr && (
          <img src={currentQr} alt="Current QR code" className="mb-4 h-40 w-40 rounded-lg border border-border object-contain" />
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-bg p-4 text-center hover:border-accent">
            <Upload size={16} className="text-text-muted" />
            <span className="text-sm text-text-muted">
              {qrFile ? qrFile.name : "Select QR code image"}
            </span>
            <input type="file" accept="image/*" onChange={handleQrFileChange} className="hidden" />
          </label>
          <button
            onClick={handleQrUpload}
            disabled={!qrFile || uploadingQr}
            className="rounded-lg bg-accent-gradient px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {uploadingQr ? "Uploading..." : "Upload"}
          </button>
        </div>

        {qrPreview && (
          <img src={qrPreview} alt="Preview" className="mt-4 h-32 w-32 rounded-lg object-contain" />
        )}
      </div>
    </div>
  );
}