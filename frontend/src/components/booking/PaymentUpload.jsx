import { useState } from "react";
import { Upload } from "lucide-react";
import { submitPaymentScreenshot } from "../../services/bookingService";

export default function PaymentUpload({ bookingId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("screenshot", file);
      const res = await submitPaymentScreenshot(bookingId, formData);
      onSuccess(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5">
      <h3 className="mb-3 text-sm font-semibold">Submit Payment Proof</h3>

      {error && (
        <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
          {error}
        </div>
      )}

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-bg p-6 text-center hover:border-accent">
        <Upload size={20} className="text-text-muted" />
        <span className="text-xs text-text-muted">
          {file ? file.name : "Click to select a screenshot"}
        </span>
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>

      {preview && (
        <img src={preview} alt="Preview" className="mt-4 max-h-48 w-full rounded-lg object-contain" />
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-4 w-full rounded-lg bg-accent-gradient px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Submit Payment Screenshot"}
      </button>
    </div>
  );
}