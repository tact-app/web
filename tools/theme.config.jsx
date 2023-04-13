export default {
  project: {
    link: 'https://github.com/tact-app/web',
  },
  docsRepositoryBase: 'https://github.com/tact-app/web/blob/tools/pages',
  head: (
    <>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>{`
        main p a img { display: inline; } /* badges */
      `}</style>
    </>
  ),
  logo: (
    <>
      <img width={24} height={24}
           src="https://raw.githubusercontent.com/octomation/.github/main/.static/octolab.png"
           alt="OctoLab"
      />
      <span>Module</span>
    </>
  ),
  banner: {
    text: <a href="https://github.com/tact-app/web/releases/tag/v0.3.0-pre.2" target="_blank">
      🎉 Module v0.3.0-rc.2 is released. Read more →
    </a>,
  },
  footer: {
    text: <span>
      MIT {new Date().getFullYear()} © <a href="https://github.com/octolab" target="_blank">OctoLab</a>.
    </span>,
  },
}
