# Google Places API Setup Instructions

## ✅ What's Been Done

1. ✅ Installed `react-native-google-places-autocomplete`
2. ✅ Created `.env` file for API key
3. ✅ Updated `.gitignore` to protect your API key
4. ✅ Configured babel to support environment variables
5. ✅ Updated OpportunityForm with Google Places Autocomplete
6. ✅ Added coordinates field to Opportunity type
7. ✅ Updated Map to display opportunity markers with callouts

## 🔑 Add Your API Key

**IMPORTANT:** Replace the placeholder with your actual Google Places API key:

### Option 1: In `.env` file (Recommended)

1. Open `.env` file in the root directory
2. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```
   GOOGLE_PLACES_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### Option 2: Directly in code (Quick test)

1. Open `components/OpportunityForm.tsx`
2. Find line 22: `const GOOGLE_PLACES_API_KEY = "YOUR_API_KEY_HERE";`
3. Replace with your API key:
   ```typescript
   const GOOGLE_PLACES_API_KEY = "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX";
   ```

## 🚀 How to Use

### For Admin Users:

1. **Create an Opportunity:**

   - Go to Opportunities tab
   - Tap the + button
   - Fill in opportunity details

2. **Add Location:**

   - In the "Location" field, start typing an address
   - Google will suggest addresses as you type
   - Select the correct address from the suggestions
   - The app automatically saves the coordinates!

3. **Complete & Submit:**
   - Fill in remaining fields (date, time, etc.)
   - Tap "Create Opportunity"

### For Regular Users:

1. **View on Map:**
   - Go to the Map tab
   - See markers for all opportunities with locations
   - Tap a marker to see opportunity details
   - Details include name, description, location, date, and volunteers needed

## 🎯 What Happens Behind the Scenes

1. User types address → Google Places Autocomplete suggests addresses
2. User selects address → App calls Google Geocoding API
3. Geocoding returns latitude & longitude coordinates
4. App saves both the address string AND coordinates
5. Map displays marker at those coordinates
6. Tap marker → Callout shows opportunity info

## 🔒 Security Note

Your `.env` file is already in `.gitignore` so your API key won't be committed to git!

## 🧪 Testing

After adding your API key:

1. Restart your development server: `npx expo start`
2. Create a new opportunity as an admin
3. Try typing an address - you should see autocomplete suggestions
4. Select an address and submit
5. Go to the Map tab - you should see a marker at that location
6. Tap the marker to see the callout with details

## 📝 API Key Restrictions (Recommended)

In Google Cloud Console, restrict your API key:

- **Application restrictions:** iOS/Android with your bundle ID
- **API restrictions:** Only allow:
  - Places API
  - Geocoding API

This prevents unauthorized use of your API key!
