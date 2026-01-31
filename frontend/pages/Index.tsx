import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ThreeBackground from '@/components/ThreeBackground';
import HeroSection from '@/components/landing/HeroSection';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If already logged in, skip landing page
    if (user && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ThreeBackground />
      <HeroSection onGetStarted={handleGetStarted} />
    </div>
  );
};

export default Index;
