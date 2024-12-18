import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function Newsletter() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-4 gradient-text">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-muted-foreground mb-6">
          Stay updated with our latest articles, news, and insights delivered straight to your inbox.
        </p>
        <form className="flex gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1"
          />
          <Button type="submit">
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
} 