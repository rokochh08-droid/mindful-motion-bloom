import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    
    if (!hasCompletedOnboarding) {
      navigate('/welcome');
    }
  }, [navigate]);

  return null; // This will redirect before rendering
};

export default Index;
