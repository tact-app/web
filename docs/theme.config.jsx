export default {
  project: {
    link: 'https://github.com/tact-app/web',
  },

  docsRepositoryBase: 'https://github.com/tact-app/web/blob/main/docs',
  feedback: {
    useLink() {
      return 'https://github.com/tact-app/web/discussions/new/choose'
    },
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s',
    }
  },

  head: (
    <>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

      <meta name="twitter:image:src"
            content="https://cdn.octolab.org/tact/interface.png"/>
      <meta name="twitter:site" content="@github"/>
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content="Tact.web"/>
      <meta name="twitter:description" content="🖥️ Web version for desktops."/>
      <meta property="og:image"
            content="https://cdn.octolab.org/tact/interface.png"/>
      <meta property="og:image:alt" content="🖥️ Tact.web"/>
      <meta property="og:site_name" content="GitHub"/>
      <meta property="og:type" content="object"/>
      <meta property="og:title" content="Tact.web"/>
      <meta property="og:url" content="https://docs.tact.run"/>
      <meta property="og:description" content="🖥️ Web version for desktops."/>

      <style>{`
        main p a img { display: inline; } /* badges */
      `}</style>
    </>
  ),
  logo: (
    <>
      <img width={24} height={24}
           src="https://cdn.octolab.org/geek/octolab.png"
           alt="OctoLab"
      />
      <span>Tact.app</span>
    </>
  ),
  banner: {
    text: <a href="https://github.com/tact-app/web/releases/tag/v0.4.0" target="_blank">
      🎉 Release v0.4.0 is out. Read more →
    </a>,
  },
  footer: {
    text: <span>
      MIT {new Date().getFullYear()} © <a href="https://github.com/octolab" target="_blank">
        OctoLab
      </a>.
    </span>,
  },
}
