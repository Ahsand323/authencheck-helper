
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { AuthState, User } from '../utils/types';
import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';
import VerificationModal from '../components/VerificationModal';
import { verifyFaceId } from '../utils/auth';
import { toast } from 'sonner';

interface LoginProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const Login = ({ authState, setAuthState }: LoginProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showVerification, setShowVerification] = useState(false);

  // Auto-redirect to dashboard if already authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [authState.isAuthenticated]);

  const handleLoginSuccess = (userData: User) => {
    // Set the current user and show Face ID verification
    setCurrentUser(userData);
    setShowVerification(true);
  };

  const handleVerificationSuccess = () => {
    if (currentUser) {
      setAuthState({
        isAuthenticated: true,
        user: currentUser,
        loading: false,
        error: null,
      });
      toast.success('Face ID verified successfully. Welcome back!');
    }
  };

  const handleVerificationCancel = () => {
    toast.error('Face ID verification is required to log in');
    setShowVerification(false);
    // Allow them to try again after a short delay
    setTimeout(() => {
      if (currentUser) {
        setShowVerification(true);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div 
                className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <UserCheck size={24} />
              </motion.div>
              <motion.h1 
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                className="text-sm text-muted-foreground mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Sign in to your account
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <AuthForm type="login" onSuccess={handleLoginSuccess} />
            </motion.div>

            <motion.div 
              className="mt-6 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </p>
            </motion.div>
          </div>

          <motion.div 
            className="px-8 py-4 bg-muted/30 border-t text-center text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <p>Demo credentials: admin@example.com / password123</p>
          </motion.div>
        </div>
      </div>
      
      {/* Face ID verification modal */}
      {showVerification && currentUser && (
        <VerificationModal 
          user={currentUser}
          type="face"
          isRegister={false}
          required={true}
          onSuccess={handleVerificationSuccess}
          onCancel={handleVerificationCancel}
        />
      )}
    </div>
  );
};

export default Login;
