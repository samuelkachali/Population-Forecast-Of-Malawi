import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useInactivityTimer = (timeoutMinutes = 60, warningMinutes = 5) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);
  const timeoutMs = timeoutMinutes * 60 * 1000; // Convert minutes to milliseconds
  const warningMs = warningMinutes * 60 * 1000; // Warning time in milliseconds
  
  const [showWarning, setShowWarning] = useState(false);

  const logout = () => {
    // Clear user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show alert and redirect
    alert('You have been signed out due to inactivity for security reasons.');
    navigate('/signin');
  };

  const resetTimer = () => {
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }
    
    // Hide warning if it was showing
    setShowWarning(false);
    
    // Set warning timer
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
    }, timeoutMs - warningMs);
    
    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      logout();
    }, timeoutMs);
  };

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    resetTimer();
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    // Only start the timer if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    // Events to track for user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown'
    ];

    // Reset timer on any user activity
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start the initial timer
    resetTimer();

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
      
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [navigate, timeoutMs, warningMs, resetTimer]);

  return { 
    showWarning, 
    handleStayLoggedIn, 
    handleLogout,
    resetTimer 
  };
};

export default useInactivityTimer; 