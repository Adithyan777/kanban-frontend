import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation';
import useStateStore  from '@/stores/stateStore';

export default function LoginCard() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { getFullUrl } = useStateStore();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await fetch(getFullUrl('/login'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setIsLoading(false);
            router.push('/todos');
        }catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your email and password to log in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        placeholder="m@example.com" 
                        required 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                        id="password" 
                        required 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
            </CardContent>
            <CardFooter>
                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </CardFooter>
        </form>
    )
}