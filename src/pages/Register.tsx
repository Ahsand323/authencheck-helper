
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { AuthState, User } from '../utils/types';
import { motion } from 'framer-motion';
import { UserCheck, Camera } from 'lucide-react';
import VerificationModal from '../components/VerificationModal';
import { toast } from 'sonner';
import { addNewUser } from '../utils/auth';

interface RegisterProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const Register = ({ authState, setAuthState }: RegisterProps) => {
  const navigate = useNavigate();
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [faceRegistered, setFaceRegistered] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  const handleRegisterSuccess = (userData: User) => {
    setRegisteredUser(userData);
    // Show face verification
    setShowVerification(true);
    toast.success('Account created! Please set up Face ID to continue');
  };

  const handleFaceVerificationSuccess = () => {
    setShowVerification(false);
    setFaceRegistered(true);
    
    // Complete registration after face is registered
    if (registeredUser) {
      const updatedUser = {
        ...registeredUser,
        hasFaceRegistered: true
      };
      
      // Add user to database
      addNewUser(updatedUser);
      
      // Update auth state
      setAuthState({
        isAuthenticated: true,
        user: updatedUser,
        loading: false,
        error: null
      });
      
      // Save to local storage
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      localStorage.setItem('isAuthenticated', 'true');
      
      toast.success('Registration complete! You are now logged in');
      // Ensure we navigate to dashboard
      navigate('/dashboard');
    }
  };

  const handleVerificationCancel = () => {
    setShowVerification(false);
    
    // If they've canceled without registering face, prompt again
    if (!faceRegistered) {
      toast.error('Face ID registration is required to continue');
      setVerificationAttempts(prev => prev + 1);
      
      if (verificationAttempts >= 2) {
        toast('Try moving to a well-lit area and ensure your face is clearly visible', {
          duration: 5000,
        });
      }
      
      setTimeout(() => setShowVerification(true), 1000);
    }
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
                Create an Account
              </motion.h1>
              <motion.p 
                className="text-sm text-muted-foreground mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Join the next generation of attendance management
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <AuthForm type="register" onSuccess={handleRegisterSuccess} />
            </motion.div>

            <motion.div 
              className="mt-6 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </motion.div>
          </div>

          <motion.div 
            className="px-8 py-4 bg-muted/30 border-t text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <p className="text-sm text-muted-foreground mb-2">You'll need to set up:</p>
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <Camera size={16} className={`mr-2 ${faceRegistered ? 'text-green-500' : 'text-primary'}`} />
                <span className="text-xs">Face ID {faceRegistered && '✓'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Face ID verification modal */}
      {showVerification && registeredUser && (
        <VerificationModal 
          user={registeredUser}
          type="face"
          isRegister={true}
          required={true}
          onSuccess={handleFaceVerificationSuccess}
          onCancel={handleVerificationCancel}
        />
      )}
    </div>
  );
};

export default Register;
