import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import appwriteService from '../../appwrite/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";

// Load Puter.js SDK dynamically (free AI image generation, no API key needed)
function loadPuterScript() {
    return new Promise((resolve) => {
        if (window.puter) { resolve(window.puter); return; }
        const script = document.createElement('script');
        script.src = 'https://js.puter.com/v2/';
        script.onload = () => resolve(window.puter);
        script.onerror = () => resolve(null);
        document.head.appendChild(script);
    });
}

// Convert a data URL to a Blob
function dataURLtoBlob(dataURL) {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
    return new Blob([arr], { type: mime });
}

// Generate a topic-relevant featured image using Puter.js (Nano Banana / Gemini)
async function generateAndUploadImage(topic) {
    const seed = Math.floor(Math.random() * 999999);

    // Strategy 1: Puter.js — free AI image generation, no API key, no CORS issues
    try {
        const puter = await loadPuterScript();
        if (puter) {
            const prompt = `A professional, cinematic blog featured image about: "${topic}". 
                Photorealistic, high quality, 16:9 landscape format, vibrant colors, no text or watermarks.`;

            // Uses Gemini (Nano Banana) model — returns HTMLImageElement with data: URL
            const imgEl = await puter.ai.txt2img(prompt, {
                provider: 'gemini',
                model: 'gemini-2.5-flash-image-preview',
                ratio: { w: 1280, h: 720 }
            });

            if (imgEl?.src?.startsWith('data:')) {
                const blob = dataURLtoBlob(imgEl.src);
                const file = new File([blob], `ai-featured-${seed}.jpg`, { type: blob.type });
                const uploaded = await appwriteService.uploadFile(file);
                if (uploaded) {
                    return { fileId: uploaded.$id, previewUrl: appwriteService.getFilePreview(uploaded.$id) };
                }
            }
        }
    } catch (e) {
        console.warn('Puter.js image generation failed, trying fallback:', e.message);
    }

    // Strategy 2: Picsum Photos — random beautiful photo, always works, no CORS
    try {
        const imgRes = await fetch(`https://picsum.photos/seed/${seed}/1280/720`);
        if (imgRes.ok) {
            const blob = await imgRes.blob();
            if (blob.size > 1000) {
                const file = new File([blob], `featured-${seed}.jpg`, { type: 'image/jpeg' });
                const uploaded = await appwriteService.uploadFile(file);
                if (uploaded) {
                    return { fileId: uploaded.$id, previewUrl: appwriteService.getFilePreview(uploaded.$id) };
                }
            }
        }
    } catch (e) {
        console.warn('Picsum fallback failed:', e.message);
    }

    console.warn('All image strategies failed — post will publish without a featured image.');
    return null;
}

export default function AIGenerator({ onGenerate, onClose }) {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('informative');
    const [length, setLength] = useState('medium');
    const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    const [generatingStep, setGeneratingStep] = useState(''); // 'content' | 'image' | ''
    const [suggestedTopics, setSuggestedTopics] = useState([]);

    const tones = [
        { value: 'informative', label: 'Informative' },
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual' },
        { value: 'enthusiastic', label: 'Enthusiastic' },
        { value: 'witty', label: 'Witty' },
        { value: 'persuasive', label: 'Persuasive' }
    ];

    const handleGenerateTopics = async () => {
        if (!topic) return;
        setIsGeneratingTopics(true);
        try {
            const suggestions = await appwriteService.generateAITopics(topic);
            setSuggestedTopics(suggestions || []);
        } catch (error) {
            console.error("Failed to generate topics", error);
        } finally {
            setIsGeneratingTopics(false);
        }
    };

    const handleGenerateContent = async () => {
        if (!topic) return;
        setIsGeneratingContent(true);
        try {
            // Step 1: Generate blog content
            setGeneratingStep('content');
            const content = await appwriteService.generateAIContent(topic, tone, length);

            // Extract title from <h1> or fallback to topic
            let finalTitle = topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            const h1Match = content.match(/<h1>(.*?)<\/h1>/);
            if (h1Match && h1Match[1]) {
                finalTitle = h1Match[1];
            }

            // Step 2: Generate & upload featured image
            setGeneratingStep('image');
            const imageResult = await generateAndUploadImage(finalTitle || topic);

            onGenerate({
                title: finalTitle,
                content: content,
                featuredImageId: imageResult?.fileId || null,
                featuredImagePreview: imageResult?.previewUrl || null,
            });
            onClose();
        } catch (error) {
            console.error("Failed to generate content", error);
        } finally {
            setIsGeneratingContent(false);
            setGeneratingStep('');
        }
    };

    const stepLabel = generatingStep === 'content'
        ? 'Writing your article...'
        : generatingStep === 'image'
        ? 'Generating featured image...'
        : 'Generating your masterpiece...';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-2xl mx-4 shadow-2xl animate-scale-in border-primary/20">
                <CardHeader className="relative border-b bg-muted/30">
                    <CardTitle className="text-2xl gradient-text">AI Blog Assistant</CardTitle>
                    <CardDescription>Generate engaging content + a featured image in seconds.</CardDescription>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                        onClick={onClose}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {/* Topic Section */}
                    <div className="space-y-4">
                        <Label>What do you want to write about?</Label>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="E.g., Future of Remote Work, Healthy Eating Habits..." 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="text-lg"
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerateTopics()}
                            />
                            <Button 
                                variant="outline" 
                                onClick={handleGenerateTopics}
                                disabled={!topic || isGeneratingTopics}
                                className="min-w-[140px]"
                            >
                                {isGeneratingTopics ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Thinking...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 1V2.5M7.5 12.5V14M11.7426 3.25736L10.682 4.31802M4.31802 10.682L3.25736 11.7426M14 7.5H12.5M2.5 7.5H1M11.7426 11.7426L10.682 10.682M4.31802 4.31802L3.25736 3.25736M7.5 10C8.88071 10 10 8.88071 10 7.5C10 6.11929 8.88071 5 7.5 5C6.11929 5 5 6.11929 5 7.5C5 8.88071 6.11929 10 7.5 10Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        Suggest Ideas
                                    </span>
                                )}
                            </Button>
                        </div>

                        {/* Suggestions */}
                        {suggestedTopics.length > 0 && (
                            <div className="animate-fade-in-up">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">AI Suggestions</Label>
                                <div className="grid gap-2">
                                    {suggestedTopics.map((s, i) => (
                                        <div 
                                            key={i} 
                                            className="p-3 rounded-md bg-secondary/50 hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors border border-transparent hover:border-primary/20 text-sm font-medium"
                                            onClick={() => setTopic(s)}
                                        >
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Tone</Label>
                            <select 
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                            >
                                {tones.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Length</Label>
                            <select 
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                            >
                                <option value="short">Short (~300 words)</option>
                                <option value="medium">Medium (~600 words)</option>
                                <option value="long">Long (~1000 words)</option>
                            </select>
                        </div>
                    </div>

                    {/* What gets generated info */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-muted-foreground">
                        <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <span>Will generate: <strong className="text-foreground">article content</strong> + <strong className="text-foreground">featured image</strong> automatically</span>
                    </div>

                    <Button 
                        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-primary/50"
                        onClick={handleGenerateContent}
                        disabled={!topic || isGeneratingContent}
                    >
                        {isGeneratingContent ? (
                             <div className="flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                </span>
                                {stepLabel}
                             </div>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Generate Article + Image
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
