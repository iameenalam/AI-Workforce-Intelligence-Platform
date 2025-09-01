# Employee Invitation & Role-Based Access Control System

## Overview

This system implements a comprehensive employee invitation and role-based access control (RBAC) system for organization management. It includes email-based invitations, role permissions, and conditional dashboard access.

## Features Implemented

### 1. Employee Invitation System
- **Email-based Invitations**: Automatically send invitation emails when employees are invited
- **File Upload Support**: Handle profile pictures and CVs during invitation process
- **Token-based Security**: Secure invitation tokens with expiration (7 days)
- **Invitation Tracking**: Track invitation status (pending, accepted, expired)
- **Reminder System**: Send reminder emails for pending invitations

### 2. Role-Based Access Control
- **Four Role Levels**: Admin, HOD, Team Lead, Team Member
- **Granular Permissions**: 20+ permission types for fine-grained access control
- **Access Scopes**: Department-level, subfunction-level, or organization-wide access
- **Dynamic Permission Management**: Admins can configure permissions for each role

### 3. Dashboard Access Control
- **Conditional Rendering**: Show/hide dashboard sections based on permissions
- **Role-based Navigation**: Sidebar adapts to user permissions
- **Access Denied Handling**: Graceful handling of unauthorized access attempts
- **Permission Validation**: Real-time permission checking

## File Structure

```
├── models/
│   ├── Invitation.js          # Invitation model with token management
│   ├── Permission.js          # Permission model with default role permissions
│   ├── User.js               # Updated user model with invitation tracking
│   └── Employee.js           # Updated employee model with invitation status
├── src/app/api/
│   ├── invitations/
│   │   ├── route.js          # Send invitations, manage invitation lifecycle
│   │   ├── accept/route.js   # Accept invitations and create accounts
│   │   └── remind/route.js   # Send invitation reminders
│   ├── permissions/route.js  # Manage role permissions
│   └── user/
│       ├── permissions/route.js # Get user permissions
│       └── register/route.js    # Updated registration with invitation support
├── src/app/
│   ├── accept-invitation/page.jsx # Invitation acceptance UI
│   └── dashboard/
│       ├── page.jsx              # Updated dashboard with RBAC
│       └── components/
│           ├── Permissions.jsx    # Permission management component
│           ├── RoleAssignment.jsx # Updated with permission checks
│           └── Sidebar.jsx        # Updated with role-based navigation
├── lib/
│   └── emailService.js       # Email service for invitations
├── middlewares/
│   └── rbac.js              # Role-based access control middleware
└── .env.example             # Environment variables template
```

## Role Permissions

### Admin (Organization Creator)
- Full access to all dashboard sections
- Can invite employees and assign all roles
- Can configure permissions for other roles
- Can manage organization settings

### HOD (Head of Department)
- Limited dashboard access (employees, roles, payroll, performance)
- Can assign roles to Team Leads and Team Members
- Can set payroll and performance reviews
- Access scope: Department-level (configurable)

### Team Lead & Team Member
- No dashboard access (chart view only)
- Can view organization chart
- Can view own payroll and performance data
- Cannot assign roles or manage other employees

## API Endpoints

### Invitation Management
- `POST /api/invitations` - Send employee invitations
- `GET /api/invitations` - Get organization invitations
- `DELETE /api/invitations?id=<id>` - Cancel invitation
- `POST /api/invitations/remind` - Send reminder email

### Invitation Acceptance
- `GET /api/invitations/accept?token=<token>` - Validate invitation
- `POST /api/invitations/accept` - Accept invitation and create account

### Permission Management
- `GET /api/permissions` - Get organization permissions
- `PUT /api/permissions` - Update role permissions
- `POST /api/permissions` - Initialize default permissions

### User Permissions
- `GET /api/user/permissions` - Get current user's role and permissions

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env.local` and configure:

```bash
# Required for email invitations
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database and JWT
MONGODB_URI=mongodb://localhost:27017/reeorg
JWT_SEC=your-jwt-secret

# File uploads (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. Email Configuration
For Gmail:
1. Enable 2-Factor Authentication
2. Generate App Password at https://myaccount.google.com/apppasswords
3. Use App Password as EMAIL_PASS

### 3. Install Dependencies
```bash
npm install nodemailer
# Other dependencies should already be installed
```

## Usage Flow

### 1. Employee Invitation
1. Admin fills invitation form with employee details and files
2. System creates invitation record with unique token
3. Email sent to employee with invitation link
4. Files (CV, profile pic) stored and linked to invitation

### 2. Invitation Acceptance
1. Employee clicks invitation link
2. System validates token and shows acceptance page
3. Employee creates account (if new) or links existing account
4. Employee record created with uploaded files
5. User gains access based on assigned role

### 3. Role Assignment
1. Admin or HOD accesses Role Assignment section
2. Drag-and-drop employees to assign roles
3. System validates permissions before allowing changes
4. Role changes update user permissions immediately

### 4. Permission Management
1. Admin accesses Permissions section
2. Configure permissions for each role
3. Changes apply immediately to all users with that role
4. Dashboard access updates in real-time

## Security Features

- **Token Expiration**: Invitation tokens expire after 7 days
- **Permission Validation**: All actions validated against user permissions
- **Secure File Upload**: Files uploaded to Cloudinary with validation
- **JWT Authentication**: Secure API access with JWT tokens
- **Role Isolation**: Users can only access permitted resources

## Testing

### Test Invitation Flow
1. Create organization as Admin
2. Invite employee with CV and profile picture
3. Check email for invitation
4. Accept invitation and verify account creation
5. Verify files are accessible in employee profile

### Test Role Permissions
1. Assign HOD role to employee
2. Login as HOD and verify limited dashboard access
3. Test role assignment permissions
4. Verify Team Lead/Member users redirected to chart view

## Troubleshooting

### Email Issues
- Verify EMAIL_USER and EMAIL_PASS in environment
- Check Gmail App Password configuration
- Ensure NEXT_PUBLIC_BASE_URL is correct

### Permission Issues
- Check user role assignment in database
- Verify permission records exist for organization
- Test with Admin account first

### File Upload Issues
- Verify Cloudinary configuration
- Check file size limits
- Ensure proper file types (images for profiles, PDFs for CVs)

## Future Enhancements

- **Bulk Invitations**: CSV import for multiple employees
- **Custom Email Templates**: Branded invitation emails
- **Advanced Permissions**: Time-based or IP-based restrictions
- **Audit Logging**: Track all permission changes and role assignments
- **Multi-organization Support**: Users belonging to multiple organizations
