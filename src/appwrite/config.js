// This file is used to configure the appwrite client and services

import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

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
    async createPost({title,slug,content,featuredImage,status, userId}){
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
                    userId
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error",error.message);
            throw error;
        }
    }


    // Update the existing post
    async updatePost(slug,{title,content,featuredImage,status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log("Appwrite Service : updatePost : error",error.message);
            throw error
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
    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite Service : getPost : error",error.message);
            return false
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

    // Get the file preview with the given fileId
    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
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
}

const service = new Service();
export default service