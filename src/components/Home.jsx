export default function Home() {
  // ... logic stays the same

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
          <div className="text-center max-w-3xl mx-auto">
            {/* Hero content stays the same */}
          </div>
        </section>

        {featuredPost && (
          <section className="py-16 px-4">
            <h2 className="text-3xl font-bold tracking-tight mb-8 gradient-text">
              Featured Article
            </h2>
            <FeaturedPost {...featuredPost} />
          </section>
        )}

        <section className="py-16 px-4">
          <h2 className="text-3xl font-bold tracking-tight mb-8 gradient-text">
            Recent Articles
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Posts grid stays the same */}
          </div>
        </section>

        <section className="bg-gradient-to-b from-background to-primary/10 py-16 px-4">
          <div className="text-center max-w-3xl mx-auto">
            {/* CTA content stays the same */}
          </div>
        </section>
      </main>
    </div>
  );
} 