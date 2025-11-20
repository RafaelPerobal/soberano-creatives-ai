import { GOOGLE_AI_KEY, LOVABLE_AI_GATEWAY } from "@/config/api";

interface GenerationParams {
  service: string;
  scenario: string;
  message: string;
  mediaType: string;
  tone: string;
  keywords: string;
  additionalInstructions: string;
}

const serviceDescriptions: Record<string, string> = {
  "van-executiva": "luxury executive van (Mercedes-Benz Sprinter or Renault Master), modern black premium vehicle with leather seats",
  "sedan-premium": "premium black Toyota Corolla sedan, elegant executive car with leather interior",
  "suv-premium": "luxury 7-seater SUV, premium black vehicle, spacious and elegant",
  "frota-completa": "fleet of luxury executive vehicles, vans and premium cars",
};

const scenarioDescriptions: Record<string, string> = {
  "aeroporto": "modern international airport terminal, professional business setting at dawn/dusk with golden lighting",
  "evento-corporativo": "elegant corporate event venue, professional business conference center with modern architecture",
  "centro-convencoes": "contemporary convention center, glass and steel modern building, professional atmosphere",
  "hotel-luxo": "5-star luxury hotel entrance, upscale hospitality setting with elegant facade",
  "parque-turistico": "beautiful tourist attraction, scenic destination with families enjoying, bright daylight",
  "residencial-alto-padrao": "high-end residential area, luxury condominiums, exclusive neighborhood",
};

const toneStyles: Record<string, string> = {
  "corporativo": "corporate professional style, clean and sophisticated, business-oriented composition",
  "institucional": "institutional formal style, trustworthy and authoritative visual",
  "acolhedor": "warm and welcoming atmosphere, friendly and inviting composition",
  "moderno": "modern contemporary style, sleek and innovative visual design",
  "profissional": "professional polished style, high-quality and refined composition",
};

export const buildPrompt = (params: GenerationParams, imageIndex: number): string => {
  const serviceDesc = serviceDescriptions[params.service] || "luxury executive vehicle";
  const scenarioDesc = scenarioDescriptions[params.scenario] || "professional setting";
  const toneStyle = toneStyles[params.tone] || "professional style";
  
  const variations = [
    "front angle view",
    "side profile view",
    "three-quarter angle view",
  ];
  
  const angle = variations[imageIndex % variations.length];

  // Build a detailed prompt for advertising image generation
  const prompt = `Professional advertising photograph for luxury transport company. 
${serviceDesc}, ${angle}, positioned at ${scenarioDesc}.
${toneStyle}, premium quality, photorealistic.
Golden hour lighting, elegant composition, ultra-detailed, 8K quality.
Professional uniformed driver visible, premium service atmosphere.
Advertisement style with space for text overlay at top and bottom.
ANTT, ARTESP, CADASTUR certification badges visible.
Color scheme: black vehicle, golden/yellow accents, premium luxury feel.
${params.additionalInstructions || ''}
No text, clean composition ready for graphic design overlay.`;

  return prompt.trim();
};

export const generateImage = async (
  params: GenerationParams,
  imageIndex: number,
  onProgress?: (status: string) => void
): Promise<string> => {
  try {
    const prompt = buildPrompt(params, imageIndex);
    
    onProgress?.(`Gerando imagem ${imageIndex + 1} com IA...`);
    console.log("Generating with prompt:", prompt);

    // Use Google Gemini Image Generation via Lovable AI Gateway
    const response = await fetch(LOVABLE_AI_GATEWAY, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GOOGLE_AI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      console.warn("API generation failed, using placeholder");
      return generatePlaceholderImage(params, imageIndex);
    }

    onProgress?.("Processando imagem...");
    
    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.warn("No image in response, using placeholder");
      return generatePlaceholderImage(params, imageIndex);
    }
    
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    // Fallback to placeholder
    return generatePlaceholderImage(params, imageIndex);
  }
};

const generatePlaceholderImage = (params: GenerationParams, imageIndex: number): string => {
  // Create a canvas with gradient and text
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Premium gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1a1a1a');
  gradient.addColorStop(0.5, '#2d2d2d');
  gradient.addColorStop(1, '#1a1a1a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add gold accents
  ctx.strokeStyle = '#f4c430';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  // Add logo area (placeholder)
  ctx.fillStyle = '#f4c430';
  ctx.fillRect(80, 80, 200, 80);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('SOBERANO', 100, 135);

  // Add main text
  const textContent = getCreativeText(params, imageIndex);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  
  // Wrap headline text
  const words = textContent.headline.split(' ');
  let line = '';
  let y = canvas.height / 2 - 100;
  
  words.forEach((word) => {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > canvas.width - 200 && line) {
      ctx.fillText(line, canvas.width / 2, y);
      line = word + ' ';
      y += 60;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, canvas.width / 2, y);

  // Add description
  ctx.font = '24px Arial';
  ctx.fillStyle = '#cccccc';
  y += 80;
  
  const descWords = textContent.description.substring(0, 100).split(' ');
  line = '';
  
  descWords.forEach((word) => {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > canvas.width - 200 && line) {
      ctx.fillText(line, canvas.width / 2, y);
      line = word + ' ';
      y += 35;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, canvas.width / 2, y);

  // Add CTA button
  const buttonY = canvas.height - 150;
  ctx.fillStyle = '#f4c430';
  ctx.fillRect(canvas.width / 2 - 200, buttonY, 400, 70);
  
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 28px Arial';
  ctx.fillText(textContent.cta, canvas.width / 2, buttonY + 45);

  // Add certifications footer
  ctx.fillStyle = '#f4c430';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('ANTT • ARTESP • CADASTUR', canvas.width / 2, canvas.height - 50);

  return canvas.toDataURL('image/png');
};

export const getCreativeText = (params: GenerationParams, imageIndex: number) => {
  const headlines: Record<string, string[]> = {
    "seguranca-certificada": [
      "Segurança Certificada ANTT, ARTESP, CADASTUR",
      "Viaje Com Tranquilidade Total",
      "Certificações que Garantem Sua Segurança",
    ],
    "profissionalismo": [
      "Profissionalismo em Cada Detalhe",
      "Excelência Comprovada no Transporte Executivo",
      "Equipe Altamente Qualificada",
    ],
    "conforto-exclusivo": [
      "Conforto Premium em Cada Viagem",
      "Interior Luxuoso e Tecnologia de Ponta",
      "Viaje com Todo Conforto que Você Merece",
    ],
    "viagem-sem-preocupacao": [
      "Relaxe e Aproveite a Viagem",
      "Deixe a Direção Conosco",
      "Sua Única Preocupação é Aproveitar",
    ],
  };

  const descriptions: Record<string, string[]> = {
    "seguranca-certificada": [
      "Certificações oficiais ANTT, ARTESP e CADASTUR garantem sua segurança em cada quilômetro. Viaje com total tranquilidade.",
      "Frota moderna e certificada pelos principais órgãos reguladores. Sua segurança é nossa prioridade número um.",
      "Mais de 100 viagens realizadas com segurança certificada. Confiança que você pode comprovar.",
    ],
    "profissionalismo": [
      "Motoristas profissionais, treinados e uniformizados. Atendimento de alto padrão do início ao fim da viagem.",
      "Pontualidade impecável e serviço personalizado. Cada detalhe pensado para sua comodidade.",
      "Excelência operacional certificada. Profissionalismo que transforma sua viagem em experiência premium.",
    ],
    "conforto-exclusivo": [
      "Bancos de couro reclináveis, ar condicionado dual zone, tomadas 110v. Conforto executivo em cada detalhe.",
      "Interior premium equipado com TV, DVD e conexão Wi-Fi. Trabalhe ou relaxe durante todo o trajeto.",
      "Veículos luxuosos com acabamento premium. Transforme cada viagem em momento de conforto absoluto.",
    ],
    "viagem-sem-preocupacao": [
      "Esqueça o trânsito, os pedágios e o estacionamento. Concentre-se no que realmente importa.",
      "Serviço completo porta a porta. Você só precisa entrar, sentar e aproveitar a viagem.",
      "Tranquilidade do embarque ao desembarque. Sua jornada começa relaxada e termina perfeita.",
    ],
  };

  const ctas = [
    "Solicite seu Orçamento",
    "Reserve Agora",
    "Entre em Contato",
    "Agende sua Viagem",
  ];

  const messageKey = params.message || "seguranca-certificada";
  const headlineIndex = imageIndex % (headlines[messageKey]?.length || 1);
  const descIndex = imageIndex % (descriptions[messageKey]?.length || 1);
  const ctaIndex = imageIndex % ctas.length;

  return {
    headline: headlines[messageKey]?.[headlineIndex] || "Transporte Executivo Premium",
    description: descriptions[messageKey]?.[descIndex] || "Soberano Turismo - Líder em transporte executivo em Ribeirão Preto e região.",
    cta: ctas[ctaIndex],
  };
};
