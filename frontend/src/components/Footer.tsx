const Footer = () => {
  return (
    <footer className="app-footer">
      <nav aria-label="Footer navigation">
        <img src="/jk-logo.png" className="logo" alt="Aspire logo" />

        <a
          href="https://github.com/JMKangas/ElectricityAPI"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about this project
          <span className="visually-hidden"> (opens in new tab)</span>
        </a>

        <a
          href="https://github.com/JMKangas/ElectricityAPI"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
          aria-label="View this project on GitHub (opens in new tab)"
        >
          <img
            src="/github.svg"
            alt=""
            width="24"
            height="24"
            aria-hidden="true"
          />
          <span className="visually-hidden">GitHub</span>
        </a>
      </nav>
    </footer>
  )
}

export default Footer
