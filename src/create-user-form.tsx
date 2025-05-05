import { useState, type CSSProperties, type Dispatch, type SetStateAction, type FormEvent } from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

function CreateUserForm({ setUserWasCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation criteria
  const validationCriteria = [
    { test: (pwd: string) => pwd.length >= 10, message: 'Password must be at least 10 characters long' },
    { test: (pwd: string) => pwd.length <= 24, message: 'Password must be at most 24 characters long' },
    { test: (pwd: string) => !pwd.includes(' '), message: 'Password cannot contain spaces' },
    { test: (pwd: string) => /[0-9]/.test(pwd), message: 'Password must contain at least one number' },
    { test: (pwd: string) => /[A-Z]/.test(pwd), message: 'Password must contain at least one uppercase letter' },
    { test: (pwd: string) => /[a-z]/.test(pwd), message: 'Password must contain at least one lowercase letter' },
  ];

  // Check which validation criteria are failing
  const failingCriteria = validationCriteria
    .filter((criteria) => !criteria.test(password))
    .map((criteria) => criteria.message);

  // Is the password valid (all criteria pass)
  const isPasswordValid = failingCriteria.length === 0;
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset error message on new submission
    setServerError(null);
    
    // Don't submit if username is empty or password is invalid
    if (!username || !isPasswordValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Token from the HENNGE challenge details page URL
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsic3dheWFtcGFrdWxhdnNzcGF2YW5ha2FzaW5hZGhhQGdtYWlsLmNvbSJdLCJpc3MiOiJoZW5uZ2UtYWRtaXNzaW9uLWNoYWxsZW5nZSIsInN1YiI6ImNoYWxsZW5nZSJ9.y9QMGDE3zgRgCQIPl9_7I_nwy_FnY53GTy88MKUNSaU"; 
      
      const response = await fetch('https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      
      if (response.status === 200) {
        // Success - user created
        setUserWasCreated(true);
      } else if (response.status === 401 || response.status === 403) {
        // Unauthorized
        setServerError('Not authenticated to access this resource.');
      } else if (response.status === 400) {
        // Handle specific error for common passwords
        const data = await response.json();
        if (data.error === 'common_password') {
          setServerError('Sorry, the entered password is not allowed, please try a different one.');
        } else {
          setServerError('Something went wrong, please try again.');
        }
      } else {
        // Generic error
        setServerError('Something went wrong, please try again.');
      }
    } catch (error) {
      setServerError('Something went wrong, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={formWrapper}>
      <form style={form} onSubmit={handleSubmit}>
        {serverError && (
          <div style={errorMessageContainer}>
            <p style={serverErrorStyle}>{serverError}</p>
          </div>
        )}
        
        <label htmlFor="username" style={formLabel}>Username</label>
        <input 
          id="username"
          name="username"
          style={formInput} 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={!username}
        />

        <label htmlFor="password" style={formLabel}>Password</label>
        <input 
          id="password"
          name="password"
          type="password"
          style={formInput} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!isPasswordValid && password.length > 0}
        />
        
        {password.length > 0 && failingCriteria.length > 0 && (
          <ul style={validationList}>
            {failingCriteria.map((criteria, index) => (
              <li key={index} style={validationItem}>{criteria}</li>
            ))}
          </ul>
        )}

        <button 
          style={formButton} 
          type="submit" 
          disabled={isSubmitting || !username || !isPasswordValid}
        >
          {isSubmitting ? 'Creating User...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}

export { CreateUserForm };

const formWrapper: CSSProperties = {
  maxWidth: '500px',
  width: '80%',
  backgroundColor: '#efeef5',
  padding: '24px',
  borderRadius: '8px',
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  backgroundColor: '#f8f7fa',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
};

const formButton: CSSProperties = {
  outline: 'none',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#7135d2',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  height: '40px',
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '8px',
  alignSelf: 'flex-end',
  cursor: 'pointer',
};

// New styles for validation and error messages
const validationList: CSSProperties = {
  listStylePosition: 'inside',
  padding: '8px 16px',
  backgroundColor: '#fff1f0',
  borderRadius: '4px',
  marginTop: '4px',
  marginBottom: '4px',
};

const validationItem: CSSProperties = {
  color: '#cc0000',
  fontSize: '14px',
};

const errorMessageContainer: CSSProperties = {
  backgroundColor: '#fff1f0',
  padding: '8px 16px',
  borderRadius: '4px',
  marginBottom: '8px',
};

const serverErrorStyle: CSSProperties = {
  color: '#cc0000',
  fontSize: '14px',
  fontWeight: 500,
};
