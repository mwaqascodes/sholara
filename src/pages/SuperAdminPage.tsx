import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';

export default function SuperAdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return null;
}
