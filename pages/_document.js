import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      locale: ctx.req.locale,
      localeDataScript: ctx.req.localeDataScript,
    };
  }

  render() {
    // const polyfill = `https://polyfill.io/v3/polyfill.min.js?features=Intl`;
    return (
      <Html lang={this.props.locale}>
        <Head>
          {/* <script>
            {`console.log(navigator.cookieEnabled); if(!navigator.cookieEnabled)
            {alert(${mes})}`}
          </script> */}
          <script
            dangerouslySetInnerHTML={{
              __html: `if(!navigator.cookieEnabled)
              {alert("您的浏览器限制了Cookie，这将影响您的正常使用。您可以更改浏览器的隐私设置，解除限制后重试。")}`,
            }}
          />
          {/* <script src={polyfill} /> */}
          <script
            dangerouslySetInnerHTML={{ __html: this.props.localeDataScript }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
