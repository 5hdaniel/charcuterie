# Vercel Deployment Guide

## Required Environment Variables

To deploy this application on Vercel, you need to configure the following environment variables in your Vercel project settings:

### 1. Supabase Configuration

Navigate to **Project Settings > Environment Variables** in Vercel and add:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**How to get these:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings > API**
4. Copy the **Project URL** and **anon/public key**

### 2. Google Gemini AI API Key

```
VITE_API_KEY=your-gemini-api-key
```

**How to get this:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **Create API Key**
3. Copy the generated key

## Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click **Add New Project**
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In Vercel project settings, add all the environment variables listed above
   - Make sure to add them for all environments (Production, Preview, Development)

4. **Deploy**
   - Vercel will automatically deploy on every push to main
   - Or click **Deploy** manually in the Vercel dashboard

## Troubleshooting

### Build Errors
- Make sure all environment variables are set in Vercel
- Check build logs for specific TypeScript or dependency errors

### Runtime Errors
- **"supabaseUrl is required"**: Environment variables are not set correctly in Vercel
- **API errors**: Check that your API keys are valid and have proper permissions

### Local Development

For local development, create a `.env` file:

```bash
cp .env.template .env
```

Then fill in your actual credentials in the `.env` file.

## Important Notes

- Environment variable names must start with `VITE_` to be accessible in the frontend
- Never commit your `.env` file to version control (it's already in `.gitignore`)
- If you update environment variables in Vercel, you need to redeploy for changes to take effect
