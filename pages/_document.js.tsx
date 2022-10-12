import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html translate='no' lang="en">
      <Head>
        <meta name="google" content="notranslate" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className='notranslate'>
      <Main/>
      <NextScript/>
      </body>
    </Html>
  );
}