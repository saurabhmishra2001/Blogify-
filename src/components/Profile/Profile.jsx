import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import appwriteService from '../../appwrite/config';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import PostCard from '../PostCard';

function Profile() {
    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userData?.$id) {
            appwriteService.getPosts([]).then((res) => {
                if (res?.documents) {
                    const mine = res.documents.filter(p => p.userId === userData.$id);
                    setUserPosts(mine);
                }
                setLoading(false);
            });
        }
    }, [userData]);

    const joinDate = userData?.$createdAt
        ? new Date(userData.$createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        : 'Recently';

    const totalWords = userPosts.reduce((acc, post) => {
        const text = post.content?.replace(/<[^>]*>/g, '') || '';
        return acc + text.split(/\s+/).length;
    }, 0);

    return (
        <div className="min-h-screen bg-background animate-fade-in pb-20">
            {/* Hero Banner */}
            <div className="relative h-56 md:h-72 w-full overflow-hidden">
                <div className="absolute inset-0 mesh-bg opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
                {/* Decorative orbs */}
                <div className="absolute top-8 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute top-4 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <div className="container max-w-5xl mx-auto px-4 md:px-6 -mt-24 relative z-10">

                {/* Profile Card */}
                <div className="glass-card rounded-3xl p-6 md:p-10 mb-10 border border-white/10">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl overflow-hidden border-4 border-background shadow-2xl bg-primary/20">
                                <Avatar className="h-full w-full rounded-none">
                                    <AvatarImage src={userData?.profilePicture} className="object-cover" />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-4xl font-bold rounded-none flex items-center justify-center h-full w-full">
                                        {userData?.name?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 border-2 border-background" title="Active" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h1 className="text-2xl md:text-3xl font-heading font-bold text-white truncate">
                                    {userData?.name || 'Anonymous'}
                                </h1>
                                <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs">Author</Badge>
                            </div>
                            <p className="text-slate-400 text-sm mb-3">{userData?.email}</p>
                            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    Joined {joinDate}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0">
                            <Link to="/add-post">
                                <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-white gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                                    New Post
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
                        {[
                            { label: 'Articles', value: userPosts.length },
                            { label: 'Words Written', value: totalWords > 1000 ? `${(totalWords / 1000).toFixed(1)}k` : totalWords },
                            { label: 'Avg Read Time', value: userPosts.length ? `${Math.ceil(totalWords / userPosts.length / 200)} min` : '—' },
                        ].map(stat => (
                            <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="text-2xl md:text-3xl font-bold text-white font-heading">{stat.value}</div>
                                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Posts Section */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-heading font-bold text-white">
                            {loading ? 'Loading articles...' : `${userPosts.length} Article${userPosts.length !== 1 ? 's' : ''}`}
                        </h2>
                        {userPosts.length > 0 && (
                            <Link to="/all-posts">
                                <Button variant="ghost" size="sm" className="rounded-full text-slate-400 hover:text-white gap-1">
                                    View all
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                </Button>
                            </Link>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {[1,2,3].map(i => (
                                <div key={i} className="h-80 rounded-2xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : userPosts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 glass-card rounded-3xl border border-dashed border-white/10">
                            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl">✍️</div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">No articles yet</h3>
                                <p className="text-slate-400 text-sm max-w-xs">Share your thoughts with the world. Write your first article!</p>
                            </div>
                            <Link to="/add-post">
                                <Button className="rounded-full bg-primary hover:bg-primary/90 text-white gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                                    Write your first article
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {userPosts.map((post, index) => (
                                <div
                                    key={post.$id}
                                    className="animate-fade-in-up rounded-3xl overflow-hidden glass-card"
                                    style={{ animationDelay: `${index * 60}ms` }}
                                >
                                    <PostCard authStatus={authStatus} authorName={post.authorName || userData?.name} {...post} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;