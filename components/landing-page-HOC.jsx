// HOC to redirect authenticated users to /todos

'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useStateStore from '@/stores/stateStore';
import { useToast } from '@/hooks/use-toast';

const withAuthRedirect = (WrappedComponent) => {
  const WithAuthRedirectComponent = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { getFullUrl } = useStateStore();
    const { toast } = useToast();

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('token'); // Fetch token from localStorage
        if (!token) {
          // No token found, render the component for unauthenticated users
          setLoading(false);
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
            // If authenticated, redirect to /todos
            router.push('/todos');
          } else {
            // Invalid token, allow user to access the component (e.g., login page)
            toast({
              title: 'Authentication Error',
              description: 'Please log in again',
              variant: 'destructive',
            });
            localStorage.removeItem('token');
            setLoading(false); // Allow component to render
          }
        } catch (error) {
          console.error('Authentication error:', error);
          toast({
            title: 'Authentication error',
            description: 'Please log in again',
            variant: 'destructive',
          });
          localStorage.removeItem('token');
          setLoading(false); // Allow component to render
        }
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return <p>Loading...</p>; // Show a loading state while checking authentication
    }

    // Render the wrapped component if not authenticated
    return <WrappedComponent {...props} />;
  };

  WithAuthRedirectComponent.displayName = `WithAuthRedirect(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthRedirectComponent;
};

export default withAuthRedirect;
