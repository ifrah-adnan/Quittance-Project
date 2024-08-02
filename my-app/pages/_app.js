// pages/_app.js
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }) {
    console.log('Session in _app.js:', pageProps.session); // Debugging log
    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}

MyApp.getInitialProps = async (context) => {
    const { ctx, Component } = context;
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
};

export default MyApp;
