import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { myListService } from "../services/api/myList.service";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [muted, setMuted] = useState(true);
  const [showEpisodes, setShowEpisodes] = useState(true);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const data = await myListService.getAll();
        const found = data.find((m) => String(m?.id) === String(id));
        setMovie(found || null);
      } catch (error) {
        console.error(error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  const handleRemoveFromMyList = async () => {
    try {
      await myListService.remove(movie.id);
      navigate("/daftar-saya");
    } catch (error) {
      console.error(error);
      alert("Gagal hapus dari Daftar Saya");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b0f10",
          color: "#fff",
          padding: 24,
        }}
      >
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!movie) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b0f10",
          color: "#fff",
          padding: 24,
        }}
      >
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

          {!showEpisodes ? (
            <button
              className="detailBack"
              type="button"
              onClick={() => setShowEpisodes(true)}
            >
              ←
            </button>
          ) : null}

          <button
            className="detailClose"
            type="button"
            onClick={() => navigate("/daftar-saya")}
          >
            ✕
          </button>
        </div>

        <div
          className="detailHero"
          style={{ backgroundImage: `url(${movie.img || movie.posterImg})` }}
        >
          <div className="detailHeroFade" />

          <div className="detailHeroContent">
            <h2 className="detailTitle">{movie.title}</h2>

            <div className="detailActions">
              <button className="detailPlay" type="button">
                Mulai
              </button>


              <button
                className="detailCircleBtn isActive"
                type="button"
                onClick={handleRemoveFromMyList}
                aria-label="Hapus dari Daftar Saya"
                title="Hapus dari Daftar Saya"
              >
                ✓
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
