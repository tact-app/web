import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html translate='no' lang="en">
      <Head/>
      <body className='notranslate'>
      <Main/>
      <div id='portal'/>
      <NextScript/>
      </body>
    </Html>
  );
}
