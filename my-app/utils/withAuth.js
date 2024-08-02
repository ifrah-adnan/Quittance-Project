// utils/withAuth.js
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent) => {
    return function ProtectedRoute(props) {
        const router = useRouter();

        if (!props.session) {
            if (typeof window !== 'undefined') {
                console.log('User is not authenticated, redirecting to sign-in page');
                router.push('/auth/signin');
            }
            return null;
        }

        console.log('User is authenticated:', props.session);
        return <WrappedComponent {...props} />;
    };

    ProtectedRoute.getInitialProps = async (context) => {
        const session = await getSession(context);
        if (!session && context.res) {
            console.log('User is not authenticated, server-side redirect to sign-in page');
            context.res.writeHead(302, { Location: '/auth/signin' });
            context.res.end();
            return {};
        }

        console.log('User is authenticated:', session);

        const wrappedProps = WrappedComponent.getInitialProps
            ? await WrappedComponent.getInitialProps(context)
            : {};

        return { ...wrappedProps, session };
    };

    return ProtectedRoute;
};

export default withAuth;
