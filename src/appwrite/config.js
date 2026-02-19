// This file is used to configure the appwrite client and services

import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";
import axios from 'axios';

export class Service{
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

// Create a new Post
async createPost({ title, slug, content, featuredImage, status, userId, authorName }) {
    try {
        return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug,
            {
                title,
                content,
                featuredImage,
                status,
                userId,
                authorName // Add authorName here
            }
        );
    } catch (error) {
        console.log("Appwrite service :: createPost :: error", error.message);
        throw error;
    }
}



  // Update the existing post
async updatePost(slug, { title, content, featuredImage, status, authorName }) {
    try {
        return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug,
            {
                title,
                content,
                featuredImage,
                status,
                authorName // Allow updating the author name
            }
        );
    } catch (error) {
        console.log("Appwrite Service : updatePost : error", error.message);
        throw error;
    }
}


    // Delete the post with the given slug
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite Service : deletePost : error",error.message);
            return false
        }
    }


    // Get the post with the given slug
   // Get the post with the given slug
async getPost(slug) {
    try {
        return await this.databases.getDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug
        );
    } catch (error) {
        console.log("Appwrite Service : getPost : error", error.message);
        return false;
    }
}

   // Get all the posts whose status is active
async getPosts(queries = []) {
    try {
        return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            [
                Query.orderDesc('$createdAt'),
                ...queries
            ]
        );
    } catch (error) {
        console.error("Appwrite service :: getPosts :: error", error);
        return { documents: [] };
    }
}

// Add a new method for public posts
async getPublicPosts() {
    try {
        return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            [
                Query.equal('status', 'active'),
                Query.orderDesc('$createdAt')
            ]
        );
    } catch (error) {
        console.error("Appwrite service :: getPublicPosts :: error", error);
        return { documents: [] };
    }
}

    // File Upload Service 
    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error : ", error.message);
            return false
        }
    }

    // Delete the file with the given fileId
    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error.message);
            return false;
        }
    }

    // Get the file URL with the given fileId
    getFilePreview(fileId){
        if (!fileId) return '';
        try {
            // Use getFileView instead of getFilePreview - serves raw file, works with basic read permissions
            const result = this.bucket.getFileView(
                conf.appwriteBucketId,
                fileId
            );
            return result?.toString() || result?.href || String(result);
        } catch (error) {
            console.warn("getFilePreview error:", error.message);
            return '';
        }
    }

    async getAllPosts() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [] // Empty array means no filters, showing all posts
            );
        } catch (error) {
            console.error("Appwrite service :: getAllPosts :: error", error);
            return {
                documents: [] // Return empty array on error to prevent crashes
            };
        }
    }

    // Add these getter methods
    get databaseId() {
        return conf.appwriteDatabaseId;
    }

    get collectionId() {
        return conf.appwriteCollectionId;
    }

    // Add this method to your Service class
    async getUserById(userId) {
        try {
            return await this.account.get(userId);
        } catch (error) {
            console.error("Appwrite service :: getUserById :: error", error);
            return null;
        }
    }


    async generateAIContent(topic, tone = 'informative', length = 'medium') {
        try {
            const prompt = `Write a ${length} blog post about "${topic}" in a ${tone} tone.`;

            // Call our Vercel serverless proxy — no API key exposed to browser, no CORS issues
            const response = await fetch(conf.aiProxyEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: `You are a professional blog writer. Generate a structured blog post in HTML format.
                            Use <h1> for the main title, <h2> for subheadings, <p> for paragraphs, and <ul>/<li> for lists.
                            Do not wrap the output in markdown code blocks or \`\`\`html. Return only the raw HTML content.
                            Make sure the generated content matches the requested tone: ${tone}.`
                        },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: length === 'short' ? 500 : (length === 'long' ? 2000 : 1000),
                }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                if (response.status === 429) {
                    throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
                }
                throw new Error(err.error || `AI proxy returned ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error('Error generating AI content:', error);
            return '<p>Failed to generate content from AI service. Please try again later.</p>';
        }
    }

    async generateAITopics(baseTopic = 'latest technology trends') {
        try {
            // Call our Vercel serverless proxy — no API key exposed to browser, no CORS issues
            const response = await fetch(conf.aiProxyEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: "You are a creative blog topic generator. Return a JSON array of 5 catchy blog post titles based on the user's input. Return ONLY the JSON array, no extra text or markdown."
                        },
                        {
                            role: 'user',
                            content: `Suggest 5 catchy blog post titles related to: ${baseTopic}`
                        }
                    ],
                    max_tokens: 300,
                }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                if (response.status === 429) {
                    throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
                }
                throw new Error(err.error || `AI proxy returned ${response.status}`);
            }

            const data = await response.json();
            let content = data.choices[0].message.content;

            // Clean markdown code blocks if the model wraps in them
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();

            try {
                return JSON.parse(content);
            } catch (e) {
                // Fallback: split by newlines
                return content
                    .split('\n')
                    .filter(line => line.trim().length > 0)
                    .map(line => line.replace(/^\d+\.\s*/, '').replace(/"/g, ''));
            }

        } catch (error) {
            console.error('Error generating AI topics:', error);
            return [];
        }
    }
}

const service = new Service();
export default service