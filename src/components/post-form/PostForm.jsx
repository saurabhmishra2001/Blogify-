import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import appwriteService from '../../appwrite/config';
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { RTE } from "../index";

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

    const submit = async (data) => {
        try {
            // Get clean content without HTML tags
            const stripHtml = (html) => {
                const tmp = document.createElement('div');
                tmp.innerHTML = html;
                return tmp.textContent || tmp.innerText || '';
            };

            const content = getValues("content");
            const cleanContent = stripHtml(content);

            // Validate content
            if (!content || typeof content !== 'string') {
                setContentError("Content is required");
                return;
            }

            if (cleanContent.length > 259) {
                setContentError("Content must not exceed 259 characters (current: " + cleanContent.length + ")");
                return;
            }

            setContentError(''); // Clear error if validation passes

            if (post) {
                // Update existing post
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
                if (file) {
                    await appwriteService.deleteFile(post.featuredImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : undefined
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                // Create new post
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
                if (file) {
                    const fileId = file.$id;
                    data.featuredImage = fileId;

                    const dbPost = await appwriteService.createPost({
                        ...data,
                        userId: userData.$id,
                    });

                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    }
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setContentError(error.message);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, '-');
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

    return (
        <div className="container py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold gradient-text">
                        {post ? "Edit Post" : "Create a New Post"}
                    </CardTitle>
                    <CardDescription>
                        Share your thoughts with the world (max 259 characters)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(submit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter post title"
                                {...register("title", { required: true })}
                                className={errors.title ? "border-destructive" : ""}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">Title is required</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                placeholder="post-slug"
                                {...register("slug", { required: true })}
                                className={errors.slug ? "border-destructive" : ""}
                                onInput={(e) => {
                                    setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                                }}
                            />
                            {errors.slug && (
                                <p className="text-sm text-destructive">Slug is required</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Content</Label>
                            <RTE 
                                name="content" 
                                control={control} 
                                defaultValue={getValues("content")}
                            />
                            {contentError && (
                                <p className="text-sm text-destructive">{contentError}</p>
                            )}
                            <p className="text-sm text-muted-foreground">
                                {getValues("content") ? 
                                    `Characters: ${stripHtml(getValues("content")).length}/259` 
                                    : "0/259 characters"}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Featured Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                {...register("image", { required: !post })}
                                className={errors.image ? "border-destructive" : ""}
                            />
                            {errors.image && (
                                <p className="text-sm text-destructive">Featured image is required</p>
                            )}
                        </div>

                        {post && (
                            <div className="w-full">
                                <img
                                    src={appwriteService.getFilePreview(post.featuredImage)}
                                    alt={post.title}
                                    className="rounded-lg max-h-[200px] object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                {...register("status", { required: true })}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            {errors.status && (
                                <p className="text-sm text-destructive">Status is required</p>
                            )}
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Publishing..." : (post ? "Update Post" : "Publish Post")}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper function to strip HTML tags
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}