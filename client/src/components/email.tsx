import React, { useState } from 'react';
import { SHA1 } from 'crypto-js';

const PwnedPasswordChecker: React.FC = () => {
  // State management
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{isPwned: boolean; count?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Function to check if password is pwned
  const checkPassword = async () => {
    if (!password) {
      setError('Please enter a password');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Hash the password with SHA-1
      const hash = SHA1(password).toString().toUpperCase();
      const prefix = hash.substring(0, 5);
      const suffix = hash.substring(5);

      // Fetch from HIBP API
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      
      if (!response.ok) {
        throw new Error('Failed to check password');
      }

      const data = await response.text();
      const hashes = data.split('\n');
      
      // Check if our hash suffix exists in the response
      const foundHash = hashes.find((line: string) => line.startsWith(suffix));
      
      if (foundHash) {
        const count = parseInt(foundHash.split(':')[1], 10);
        setResult({ isPwned: true, count });
      } else {
        setResult({ isPwned: false });
      }
    } catch (err) {
      setError('An error occurred while checking the password. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkPassword();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Pwned Passwords</h1>
        <p style={styles.subtitle}>
          Check if your password has been exposed in a data breach
        </p>
      </div>
      
      <div style={styles.card}>
        <div style={styles.inputContainer}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter password to check..."
            style={styles.input}
            disabled={isLoading}
          />
          <button
            onClick={checkPassword}
            disabled={isLoading}
            style={isLoading ? {...styles.button, ...styles.buttonLoading} : styles.button}
          >
            {isLoading ? 'Checking...' : 'Check'}
          </button>
        </div>
        
        {error && (
          <div style={styles.error}>
            <p>{error}</p>
          </div>
        )}
        
        {result && (
          <div style={result.isPwned ? styles.resultError : styles.resultSuccess}>
            <h3 style={styles.resultTitle}>
              {result.isPwned ? (
                <>Oh no — <span style={styles.pwnedText}>pwned</span>!</>
              ) : (
                <>Good news — no pwnage found!</>
              )}
            </h3>
            {result.isPwned ? (
              <p style={styles.resultText}>
                This password has been seen <strong style={styles.count}>{result.count?.toLocaleString()}</strong> times in data breaches. 
                You should <strong>never</strong> use this password for any online account.
              </p>
            ) : (
              <p style={styles.resultText}>
                This password wasn't found in any of the Pwned Passwords database. 
                However, this doesn't guarantee it's a secure password — just that it hasn't been found in a breach.
              </p>
            )}
          </div>
        )}
        
        <div style={styles.infoSection}>
          <div style={styles.infoHeader} onClick={() => setShowInfo(!showInfo)}>
            <h3 style={styles.infoTitle}>How this works</h3>
            <span style={styles.infoToggle}>{showInfo ? '▲' : '▼'}</span>
          </div>
          
          {showInfo && (
            <div style={styles.infoContent}>
              <div style={styles.infoBlock}>
                <h4 style={styles.infoSubtitle}>What are Pwned Passwords?</h4>
                <p style={styles.infoText}>
                  Pwned Passwords are hundreds of millions of real world passwords previously exposed in data breaches. 
                  This exposure makes them unsuitable for ongoing use as they're at much greater risk of being used to take over other accounts.
                </p>
              </div>
              
              <div style={styles.infoBlock}>
                <h4 style={styles.infoSubtitle}>How we check your password safely</h4>
                <p style={styles.infoText}>
                  We use a k-anonymity model that allows you to check your password without sending the actual password to the service. 
                  Your password is hashed with SHA-1, and only the first 5 characters of the hash are sent to the API. 
                  The API returns a list of all hashes that start with those 5 characters, and we check the full hash locally on your device.
                </p>
              </div>
              
              <div style={styles.infoBlock}>
                <h4 style={styles.infoSubtitle}>Why you need to change pwned passwords</h4>
                <p style={styles.infoText}>
                  If your password has been exposed in a data breach, it's no longer safe to use. 
                  Attackers use exposed passwords in "credential stuffing" attacks, where they try the same password on many different websites. 
                  Using a unique, strong password for each account is essential for your online security.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div style={styles.footer}>
        <p style={styles.footerText}>
          This service is based on Troy Hunt's "Have I Been Pwned" API. 
          Read more about <a href="https://www.troyhunt.com/ive-just-launched-pwned-passwords-version-2/" target="_blank" rel="noopener noreferrer" style={styles.link}>Pwned Passwords</a>.
        </p>
      </div>
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    color: '#333',
    lineHeight: 1.5,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
  },
  title: {
    color: '#2b2b2b',
    fontSize: '2.5rem',
    fontWeight: 600,
    margin: '0 0 10px 0',
  },
  subtitle: {
    color: '#666',
    fontSize: '1.2rem',
    margin: 0,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    marginBottom: '30px',
  },
  inputContainer: {
    display: 'flex',
    marginBottom: '20px',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '14px 16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '14px 24px',
    backgroundColor: '#2b8cbe',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600 as const,
    transition: 'background-color 0.2s',
  },
  buttonLoading: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
  },
  resultError: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '20px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
  },
  resultSuccess: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '20px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #c3e6cb',
  },
  resultTitle: {
    margin: '0 0 10px 0',
    fontSize: '1.5rem',
  },
  pwnedText: {
    color: '#dc3545',
    fontWeight: 700 as const,
  },
  resultText: {
    margin: 0,
    fontSize: '16px',
  },
  count: {
    fontSize: '1.2em',
    color: '#dc3545',
  },
  infoSection: {
    marginTop: '25px',
  },
  infoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  infoTitle: {
    margin: 0,
    color: '#2b8cbe',
    fontSize: '1.2rem',
  },
  infoToggle: {
    fontSize: '1.2rem',
    color: '#666',
  },
  infoContent: {
    paddingTop: '15px',
  },
  infoBlock: {
    marginBottom: '20px',
  },
  infoSubtitle: {
    margin: '0 0 10px 0',
    color: '#2b2b2b',
    fontSize: '1.1rem',
  },
  infoText: {
    margin: 0,
    color: '#555',
  },
  footer: {
    textAlign: 'center' as const,
    padding: '20px',
    color: '#666',
    fontSize: '0.9rem',
  },
  footerText: {
    margin: 0,
  },
  link: {
    color: '#2b8cbe',
    textDecoration: 'none' as const,
  },
};

export default PwnedPasswordChecker;