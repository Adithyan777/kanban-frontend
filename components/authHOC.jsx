import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useStateStore from '@/stores/stateStore';
import { useToast } from '@/hooks/use-toast';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const { getFullUrl } = useStateStore();
    const { toast } = useToast();

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('token'); // Fetch token from localStorage
        if (!token) {
          toast({
            title: 'Token Not Found',
            description: 'Please Log In',
            variant: 'destructive',
          });
          router.push('/'); // Redirect to login if no token
          return;
        }

        try {
          // Verify token by sending it to the backend
          const res = await fetch(getFullUrl('/auth'), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
          });

          if (res.ok) {
            setIsAuthenticated(true); // Token is valid
          } else {
            toast({
              title: 'Authentication Error',
              description: 'Please log in again',
              variant: 'destructive',
            });
            localStorage.removeItem('token'); // Remove invalid token
            router.push('/'); // Redirect to login
          }
        } catch (error) {
          console.error('Authentication error:', error);
          toast({
            title: 'Authentication error',
            description: 'Please log in again',
            variant: 'destructive',
          });
          localStorage.removeItem('token');
          router.push('/'); // Redirect to login on error
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return <p>Loading...</p>; // Show a loading state while checking authentication
    }

    if (isAuthenticated) {
      return <WrappedComponent {...props} />; // Render the component if authenticated
    }

    return null; // Don't render the component if not authenticated
  };
};

export default withAuth;
