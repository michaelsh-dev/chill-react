import { useState } from "react";
import { Link } from "react-router-dom";

import bgDaftar from "../assets/brand/bg-daftar.png";
import logo from "../assets/brand/logo.png";
import googleLogo from "../assets/brand/logo-google.png";

export default function Register() {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  return (
    <main className="page" style={{ ["--bg"]: `url(${bgDaftar})` }}>
      <div className="overlay"></div>

      <section className="card">
        <div className="brand">
          <img src={logo} alt="Chill" className="brand__logo" />
        </div>

        <h1 className="title">Daftar</h1>
        <p className="subtitle">Selamat datang!</p>

        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span className="label">Username</span>
            <input className="input" placeholder="Masukkan username" />
          </label>

          <label className="field">
            <span className="label">Kata Sandi</span>
            <input
              className="input"
              type={show1 ? "text" : "password"}
              placeholder="Masukkan kata sandi"
            />
            <label className="pwToggle">
              <input type="checkbox" checked={show1} onChange={e => setShow1(e.target.checked)} />
              Tampilkan kata sandi
            </label>
          </label>

          <label className="field">
            <span className="label">Konfirmasi Kata Sandi</span>
            <input
              className="input"
              type={show2 ? "text" : "password"}
              placeholder="Masukkan kata sandi"
            />
            <label className="pwToggle">
              <input type="checkbox" checked={show2} onChange={e => setShow2(e.target.checked)} />
              Tampilkan kata sandi
            </label>
          </label>

          <div className="row row--single">
            <Link className="link" to="/">Sudah punya akun? <b>Masuk</b></Link>
          </div>

          <button className="btnPrimary">Daftar</button>

          <div className="divider"><span>Atau</span></div>

          <button className="btnGhost" type="button">
            <img src={googleLogo} className="gIcon" />
            Daftar dengan Google
          </button>
        </form>
      </section>
    </main>
  );
}