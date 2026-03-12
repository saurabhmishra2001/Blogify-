import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import appwriteService from '../../appwrite/config';
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { RTE } from "../index";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import AIGenerator from "./AIGenerator";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active',
        }
    });

    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const [contentError, setContentError] = useState('');
    const [showAIGenerator, setShowAIGenerator] = useState(false);
    const [aiGeneratedImageId, setAiGeneratedImageId] = useState(null);
    const [aiGeneratedImagePreview, setAiGeneratedImagePreview] = useState(null);

    const submit = async (data) => {
        try {
            const stripHtml = (html) => {
                const tmp = document.createElement('div');
                tmp.innerHTML = html;
                return tmp.textContent || tmp.innerText || '';
            };

            const content = getValues("content");
            const cleanContent = stripHtml(content);

            if (!content || typeof content !== 'string' || cleanContent.trim().length === 0) {
                setContentError("Content is required");
                return;
            }

            setContentError('');
            const authorName = userData?.name || 'Anonymous'; 

            if (post) {
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
                if (file) {
                    await appwriteService.deleteFile(post.featuredImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    authorName, 
                    featuredImage: file ? file.$id : undefined
                });

                if (dbPost) {
                    toast.success("Post updated successfully!");
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                // Use manually uploaded file, or fall back to AI-generated image
                let fileId = null;
                if (data.image[0]) {
                    const file = await appwriteService.uploadFile(data.image[0]);
                    if (file) fileId = file.$id;
                } else if (aiGeneratedImageId) {
                    fileId = aiGeneratedImageId;
                }

                if (fileId) {
                    data.featuredImage = fileId;
                    const dbPost = await appwriteService.createPost({
                        ...data,
                        userId: userData.$id,
                        authorName,
                    });
                    if (dbPost) {
                        toast.success("Post published successfully!");
                        navigate(`/post/${dbPost.$id}`);
                    }
                } else {
                    toast.error("Please upload a featured image.");
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setContentError(error.message);
            toast.error(error.message || "Something went wrong.");
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, '-')
                .replace(/\s/g, '-')
                .replace(/^-+|-+$/g, '')
                .substring(0, 36);
        }
        return '';
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title') {
                setValue('slug', slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const handleAIResult = ({ title, content, featuredImageId, featuredImagePreview }) => {
        setValue("title", title);
        setValue("slug", slugTransform(title), { shouldValidate: true });
        setValue("content", content);
        setContentError('');
        if (featuredImageId) {
            setAiGeneratedImageId(featuredImageId);
            setAiGeneratedImagePreview(featuredImagePreview);
            toast.success("Article + featured image generated! ✨");
        } else {
            toast.success("Content generated successfully!");
        }
    };

    return (
        <div className="container max-w-5xl py-12 animate-fade-in relative">
            {showAIGenerator && (
                <AIGenerator 
                    onGenerate={handleAIResult} 
                    onClose={() => setShowAIGenerator(false)} 
                />
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                     <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        {post ? "Edit Article" : "Create New Article"}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Share your knowledge and ideas with the community.
                    </p>
                </div>
                {!post && (
                    <Button 
                        type="button" 
                        variant="secondary"
                        onClick={() => setShowAIGenerator(true)} 
                        className="gap-2 shadow-sm border border-input/50 bg-background hover:bg-muted/50 transition-colors"
                    >
                        <span className="text-xl">✨</span>
                        Generate with AI
                    </Button>
                )}
            </div>

            <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 md:p-10">
                    <form onSubmit={handleSubmit(submit)} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                            {/* Left Column: Metadata */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-base font-medium">Article Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter a captivating title"
                                        {...register("title", { required: true })}
                                        className={`h-12 text-lg bg-background/50 ${errors.title ? "border-destructive" : ""}`}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive font-medium">Title is required</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug" className="text-base font-medium">URL Slug</Label>
                                    <Input
                                        id="slug"
                                        placeholder="article-url-slug"
                                        {...register("slug", { required: true })}
                                        className={`bg-background/50 font-mono text-sm ${errors.slug ? "border-destructive" : ""}`}
                                        onInput={(e) => {
                                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                                        }}
                                    />
                                    {errors.slug && (
                                        <p className="text-sm text-destructive font-medium">Slug is required</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-base font-medium">Visibility Status</Label>
                                    <div className="relative">
                                        <select
                                            id="status"
                                            {...register("status", { required: true })}
                                            className="w-full h-12 rounded-md border border-input bg-background/50 px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                        >
                                            <option value="active">Public</option>
                                            <option value="inactive">Draft / Private</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Image */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="image" className="text-base font-medium">Featured Image</Label>
                                    <div className="flex flex-col gap-4">
                                        {/* AI Generated Image Preview */}
                                        {aiGeneratedImagePreview && !post && (
                                            <div className="w-full aspect-video rounded-lg overflow-hidden border border-primary/30 bg-muted/30 relative group">
                                                <img
                                                    src={aiGeneratedImagePreview}
                                                    alt="AI Generated"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute top-2 left-2">
                                                    <span className="text-xs font-semibold bg-primary text-white px-2 py-1 rounded-full flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                                        AI Generated
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => { setAiGeneratedImageId(null); setAiGeneratedImagePreview(null); }}
                                                    className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                                                    title="Remove AI image"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                                                </button>
                                            </div>
                                        )}

                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/png, image/jpg, image/jpeg, image/gif"
                                            {...register("image", { required: !post && !aiGeneratedImageId })}
                                            className={`h-12 pt-2 bg-background/50 cursor-pointer ${errors.image ? "border-destructive" : ""}`}
                                        />
                                        {aiGeneratedImagePreview && !post && (
                                            <p className="text-xs text-muted-foreground">Upload a new image to override the AI-generated one.</p>
                                        )}
                                        {errors.image && (
                                            <p className="text-sm text-destructive font-medium">Featured image is required</p>
                                        )}
                                        
                                        {post && (
                                                <div className="w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted/30 relative group">
                                                    <img
                                                        src={appwriteService.getFilePreview(post.featuredImage)}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                                                    Current Image
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-medium">Article Content</Label>
                            <div className="min-h-[500px] border rounded-lg border-input overflow-hidden shadow-sm bg-background">
                                <RTE 
                                    name="content" 
                                    control={control} 
                                    defaultValue={getValues("content")}
                                />
                            </div>
                            {contentError && (
                                <p className="text-sm text-destructive font-medium">{contentError}</p>
                            )}
                        </div>

                        <div className="flex justify-end pt-6 border-t border-border">
                            <Button 
                                type="submit" 
                                size="lg"
                                className="w-full md:w-auto px-10 text-lg font-semibold shadow-lg hover:shadow-primary/20 transition-all rounded-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        {post ? "Updating..." : "Publishing..."}
                                    </span>
                                ) : (post ? "Update Article" : "Publish Article")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

PostForm.propTypes = {
    post: PropTypes.shape({
        title: PropTypes.string,
        $id: PropTypes.string,
        content: PropTypes.string,
        status: PropTypes.string,
        featuredImage: PropTypes.string,
    }),
};
