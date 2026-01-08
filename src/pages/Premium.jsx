import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Premium.css";

import logo from "../assets/brand/logo.png";
import avatarImg from "../assets/brand/avatar.png";

// icons payment (kamu tinggal download & taruh di folder ini)
import icVisa from "../assets/payments/visa.png";
import icMastercard from "../assets/payments/mastercard.png";
import icJcb from "../assets/payments/jcb.png";
import icBca from "../assets/payments/bca.png";
import icAmerican from "../assets/payments/americanexpress.png";

function MiIcon({ children }) {
    return (
        <span className="miIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24">{children}</svg>
        </span>
    );
}

export default function Premium() {
    const nav = useNavigate();
    const loc = useLocation();
    const [openMenu, setOpenMenu] = useState(false);

    // step: 1) choose, 2) checkout, 3) howto
    const [step, setStep] = useState("choose"); // "choose" | "checkout" | "howto"

    // baca state dari Profil (Mulai Berlangganan -> langsung choose)
    useEffect(() => {
        const wantedStep = loc.state?.step;
        if (wantedStep === "choose" || wantedStep === "checkout" || wantedStep === "howto") {
            setStep(wantedStep);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loc.key]);

    const packs = useMemo(
        () => [
            {
                id: "ind",
                name: "Individual",
                price: 49900,
                sub: "Mulai dari Rp49.900/bulan",
                lines: ["1 Akun", "Tidak ada iklan", "Kualitas 720p", "Download konten pilihan"],
            },
            {
                id: "duo",
                name: "Berdua",
                price: 79900,
                sub: "Mulai dari Rp79.900/bulan",
                lines: ["2 Akun", "Tidak ada iklan", "Kualitas 1080p", "Download konten pilihan"],
            },
            {
                id: "fam",
                name: "Keluarga",
                price: 159900,
                sub: "Mulai dari Rp159.900/bulan",
                lines: ["5-7 Akun", "Tidak ada iklan", "Kualitas 4K", "Download konten pilihan"],
            },
        ],
        []
    );

    // ✅ penting: jangan default "ind", biar gak kerasa demo
    const [selectedPlan, setSelectedPlan] = useState(null); // "ind" | "duo" | "fam" | null

    // ✅ pack aktif (untuk ringkasan pembayaran)
    const selectedPack = useMemo(() => {
        const found = packs.find((p) => p.id === selectedPlan);
        return found || packs[0];
    }, [packs, selectedPlan]);

    const [method, setMethod] = useState("card"); // "card" | "bca"
    const [voucher, setVoucher] = useState("");

    // timer step 3
    const [secondsLeft, setSecondsLeft] = useState(14 * 60 + 58);

    useEffect(() => {
        if (step !== "howto") return;
        setSecondsLeft(14 * 60 + 58);
    }, [step]);

    useEffect(() => {
        if (step !== "howto") return;
        const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
        return () => clearInterval(t);
    }, [step]);

    const feeAdmin = 3000;
    const total = selectedPack.price + feeAdmin;

    const fmt = (n) => "Rp" + Number(n || 0).toLocaleString("id-ID");

    const timeParts = useMemo(() => {
        const h = Math.floor(secondsLeft / 3600);
        const m = Math.floor((secondsLeft % 3600) / 60);
        const s = secondsLeft % 60;
        return {
            h: String(h).padStart(2, "0"),
            m: String(m).padStart(2, "0"),
            s: String(s).padStart(2, "0"),
        };
    }, [secondsLeft]);

    const goCheckout = () => {
        setStep("checkout");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goHowTo = () => {
        setStep("howto");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goChoose = () => {
        setStep("choose");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onPayDone = () => {
        // ✅ simpan paket yang dipilih, bukan cuma isPremium
        if (!selectedPlan) {
            alert("Pilih paket dulu ya.");
            setStep("choose");
            return;
        }

        const pack = packs.find((p) => p.id === selectedPlan) || packs[0];
        localStorage.setItem("isPremium", "true");
        localStorage.setItem("premiumPlan", pack.id);
        localStorage.setItem("premiumPlanName", pack.name);

        nav("/profil");
    };

    return (
        <div className="prPage">
            {/* NAV */}
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
                    <button className="avatarBtn" onClick={() => setOpenMenu((v) => !v)} type="button">
                        <img src={avatarImg} alt="User" className="avatar" />
                        <span className="chev">▾</span>
                    </button>

                    {openMenu && (
                        <div className="menu">
                            <Link className="menuItem" to="/profil" onClick={() => setOpenMenu(false)}>
                                <MiIcon>
                                    <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
                                </MiIcon>
                                <span>Profil Saya</span>
                            </Link>

                            <Link className="menuItem" to="/premium" onClick={() => setOpenMenu(false)}>
                                <MiIcon>
                                    <path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 14H5L3 7Zm4.2 12h9.6l1-7.2-1.9 1.2L12 6.8 8.1 13l-1.9-1.2L7.2 19Z" />
                                </MiIcon>
                                <span>Ubah Premium</span>
                            </Link>

                            <Link className="menuItem" to="/" onClick={() => setOpenMenu(false)}>
                                <MiIcon>
                                    <path d="M10 17v2H4V5h6v2H6v10h4Zm3.6-1.6L12.2 14H21v-4h-8.8l1.4-1.4L12.2 7l-5 5 5 5 1.4-1.6Z" />
                                </MiIcon>
                                <span>Keluar</span>
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* STEP 1 */}
            {step === "choose" && (
                <main className="prMain">
                    <section className="prWhy">
                        <h2 className="prWhyTitle">Kenapa Harus Berlangganan?</h2>

                        <div className="prWhyGrid">
                            <div className="prWhyItem"><div className="prWhyIcon">⬇</div><div className="prWhyText">Download Konten Pilihan</div></div>
                            <div className="prWhyItem"><div className="prWhyIcon">🚫</div><div className="prWhyText">Tidak Ada Iklan</div></div>
                            <div className="prWhyItem"><div className="prWhyIcon">🌐</div><div className="prWhyText">Tonton Semua Konten</div></div>
                            <div className="prWhyItem"><div className="prWhyIcon">4K</div><div className="prWhyText">Kualitas Maksimal Sampai Dengan 4K</div></div>
                            <div className="prWhyItem"><div className="prWhyIcon">📺</div><div className="prWhyText">Tonton di TV, Tablet, Mobile, dan Laptop</div></div>
                            <div className="prWhyItem"><div className="prWhyIcon">💬</div><div className="prWhyText">Subtitle Untuk Konten Pilihan</div></div>
                        </div>
                    </section>

                    <section className="prPick">
                        <div className="prPickHead">
                            <div className="prPickTitle">Pilih Paketmu</div>
                            <div className="prPickSub">Temukan paket sesuai kebutuhanmu!</div>
                        </div>

                        {/* CARD GRID */}
                        <div className={`prCards ${selectedPlan ? "hasActive" : ""}`}>
                            {packs.map((p) => {
                                const active = selectedPlan === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        className={`prCard ${active ? "isActive" : ""}`}
                                        onClick={() => setSelectedPlan(p.id)}
                                    >
                                        <div className="prCardTop">
                                            <div className="prCardName">{p.name}</div>
                                            <div className="prCardSub">{p.sub}</div>
                                        </div>

                                        <ul className="prCardList">
                                            {p.lines.map((x) => (
                                                <li key={x}>
                                                    <span className="prCheck">✓</span>
                                                    <span>{x}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* jangan button di dalam button */}
                                        <div
                                            className="prCardBtn"
                                            role="button"
                                            tabIndex={0}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedPlan(p.id);
                                                goCheckout();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.stopPropagation();
                                                    setSelectedPlan(p.id);
                                                    goCheckout();
                                                }
                                            }}
                                        >
                                            Langganan
                                        </div>

                                        <div className="prCardFoot">Syarat dan ketentuan berlaku</div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* footer kamu (biarin seperti punyamu) */}
                    <footer className="prFooter">
                        <div className="prFooterLeft">
                            <img src={logo} alt="Chill" className="prFooterLogo" />
                            <div className="prFooterCopy">©2025 Chill All Rights Reserved.</div>
                        </div>

                        <div className="prFooterCols">
                            <div className="prCol">
                                <div className="prColTitle">Genre</div>
                                <div className="prColLinks">
                                    <a href="#">Aksi</a><a href="#">Drama</a><a href="#">Komedi</a>
                                    <a href="#">Anime</a><a href="#">KDrama</a><a href="#">Romantis</a>
                                </div>
                            </div>
                            <div className="prCol">
                                <div className="prColTitle">Bantuan</div>
                                <div className="prColLinks">
                                    <a href="#">FAQ</a><a href="#">Kontak Kami</a><a href="#">Privasi</a><a href="#">Syarat & Ketentuan</a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </main>
            )}

            {/* STEP 2 */}
            {step === "checkout" && (
                <main className="prMain prCheckout">
                    <div className="prSectionTitleRow">
                        <h1 className="prH1">Ringkasan Pembayaran</h1>
                        <button className="prBack" type="button" onClick={goChoose}>
                            ← Kembali
                        </button>
                    </div>

                    <div className="prPayGrid">
                        <aside className="prPackMini">
                            <div className="prPackMiniName">{selectedPack.name}</div>
                            <div className="prPackMiniSub">{selectedPack.sub}</div>

                            <ul className="prPackMiniList">
                                {selectedPack.lines.map((x) => (
                                    <li key={x}>
                                        <span className="prCheck">✓</span>
                                        <span>{x}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* sesuai figma: ini buat balik milih paket */}
                            <button className="prPackMiniBtn" type="button" onClick={goChoose}>
                                Langganan
                            </button>
                            <div className="prMiniFoot">Syarat dan ketentuan berlaku</div>
                        </aside>

                        <section className="prPayCard">
                            <div className="prPayLabel">Metode Pembayaran</div>

                            <div className="prTabs">
                                <button
                                    type="button"
                                    className={`prTab ${method === "card" ? "isOn" : ""}`}
                                    onClick={() => setMethod("card")}
                                >
                                    <span className="prTabLogos">
                                        <img className="prPayLogo" src={icVisa} alt="Visa" />
                                        <img className="prPayLogo" src={icMastercard} alt="Mastercard" />
                                        <img className="prPayLogo" src={icJcb} alt="JCB" />
                                        <img className="prPayLogo" src={icAmerican} alt="American Express" />
                                    </span>
                                    <span>Kartu Debit/Kredit</span>
                                </button>

                                <button
                                    type="button"
                                    className={`prTab ${method === "bca" ? "isOn" : ""}`}
                                    onClick={() => setMethod("bca")}
                                >
                                    <span className="prTabLogos">
                                        <img className="prPayLogo" src={icBca} alt="BCA" />
                                    </span>
                                    <span>BCA Virtual Account</span>
                                </button>
                            </div>

                            <div className="prVoucher">
                                <div className="prPayLabel">Kode Voucher (jika ada)</div>
                                <div className="prVoucherRow">
                                    <input
                                        className="prInput"
                                        placeholder="Masukkan kode voucher"
                                        value={voucher}
                                        onChange={(e) => setVoucher(e.target.value)}
                                    />
                                    <button className="prGhostBtn" type="button">Gunakan</button>
                                </div>
                            </div>

                            <div className="prSum">
                                <div className="prPayLabel">Ringkasan Transaksi</div>
                                <div className="prSumRows">
                                    <div className="prSumRow">
                                        <span>Paket Premium {selectedPack.name}</span>
                                        <span>{fmt(selectedPack.price)}</span>
                                    </div>
                                    <div className="prSumRow">
                                        <span>Biaya Admin</span>
                                        <span>{fmt(feeAdmin)}</span>
                                    </div>
                                    <div className="prSumRow prSumTotal">
                                        <span>Total Pembayaran</span>
                                        <span>{fmt(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="prPayBtn" type="button" onClick={goHowTo}>
                                Bayar
                            </button>
                        </section>
                    </div>

                    <footer className="prFooter prFooterCompact">
                        <div className="prFooterLeft">
                            <img src={logo} alt="Chill" className="prFooterLogo" />
                            <div className="prFooterCopy">©2025 Chill All Rights Reserved.</div>
                        </div>
                        <div className="prFooterCols">
                            <div className="prCol">
                                <div className="prColTitle">Genre</div>
                                <div className="prColLinks"><a href="#">Aksi</a><a href="#">Drama</a><a href="#">Komedi</a></div>
                            </div>
                            <div className="prCol">
                                <div className="prColTitle">Bantuan</div>
                                <div className="prColLinks"><a href="#">FAQ</a><a href="#">Kontak Kami</a><a href="#">Privasi</a></div>
                            </div>
                        </div>
                    </footer>
                </main>
            )}

            {/* STEP 3 */}
            {step === "howto" && (
                <main className="prMain prHowto">
                    <div className="prTimerBar">
                        <div className="prTimerTitle">Lakukan Pembayaran Sebelum</div>
                        <div className="prTimerBoxes">
                            <div className="prTimeBox"><div className="prTimeNum">{timeParts.h}</div><div className="prTimeLbl">Jam</div></div>
                            <div className="prTimeBox"><div className="prTimeNum">{timeParts.m}</div><div className="prTimeLbl">Menit</div></div>
                            <div className="prTimeBox"><div className="prTimeNum">{timeParts.s}</div><div className="prTimeLbl">Detik</div></div>
                        </div>
                    </div>

                    <div className="prSectionTitleRow">
                        <h1 className="prH1">Ringkasan Pembayaran</h1>
                        <button className="prBack" type="button" onClick={() => setStep("checkout")}>
                            ← Kembali
                        </button>
                    </div>

                    <div className="prPayGrid">
                        <aside className="prPackMini">
                            <div className="prPackMiniName">{selectedPack.name}</div>
                            <div className="prPackMiniSub">{selectedPack.sub}</div>

                            <ul className="prPackMiniList">
                                {selectedPack.lines.map((x) => (
                                    <li key={x}><span className="prCheck">✓</span><span>{x}</span></li>
                                ))}
                            </ul>

                            <button className="prPackMiniBtn" type="button" onClick={goChoose}>
                                Langganan
                            </button>
                        </aside>

                        <section className="prPayCard">
                            <div className="prPayLabel">Metode Pembayaran</div>

                            <div className="prMethodLine">
                                <span className="prRadioDot isOn" />
                                <span className="prMethodText">{method === "bca" ? "BCA Virtual Account" : "Kartu Debit/Kredit"}</span>
                                <span className="prMethodRight">08 Juni 2023</span>
                            </div>

                            <div className="prPayInfoGrid">
                                <div className="prInfoRow">
                                    <div className="prInfoKey">Kode Pembayaran</div>
                                    <div className="prInfoVal">
                                        3KQ3XJ95QPU <button className="prCopy" type="button">📋</button>
                                    </div>
                                </div>
                            </div>

                            <div className="prSum">
                                <div className="prPayLabel">Ringkasan Transaksi</div>
                                <div className="prSumRows">
                                    <div className="prSumRow"><span>Paket Premium {selectedPack.name}</span><span>{fmt(selectedPack.price)}</span></div>
                                    <div className="prSumRow"><span>Biaya Admin</span><span>{fmt(feeAdmin)}</span></div>
                                    <div className="prSumRow prSumTotal"><span>Total Pembayaran</span><span>{fmt(total)}</span></div>
                                </div>
                            </div>

                            <div className="prHowtoBox">
                                <div className="prPayLabel">Tata Cara Pembayaran</div>
                                <ol className="prSteps">
                                    <li>Buka aplikasi BCA Mobile Banking atau akses BCA Internet Banking.</li>
                                    <li>Login ke akun Anda.</li>
                                    <li>Pilih menu “Transfer” atau “Pembayaran”.</li>
                                    <li>Pilih “Virtual Account” atau “Virtual Account Number”.</li>
                                    <li>Masukkan nomor virtual account dan jumlah pembayaran, lalu konfirmasi pembayaran.</li>
                                </ol>
                            </div>

                            {/* ✅ INI yang bikin profil berubah */}
                            <button className="prPayBtn" type="button" onClick={onPayDone}>
                                Bayar
                            </button>
                        </section>
                    </div>

                    <footer className="prFooter prFooterCompact">
                        <div className="prFooterLeft">
                            <img src={logo} alt="Chill" className="prFooterLogo" />
                            <div className="prFooterCopy">©2025 Chill All Rights Reserved.</div>
                        </div>
                        <div className="prFooterCols">
                            <div className="prCol">
                                <div className="prColTitle">Genre</div>
                                <div className="prColLinks"><a href="#">Aksi</a><a href="#">Drama</a><a href="#">Komedi</a></div>
                            </div>
                            <div className="prCol">
                                <div className="prColTitle">Bantuan</div>
                                <div className="prColLinks"><a href="#">FAQ</a><a href="#">Kontak Kami</a><a href="#">Privasi</a></div>
                            </div>
                        </div>
                    </footer>
                </main>
            )}
        </div>
    );
}