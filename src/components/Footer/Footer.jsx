import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black pt-20 pb-10">
      <div className="container max-w-7xl px-6 md:px-8">
        
        {/* Top Section with Massive Typography */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-10">
          <div className="max-w-2xl">
             <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-6">
               Blogify.
             </h2>
             <p className="text-xl text-slate-400 font-light max-w-md">
               The digital editorial for the modern web. Curated stories, insights, and perspectives for the curious mind.
             </p>
          </div>
          
          <div className="flex flex-col items-start gap-4">
             <h3 className="text-lg font-medium text-white">Join our newsletter</h3>
             <div className="flex w-full max-w-sm items-center space-x-2">
                 <input 
                   type="email" 
                   placeholder="Enter your email" 
                   className="flex h-12 w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white" 
                 />
                 <Button className="rounded-full h-12 px-6 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20">
                    Subscribe
                 </Button>
             </div>
          </div>
        </div>

        {/* Grid Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-16 mb-16">
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white tracking-wide">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/explore" className="hover:text-primary transition-colors">Explore</Link></li>
              <li><Link to="/all-posts" className="hover:text-primary transition-colors">Articles</Link></li>
              <li><Link to="/authors" className="hover:text-primary transition-colors">Authors</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white tracking-wide">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white tracking-wide">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
             <h4 className="font-heading font-semibold text-white tracking-wide">Socials</h4>
             <div className="flex gap-4">
                <a href="#" className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all hover:scale-110 border border-white/5">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all hover:scale-110 border border-white/5">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all hover:scale-110 border border-white/5">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
           <div className="flex gap-4">
              <p>© {new Date().getFullYear()} Blogify Inc. All rights reserved.</p>
           </div>
           <div className="flex gap-6">
               <a href="#" className="hover:text-white transition-colors">Sitemap</a>
               <a href="#" className="hover:text-white transition-colors">Accessibility</a>
           </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer