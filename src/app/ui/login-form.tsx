import { Button } from "./button";

import styles from "../ui/styles/login-form.module.scss";

export const LoginForm = () => {
  return (
    <form className={styles.form}>
      <div className={styles.input_container}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
        />
      </div>
      <hr />
      <div className={styles.input_container}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Enter password"
          required
          minLength={6}
        />
      </div>
      <div>
        <Button>Login</Button>
      </div>
    </form>
  );
};
