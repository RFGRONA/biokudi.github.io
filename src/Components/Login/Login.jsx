import React, { Fragment } from "react";
import styles from "./Login.module.css";
import Header from "../header/Header2";
import Footer from "../footer/Footer";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <Fragment>
      <Header />
      <div className={styles.mainContainer}>
        <LoginForm />
      </div>
      <Footer />
    </Fragment>
  );
};

export default Login;
