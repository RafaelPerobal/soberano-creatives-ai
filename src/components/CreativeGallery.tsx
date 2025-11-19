import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Creative } from "@/types/creative";

interface CreativeGalleryProps {
  creatives: Creative[];
}

export const CreativeGallery = ({ creatives }: CreativeGalleryProps) => {
  const { toast } = useToast();

  const handleDownload = (creative: Creative) => {
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = creative.imageUrl;
      link.download = `soberano-${creative.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download concluído!",
        description: `${creative.headline} foi baixado com sucesso.`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar a imagem.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (creative: Creative) => {
    try {
      if (navigator.share) {
        // Try to use native share API
        const response = await fetch(creative.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `soberano-${creative.id}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: creative.headline,
          text: creative.description,
          files: [file],
        });
        
        toast({
          title: "Compartilhado!",
          description: "Criativo compartilhado com sucesso.",
        });
      } else {
        // Fallback: copy link
        await navigator.clipboard.writeText(creative.imageUrl);
        toast({
          title: "Link copiado!",
          description: "Link da imagem copiado para a área de transferência.",
        });
      }
    } catch (error) {
      console.error("Share error:", error);
      toast({
        title: "Compartilhamento cancelado",
        description: "O compartilhamento foi cancelado ou não está disponível.",
      });
    }
  };

  const handleCopyText = (creative: Creative) => {
    const text = `${creative.headline}\n\n${creative.description}\n\n${creative.cta}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Texto copiado!",
      description: "O texto do criativo foi copiado para a área de transferência.",
    });
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creatives.map((creative) => (
        <Card key={creative.id} className="overflow-hidden group hover:shadow-premium transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img 
              src={creative.imageUrl} 
              alt={creative.headline}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => handleDownload(creative)}
                  className="backdrop-blur-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Baixar
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => handleShare(creative)}
                  className="backdrop-blur-sm"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <h3 className="font-bold text-lg text-foreground line-clamp-2">
              {creative.headline}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {creative.description}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs font-semibold text-primary">
                {creative.cta}
              </span>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleCopyText(creative)}
                className="text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copiar Texto
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
