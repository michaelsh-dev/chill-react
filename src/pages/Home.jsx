import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// BRAND
import logo from "../assets/brand/logo.png";
import avatar from "../assets/brand/avatar.png";

// HERO
import heroImg from "../assets/hero/duty-after-school.png";

// POSTERS
import pDontLookUp from "../assets/posters/dont-look-up.png";
import pBatman from "../assets/posters/batman.png";
import pBlueLock from "../assets/posters/blue-lock.png";
import pOtto from "../assets/posters/otto.png";
import pSuzume from "../assets/posters/suzume.png";
import pJurassic from "../assets/posters/jurassic.png";
import pSonic from "../assets/posters/sonic.png";
import pBigHero from "../assets/posters/big-hero-6.png";
import pMermaid from "../assets/posters/little-mermaid.png";
import pMissing from "../assets/posters/missing.png";

import pAllofus from "../assets/posters/all-of-us-are-dead.png";
import pCalledotto from "../assets/posters/a_man_called_otto.png";
import pAntman from "../assets/posters/ant-man.png";
import pTomorrow from "../assets/posters/the-tomorrow-War.png";
import pGuardians from "../assets/posters/guardians.png";
import pDutyafter from "../assets/posters/duty-after-school.png";
import pMha from "../assets/posters/mha.png";
import pRio from "../assets/posters/rio.png";
import pDoctor from "../assets/posters/doctor-strage.png";
import pTedlasso from "../assets/posters/ted-lasso.png";

import pTedlassoEp1 from "../assets/posters/tedlassoep1.png";
import pTedlassoEp2 from "../assets/posters/tedlassoep2.png";
import pTedlassoEp3 from "../assets/posters/tedlassoep3.png";
import pTedlassoEp4 from "../assets/posters/tedlassoep4.png";
import pTedlassoEp5 from "../assets/posters/tedlassoep5.png";
import pTedlassoEp1Vid from "../assets/posters/tedlassoep1vid.png";


function Row({ title, items, variant, onSelect }) {
  const scrollerRef = useRef(null);

  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 520, behavior: "smooth" });
  };

  return (
    <section className="hSection">
      <div className="hSectionHead">
        <h2 className="hSectionTitle">{title}</h2>
      </div>

      <div className="hRowWrap">
        <button
          className="hArrow hArrowLeft"
          onClick={() => scrollBy(-1)}
          aria-label="Prev"
          type="button"
        >
          ‹
        </button>

        <div className="hRow" ref={scrollerRef}>
          {items.map((m) => (
            <article
              key={m.id}
              className={`poster poster--${variant}`}
              onClick={() => onSelect(m)}
              role="button"
              tabIndex={0}
            >
              <div className="posterMedia">
                <img className="posterImg" src={m.img} alt={m.title} />
                {m.badge && <span className="posterBadge">{m.badge}</span>}
                {m.top10 && <span className="posterTop">Top 10</span>}
              </div>


              <div className="posterCap">
                <div className="posterCapTitle">{m.title}</div>
                {m.rating && <div className="posterCapMeta">★ {m.rating}</div>}
              </div>
            </article>
          ))}
        </div>

        <button
          className="hArrow hArrowRight"
          onClick={() => scrollBy(1)}
          aria-label="Next"
          type="button"
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default function Home() {
  const [openMenu, setOpenMenu] = useState(false);

  const [muted, setMuted] = useState(true);
  const [openMore, setOpenMore] = useState(false);

  const [activeMovie, setActiveMovie] = useState(null);
  const [showEpisodes, setShowEpisodes] = useState(false);

  // ✅ Daftar Saya (persist localStorage)
  const [myList, setMyList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("myList") || "[]");
    } catch {
      return [];
    }
  });

  const navigate = useNavigate();

  const isInMyList = (id) => myList.some((x) => x?.id === id);
  const isSeries = (m) =>
    m?.kind === "series" || (Array.isArray(m?.episodesList) && m.episodesList.length > 0);
  const makeDefaultEpisodes = (m, count = 5) =>
    Array.from({ length: count }, (_, i) => ({
      no: i + 1,
      title: `Episode ${i + 1}`,
      dur: "30m",
      thumb: m?.img,                 // list thumbnail
      playerThumb: m?.img,           // fallback player thumbnail
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

    const fixedEpisodes =
      kind === "series"
        ? (Array.isArray(m?.episodesList) && m.episodesList.length
          ? m.episodesList.map((ep, idx) => ({
            no: ep.no ?? idx + 1,
            title: ep.title ?? `Episode ${idx + 1}`,
            dur: ep.dur ?? "30m",
            thumb: ep.thumb ?? m?.img,

            // ✅ INI YANG HILANG SEBELUMNYA:
            playerThumb: ep.playerThumb ?? ep.thumb ?? m?.img,

            desc: ep.desc ?? "Deskripsi episode belum tersedia.",
            videoTo: ep.videoTo ?? `/video/${m?.id}/${ep.no ?? idx + 1}`,
          }))

          : makeDefaultEpisodes(m, 5))
        : null;

    return {
      ...m,
      id: m?.id,
      title: m?.title,
      img: m?.img,
      bannerImg: m?.bannerImg ?? m?.img,
      posterImg: m?.posterImg ?? m?.img,
      kind,

      rating: m?.rating ?? null,
      badge: m?.badge ?? null,
      top10: !!m?.top10,

      year: m?.year ?? "2023",
      duration: m?.duration ?? (kind === "series" ? "10 Episode" : "2j 00m"),
      age: m?.age ?? "PG-13",
      desc: m?.desc ?? "Deskripsi belum tersedia.",
      cast: m?.cast ?? "—",
      genre: m?.genre ?? "—",
      creator: m?.creator ?? "—",

      episodesList: fixedEpisodes,
    };
  };




  const toggleMyList = (movie) => {
    const fixed = normalizeMovie(movie);

    setMyList((prev) => {
      const exists = prev.some((x) => String(x?.id) === String(fixed.id));
      const next = exists
        ? prev.filter((x) => String(x?.id) !== String(fixed.id))
        : [...prev, fixed];

      localStorage.setItem("myList", JSON.stringify(next));
      return next;
    });
  };

  const getPlayList = (m) => {
    if (isSeries(m)) {
      return m?.episodesList ?? makeDefaultEpisodes(m, 5);
    }

    return [
      {
        no: 1,
        title: "Movie",
        dur: m?.duration ?? "2j 00m",
        thumb: m?.img,
        desc: "Putar film ini.",
        videoTo: `/video/${m?.id}`,
      },
    ];
  };



  const handleSelectMovie = (m) => {
    // ✅ penting: normalize biar detail ga kosong
    setActiveMovie(normalizeMovie(m));
    setShowEpisodes(false);
  };

  const rows = useMemo(() => {
    const trendingBase = [
      {
        id: "tmw",
        title: "The Tomorrow War",
        img: pTomorrow,
        top10: true,
        year: "2021",
        duration: "2j 18m",
        age: "PG-13",
        desc: "Seorang ayah direkrut ke perang masa depan untuk menyelamatkan umat manusia.",
        cast: "Chris Pratt, Yvonne Strahovski, J.K. Simmons",
        genre: "Aksi, Sci-Fi",
        creator: "Chris McKay",
      },
      {
        id: "ant",
        title: "Ant-Man",
        img: pAntman,
        top10: true,
        year: "2015",
        duration: "1j 57m",
        age: "PG-13",
        desc: "Mantan narapidana menjadi pahlawan mini dengan misi besar yang berbahaya.",
        cast: "Paul Rudd, Evangeline Lilly, Michael Douglas",
        genre: "Aksi, Komedi",
        creator: "Peyton Reed",
      },
      {
        id: "gotg",
        title: "Guardians",
        img: pGuardians,
        top10: true,
        year: "2014",
        duration: "2j 01m",
        age: "PG-13",
        desc: "Sekelompok penjahat luar angkasa bersatu untuk menghentikan ancaman galaksi.",
        cast: "Chris Pratt, Zoe Saldana, Dave Bautista",
        genre: "Aksi, Sci-Fi",
        creator: "James Gunn",
      },
      {
        id: "otto2",
        title: "A Man Called Otto",
        img: pCalledotto,
        top10: true,
        year: "2022",
        duration: "2j 06m",
        age: "PG-13",
        desc: "Pria pemarah perlahan berubah saat bertemu tetangga baru yang hangat.",
        cast: "Tom Hanks, Mariana Treviño",
        genre: "Drama, Komedi",
        creator: "Marc Forster",
      },
      {
        id: "mer",
        title: "Little Mermaid",
        img: pMermaid,
        kind: "movie",
        year: "2023",
        duration: "2j 15m",
        age: "PG",
        desc: "Putri duyung yang penasaran membuat kesepakatan berbahaya demi hidup di daratan.",
        cast: "Halle Bailey, Jonah Hauer-King, Melissa McCarthy",
        genre: "Fantasi, Keluarga",
        creator: "Rob Marshall",
      },
      {
        id: "mha",
        title: "My Hero Academia",
        img: pMha,
        kind: "series",
        year: "2016",
        duration: "25 Episode",
        age: "13+",
        desc: "Seorang remaja tanpa kekuatan berjuang masuk akademi pahlawan dan membuktikan dirinya.",
        cast: "Daiki Yamashita, Nobuhiko Okamoto",
        genre: "Anime, Aksi",
        creator: "Kenji Nagasaki",
        episodesList: [
          { no: 1, title: "Izuku Midoriya: Origin", dur: "24m" },
          { no: 2, title: "What It Takes to Be a Hero", dur: "24m" },
          { no: 3, title: "Roaring Muscles", dur: "24m" },
          { no: 4, title: "Start Line", dur: "24m" },
          { no: 5, title: "What I Can Do for Now", dur: "24m" },
        ],
      },

    ];

    return {
      lanjut: [
        {
          id: "dlu",
          title: "Don't Look Up",
          img: pDontLookUp,
          rating: "4.5/5",
          year: "2021",
          duration: "2j 18m",
          age: "18+",
          desc: "Dua ilmuwan mencoba memperingatkan dunia tentang komet mematikan—tapi tak ada yang peduli.",
          cast: "Leonardo DiCaprio, Jennifer Lawrence",
          genre: "Satire, Komedi",
          creator: "Adam McKay",
          recs: trendingBase.slice(0, 3),
        },
        {
          id: "tedlasso",
          title: "Ted Lasso",
          img: pTedlasso,
          rating: "4.7/5",
          year: "2020",
          duration: "10 Episode",
          age: "PG-13",
          desc: "Pelatih sepak bola Amerika yang optimistis memimpin klub Inggris dan menyatukan tim yang retak.",
          cast: "Jason Sudeikis, Brett Goldstein, Hannah Waddingham",
          genre: "Komedi, Drama",
          creator: "Bill Lawrence",
          episodesList: [
            {
              no: 1,
              title: "Pilot",
              dur: "29m",
              thumb: pTedlassoEp1,
              playerThumb: pTedlassoEp1Vid,
              desc: "Ted Lasso direkrut melatih AFC Richmond meski tak paham sepak bola Inggris.",
              videoTo: "/video/tedlasso/1",
            },
            {
              no: 2,
              title: "Biscuits",
              dur: "29m",
              thumb: pTedlassoEp2,
              desc: "Ted mulai membangun hubungan dengan tim dan memberi kejutan kecil untuk Rebecca.",
              videoTo: "/video/tedlasso/2",
            },
            {
              no: 3,
              title: "Trent Crimm, The Independent",
              dur: "30m",
              thumb: pTedlassoEp3,
              desc: "Seorang jurnalis mengikuti Ted sehari penuh untuk menulis artikel tentang dirinya.",
              videoTo: "/video/tedlasso/3",
            },
            {
              no: 4,
              title: "For The Children",
              dur: "31m",
              thumb: pTedlassoEp4,
              desc: "Gala amal klub membuat banyak konflik kecil muncul di antara staf dan pemain.",
              videoTo: "/video/tedlasso/4",
            },
            {
              no: 5,
              title: "Tan Lines",
              dur: "31m",
              thumb: pTedlassoEp5,
              desc: "Masalah strategi tim memuncak, sementara Ted berusaha tetap positif di bawah tekanan.",
              videoTo: "/video/tedlasso/5",
            },
          ],

          recs: trendingBase.slice(0, 3),
        },
        {
          id: "bl",
          title: "Blue Lock",
          img: pBlueLock,
          kind: "series",
          rating: "4.6/5",
          badge: "Episode Baru",
          year: "2022",
          duration: "24 Episode",
          age: "13+",
          desc: "Program brutal memilih striker terbaik Jepang lewat kompetisi yang tanpa ampun.",
          cast: "Kazuki Ura, Tasuku Kaito",
          genre: "Anime, Olahraga",
          creator: "Tetsuaki Watanabe",
          recs: trendingBase.slice(1, 4),
        },
        {
          id: "otto",
          title: "A Man Called Otto",
          img: pOtto,
          rating: "4.4/5",
          year: "2022",
          duration: "2j 06m",
          age: "PG-13",
          desc: "Tetangga baru mengubah hidup Otto yang dingin jadi lebih hangat dan bermakna.",
          cast: "Tom Hanks, Mariana Treviño",
          genre: "Drama, Komedi",
          creator: "Marc Forster",
          recs: trendingBase.slice(0, 3),
        },
        {
          id: "bat",
          title: "The Batman",
          img: pBatman,
          rating: "4.2/5",
          year: "2022",
          duration: "2j 56m",
          age: "16+",
          desc: "Batman menyelidiki pembunuhan berantai yang menyeret rahasia gelap Gotham.",
          cast: "Robert Pattinson, Zoë Kravitz",
          genre: "Aksi, Misteri",
          creator: "Matt Reeves",
          recs: trendingBase.slice(0, 3),
        },
      ],
      top: [
        {
          id: "suz",
          title: "Suzume",
          img: pSuzume,
          kind: "movie",
          year: "2022",
          duration: "2j 02m",
          age: "13+",
          desc: "Suzume membantu menutup pintu-pintu misterius yang memicu bencana di Jepang.",
          cast: "Nanoka Hara, Hokuto Matsumura",
          genre: "Fantasi, Petualangan",
          creator: "Makoto Shinkai",
          badge: "Baru",
          top10: false,
        },
        {
          id: "jur",
          title: "Jurassic World",
          img: pJurassic,
          kind: "movie",
          year: "2015",
          duration: "2j 04m",
          age: "PG-13",
          desc: "Taman dinosaurus modern berubah jadi bencana saat eksperimen lepas kendali.",
          cast: "Chris Pratt, Bryce Dallas Howard",
          genre: "Aksi, Sci-Fi",
          creator: "Colin Trevorrow",
        },
        {
          id: "son",
          title: "Sonic",
          img: pSonic,
          kind: "movie",
          year: "2020",
          duration: "1j 39m",
          age: "PG",
          desc: "Sonic berusaha menyelamatkan dunia sambil kabur dari musuh bebuyutannya.",
          cast: "Ben Schwartz, Jim Carrey",
          genre: "Komedi, Petualangan",
          creator: "Jeff Fowler",
        },
        {
          id: "all",
          title: "All Of Us Are Dead",
          img: pAllofus,
          kind: "series",
          year: "2022",
          duration: "16 Episode",
          age: "13+",
          desc: "Sekolah berubah jadi neraka saat wabah zombie menyebar dan murid harus bertahan hidup.",
          cast: "Park Ji-hu, Yoon Chan-young",
          genre: "Horror, Thriller",
          creator: "Lee Jae-kyoo",
          episodesList: [
            { no: 1, title: "Episode 1", dur: "60m" },
            { no: 2, title: "Episode 2", dur: "58m" },
            { no: 3, title: "Episode 3", dur: "56m" },
          ],
          recs: trendingBase.slice(0, 3),
        },
        {
          id: "bh6",
          title: "Big Hero 6",
          img: pBigHero,
          kind: "movie",
          year: "2014",
          duration: "1j 42m",
          age: "PG",
          desc: "Hiro dan Baymax membentuk tim pahlawan untuk mengungkap kejahatan di kota futuristik.",
          cast: "Ryan Potter, Scott Adsit",
          genre: "Animasi, Petualangan",
          creator: "Don Hall",
          top10: true,
        },
        {
          id: "doctor",
          title: "Doctor Strange",
          img: pDoctor,
          kind: "movie",
          year: "2016",
          duration: "1j 55m",
          age: "PG-13",
          desc: "Dokter jenius menemukan dunia sihir setelah kecelakaan menghancurkan kariernya.",
          cast: "Benedict Cumberbatch, Tilda Swinton",
          genre: "Aksi, Fantasi",
          creator: "Scott Derrickson",
          top10: true,
        },
      ],

      trending: trendingBase,
      rilis: [
        {
          id: "mer2",
          title: "Little Mermaid",
          img: pMermaid,
          kind: "movie",
          year: "2023",
          duration: "2j 15m",
          age: "PG",
          desc: "Putri duyung ingin hidup di daratan dan membuat kesepakatan berbahaya.",
          cast: "Halle Bailey, Jonah Hauer-King",
          genre: "Fantasi, Keluarga",
          creator: "Rob Marshall",
          top10: true,
          badge: "Episode Baru",
        },
        {
          id: "das",
          title: "Duty After School",
          img: pDutyafter,
          kind: "series",
          year: "2023",
          duration: "10 Episode",
          age: "16+",
          desc: "Siswa SMA direkrut untuk menghadapi ancaman misterius demi bertahan hidup.",
          cast: "Shin Hyun-soo, Lee Soon-won",
          genre: "Aksi, Thriller",
          creator: "Sung Yong-il",
          episodesList: [
            { no: 1, title: "Episode 1", dur: "45m" },
            { no: 2, title: "Episode 2", dur: "47m" },
            { no: 3, title: "Episode 3", dur: "46m" },
          ],
          badge: "Episode Baru",
        },
        {
          id: "bh62",
          title: "Big Hero 6",
          img: pBigHero,
          kind: "movie",
          year: "2014",
          duration: "1j 42m",
          age: "PG",
          desc: "Hiro dan Baymax membentuk tim pahlawan untuk melindungi kota.",
          cast: "Ryan Potter, Scott Adsit",
          genre: "Animasi, Petualangan",
          creator: "Don Hall",
          top10: true,
        },
        {
          id: "aoud",
          title: "All Of Us Are Dead",
          img: pAllofus,
          kind: "series",
          year: "2022",
          duration: "16 Episode",
          age: "13+",
          desc: "Wabah zombie membuat sekolah terjebak dan murid harus bertahan.",
          cast: "Park Ji-hu, Yoon Chan-young",
          genre: "Horror, Thriller",
          creator: "Lee Jae-kyoo",
          episodesList: [
            { no: 1, title: "Episode 1", dur: "60m" },
            { no: 2, title: "Episode 2", dur: "58m" },
            { no: 3, title: "Episode 3", dur: "56m" },
          ],
          badge: "Episode Baru",
        },
        {
          id: "mis",
          title: "Missing",
          img: pMissing,
          kind: "movie",
          year: "2023",
          duration: "1j 51m",
          age: "16+",
          desc: "Seorang ibu menelusuri jejak digital untuk menemukan putrinya yang hilang.",
          cast: "Storm Reid, Nia Long",
          genre: "Thriller, Misteri",
          creator: "Nicholas D. Johnson",
        },
        {
          id: "rio",
          title: "Rio",
          img: pRio,
          kind: "movie",
          year: "2011",
          duration: "1j 36m",
          age: "PG",
          desc: "Seekor burung langka memulai petualangan seru di Rio de Janeiro.",
          cast: "Jesse Eisenberg, Anne Hathaway",
          genre: "Animasi, Komedi",
          creator: "Carlos Saldanha",
        },
      ],

    };
  }, []);
  // ✅ kumpulkan semua film/series untuk dipakai cari rekomendasi serupa
  // ✅ kumpulin semua film & buang duplikat by id (dan title optional)
  const allMovies = useMemo(() => {
    const merged = Object.values(rows).flat();

    const seenId = new Set();
    const seenTitle = new Set();

    return merged.filter((m) => {
      const id = String(m.id ?? "");
      const title = String(m.title ?? "").toLowerCase().trim();

      // kalau id kosong, pakai title sebagai fallback
      const keyId = id || title;

      if (seenId.has(keyId)) return false;
      seenId.add(keyId);

      // optional: kalau title sama persis, buang juga
      if (title && seenTitle.has(title)) return false;
      if (title) seenTitle.add(title);

      return true;
    });
  }, [rows]);

  const similarMovies = useMemo(() => {
    if (!activeMovie) return [];

    const base = (activeMovie.genre || "")
      .split(",")
      .map((g) => g.trim().toLowerCase())
      .filter(Boolean);

    const score = (m) => {
      const gs = (m.genre || "")
        .split(",")
        .map((g) => g.trim().toLowerCase())
        .filter(Boolean);
      return gs.reduce((acc, g) => acc + (base.includes(g) ? 1 : 0), 0);
    };

    const list = (base.length
      ? allMovies
        .filter((m) => m.id !== activeMovie.id)
        .map((m) => ({ m, s: score(m) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.m)
      : allMovies.filter((m) => m.id !== activeMovie.id)
    ).slice(0, 12);

    // ✅ final safety: unik lagi by id
    const seen = new Set();
    return list.filter((m) => {
      const key = String(m.id ?? m.title);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [activeMovie, allMovies]);


  return (
    <div className="home">
      <header className="nav">
        <div className="navLeft">
          <div className="navBrand">
            <img src={logo} alt="Chill" className="navLogo" />
          </div>
          <nav className="navLinks">
            <Link to="#" className="navLink">Series</Link>
            <Link to="#" className="navLink">Film</Link>
            <Link to="/daftar-saya" className="navLink">Daftar Saya</Link>
          </nav>
        </div>

        <div className="navRight">
          <button className="avatarBtn" onClick={() => setOpenMenu((v) => !v)} type="button">
            <img src={avatar} alt="User" className="avatar" />
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

      <main className="main">
        <section className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
          <div className="heroFade" />
          <div className="heroContent heroContent--bottom">
            <h1 className="heroTitle">Duty After School</h1>
            <p className="heroDesc">
              Sebuah benda tak dikenal mengambil alih dunia. Dalam keputusasaan,
              Departemen Pertahanan mulai merekrut lebih banyak tentara...
            </p>

            <div className="heroBtns">
              <button className="heroPrimary" type="button">
                Mulai
              </button>

              <button className="heroGhost" type="button" onClick={() => setOpenMore(true)}>
                <span className="infoBang">!</span>
                Selengkapnya
              </button>

              <button
                type="button"
                className="heroSound heroSound--bottom"
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={() => setMuted((v) => !v)}
                title={muted ? "Sound Off" : "Sound On"}
              >
                {muted ? (
                  <svg viewBox="0 0 24 24">
                    <path d="M11 5 6 9H3v6h3l5 4V5Zm8.5 7 2.5 2.5-1.4 1.4L18 13.4l-2.6 2.5-1.4-1.4 2.5-2.5-2.5-2.5 1.4-1.4 2.6 2.5 2.6-2.5 1.4 1.4-2.5 2.5Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d="M11 5 6 9H3v6h3l5 4V5Zm3.5 2.5v2.1c1.2.6 2 1.9 2 3.4s-.8 2.8-2 3.4v2.1c2.4-.8 4-3 4-5.5s-1.6-4.7-4-5.5Z" />
                  </svg>
                )}
              </button>

              <span className="agePill">18+</span>
            </div>
          </div>
        </section>

        {openMore && (
          <div className="moreOverlay" onClick={() => setOpenMore(false)}>
            <div className="moreModal" onClick={(e) => e.stopPropagation()}>
              <div className="moreHead">
                <div className="moreTitle">Kategori Genre</div>
                <button className="moreClose" type="button" onClick={() => setOpenMore(false)}>
                  ✕
                </button>
              </div>

              <div className="moreGrid">
                <button className="chip" type="button">Aksi</button>
                <button className="chip" type="button">Drama</button>
                <button className="chip" type="button">Komedi</button>
                <button className="chip" type="button">Anime</button>
                <button className="chip" type="button">KDrama</button>
                <button className="chip" type="button">Romantis</button>
                <button className="chip" type="button">Kejahatan</button>
                <button className="chip" type="button">Petualangan</button>
                <button className="chip" type="button">Thriller</button>
                <button className="chip" type="button">Fantasi</button>
                <button className="chip" type="button">Sains &amp; Alam</button>
                <button className="chip" type="button">Perang</button>
              </div>
            </div>
          </div>
        )}

        {activeMovie && (
          <div
            className="detailOverlay"
            onClick={() => {
              setActiveMovie(null);      // ✅ tutup modal
              setShowEpisodes(false);    // ✅ reset tab
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
                      onClick={() => setShowEpisodes(true)} // ✅ selalu masuk tab list (movie/episode)
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


              {/* ✅ SATU BODY SAJA */}
              <div className="detailBody">
                {/* INFO atas tetap tampil */}
                <div className="detailInfo">
                  <div className="detailMeta">
                    <span>{activeMovie.year ?? "2023"}</span>
                    <span className="dot">•</span>
                    <span>{activeMovie.duration ?? (isSeries(activeMovie) ? "10 Episode" : "2j 00m")}</span>
                    <span className="dot">•</span>
                    <span className="pill">{activeMovie.age ?? "PG-13"}</span>
                  </div>

                  <p className="detailDesc">{activeMovie.desc ?? "Deskripsi belum tersedia."}</p>

                  <div className="detailInfoGrid">
                    <div>
                      <div className="infoLabel">Cast</div>
                      <div className="infoText">{activeMovie.cast ?? "—"}</div>
                    </div>
                    <div>
                      <div className="infoLabel">Genre</div>
                      <div className="infoText">{activeMovie.genre ?? "—"}</div>
                    </div>
                    <div>
                      <div className="infoLabel">Pembuat Film</div>
                      <div className="infoText">{activeMovie.creator ?? "—"}</div>
                    </div>
                  </div>
                </div>

                {/* SWITCH bawah: default rekomendasi, klik Mulai baru episode */}
                {!showEpisodes ? (
                  <>
                    <div className="detailSectionTitle">Rekomendasi Serupa</div>

                    <div className="recRow">
                      {(similarMovies.length ? similarMovies : rows.trending.slice(0, 12)).map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          className="recCard"
                          onClick={() => {
                            setActiveMovie(normalizeMovie(r));
                            setShowEpisodes(false);
                          }}
                        >
                          <img src={r.posterImg ?? r.img} alt={r.title} />
                          {r.top10 && <span className="recTop">Top 10</span>}

                          <div className="recMeta">
                            <div className="recTitle">{r.title}</div>
                            <div className="recGenre">{r.genre ?? "-"}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detailSectionTitle">{isSeries(activeMovie) ? "Episode" : "Movie"}</div>

                    <div className="epList figmaEp">
                      {getPlayList(activeMovie).map((ep) => (
                        <button
                          key={ep.no}
                          type="button"
                          className="epCard"
                          onClick={() =>
                            navigate(ep.videoTo || `/video/${activeMovie.id}/${ep.no}`, {
                              state: {
                                // layar player pakai gambar "vid" kalau ada
                                playerThumb: ep.playerThumb ?? ep.thumb ?? activeMovie.img,
                                seriesTitle: activeMovie.title,
                                playlist: getPlayList(activeMovie), // <- penting buat episode selanjutnya & list
                                index: (ep.no ?? 1) - 1,            // <- posisi episode sekarang
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


        <div className="rows">
          <Row title="Melanjutkan Tonton Film" items={rows.lanjut} variant="landscape" onSelect={handleSelectMovie} />
          <Row title="Top Rating Film dan Series Hari ini" items={rows.top} variant="portrait" onSelect={handleSelectMovie} />
          <Row title="Film Trending" items={rows.trending} variant="portrait" onSelect={handleSelectMovie} />
          <Row title="Rilis Baru" items={rows.rilis} variant="portrait" onSelect={handleSelectMovie} />
        </div>

        <footer className="footer">
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
        </footer>
      </main>
    </div>
  );
}