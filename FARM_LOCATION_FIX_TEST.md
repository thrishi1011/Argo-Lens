# Farm Location Update Fix - Test Guide

## Issue Summary
**Error:** "duplicate key value violates unique constraint profile unique ID"
**Root Cause:** The `.upsert()` method in ProfileContext was missing the `id` (primary key) field, causing it to attempt inserting a new record instead of updating the existing one.

## Fix Applied
**File:** `frontend/contexts/ProfileContext.tsx`
**Changes:** Added `id: user.id` to the upsert payload to explicitly specify the primary key

### Before (Broken):
```tsx
const { error: dbError } = await supabase
    .from('profiles')
    .upsert({
        user_id: user.id,
        full_name: newProfile.fullName,
        farm_name: newProfile.farmName,
        farm_location: {...},
        updated_at: new Date().toISOString(),
    });
```

### After (Fixed):
```tsx
const { error: dbError } = await supabase
    .from('profiles')
    .upsert({
        id: user.id,  // ← PRIMARY KEY ADDED
        user_id: user.id,
        full_name: newProfile.fullName,
        farm_name: newProfile.farmName,
        farm_location: {...},
        updated_at: new Date().toISOString(),
    });
```

---

## Step-by-Step Testing Guide

### Prerequisites
- Ensure you have the development environment running
- Have the app built and running locally

### Test Steps

#### 1. **Start Development Server** (if not already running)
```bash
npm run dev
# or
bun run dev
```

#### 2. **Navigate to Profile Settings**
- Login to the application
- Click on your user avatar/profile icon in the header
- Click on "Profile Settings" OR "Farm Settings"
- You should see the Farm Settings dialog option

#### 3. **Change the Farm Location**
- In the Farm Settings dialog, locate the "Location" input field
- Current default value should be: "Iowa, USA"
- Change it to one of the following test locations:
  - `California, USA`
  - `Texas, USA`
  - `Delhi, India`
  - Or use coordinates format: `40.7128, -74.0060` (New York)

#### 4. **Submit the Update**
- Click the "Update Farm Settings" button
- **Expected Result:** Success toast notification appears: "Farm settings updated successfully!"
- **Previous Behavior:** Error toast would appear with "duplicate key value violates unique constraint"

#### 5. **Verify Location Changed in Database**
- Observe that the profile context updates without errors
- The location should now reflect your new value

#### 6. **Verify Location Changes on Map (Alert Map)**
- Navigate to the "Alerts" or "Map" screen
- **Expected Result:** The map should re-center to the new coordinates
  - California: ~36.78°N, -119.42°W
  - Texas: ~31.97°N, -99.90°W
  - Delhi: ~28.61°N, 77.21°E
  - New York: ~40.71°N, -74.01°W

#### 7. **Test Multiple Location Changes** (to ensure upsert works consistently)
- Change location from California to Texas
- **Expected Result:** No error, map re-centers to Texas
- Change location to coordinates format: `51.5074, -0.1278` (London)
- **Expected Result:** No error, map re-centers to London
- All changes should update successfully without duplicate key errors

#### 8. **Verify Data Persistence**
- Refresh the browser page
- Navigate back to Profile Settings
- **Expected Result:** The location field should still show your last updated location
- This confirms the data was properly saved to the database

---

## Success Criteria

✅ **All tests should pass:**
1. Farm location updates without "duplicate key" error
2. Success toast notification appears on successful update
3. Map re-centers to new location coordinates
4. Location persists after page refresh
5. Multiple consecutive location changes work without errors
6. Both named locations (e.g., "California") and coordinates (e.g., "40.7128, -74.0060") work

## Troubleshooting

### If You Still See the Duplicate Key Error:
1. Clear browser cache and localStorage:
   ```javascript
   // Run in browser console
   localStorage.clear();
   location.reload();
   ```
2. Check Supabase dashboard to verify the profiles table has correct schema
3. Ensure you're using the latest code from `frontend/contexts/ProfileContext.tsx`

### If Map Doesn't Re-center:
1. Check that the coordinates are being calculated correctly
2. Verify the map component is properly receiving the updated `profile.coordinates`
3. Check browser console for any errors in the LeafletMap component

### Expected Console Behavior (No Errors):
- Should see the successful update logged
- Map should re-render with new center coordinates
- No SQL constraint errors should appear

---

## Technical Details

**Profiles Table Schema:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  user_id UUID,
  full_name TEXT,
  farm_name TEXT,
  farm_location JSONB,
  avatar_url TEXT,
  total_area NUMERIC,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id)
);
```

**Why the Fix Works:**
- Supabase's `.upsert()` uses the primary key to determine whether to INSERT or UPDATE
- Without the `id` field, it defaults to INSERT behavior
- INSERT on a duplicate primary key violates the UNIQUE constraint
- By explicitly providing `id: user.id`, we ensure UPDATE behavior instead

---

## Notes
- The geocoding function converts location names to coordinates
- Supported named locations: iowa, california, texas, india, delhi, london, new york
- Custom coordinates should be in format: "latitude, longitude" (e.g., "41.6, -93.7")
