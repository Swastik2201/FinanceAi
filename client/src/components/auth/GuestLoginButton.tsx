import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

interface GuestLoginButtonProps {
  onSuccess?: () => void;
  className?: string;
}

export const GuestLoginButton: React.FC<GuestLoginButtonProps> = ({ onSuccess, className = '' }) => {
  const { loginAsGuest } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestClick = async () => {
    setIsLoading(true);
    try {
      await loginAsGuest();
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      isLoading={isLoading}
      onClick={handleGuestClick}
      className={`w-full py-2.5 shadow-sm ${className}`}
      leftIcon={!isLoading && <UserCheck className="w-4 h-4 text-emerald-400" />}
    >
      Continue as Guest
    </Button>
  );
};
