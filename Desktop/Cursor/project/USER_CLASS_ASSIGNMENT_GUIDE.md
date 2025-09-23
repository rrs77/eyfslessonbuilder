# User Class Assignment System Guide

## Overview
The User Class Assignment System allows administrators to manage user access to different classes based on their purchased items. This ensures proper access control and content management.

## Features

### 1. User Management with Class Assignment
- **Location**: UserSettings → User Management
- **Access**: Administrator only
- **Purpose**: Create and manage users with class assignments

### 2. Purchased Items System
Users can purchase different content packages:
- **LKG Activities** → Access to Lower Kindergarten class
- **UKG Activities** → Access to Upper Kindergarten class  
- **Reception Activities** → Access to Reception class
- **Music Curriculum** → Access to all classes with music content
- **Drama Curriculum** → Access to all classes with drama content
- **EYFS Standards** → Access to assessment features

### 3. Class Assignment Logic
The system automatically determines which classes a user can access based on their purchased items:

```typescript
// Access Control Logic
const getAvailableClasses = (purchasedItems: string[]) => {
  return classes.filter(cls => {
    // Year group specific access
    if (purchasedItems.includes('year-group-lkg') && cls.name === 'LKG') return true;
    if (purchasedItems.includes('year-group-ukg') && cls.name === 'UKG') return true;
    if (purchasedItems.includes('year-group-reception') && cls.name === 'Reception') return true;
    
    // Curriculum-wide access
    if (purchasedItems.includes('music-curriculum') || purchasedItems.includes('drama-curriculum')) return true;
    
    return false;
  });
};
```

## How to Use

### Creating a New User
1. Open UserSettings modal
2. Go to "User Management" tab
3. Click "Add New User"
4. Fill in user details:
   - Email address
   - Full name
   - Role (Teacher, TA, SLT, Administrator)
   - Password
   - Select purchased items from checkboxes
5. Click "Create User"
6. Click "Classes" button to assign to appropriate classes

### Managing Existing Users
1. In User Management, find the user
2. Click "Classes" button next to their name
3. View their purchased items (shown as green badges)
4. See available classes based on their purchases
5. Assign or remove classes as needed

### Class Assignment Workflow
1. **View Purchased Items**: See what content the user has access to
2. **Available Classes**: System shows only classes they can access
3. **Assign Classes**: Click "Assign" to give access to a class
4. **Remove Access**: Click "Remove" to revoke class access
5. **Visual Feedback**: Green checkmarks show assigned classes

## Database Schema

### Tables Used
- `classes` - Available classes (LKG, UKG, Reception)
- `user_classes` - User-to-class assignments
- `class_categories` - Categories assigned to each class
- `subjects` - Subject information (Music, Drama, etc.)
- `subject_categories` - Categories within subjects

### Key Relationships
- Users can be assigned to multiple classes
- Classes have multiple categories
- Categories determine what content is available
- Purchased items determine which classes are accessible

## Access Control

### User Roles
- **Administrator**: Full access to all features
- **SLT**: Senior Leadership Team (limited admin access)
- **Teacher**: Access to assigned classes only
- **TA**: Teaching Assistant (access to assigned classes)

### Class Access Rules
1. Users can only access classes they've been assigned to
2. Class assignment is based on purchased items
3. Administrators can override assignments
4. Users see only their assigned classes in the interface

## Technical Implementation

### Components
- `UserManagement.tsx` - Main user management interface
- `ClassContext.tsx` - Class data management
- `AuthContext.tsx` - User authentication
- `UserSettings.tsx` - Settings modal container

### Key Functions
- `getAvailableClasses()` - Determines accessible classes
- `handleAssignToClass()` - Assigns user to class
- `handleRemoveFromClass()` - Removes user from class
- `assignUserToClass()` - API call for assignment

### State Management
- User data includes `purchasedItems` and `assignedClasses` arrays
- Class assignments are stored in `user_classes` table
- Real-time updates reflect changes immediately

## Best Practices

### For Administrators
1. **Always assign purchased items first** before class assignment
2. **Verify purchases** before granting class access
3. **Regular audits** of user assignments
4. **Document purchases** for billing purposes

### For Users
1. **Contact admin** if you need access to additional classes
2. **Check your assigned classes** in the header dropdown
3. **Report issues** if you can't access expected content

## Troubleshooting

### Common Issues
1. **User can't see classes**: Check if they're assigned to any classes
2. **Missing content**: Verify purchased items and class assignments
3. **Access denied**: Confirm user has appropriate role and assignments

### Debug Steps
1. Check user's purchased items
2. Verify class assignments
3. Confirm class has required categories
4. Check user's role permissions

## Future Enhancements
- Automatic class assignment based on purchases
- Bulk user management tools
- Purchase history tracking
- Advanced permission systems
- Integration with payment systems

---

*This system ensures proper access control while maintaining a smooth user experience for both administrators and end users.*






