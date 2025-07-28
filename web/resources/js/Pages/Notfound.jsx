import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function NotFoundRedirect() {
  useEffect(() => {
    toast.error('Halaman tidak ditemukan');
  }, []);

  return <Navigate to="/" replace />;
}
