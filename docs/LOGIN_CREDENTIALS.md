# Admin Login Credentials

## Default Admin Account

**Email:** `admin@damirapharma.com`  
**Password:** `admin123`

## Login URL

- **Development:** `http://localhost:3000/admin/login`
- **Production:** `https://your-domain.com/admin/login`

## Database Verification

The admin user was successfully created in the PostgreSQL database with:
- ID: `cmnpufpdo0000o46s7l3ii32v`
- Role: `ADMIN`
- Password: Securely hashed with bcrypt

## Login System Status

✅ **All Components Working:**
1. Database connection established
2. User authentication with bcrypt password hashing
3. Auth.js (NextAuth.js) session management
4. JWT tokens stored in cookies
5. Middleware auth protection enabled
6. Automatic redirect to admin dashboard after login
7. Protected routes (/admin/*) require authentication

## Known Issues

### Turbopack Development Server Error (Windows)
- **Issue:** Turbopack fails to compile CSS files on Windows due to a bug with file path resolution
- **Error:** `reading file "C:\...\nul"` (Incorrect function. os error 1)
- **Impact:** Development server (`npm run dev`) does not work
- **Workaround:** Use production build for testing
  ```bash
  npm run build
  PORT=3005 npm run start
  ```
- **Status:** This is a known Next.js 16.2.2 + Turbopack bug on Windows
- **Fix:** Will be resolved in a future Next.js update

## Testing the Login

1. Start production server:
   ```bash
   npm run build
   npm run start
   ```

2. Navigate to `http://localhost:3000/admin/login`

3. Enter credentials:
   - Email: `admin@damirapharma.com`
   - Password: `admin123`

4. Upon successful login, you will be redirected to `/admin` dashboard

## Security Notes

⚠️ **IMPORTANT:** Change the default admin password in production!

1. Log in to the admin dashboard
2. Navigate to Settings or Users
3. Update the admin password to a strong, unique password
4. Never commit `.env` files with production credentials to version control
