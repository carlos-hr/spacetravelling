import styles from './header.module.scss';

const Header = (): JSX.Element => {
  return (
    <header className={styles.headerContainer}>
      <div>
        <img src="/images/logo.svg" alt="logo" />
      </div>
    </header>
  );
};

export default Header;
