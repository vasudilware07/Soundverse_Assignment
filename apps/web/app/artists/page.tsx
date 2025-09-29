"use client";
import { useEffect, useState } from "react";

interface Artist {
  id: string;
  creator_name: string;
  description: string;
  profile_image_url?: string;
  tags?: string[];
  dna_visibility?: string;
  price?: number;
  license_type?: string;
  tracks_visibility?: string;
  become_partner?: boolean;
  audio_preview_url?: string;
  sensitivity?: number;
  status?: string;
  created_at?: string;
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      setError(null);
      try {
        const backendUri = process.env.NEXT_PUBLIC_BACKEND_URI;
        if (!backendUri) throw new Error("Backend URI not set");
        const res = await fetch(`${backendUri}/artists`);
        if (!res.ok) throw new Error("Failed to fetch artists");
        const data = await res.json();
        setArtists(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-center sm:text-left">
        Featured Artists
      </h1>

      {error && (
        <div className="text-red-500 text-center mb-6">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {artists.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center">
              <img
                src="/user.png"
                alt="No artists"
                className="w-24 h-24 rounded-full mb-4 border-2 border-gray-300"
              />
              <span className="text-gray-500 text-lg">No artists found.</span>
            </div>
          ) : (
            artists.map((artist) => (
              <div
                key={artist.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300"
              >
                {/* Artist Header */}
                <div className="relative h-48 w-full">
                  <img
                    src={artist.profile_image_url || "/user1.jpg"}
                    alt={artist.creator_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/user.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h2 className="text-xl font-bold text-gray-900">{artist.creator_name}</h2>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {artist.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full ${
                      artist.status === "active"
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {artist.status ?? "unknown"}
                  </span>
                </div>

                {/* Artist Info */}
                <div className="p-4 flex flex-col gap-3">
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {artist.description || "No description available."}
                  </p>

                  <div className="grid grid-cols-3 text-center text-gray-500 text-xs gap-2 mt-2">
                    <div>
                      <span className="block text-[10px]">DNA</span>
                      <strong className="text-gray-900 text-sm">{artist.dna_visibility || "—"}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px]">Price</span>
                      <strong className="text-gray-900 text-sm">
                        {artist.price ? `$${artist.price}` : "Free"}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[10px]">License</span>
                      <strong className="text-gray-900 text-sm">{artist.license_type || "—"}</strong>
                    </div>
                  </div>

                  {artist.audio_preview_url && (
                    <audio
                      controls
                      src={artist.audio_preview_url}
                      className="w-full rounded-md mt-2"
                    />
                  )}

                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition">
                      Follow
                    </button>
                    <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg transition">
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
