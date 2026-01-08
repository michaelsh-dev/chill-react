import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./daftarSaya.css";

import logo from "../assets/brand/logo.png";
import avatar from "../assets/brand/avatar.png";

export default function DaftarSaya() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [activeMovie, setActiveMovie] = useState(null);
  const [showEpisodes, setShowEpisodes] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("myList") || "[]");
      setItems(Array.isArray(saved) ? saved : []);
    } catch {
      setItems([]);
    }
  }, []);


  const gridItems = useMemo(() => {
    const seen = new Set();
    return items.filter((m) => {
      const key = String(m?.id ?? m?.title ?? "");
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [items]);

  // ===== helpers biar movie/series kebaca bener dari localStorage =====

  const isSeries = (m) =>
    m?.kind === "series" || (Array.isArray(m?.episodesList) && m.episodesList.length > 0);

  const makeDefaultEpisodes = (m, count = 5) =>
    Array.from({ length: count }, (_, i) => ({
      no: i + 1,
      title: `Episode ${i + 1}`,
      dur: "30m",
      thumb: m?.img,
      desc: "Deskripsi episode belum tersedia.",
      videoTo: `/video/${m?.id}/${i + 1}`,
    }));

  const normalizeMovie = (m) => {
    const kind =
      m?.kind === "series" || m?.kind === "movie"
        ? m.kind
        : Array.isArray(m?.episodesList) && m.episodesList.length
          ? "series"
          : "movie";

    return {
      ...m,
      id: m?.id,
      title: m?.title,
      img: m?.img,
      bannerImg: m?.bannerImg ?? m?.img,
      posterImg: m?.posterImg ?? m?.img,
      kind,

      year: m?.year ?? "2023",
      duration: m?.duration ?? (kind === "series" ? "10 Episode" : "2j 00m"),
      age: m?.age ?? "PG-13",
      desc: m?.desc ?? "Deskripsi belum tersedia.",
      cast: m?.cast ?? "—",
      genre: m?.genre ?? "—",
      creator: m?.creator ?? "—",

      // movie harus null
      episodesList:
        kind === "series"
          ? (Array.isArray(m?.episodesList) && m.episodesList.length
            ? m.episodesList.map((ep, idx) => ({
              no: ep.no ?? idx + 1,
              title: ep.title ?? `Episode ${idx + 1}`,
              dur: ep.dur ?? "30m",
              thumb: ep.thumb ?? m?.img,
              playerThumb: ep.playerThumb ?? ep.thumb ?? m?.img,
              desc: ep.desc ?? "Deskripsi episode belum tersedia.",
              videoTo: ep.videoTo ?? `/video/${m?.id}/${ep.no ?? idx + 1}`,
            }))
            : makeDefaultEpisodes(m, 5))

          : null,
    };
  };

  const getPlayList = (m) => {
    const fixed = normalizeMovie(m);

    if (fixed.kind === "series") {
      return Array.isArray(fixed.episodesList) && fixed.episodesList.length
        ? fixed.episodesList
        : makeDefaultEpisodes(fixed, 5);
    }
    return [
      {
        no: 1,
        title: "Movie",
        dur: fixed.duration ?? "2j 00m",
        thumb: fixed.img,
        desc: "Putar film ini.",
        videoTo: `/video/${fixed.id}`,
      },
    ];
  };

  // ===== daftar saya toggle (hapus/tambah) =====
  const isInMyList = (id) => items.some((x) => String(x?.id) === String(id));

  const toggleMyList = (movie) => {
    const fixed = normalizeMovie(movie);


    setItems((prev) => {
      const exists = prev.some((x) => String(x?.id) === String(fixed.id));
      const next = exists
        ? prev.filter((x) => String(x?.id) !== String(fixed.id))
        : [...prev, fixed];

      localStorage.setItem("myList", JSON.stringify(next));
      return next;
    });
  };

  const openDetail = (m) => {
    setActiveMovie(normalizeMovie(m));
    setShowEpisodes(false);
  };

  return (
    <div className="dsPage">
      {/* NAVBAR */}
      <header className="nav">
        <div className="navLeft">
          <div className="navBrand">
            <img src={logo} alt="Chill" className="navLogo" />
          </div>

          <nav className="navLinks">
            <Link className="navLink" to="/home">Series</Link>
            <Link className="navLink" to="/home">Film</Link>
            <Link className="navLink isActive" to="/daftar-saya">Daftar Saya</Link>
          </nav>
        </div>

        <div className="navRight">
          <button
            className="avatarBtn"
            type="button"
            onClick={() => setOpenMenu((v) => !v)}
          >
            <img className="avatar" src={avatar} alt="User" />
            <span className="chev">▾</span>
          </button>

          {openMenu && (
            <div className="menu">
              <Link className="menuItem" to="/profil" onClick={() => setOpenMenu(false)}>
                <span className="miIcon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
                  </svg>
                </span>
                <span>Profil Saya</span>
              </Link>

              <Link className="menuItem" to="/premium" onClick={() => setOpenMenu(false)}>
                <span className="miIcon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 14H5L3 7Zm4.2 12h9.6l1-7.2-1.9 1.2L12 6.8 8.1 13l-1.9-1.2L7.2 19Z" />
                  </svg>
                </span>
                <span>Ubah Premium</span>
              </Link>

              <Link className="menuItem" to="/">
                <span className="miIcon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M10 17v2H4V5h6v2H6v10h4Zm3.6-1.6L12.2 14H21v-4h-8.8l1.4-1.4L12.2 7l-5 5 5 5 1.4-1.6Z" />
                  </svg>
                </span>
                <span>Keluar</span>
              </Link>
            </div>
          )}

        </div>
      </header>

      {/* CONTENT */}
      <main className="dsMain">
        <div className="dsWrap">
          <h1 className="dsTitle">Daftar Saya</h1>

          {gridItems.length === 0 ? (
            <div className="dsEmpty">Belum ada film/series di Daftar Saya.</div>
          ) : (
            <div className="dsGrid">
              {gridItems.map((m) => (
                <button
                  key={m.id ?? m.title}
                  type="button"
                  className="dsCard"
                  onClick={() => openDetail(m)}
                  style={{ background: "transparent", border: "none", padding: 0, textAlign: "left" }}
                >
                  <div className="dsPosterWrap">
                    <img
                      className="dsPoster"
                      src={m.posterImg ?? m.img}
                      alt={m.title}
                    />

                    {/* dukung 2 model data: isNewEpisode atau badge */}
                    {(m.isNewEpisode || m.badge === "Episode Baru") ? (
                      <span className="dsBadge dsBadgeNew">Episode Baru</span>
                    ) : null}

                    {m.top10 ? <span className="dsBadge dsBadgeTop">Top 10</span> : null}
                  </div>

                  <div className="dsName" title={m.title}>
                    {m.title}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MODAL DETAIL di halaman DaftarSaya */}
        {activeMovie && (
          <div
            className="detailOverlay"
            onClick={() => {
              setActiveMovie(null);
              setShowEpisodes(false);
            }}
          >
            <div className="detailModal" onClick={(e) => e.stopPropagation()}>
              <div className="detailTopActions">
                {showEpisodes && (
                  <button
                    className="detailBack"
                    type="button"
                    onClick={() => setShowEpisodes(false)}
                    aria-label="Back"
                    title="Kembali"
                  >
                    ←
                  </button>
                )}

                <button
                  className="detailClose"
                  type="button"
                  onClick={() => {
                    setActiveMovie(null);
                    setShowEpisodes(false);
                  }}
                  aria-label="Close"
                  title="Tutup"
                >
                  ✕
                </button>
              </div>

              <div className="detailHero">
                <img
                  className="detailBannerImg"
                  src={activeMovie.bannerImg ?? activeMovie.img}
                  alt={activeMovie.title}
                />
                <div className="detailHeroFade" />

                <div className="detailHeroContent">
                  <h2 className="detailTitle">{activeMovie.title}</h2>

                  <div className="detailActions">
                    <button
                      className="detailPlay"
                      type="button"
                      onClick={() => setShowEpisodes(true)}
                    >
                      Mulai
                    </button>

                    <button
                      className={`detailCircleBtn ${isInMyList(activeMovie.id) ? "isActive" : ""}`}
                      type="button"
                      onClick={() => toggleMyList(activeMovie)}
                      title={isInMyList(activeMovie.id) ? "Hapus dari Daftar Saya" : "Tambah ke Daftar Saya"}
                    >
                      {isInMyList(activeMovie.id) ? "✓" : "+"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="detailBody">
                {/* INFO SELALU TAMPIL */}
                <div className="detailInfo">
                  <div className="detailMeta">
                    <span>{activeMovie.year}</span>
                    <span className="dot">•</span>
                    <span>{activeMovie.duration}</span>
                    <span className="dot">•</span>
                    <span className="pill">{activeMovie.age}</span>
                  </div>

                  <p className="detailDesc">{activeMovie.desc}</p>

                  <div className="detailInfoGrid">
                    <div>
                      <div className="infoLabel">Cast</div>
                      <div className="infoText">{activeMovie.cast}</div>
                    </div>
                    <div>
                      <div className="infoLabel">Genre</div>
                      <div className="infoText">{activeMovie.genre}</div>
                    </div>
                    <div>
                      <div className="infoLabel">Pembuat Film</div>
                      <div className="infoText">{activeMovie.creator}</div>
                    </div>
                  </div>
                </div>

                {/* BAWAH: rekomendasi (kamu belum minta di daftar saya), jadi kita tampilkan tab list saja kalau Mulai */}
                {showEpisodes && (
                  <>
                    <div className="detailSectionTitle">
                      {isSeries(activeMovie) ? "Episode" : "Movie"}
                    </div>

                    <div className="epList figmaEp">
                      {getPlayList(activeMovie).map((ep) => (
                        <button
                          key={ep.no}
                          type="button"
                          className="epCard"
                          onClick={() =>
                            navigate(ep.videoTo || `/video/${activeMovie.id}/${ep.no}`, {
                              state: {
                                title: activeMovie.title,
                                seriesTitle: activeMovie.title,
                                epTitle: ep.title,
                                thumb: ep.thumb ?? activeMovie.img,
                                playerThumb: ep.playerThumb ?? ep.thumb ?? activeMovie.img, // ✅ ini yang bikin gambar player muncul
                                playlist: getPlayList(activeMovie), // ✅ biar next/list episode jalan juga
                                index: (ep.no ? ep.no - 1 : 0),
                              },
                            })
                          }
                        >
                          <div className="epNo">{ep.no}</div>

                          <div className="epThumbWrap">
                            <img className="epThumb" src={ep.thumb ?? activeMovie.img} alt={ep.title} />
                          </div>

                          <div className="epInfo">
                            <div className="epTitleRow">
                              <div className="epTitle">{ep.title}</div>
                              <div className="epDur">{ep.dur}</div>
                            </div>
                            <div className="epDesc">{ep.desc ?? "Deskripsi episode belum tersedia."}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="footer">
          <div className="footerInner">
            <div className="footerLeft">
              <img src={logo} alt="Chill" className="footerLogo" />
              <div className="footerCopy">©2025 Chill All Rights Reserved.</div>
            </div>

            <div className="footerCols">
              <div className="fCol">
                <div className="fTitle">Genre</div>
                <div className="fList">
                  <a href="#">Aksi</a>
                  <a href="#">Drama</a>
                  <a href="#">Komedi</a>
                  <a href="#">Anime</a>
                  <a href="#">KDrama</a>
                  <a href="#">Romantis</a>
                </div>
              </div>

              <div className="fCol">
                <div className="fTitle">Bantuan</div>
                <div className="fList">
                  <a href="#">FAQ</a>
                  <a href="#">Kontak Kami</a>
                  <a href="#">Privasi</a>
                  <a href="#">Syarat & Ketentuan</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
