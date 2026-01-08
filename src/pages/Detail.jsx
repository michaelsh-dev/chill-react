import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [muted, setMuted] = useState(true);
  const [showEpisodes, setShowEpisodes] = useState(true); // ✅ default langsung Episode
  const [myList, setMyList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("myList") || "[]");
    } catch {
      return [];
    }
  });

  const movie = useMemo(() => {
    // ✅ sumber data dari Daftar Saya (localStorage)
    const found = myList.find((m) => String(m?.id) === String(id));
    return found || null;
  }, [myList, id]);

  const isInMyList = (movieId) => myList.some((x) => String(x?.id) === String(movieId));

  const toggleMyList = (m) => {
    setMyList((prev) => {
      const exists = prev.some((x) => String(x?.id) === String(m.id));
      const next = exists ? prev.filter((x) => String(x?.id) !== String(m.id)) : [...prev, m];
      localStorage.setItem("myList", JSON.stringify(next));
      return next;
    });
  };

  // kalau list berubah dari tab lain (optional)
  useEffect(() => {
    const onStorage = () => {
      try {
        setMyList(JSON.parse(localStorage.getItem("myList") || "[]"));
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ✅ kalau item gak ketemu (misal URL dibuka manual)
  if (!movie) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0f10", color: "#fff", padding: 24 }}>
        <h2>Film/Series tidak ditemukan</h2>
        <button
          type="button"
          onClick={() => navigate("/daftar-saya")}
          style={{
            marginTop: 12,
            border: "1px solid rgba(255,255,255,.18)",
            background: "rgba(255,255,255,.06)",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          ← Kembali ke Daftar Saya
        </button>
      </div>
    );
  }

  return (
    <div
      className="detailOverlay"
      onClick={() => navigate("/daftar-saya")}
      role="presentation"
    >
      <div className="detailModal" onClick={(e) => e.stopPropagation()}>
        <div className="detailTopActions">
          {/* ✅ back (kalau kamu nanti bikin tab lain) */}
          {!showEpisodes ? (
            <button className="detailBack" type="button" onClick={() => setShowEpisodes(true)}>
              ←
            </button>
          ) : null}

          <button className="detailClose" type="button" onClick={() => navigate("/daftar-saya")}>
            ✕
          </button>
        </div>

        {/* HERO */}
        <div className="detailHero" style={{ backgroundImage: `url(${movie.img || movie.posterImg})` }}>
          <div className="detailHeroFade" />

          <div className="detailHeroContent">
            <h2 className="detailTitle">{movie.title}</h2>

            <div className="detailActions">
              <button className="detailPlay" type="button">
                Mulai
              </button>

              {/* ✅ tombol + (masuk/keluar daftar saya) */}
              <button
                className={`detailCircleBtn ${isInMyList(movie.id) ? "isActive" : ""}`}
                type="button"
                onClick={() => toggleMyList(movie)}
                aria-label="Add to My List"
                title="Daftar Saya"
              >
                {isInMyList(movie.id) ? "✓" : "+"}
              </button>

              <button
                className="detailCircleBtn"
                type="button"
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={() => setMuted((v) => !v)}
                title={muted ? "Sound Off" : "Sound On"}
              >
                {muted ? "🔇" : "🔊"}
              </button>
            </div>

            <div className="detailMeta">
              <span>{movie.year ?? "2023"}</span>
              <span className="dot">•</span>
              <span>{movie.duration ?? "10 Episode"}</span>
              <span className="dot">•</span>
              <span className="pill">{movie.age ?? "PG-13"}</span>
            </div>

            <p className="detailDesc">
              {movie.desc ??
                "Sebuah cerita singkat tentang karakter yang bertahan, berubah, dan menemukan harapan."}
            </p>

            <div className="detailInfoGrid">
              <div>
                <div className="infoLabel">Cast</div>
                <div className="infoText">{movie.cast ?? "—"}</div>
              </div>
              <div>
                <div className="infoLabel">Genre</div>
                <div className="infoText">{movie.genre ?? "—"}</div>
              </div>
              <div>
                <div className="infoLabel">Pembuat Film</div>
                <div className="infoText">{movie.creator ?? "—"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ BAGIAN BAWAH: EPISODE (bukan rekomendasi) */}
        <div className="detailBody">
          <div className="detailSectionTitle">Episode</div>

          <div className="epList">
            {(movie.episodesList ?? [
              { no: 1, title: "Episode 1", dur: "29m" },
              { no: 2, title: "Episode 2", dur: "31m" },
              { no: 3, title: "Episode 3", dur: "30m" },
            ]).map((ep) => (
              <div key={ep.no} className="epRow">
                <div className="epNo">{ep.no}</div>
                <div className="epMain">
                  <div className="epTitle">{ep.title}</div>
                  <div className="epDur">{ep.dur}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
