const conf = {
    appwriteUrl : String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId : String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId : String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId : String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketId : String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    editorApi : String(import.meta.env.VITE_TINY_EDITOR_API),
    unsplashAccessKey : String(import.meta.env.VITE_UNSPLASH_ACCESS_KEY),

    // AI calls are proxied through /api/ai (Vercel serverless function).
    // The actual Perplexity API key lives ONLY in Vercel environment variables (server-side).
    aiProxyEndpoint: '/api/ai',
}

export default conf;
