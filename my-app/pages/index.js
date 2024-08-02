// pages/index.js
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            {session ? (
                <div>
                    <p>Signed in as {session.user.email}</p>
                    <button onClick={() => signOut()}>Sign out</button>
                </div>
            ) : (
                <p>You are not signed in</p>
            )}
        </div>
    );
}
