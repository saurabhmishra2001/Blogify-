import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from '../index';
import appwriteService from '../../appwrite/config';
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active',
        }
    });

    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const [loading, setLoading] = useState(false); // Loading state

    const submit = async (data) => {
        setLoading(true); // Set loading to true
        try {
            // Validate content length
            const content = getValues("content");
            if (typeof content !== 'string' || content.length > 259) {
                throw new Error("Content must be a valid string and no longer than 259 characters.");
            }

            let file;
            if (post) {
                file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
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
                file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
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
            alert(error.message); // Optional: Show an alert with the error message
        } finally {
            setLoading(false); // Reset loading state
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
        <form onSubmit={handleSubmit(submit)} className="flex flex-col md:flex-row md:space-x-4 p-4 bg-white shadow-md rounded-lg">
            <div className="flex-1 mb-4">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className={`mb-4 ${errors.title ? 'border-red-500' : ''}`}
                    {...register("title", { required: true })}
                />
                {errors.title && <span className="text-red-500 text-sm">Title is required</span>}
                
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className={`mb-4 ${errors.slug ? 'border-red-500' : ''}`}
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                {errors.slug && <span className="text-red-500 text-sm">Slug is required</span>}
                
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                {errors.content && <span className="text-red-500 text-sm">Content is required</span>}
            </div>
            <div className="flex-1 mb-4">
                <Input
                    label="Featured Image :"
                    type="file"
                    className={`mb-4 ${errors.image ? 'border-red-500' : ''}`}
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {errors.image && <span className="text-red-500 text-sm">Image is required</span>}
                
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className={`mb-4 ${errors.status ? 'border-red-500' : ''}`}
                    {...register("status", { required: true })}
                />
                {errors.status && <span className="text-red-500 text-sm">Status is required</span>}
                
                <Button 
                    type="submit" 
                    bgColor={post ? "bg-green-500" : "bg-blue-500"} 
                    className="w-full hover:bg-blue-600 transition duration-200"
                    disabled={loading} // Disable button while loading
                >
                    {loading ? "Submitting..." : (post ? "Update" : "Submit")}
                </Button>
            </div>
        </form>
    );
}