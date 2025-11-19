import { useState } from "react";
import { CreativeForm } from "@/components/CreativeForm";
import { CreativeGallery } from "@/components/CreativeGallery";
import { Sparkles } from "lucide-react";
import type { Creative } from "@/types/creative";

const Index = () => {
  const [creatives, setCreatives] = useState<Creative[]>([]);

  const handleGenerateCreatives = (newCreatives: Creative[]) => {
    setCreatives(newCreatives);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-premium">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Soberano Turismo</h1>
              <p className="text-sm text-muted-foreground">Gerador de Criativos Premium</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Introduction */}
        <section className="text-center space-y-4 py-8">
          <h2 className="text-4xl font-bold text-foreground">
            Crie Criativos de Alto Impacto
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Geração inteligente de materiais publicitários premium para transporte executivo e fretamento
          </p>
        </section>

        {/* Form */}
        <section className="max-w-4xl mx-auto">
          <CreativeForm onGenerate={handleGenerateCreatives} />
        </section>

        {/* Gallery */}
        {creatives.length > 0 && (
          <section className="space-y-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-foreground mb-2">
                Seus Criativos Gerados
              </h3>
              <p className="text-muted-foreground">
                {creatives.length} criativo{creatives.length > 1 ? "s" : ""} pronto{creatives.length > 1 ? "s" : ""} para uso
              </p>
            </div>
            <CreativeGallery creatives={creatives} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Soberano Turismo - Transporte Executivo Premium</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
