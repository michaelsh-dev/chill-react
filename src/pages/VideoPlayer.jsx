import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./VideoPlayer.css";

export default function VideoPlayer() {
    const { movieId, episodeNo } = useParams();
    const nav = useNavigate();
    const { state } = useLocation();

    const playlist = useMemo(() => {
        const list = Array.isArray(state?.playlist) ? state.playlist : [];
        return list.map((ep, i) => ({
            no: ep.no ?? i + 1,
            title: ep.title ?? `Episode ${i + 1}`,
            dur: ep.dur ?? "30m",
            thumb: ep.thumb,
            playerThumb: ep.playerThumb ?? ep.thumb,
            desc: ep.desc ?? "Deskripsi episode belum tersedia.",
            videoTo: ep.videoTo ?? `/video/${movieId}/${i + 1}`,
        }));
    }, [state, movieId]);

    const currentIndex = Number.isFinite(state?.index) ? state.index : Math.max(0, (Number(episodeNo) || 1) - 1);
    const currentEp = playlist[currentIndex];

    const heroImg =
        state?.playerThumb ||
        currentEp?.playerThumb ||
        currentEp?.thumb ||
        state?.thumb ||
        "";

    const seriesTitle = state?.seriesTitle || state?.title || "Tontonan";
    const epTitle = currentEp?.title || state?.epTitle || (episodeNo ? `Episode ${episodeNo}` : "Movie");

    // UI states (figma)
    const [paused, setPaused] = useState(false);
    const [openAudio, setOpenAudio] = useState(false);
    const [openCaption, setOpenCaption] = useState(false);
    const [openSpeed, setOpenSpeed] = useState(false);
    const [openNext, setOpenNext] = useState(false);
    const [openList, setOpenList] = useState(false);
    const [openPremium, setOpenPremium] = useState(false);

    const [captionOn, setCaptionOn] = useState(true);
    const [audioLang, setAudioLang] = useState("Bahasa Inggris");
    const [captionLang, setCaptionLang] = useState("Bahasa Indonesia");
    const [speed, setSpeed] = useState("1x (Normal)");
    const [volume, setVolume] = useState(0.7);     // 0 - 1
    const [showVol, setShowVol] = useState(false); // popup slider



    const closeAllPop = () => {
        setOpenAudio(false);
        setOpenCaption(false);
        setOpenSpeed(false);
    };

    const goToEpisode = (idx) => {
        const ep = playlist[idx];
        if (!ep) return;
        nav(ep.videoTo, {
            state: {
                ...state,
                playerThumb: ep.playerThumb ?? ep.thumb ?? heroImg,
                playlist,
                index: idx,
                seriesTitle,
            },
        });
    };

    const nextEp = playlist[currentIndex + 1];

    return (
        <div className="vpPage">
            {/* SCREEN */}
            <div className="vpStage" style={heroImg ? { backgroundImage: `url(${heroImg})` } : undefined}>
                <button
                    type="button"
                    className="vpClose"
                    onClick={() => nav(-1)}
                    aria-label="Tutup"
                    title="Tutup"
                >
                    ✕
                </button>

                <div className="vpShade" />

                {/* Center Play/Pause */}
                <button
                    type="button"
                    className="vpCenterBtn"
                    onClick={() => setPaused((v) => !v)}
                    aria-label={paused ? "Play" : "Pause"}
                >
                    {paused ? "▶" : "⏸"}
                </button>

                {/* Caption overlay (fake subtitle like figma) */}
                {captionOn && (
                    <div className="vpCaption">
                        <span>TED Lasso Episode {currentIndex + 1}: {epTitle}</span>
                    </div>
                )}

                {/* Bottom Bar (icons) */}
                <div className="vpBar">
                    <div className="vpLeft">
                        <button className="vpIcon" type="button" onClick={() => setPaused((v) => !v)} title="Play/Pause">
                            {paused ? "▶" : "⏸"}
                        </button>
                        <button className="vpIcon" type="button" title="Replay 10s">↺10</button>
                        <button className="vpIcon" type="button" title="Forward 10s">10↻</button>
                        <div className="vpVol">
                            <button
                                type="button"
                                className="vpIcon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowVol((v) => !v);   // ✅ klik untuk buka/tutup slider
                                }}
                                title="Volume"
                            >
                                🔊
                            </button>

                            {showVol && (
                                <div
                                    className="vpVolPop"
                                    onClick={(e) => e.stopPropagation()}  // ✅ klik di popup ga nutup
                                >
                                    <input
                                        className="vpVolRange"
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={Math.round(volume * 100)}
                                        onChange={(e) => setVolume(Number(e.target.value) / 100)}
                                    />
                                    <div className="vpVolNum">{Math.round(volume * 100)}%</div>
                                </div>
                            )}
                        </div>


                        <div className="vpNow">
                            <div className="vpNowTitle">{seriesTitle}</div>
                            <div className="vpNowEp">{epTitle}</div>
                        </div>
                    </div>

                    <div className="vpRight">
                        {/* AUDIO */}
                        <div className="vpPopWrap">
                            <button
                                className={`vpIcon ${openAudio ? "isOn" : ""}`}
                                type="button"
                                title="Audio"
                                onClick={() => {
                                    setOpenAudio((v) => !v);
                                    setOpenCaption(false);
                                    setOpenSpeed(false);
                                }}
                            >
                                🎧
                            </button>

                            {openAudio && (
                                <div className="vpPop">
                                    <div className="vpPopTitle">Audio</div>
                                    {["Bahasa Inggris", "Bahasa Indonesia"].map((x) => (
                                        <button
                                            key={x}
                                            className={`vpPopItem ${audioLang === x ? "isActive" : ""}`}
                                            type="button"
                                            onClick={() => setAudioLang(x)}
                                        >
                                            <span>{x}</span>
                                            {audioLang === x ? <span>✓</span> : null}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* CAPTION / TERJEMAHAN */}
                        <div className="vpPopWrap">
                            <button
                                type="button"
                                className={`vpIcon ${captionOn ? "isOn" : ""}`}
                                onClick={(e) => {
                                    setOpenCaption((v) => !v);   // ✅ buka/tutup panel terjemahan
                                    e.currentTarget.blur();     // ✅ ga nempel focus
                                    setOpenAudio(false);
                                    setOpenSpeed(false);
                                }}
                                aria-label="CC"
                                title="CC"
                            >
                                CC
                            </button>



                            {openCaption && (
                                <div className="vpPop">
                                    <div className="vpPopTitle">Terjemahan</div>

                                    <button
                                        className={`vpPopItem ${captionOn ? "isActive" : ""}`}
                                        type="button"
                                        onClick={() => setCaptionOn(true)}
                                    >
                                        <span>Aktif</span>
                                        {captionOn ? <span>✓</span> : null}
                                    </button>

                                    <button
                                        className={`vpPopItem ${!captionOn ? "isActive" : ""}`}
                                        type="button"
                                        onClick={() => setCaptionOn(false)}
                                    >
                                        <span>Nonaktif</span>
                                        {!captionOn ? <span>✓</span> : null}
                                    </button>

                                    <div className="vpPopHr" />

                                    {["Bahasa Indonesia", "Bahasa Inggris"].map((x) => (
                                        <button
                                            key={x}
                                            className={`vpPopItem ${captionLang === x ? "isActive" : ""}`}
                                            type="button"
                                            onClick={() => setCaptionLang(x)}
                                        >
                                            <span>{x}</span>
                                            {captionLang === x ? <span>✓</span> : null}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* SPEED */}
                        <div className="vpPopWrap">
                            <button
                                className={`vpIcon ${openSpeed ? "isOn" : ""}`}
                                type="button"
                                title="Kecepatan"
                                onClick={() => {
                                    setOpenSpeed((v) => !v);
                                    setOpenAudio(false);
                                    setOpenCaption(false);
                                }}
                            >
                                ⏩
                            </button>

                            {openSpeed && (
                                <div className="vpPop">
                                    <div className="vpPopTitle">Kecepatan</div>
                                    {["0.5x", "0.75x", "1x (Normal)", "1.25x", "1.5x"].map((x) => (
                                        <button
                                            key={x}
                                            className={`vpPopItem ${speed === x ? "isActive" : ""}`}
                                            type="button"
                                            onClick={() => setSpeed(x)}
                                        >
                                            <span>{x}</span>
                                            {speed === x ? <span>✓</span> : null}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* NEXT EP BUTTON (figma: tombol play utk episode selanjutnya) */}
                        <button
                            className="vpIcon"
                            type="button"
                            title="Episode Selanjutnya"
                            onClick={() => {
                                closeAllPop();
                                setOpenList(false);
                                setOpenNext(true);
                            }}
                            disabled={!nextEp}
                        >
                            ⏭
                        </button>

                        {/* LIST EP (figma: icon list untuk semua episode) */}
                        <button
                            className={`vpIcon ${openList ? "isOn" : ""}`}
                            type="button"
                            title="Daftar Episode"
                            onClick={() => {
                                closeAllPop();
                                setOpenNext(false);
                                setOpenList((v) => !v);
                            }}
                            disabled={!playlist.length}
                        >
                            ☰
                        </button>

                        <button className="vpIcon" type="button" title="Fullscreen">⛶</button>
                    </div>
                </div>

                {/* Next episode popup (figma gambar 2) */}
                {openNext && nextEp && (
                    <div className="vpNextCard" onClick={(e) => e.stopPropagation()}>
                        <div className="vpNextTop">
                            <div className="vpNextLabel">Episode Selanjutnya</div>
                            <button className="vpX" type="button" onClick={() => setOpenNext(false)}>✕</button>
                        </div>
                        <button className="vpNextBtn" type="button" onClick={() => goToEpisode(currentIndex + 1)}>
                            <img className="vpNextThumb" src={nextEp.thumb || heroImg} alt={nextEp.title} />
                            <div className="vpNextMeta">
                                <div className="vpNextTitle">Episode {nextEp.no}: {nextEp.title}</div>
                                <div className="vpNextDesc">{nextEp.desc}</div>
                            </div>
                        </button>
                    </div>
                )}

                {/* Episode list drawer (figma gambar 3) */}
                {openList && (
                    <div className="vpDrawer" onClick={() => setOpenList(false)}>
                        <div className="vpDrawerPanel" onClick={(e) => e.stopPropagation()}>
                            <div className="vpDrawerHead">
                                <button className="vpBack" type="button" onClick={() => setOpenList(false)}>←</button>
                                <div className="vpDrawerTitle">Episode Selanjutnya</div>
                            </div>

                            <div className="vpDrawerList">
                                {playlist.map((ep, idx) => (
                                    <button
                                        key={ep.no}
                                        type="button"
                                        className={`vpDrawerItem ${idx === currentIndex ? "isActive" : ""}`}
                                        onClick={() => goToEpisode(idx)}
                                    >
                                        <div className="vpDrawerNo">Episode {ep.no}</div>
                                        <div className="vpDrawerItemMain">
                                            <div className="vpDrawerItemTitle">{ep.title}</div>
                                            <div className="vpDrawerItemDesc">{ep.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Lewati Intro -> Premium modal (figma gambar 4) */}
                <button
                    type="button"
                    className="vpSkipIntro"
                    onClick={() => setOpenPremium(true)}
                >
                    Lewati Intro
                </button>

                {openPremium && (
                    <div className="vpPremium" onClick={() => setOpenPremium(false)}>
                        <div className="vpPremiumCard" onClick={(e) => e.stopPropagation()}>
                            <div className="vpPremiumTitle">Layanan Premium ✨</div>
                            <div className="vpPremiumSub">Tingkatkan paket anda untuk dapat menonton video ini.</div>

                            <div className="vpPremiumWhy">Kenapa Harus Berlangganan?</div>

                            <div className="vpPremiumGrid">
                                <div className="vpPItem"><div className="vpPIcon">⬇</div><div className="vpPText">Download Konten Pilihan</div></div>
                                <div className="vpPItem"><div className="vpPIcon">🚫</div><div className="vpPText">Tidak Ada Iklan</div></div>
                                <div className="vpPItem"><div className="vpPIcon">🌐</div><div className="vpPText">Tonton Semua Konten</div></div>
                                <div className="vpPItem"><div className="vpPIcon">4K</div><div className="vpPText">Kualitas Maksimal Sampai Dengan 4K</div></div>
                                <div className="vpPItem"><div className="vpPIcon">📺</div><div className="vpPText">Tonton di TV, Tablet, Mobile, dan Laptop</div></div>
                                <div className="vpPItem"><div className="vpPIcon">💬</div><div className="vpPText">Subtitle Untuk Konten Pilihan</div></div>
                            </div>

                            <button type="button" className="vpPremiumBtn" onClick={() => setOpenPremium(false)}>
                                Ubah Jadi Premium
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* close popups when click outside pop */}
            {(openAudio || openCaption || openSpeed) && (
                <button className="vpClickCatcher" type="button" onClick={closeAllPop} aria-label="Close" />
            )}
        </div>
    );
}
