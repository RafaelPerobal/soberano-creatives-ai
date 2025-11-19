import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Creative } from "@/types/creative";

interface CreativeFormProps {
  onGenerate: (creatives: Creative[]) => void;
}

export const CreativeForm = ({ onGenerate }: CreativeFormProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    service: "",
    scenario: "",
    message: "",
    mediaType: "",
    tone: "",
    keywords: "",
    additionalInstructions: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.service || !formData.scenario || !formData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation (replace with actual AI integration later)
    setTimeout(() => {
      const mockCreatives: Creative[] = Array.from({ length: 3 }, (_, i) => ({
        id: `creative-${Date.now()}-${i}`,
        imageUrl: `https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&h=800&fit=crop&crop=center&q=80`,
        headline: `${formData.message} - Criativo ${i + 1}`,
        description: `Criativo premium para ${formData.service} em ${formData.scenario}. ${formData.additionalInstructions || "Soberano Turismo - Segurança certificada ANTT, ARTESP, CADASTUR."}`,
        cta: formData.mediaType === "instagram" ? "Saiba Mais" : "Entre em Contato",
      }));

      onGenerate(mockCreatives);
      setIsGenerating(false);
      
      toast({
        title: "Criativos gerados com sucesso!",
        description: `${mockCreatives.length} criativos prontos para uso.`,
      });
    }, 2000);
  };

  return (
    <Card className="p-6 shadow-elegant">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Serviço/Veículo */}
          <div className="space-y-2">
            <Label htmlFor="service">Serviço/Veículo em Destaque *</Label>
            <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
              <SelectTrigger id="service">
                <SelectValue placeholder="Selecione o veículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="van-executiva">Van Executiva (Renault Master / MB Sprinter)</SelectItem>
                <SelectItem value="sedan-premium">Carro Sedan Premium (Toyota Corolla)</SelectItem>
                <SelectItem value="suv-premium">SUV Premium 7 Lugares</SelectItem>
                <SelectItem value="frota-completa">Frota Completa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cenário */}
          <div className="space-y-2">
            <Label htmlFor="scenario">Cenário Desejado *</Label>
            <Select value={formData.scenario} onValueChange={(value) => setFormData({ ...formData, scenario: value })}>
              <SelectTrigger id="scenario">
                <SelectValue placeholder="Selecione o cenário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aeroporto">Aeroporto (GRU/CGH/VCP)</SelectItem>
                <SelectItem value="evento-corporativo">Evento Corporativo</SelectItem>
                <SelectItem value="centro-convencoes">Centro de Convenções</SelectItem>
                <SelectItem value="hotel-luxo">Hotel de Luxo</SelectItem>
                <SelectItem value="parque-turistico">Parque Turístico</SelectItem>
                <SelectItem value="residencial-alto-padrao">Residencial Alto Padrão</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mensagem Principal */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem Principal *</Label>
            <Select value={formData.message} onValueChange={(value) => setFormData({ ...formData, message: value })}>
              <SelectTrigger id="message">
                <SelectValue placeholder="Selecione a mensagem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seguranca-certificada">Segurança Garantida e Certificada (ANTT/ARTESP/CADASTUR)</SelectItem>
                <SelectItem value="profissionalismo">Profissionalismo Auditado</SelectItem>
                <SelectItem value="conforto-exclusivo">Conforto Exclusivo e Sob Medida</SelectItem>
                <SelectItem value="viagem-sem-preocupacao">Viagem Sem Preocupação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Mídia */}
          <div className="space-y-2">
            <Label htmlFor="mediaType">Tipo de Mídia e Formato *</Label>
            <Select value={formData.mediaType} onValueChange={(value) => setFormData({ ...formData, mediaType: value })}>
              <SelectTrigger id="mediaType">
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Post Instagram (Quadrado 1:1)</SelectItem>
                <SelectItem value="instagram-feed">Post Instagram Feed (Vertical 4:5)</SelectItem>
                <SelectItem value="instagram-stories">Instagram Stories/Reels (9:16)</SelectItem>
                <SelectItem value="facebook">Facebook Banner/Post (1.91:1)</SelectItem>
                <SelectItem value="linkedin">LinkedIn Post (1:1)</SelectItem>
                <SelectItem value="whatsapp">Imagem WhatsApp (Quadrado)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tom da Comunicação */}
          <div className="space-y-2">
            <Label htmlFor="tone">Tom da Comunicação</Label>
            <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Selecione o tom" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corporativo">Corporativo</SelectItem>
                <SelectItem value="institucional">Institucional</SelectItem>
                <SelectItem value="acolhedor">Acolhedor</SelectItem>
                <SelectItem value="moderno">Moderno</SelectItem>
                <SelectItem value="profissional">Profissional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Palavras-chave */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Palavras-chave (SEO Local)</Label>
            <Input
              id="keywords"
              placeholder="ex: transporte executivo São Paulo, fretamento premium"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            />
          </div>
        </div>

        {/* Instruções Adicionais */}
        <div className="space-y-2">
          <Label htmlFor="additionalInstructions">Instruções Adicionais</Label>
          <Textarea
            id="additionalInstructions"
            placeholder="Adicione detalhes específicos para personalizar os criativos..."
            rows={4}
            value={formData.additionalInstructions}
            onChange={(e) => setFormData({ ...formData, additionalInstructions: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-gradient-premium text-primary-foreground hover:opacity-90 transition-opacity shadow-premium"
          disabled={isGenerating}
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Gerando Criativos...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Gerar Criativos Premium
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};
