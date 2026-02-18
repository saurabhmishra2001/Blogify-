const conf = {
    appwriteUrl : String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId : String(import.meta.env.VITE_APPWRITE_PROJECT_ID),

    appwriteDatabaseId : String(import.meta.env.VITE_APPWRITE_DATABASE_ID),

    appwriteCollectionId : String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),

    appwriteBucketId : String(import.meta.env.VITE_APPWRITE_BUCKET_ID),

    editorApi : String(import.meta.env.VITE_TINY_EDITOR_API),
    aiApiEndpoint: String(import.meta.env.VITE_PERPLEXITY_API_URL || 'https://api.perplexity.ai/chat/completions'),
    aiApiKey: String(import.meta.env.VITE_PERPLEXITY_API_KEY || ''),
    aiModel: String(import.meta.env.VITE_PERPLEXITY_MODEL || 'sonar-pro'),
}


export default conf;