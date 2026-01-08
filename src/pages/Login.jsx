import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import bgLogin from "../assets/brand/bg-login.png";
import logo from "../assets/brand/logo.png";
import googleLogo from "../assets/brand/logo-google.png";

export default function Login() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  console.log("bgLogin:", bgLogin);

  return (
    <main className="page" style={{ ["--bg"]: `url(${bgLogin})` }}>
      <div className="overlay"></div>

      <section className="card">
        <div className="brand">
          <img src={logo} alt="Chill" className="brand__logo" />
        </div>

        <h1 className="title">Masuk</h1>
        <p className="subtitle">Selamat datang kembali!</p>

        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/home");
          }}
        >
          <label className="field">
            <span className="label">Username</span>
            <input className="input" placeholder="Masukkan username" />
          </label>

          <label className="field">
            <span className="label">Kata Sandi</span>
            <input
              className="input"
              type={show ? "text" : "password"}
              placeholder="Masukkan kata sandi"
            />

            <label className="pwToggle">
              <input
                type="checkbox"
                checked={show}
                onChange={(e) => setShow(e.target.checked)}
              />
              Tampilkan kata sandi
            </label>
          </label>

          <div className="row">
            <Link className="link" to="/register">
              Belum punya akun? <b>Daftar</b>
            </Link>
            <a className="link" href="#">Lupa kata sandi?</a>
          </div>

          <button className="btnPrimary" type="submit">Masuk</button>

          <div className="divider"><span>Atau</span></div>

          <button className="btnGhost" type="button">
            <img src={googleLogo} className="gIcon" />
            Masuk dengan Google
          </button>
        </form>
      </section>
    </main>
  );
}