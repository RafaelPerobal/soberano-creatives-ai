import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles } from "lucide-react";

interface GenerationProgressProps {
  current: number;
  total: number;
  status: string;
}

export const GenerationProgress = ({ current, total, status }: GenerationProgressProps) => {
  const progress = (current / total) * 100;

  return (
    <Card className="p-6 shadow-elegant border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-premium animate-pulse">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Gerando Criativos Premium</h3>
            <p className="text-sm text-muted-foreground">{status}</p>
          </div>
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-semibold text-foreground">
              {current} de {total} criativos
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i < current
                  ? "bg-gradient-premium"
                  : i === current
                  ? "bg-gradient-premium animate-pulse"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};
