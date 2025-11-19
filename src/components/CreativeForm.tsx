import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GenerationProgress } from "@/components/GenerationProgress";
import type { Creative } from "@/types/creative";

interface CreativeFormProps {
  onGenerate: (creatives: Creative[]) => void;
}

export const CreativeForm = ({ onGenerate }: CreativeFormProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState({ current: 0, total: 0, message: "" });
  
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

    try {
      const { generateImage, getCreativeText } = await import("@/services/imageGenerator");
      
      const numImages = 3;
      const creatives: Creative[] = [];
      
      setGenerationStatus({ current: 0, total: numImages, message: "Preparando geração..." });

      for (let i = 0; i < numImages; i++) {
        setGenerationStatus({ 
          current: i, 
          total: numImages, 
          message: `Gerando criativo ${i + 1} de ${numImages}...` 
        });

        try {
          const imageUrl = await generateImage(formData, i, (status) => {
            console.log(`Image ${i + 1} status:`, status);
            setGenerationStatus({ 
              current: i, 
              total: numImages, 
              message: status 
            });
          });

          const textContent = getCreativeText(formData, i);

          creatives.push({
            id: `creative-${Date.now()}-${i}`,
            imageUrl,
            headline: textContent.headline,
            description: textContent.description,
            cta: textContent.cta,
          });
          
          setGenerationStatus({ 
            current: i + 1, 
            total: numImages, 
            message: `Criativo ${i + 1} concluído!` 
          });
        } catch (error) {
          console.error(`Error generating image ${i + 1}:`, error);
          toast({
            title: `Erro ao gerar criativo ${i + 1}`,
            description: "Continuando com os próximos...",
            variant: "destructive",
          });
        }
      }

      if (creatives.length > 0) {
        onGenerate(creatives);
        toast({
          title: "Criativos gerados com sucesso!",
          description: `${creatives.length} criativos premium prontos para uso.`,
        });
      } else {
        toast({
          title: "Erro na geração",
          description: "Não foi possível gerar nenhum criativo. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in generation process:", error);
      toast({
        title: "Erro na geração",
        description: "Ocorreu um erro ao gerar os criativos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {isGenerating && (
        <div className="mb-6">
          <GenerationProgress 
            current={generationStatus.current}
            total={generationStatus.total}
            status={generationStatus.message}
          />
        </div>
      )}
      
      <Card className="p-6 shadow-elegant">{/* ... keep existing code */}
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
    </>
  );
};
