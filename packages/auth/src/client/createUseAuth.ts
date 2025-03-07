import { useContext } from 'react';
import { AuthContextType } from '@healthtrack/types';

export function createUseAuth(AuthContext: React.Context<AuthContextType | undefined>) {
  return () => {
    const context = useContext(AuthContext);
    
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
  };
}