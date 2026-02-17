# Authentication System Documentation

Complete documentation of the Firebase Authentication system for Gold Guardian.

## Overview

The application uses Firebase Authentication with email/password sign-in, local persistence, and role-based access control for protected routes.

## Architecture

```
┌─────────────────────────────────────────┐
│         React Application               │
│  (App.jsx with Router & AuthProvider)   │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
    ┌───▼────┐         ┌───▼────┐
    │ Public │         │Protected
    │ Routes │         │ Routes
    │        │         │(PrivateRoute)
    └──┬─────┘         └───┬────┘
       │                   │
       │                   ▼
    ┌──┴─────────┬─────────────────┐
    │ AuthContext│(useAuth hook)    │
    │            │                  │
    │ user       │ isAuthenticated  │
    │ loading    │ signup()         │
    │ error      │ login()          │
    │            │ logout()         │
    └────────────┼──────────────────┘
                 │
        ┌────────▼──────────┐
        │ Firebase Auth SDK │
        │                   │
        │ Email/Password    │
        │ Local Persistence │
        │ Auth State        │
        └────────┬──────────┘
                 │
        ┌────────▼──────────────────┐
        │ Firebase Authentication   │
        │ Service (Backend)         │
        │                           │
        │ ✅ User Registration      │
        │ ✅ User Login             │
        │ ✅ User Logout            │
        │ ✅ State Persistence      │
        └───────────────────────────┘
```

## Components Created

### 1. AuthContext (`src/contexts/AuthContext.jsx`)

Main authentication context provider and hook.

**Exports:**
- `AuthContext` - React Context object
- `AuthProvider` - Context provider component
- `useAuth()` - Hook to access auth state and methods

**State:**
```javascript
{
  user: FirebaseUser | null,        // Current user object
  loading: boolean,                  // Auth state loading
  error: string | null,              // Error message
  isAuthenticated: boolean,          // True if user logged in
  signup: function(email, password), // Register new account
  login: function(email, password),  // Sign in existing user
  logout: function()                 // Sign out user
}
```

**Error Handling:**
- Email already in use
- Invalid email format
- Weak password
- User not found
- Wrong password
- Too many attempts
- Custom error messages

### 2. PrivateRoute (`src/contexts/PrivateRoute.jsx`)

Route wrapper component that enforces authentication.

**Behavior:**
- If `loading` → Shows loading spinner
- If not authenticated → Redirects to `/login`
- If authenticated → Renders child component

```javascript
<PrivateRoute>
  <ProtectedPage />
</PrivateRoute>
```

### 3. Login Page (`src/pages/Login.jsx`)

User login form with email/password validation.

**Features:**
- Form validation (email, password format)
- Error message display
- Loading state during sign-in
- Link to signup page
- Redirect after successful login
- Password minimum 6 characters

**Form Fields:**
- Email address (required, valid format)
- Password (required, min 6 chars)

### 4. Signup Page (`src/pages/Signup.jsx`)

User registration form with comprehensive validation.

**Features:**
- Form validation (email, password, confirmation)
- Email format validation
- Password strength checking
- Password match validation
- Error message display
- Loading state during signup
- Link to login page
- Auto-creates user profile in Firestore
- Redirect after successful signup

**Form Fields:**
- Email address (required, valid format)
- Password (required, min 6 chars)
- Confirm Password (required, must match)

### 5. Updated Navbar (`src/components/Navbar.jsx`)

Navigation bar with authentication-aware menu.

**For Unauthenticated Users:**
- Home link
- Sign In button
- Sign Up button

**For Authenticated Users:**
- Home link
- Calculator link
- Verify HUID link
- Learn link
- Complaint link
- User email display
- Logout button

### 6. Auth Styles (`src/styles/auth.css`)

Premium glassmorphism styling for auth pages.

**Features:**
- Glass card background (20px blur)
- Gold gradient text for headers
- Smooth form inputs with focus states
- Error message styling with animations
- Button hover/active states
- Responsive mobile design
- Loading spinner animation
- Slide-up entrance animation

## Updated Components

### App.jsx
- Wrapped with `AuthProvider`
- Added Login and Signup routes (public)
- Wrapped feature routes with `PrivateRoute`
- Import React Router's Navigate for redirects

## Integration Flow

### Sign-Up Flow

```
User clicks "Sign Up"
        ↓
Navigate to /signup
        ↓
User fills form (email, password, confirm)
        ↓
Client-side validation
        ↓
User clicks "Sign Up" button
        ↓
authContext.signup(email, password)
        ↓
Firebase creates user account
        ↓
Cloud Function trigger: createUserProfile()
        ↓
Creates user document in Firestore (with role: "user")
        ↓
Auth state updates
        ↓
User redirected to /dashboard (or home)
```

### Sign-In Flow

```
User clicks "Sign In"
        ↓
Navigate to /login
        ↓
User fills form (email, password)
        ↓
Client-side validation
        ↓
User clicks "Sign In" button
        ↓
authContext.login(email, password)
        ↓
Firebase authenticates user
        ↓
Auth state updates
        ↓
User redirected to /dashboard (or home)
```

### Protected Route Flow

```
User tries to access /calculator
        ↓
PrivateRoute component checks auth
        ↓
Is user authenticated?
  No → Redirect to /login
  Yes → Render Calculator component
```

### Logout Flow

```
User clicks "Logout" button
        ↓
authContext.logout()
        ↓
Firebase clears auth state
        ↓
Auth state updates
        ↓
Menu updates to show Sign In/Sign Up
        ↓
User redirected to home
```

## Authentication Persistence

Firebase Auth automatically persists login state using browser localStorage.

```javascript
// Configured in src/config/firebase.js
setPersistence(auth, browserLocalPersistence)

// User remains logged in even after:
// - Closing browser tab
// - Closing browser window
// - Restarting browser
// - Restarting computer
// - Page refresh
```

## Using useAuth Hook

### Example: Access Current User

```javascript
import { useAuth } from '../contexts/AuthContext'

export function MyComponent() {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) return <p>Please log in</p>
  
  return <p>Welcome, {user.email}</p>
}
```

### Example: Protected Action

```javascript
import { useAuth } from '../contexts/AuthContext'

export function DeleteButton() {
  const { user } = useAuth()
  
  const handleDelete = async () => {
    if (!user) {
      console.error('User not authenticated')
      return
    }
    // Perform delete action
  }
  
  return <button onClick={handleDelete}>Delete</button>
}
```

### Example: Sign Out

```javascript
import { useAuth } from '../contexts/AuthContext'

export function ProfileMenu() {
  const { logout } = useAuth()
  
  const handleLogout = async () => {
    try {
      await logout()
      // User will be redirected by navbar
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  
  return <button onClick={handleLogout}>Sign Out</button>
}
```

## Security Features

### 1. Email/Password Validation
- Valid email format required
- Minimum 6 character password
- Password confirmation on signup
- Server-side validation by Firebase

### 2. Protected Routes
- Unauthenticated users redirected to login
- Protected routes check `useAuth()` hook
- PrivateRoute wrapper prevents unauthorized access

### 3. Auth State Check
- Page loads with loading state
- Auth state verified on app startup
- Persistent login maintained

### 4. Firestore Security Rules
```javascript
// Users can only read/write their own profile
match /users/{uid} {
  allow read, write: if request.auth.uid == uid
}

// Protected routes can only be accessed by authenticated users
match /protected-data/{doc=**} {
  allow read, write: if request.auth != null
}
```

### 5. Cloud Function Triggers
```javascript
// Auto-create user profile on signup
exports.createUserProfile = functions.auth.user()
  .onCreate(async (user) => {
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      role: 'user',  // Always 'user' for security
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })
  })

// Auto-delete user profile on account deletion
exports.deleteUserProfile = functions.auth.user()
  .onDelete(async (user) => {
    await db.collection('users').doc(user.uid).delete()
    // Cascade delete complaints, logs, etc.
  })
```

## Database Schema

### Users Collection
```javascript
users/{uid} {
  email: "user@example.com",
  displayName: "John Doe",
  role: "user",              // Cannot be changed by user
  complaintCount: 3,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Error Messages

### Sign-Up Errors
- "Email already registered. Try logging in."
- "Invalid email address."
- "Password must be at least 6 characters."
- "Passwords do not match."

### Sign-In Errors
- "No account found with this email."
- "Incorrect password."
- "Invalid email address."
- "Too many attempts. Try again later."

## Testing the Authentication

### Test Sign-Up
1. Go to `/signup`
2. Enter email: `test@example.com`
3. Enter password: `Test123456`
4. Confirm password: `Test123456`
5. Click Sign Up
6. Should be redirected to home
7. Navbar should show user email and logout button

### Test Sign-In
1. Go to `/login`
2. Enter email: `test@example.com`
3. Enter password: `Test123456`
4. Click Sign In
5. Should be redirected to home
6. Navbar should show authenticated state

### Test Protected Route
1. Log out (click logout button)
2. Try accessing `/calculator`
3. Should redirect to `/login`
4. After login, should access `/calculator`

### Test Persistence
1. Log in
2. Refresh page
3. Should remain logged in
4. Close and reopen browser
5. Should still be logged in

## Troubleshooting

### Issue: "User does not have permission" on login

**Solution:** 
- Firestore rules may be incorrect
- Deploy rules: `firebase deploy --only firestore:rules`
- Check that `users` collection exists with your user document

### Issue: Page shows loading spinner forever

**Solution:**
- Check console for errors (F12)
- Ensure Firebase is initialized properly
- Check `.env` variables are set correctly
- Try clearing browser cache

### Issue: Can't sign up - "Email already in use"

**Solution:**
- User already registered
- Try signing in instead
- Or use different email

### Issue: Auth state not persisting

**Solution:**
- Check browser allows localStorage
- Private/Incognito mode doesn't persist
- Check browser storage limits

## Environment Variables Required

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## API Reference

### useAuth() Hook

```typescript
interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  signup: (email: string, password: string) => Promise<FirebaseUser>
  login: (email: string, password: string) => Promise<FirebaseUser>
  logout: () => Promise<void>
}
```

### PrivateRoute Component

```typescript
interface PrivateRouteProps {
  children: React.ReactNode
}
```

## Best Practices

1. **Always check `loading` state** before rendering protected content
2. **Wrap sensitive operations** with auth check
3. **Clear sensitive data** on logout
4. **Use PrivateRoute** for all authenticated pages
5. **Handle errors gracefully** with user-friendly messages
6. **Test auth flows** thoroughly before deployment
7. **Monitor auth logs** in Firebase Console
8. **Set strong password policies** (enforce in signup form)
9. **Implement rate limiting** (Firebase handles this)
10. **Keep auth tokens secure** (Firebase SDK handles this)

## Next Steps

- Customize login/signup styling to match your brand
- Add password reset functionality
- Add social login (Google, GitHub)
- Implement two-factor authentication
- Add email verification
- Create user profile settings page

---

**Last Updated:** 2024  
**Auth Type:** Firebase Email/Password  
**State Management:** React Context API  
**Persistence:** Browser Local Storage
