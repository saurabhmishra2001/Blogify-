import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t bg-background/95">
      <div className="py-8 md:py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <svg 
              className="h-6 w-6 text-primary" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
            </svg>
            <span className="font-semibold text-lg gradient-text">Blogify</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link 
              to="/about" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link 
              to="/privacy" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              to="/contact" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Blogify. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer