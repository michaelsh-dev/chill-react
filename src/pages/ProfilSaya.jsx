import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./ProfilSaya.css";

import logo from "../assets/brand/logo.png";
import avatarImg from "../assets/brand/avatar.png";

export default function ProfilSaya() {
    const [openMenu, setOpenMenu] = useState(false);

    // ✅ toggle untuk 2 kondisi (belum / sudah premium)
    // kalau mau default "belum", set jadi false
    const [isPremium, setIsPremium] = useState(() => localStorage.getItem("isPremium") === "true");

    // form dummy (kamu bisa ganti nanti)
    // ✅ ambil dari localStorage dulu biar gak nyangkut William terus
    const [name, setName] = useState(() => localStorage.getItem("profileName") || "William");
    const [email, setEmail] = useState(() => localStorage.getItem("profileEmail") || "william1980@gmail.com");

    // ✅ jangan pake "********" sebagai value, itu bikin editing aneh
    const [pass, setPass] = useState(() => localStorage.getItem("profilePass") || "");
    const [showPass, setShowPass] = useState(false);
    const [savedMsg, setSavedMsg] = useState("");

    useEffect(() => {
        const n = localStorage.getItem("profileName");
        const e = localStorage.getItem("profileEmail");
        const p = localStorage.getItem("profilePass");

        if (n !== null) setName(n);
        if (e !== null) setEmail(e);
        if (p !== null) setPass(p);
    }, []);


    const onSave = (e) => {
        e.preventDefault();

        const n = name.trim();
        const em = email.trim();

        localStorage.setItem("profileName", n);
        localStorage.setItem("profileEmail", em);
        localStorage.setItem("profilePass", pass); // boleh kosong

        setName(n);
        setEmail(em);

        setSavedMsg("Tersimpan ✅");
        setTimeout(() => setSavedMsg(""), 2000);

        <input
            type={showPass ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="pfInput"
            autoComplete="new-password"
        />

    };


    const fileRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(avatarImg);

    const onPickPhoto = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // limit 2MB
        if (file.size > 2 * 1024 * 1024) {
            alert("Maksimal 2MB ya.");
            e.target.value = "";
            return;
        }

        const url = URL.createObjectURL(file);
        setAvatarPreview(url);
    };

    // ✅ Daftar Saya (ambil dari localStorage)
    const [myList, setMyList] = useState([]);
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("myList") || "[]");
            setMyList(Array.isArray(saved) ? saved : []);
        } catch {
            setMyList([]);
        }
    }, []);

    // buang duplikat
    const listUnique = useMemo(() => {
        const seen = new Set();
        return myList.filter((m) => {
            const key = String(m?.id ?? m?.title ?? "");
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [myList]);
    const [premiumName, setPremiumName] = useState(
        () => localStorage.getItem("premiumPlanName") || "Individual"
    );

    const loc = useLocation();
    useEffect(() => {
        setIsPremium(localStorage.getItem("isPremium") === "true");
        setPremiumName(localStorage.getItem("premiumPlanName") || "Individual");
    }, [loc.pathname]);
    const nav = useNavigate();

    const PencilIcon = () => (
        <svg viewBox="0 0 24 24" className="pfPencil" aria-hidden="true">
            <path d="M3 17.25V21h3.75L17.8 9.95l-3.75-3.75L3 17.25Zm18-11.5a1 1 0 0 0 0-1.41l-1.34-1.34a1 1 0 0 0-1.41 0l-1.13 1.13 3.75 3.75L21 5.75Z" />
        </svg>
    );
    const onCancelPremium = () => {
        localStorage.setItem("isPremium", "false");
        localStorage.removeItem("premiumPlan");
        localStorage.removeItem("premiumPlanName");
        setIsPremium(false);
        setPremiumName("Individual");
    };


    return (
        <div className="pfPage">
            {/* NAVBAR (samain gaya Home) */}
            <header className="nav">
                <div className="navLeft">
                    <div className="navBrand">
                        <img src={logo} alt="Chill" className="navLogo" />
                    </div>

                    <nav className="navLinks">
                        <Link to="/home" className="navLink">Series</Link>
                        <Link to="/home" className="navLink">Film</Link>
                        <Link to="/daftar-saya" className="navLink">Daftar Saya</Link>
                    </nav>
                </div>

                <div className="navRight">
                    <button
                        className="avatarBtn"
                        type="button"
                        onClick={() => setOpenMenu((v) => !v)}
                    >
                        <img className="avatar" src={avatarImg} alt="User" />
                        <span className="chev">▾</span>
                    </button>

                    {openMenu && (
                        <div className="menu">
                            <Link className="menuItem" to="/profil">
                                <span className="miIcon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
                                    </svg>
                                </span>
                                <span>Profil Saya</span>
                            </Link>

                            <Link className="menuItem" to="/premium">
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

            <main className="pfMain">
                <h1 className="pfTitle">Profil Saya</h1>

                <section className="pfGrid">
                    {/* LEFT: avatar + form */}
                    <div className="pfLeftCard">
                        <div className="pfProfileTop">
                            <img className="pfAvatar" src={avatarPreview} alt="Avatar" />

                            <div className="pfUploadArea">
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={onPickPhoto}
                                    style={{ display: "none" }}
                                />

                                <button
                                    className="pfUploadBtn"
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                >
                                    Ubah Foto
                                </button>

                                <div className="pfHint">Maksimal 2MB</div>
                            </div>
                        </div>

                        <form className="pfForm" onSubmit={onSave}>
                            <label className="pfField">
                                <div className="pfLabel">Nama Pengguna</div>
                                <div className="pfInputWrap">
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pfInput"
                                    />
                                    <button className="pfEdit" type="button" title="Edit">
                                        <PencilIcon />
                                    </button>
                                </div>
                            </label>

                            <label className="pfField">
                                <div className="pfLabel">Email</div>
                                <div className="pfInputWrap">
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pfInput"
                                    />
                                    <button className="pfEdit" type="button" title="Edit">
                                        <PencilIcon />
                                    </button>
                                </div>
                            </label>

                            <label className="pfField">
                                <div className="pfLabel">Kata Sandi</div>

                                <div className="pfInputWrap">
                                    <input
                                        type={showPass ? "text" : "password"}   // ✅ hidden password
                                        value={pass}
                                        onChange={(e) => setPass(e.target.value)}
                                        className="pfInput"
                                    />

                                    {/* tombol show/hide */}
                                    <button
                                        className="pfEdit"
                                        type="button"
                                        title={showPass ? "Sembunyikan" : "Tampilkan"}
                                        onClick={() => setShowPass(v => !v)}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="18"
                                            height="18"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            {showPass ? (
                                                <>
                                                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.64-1.61 1.55-3.09 2.66-4.36" />
                                                    <path d="M1 1l22 22" />
                                                </>
                                            ) : (
                                                <>
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </>
                                            )}
                                        </svg>
                                    </button>

                                </div>
                            </label>

                            <div className="pfSaveRow">
                                <button className="pfSave" type="submit">Simpan</button>
                                {savedMsg && <div className="pfSavedMsg">{savedMsg}</div>}
                            </div>
                        </form>

                    </div>

                    {/* RIGHT: premium card */}
                    {!isPremium ? (
                        <div className="pfRightCard pfRightCard--free">
                            <div className="pfRightTop">
                                <div className="pfRightIcon">📣</div>
                                <div>
                                    <div className="pfRightTitle">Saat ini anda belum berlangganan</div>
                                    <div className="pfRightDesc">
                                        Dapatkan Akses Tak Terbatas ke Ribuan Film dan Series Kesukaan Kamu!!
                                    </div>

                                </div>
                            </div>

                            <button
                                className="pfRightBtn"
                                type="button"
                                onClick={() => nav("/premium", { state: { step: "choose" } })}
                            >
                                Mulai Berlangganan
                            </button>

                        </div>
                    ) : (
                        <div className="pfRightCard pfRightCard--premium">
                            <div className="pfPill">Aktif</div>
                            <div className="pfRightTitle2">Akun Premium {premiumName}✨</div>
                            <div className="pfRightDesc2">
                                Saat ini kamu sedang menggunakan akses akun premium
                            </div>
                            <div className="pfRightFoot">
                                Berlaku hingga 1 febuari 2026
                            </div>

                            <button
                                className="pfRightBtn"
                                type="button"
                                onClick={() => nav("/premium", { state: { step: "choose" } })}
                            >
                                Langganan Paket
                            </button>

                            {/* ✅ tombol batal premium (baru bener posisinya) */}
                            <button
                                className="pfRightBtn pfRightBtn--ghost"
                                type="button"
                                onClick={onCancelPremium}
                            >
                                <span className="miIcon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 1 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4l4.9-4.9 4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4Z" />
                                    </svg>
                                </span>
                                Batal Premium
                            </button>

                        </div>
                    )}
                </section>

                {/* Daftar Saya row */}
                <section className="pfList">
                    <div className="pfListHead">
                        <h2 className="pfListTitle">Daftar Saya</h2>
                        <Link className="pfSeeAll" to="/daftar-saya">Lihat Semua</Link>
                    </div>

                    <div className="pfRow">
                        {listUnique.length ? (
                            listUnique.slice(0, 12).map((m) => (
                                <div key={m.id ?? m.title} className="pfPoster">
                                    <div className="pfPosterMedia">
                                        <img
                                            src={m.posterImg ?? m.img}
                                            alt={m.title}
                                            className="pfPosterImg"
                                        />
                                        {(m.isNewEpisode || m.badge === "Episode Baru") && (
                                            <span className="pfBadge pfBadgeNew">Episode Baru</span>
                                        )}
                                        {m.top10 && <span className="pfBadge pfBadgeTop">Top 10</span>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="pfEmpty">
                                Daftar Saya masih kosong. Tambahkan film/series dari Home dulu.
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer sederhana (kalau kamu sudah punya footer global, boleh hapus ini) */}
                <footer className="pfFooter">
                    <div className="pfFooterLeft">
                        <img src={logo} alt="Chill" className="pfFooterLogo" />
                        <div className="pfFooterCopy">©2025 Chill All Rights Reserved.</div>
                    </div>

                    <div className="pfFooterCols">
                        <div className="pfCol">
                            <div className="pfColTitle">Genre</div>
                            <div className="pfColLinks">
                                <a href="#">Aksi</a><a href="#">Drama</a><a href="#">Komedi</a>
                                <a href="#">Anime</a><a href="#">KDrama</a><a href="#">Romantis</a>
                            </div>
                        </div>

                        <div className="pfCol">
                            <div className="pfColTitle">Bantuan</div>
                            <div className="pfColLinks">
                                <a href="#">FAQ</a><a href="#">Kontak Kami</a><a href="#">Privasi</a>
                                <a href="#">Syarat & Ketentuan</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}