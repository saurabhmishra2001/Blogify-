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
            const aiEndpoint = conf.aiApiEndpoint; 
            
            // Construct dynamic prompt
            const prompt = `Write a ${length} blog post about "${topic}" in a ${tone} tone.`;

            if (!aiEndpoint || aiEndpoint === 'YOUR_AI_API_ENDPOINT') {
                console.warn("AI API Endpoint not configured. Returning mock content for demonstration.");
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                return `<h1>${topic.charAt(0).toUpperCase() + topic.slice(1)}: A Comprehensive Guide</h1>
<p>This is a simulated AI response tailored to your request about <strong>${topic}</strong>. In a real scenario, this content would be dynamic.</p>
<h2>Why ${topic} Matters</h2>
<p>Understanding the nuances of ${topic} is crucial in today's landscape. A ${tone} approach reveals key insights.</p>
<ul>
    <li>Key Insight 1: Innovation drives progress.</li>
    <li>Key Insight 2: Adaptability is essential.</li>
    <li>Key Insight 3: Community engagement fosters growth.</li>
</ul>
<p><em>(This is a mock generated response. To use real AI, please configure your AI API endpoint in the app settings.)</em></p>`;
            }

            const response = await axios.post(aiEndpoint, {
                model: conf.aiModel || 'sonar-pro',
                messages: [
                    {
                        role: "system",
                        content: `You are a professional blog writer. Generate a structured blog post in HTML format. 
                        Use <h1> for the main title, <h2> for subheadings, <p> for paragraphs, and <ul>/<li> for lists.
                        Do not wrap the output in markdown code blocks or \`\`\`html. Return only the raw HTML content.
                        Make sure the generated content matches the requested tone: ${tone}.`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: length === 'short' ? 500 : (length === 'long' ? 2000 : 1000), 
            }, {
                headers: {
                    'Authorization': `Bearer ${conf.aiApiKey}`, 
                    'Content-Type': 'application/json',
                }
            });

            // Perplexity/OpenAI chat completion response structure
            return response.data.choices[0].message.content; 

        } catch (error) {
            console.error("Error generating AI content:", error);
            // Fallback for demo purposes even on error
            return "<p>Failed to generate content from AI service. Please check your API configuration.</p>";
        }
    }

    async generateAITopics(baseTopic = "latest technology trends") {
        try {
            const aiEndpoint = conf.aiApiEndpoint;
            
            if (!aiEndpoint || aiEndpoint === 'YOUR_AI_API_ENDPOINT') {
                 // Simulate network delay
                 await new Promise(resolve => setTimeout(resolve, 1500));
                 return [
                    "The Future of Artificial Intelligence in Healthcare",
                    "Sustainable Tech: Innovations for a Greener Planet",
                    "Web Development Trends to Watch in 2024",
                    "Cybersecurity: Protecting Your Digital Footprint",
                    "The Rise of Quantum Computing"
                 ];
            }

            const response = await axios.post(aiEndpoint, {
                model: conf.aiModel || 'sonar-pro',
                messages: [
                    {
                        role: "system",
                        content: "You are a creative blog topic generator. Return a JSON array of 5 catchy blog post titles based on the user's input. Return ONLY the JSON array strings, no extra text."
                    },
                    {
                        role: "user",
                        content: `Suggest 5 catchy blog post titles related to: ${baseTopic}`
                    }
                ],
                max_tokens: 300, 
            }, {
                headers: {
                    'Authorization': `Bearer ${conf.aiApiKey}`, 
                    'Content-Type': 'application/json',
                }
            });

             // Attempt to parse JSON response. Perplexity/LLMs might wrap in markdown sometimes so we clean it.
            let content = response.data.choices[0].message.content;
            // Clean markdown code blocks if present
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();
            
            try {
                return JSON.parse(content);
            } catch (e) {
                // If parsing fails, try to split by newlines as a fallback
                return content.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^\d+\.\s*/, '').replace(/"/g, ''));
            }

        } catch (error) {
            console.error("Error generating AI topics:", error);
            return [];
        }
    }
}

const service = new Service();
export default service