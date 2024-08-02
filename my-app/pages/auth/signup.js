// pages/auth/signup.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tenantId, setTenantId] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/registerUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, tenantId }),
        });
        if (res.ok) {
            alert('User registered successfully');
            router.push('/auth/signin');
        } else {
            alert('Failed to register user');
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Tenant ID"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}
