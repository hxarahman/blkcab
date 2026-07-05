import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTopScores = () =>
  useQuery({
    queryKey: ["top-scores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_scores")
        .select("initials, score")
        .order("score", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
    retry: 1,
  });

export const Leaderboard = ({ compact = false }: { compact?: boolean }) => {
  const { data, isLoading, isError } = useTopScores();
  const rows = compact ? data?.slice(0, 5) : data;

  if (isError) return null;
  if (!isLoading && (!rows || rows.length === 0)) return null;

  return (
    <div
      className={
        compact
          ? "w-full max-w-[260px] rounded-sm border border-border/60 bg-black/40 px-4 py-3 backdrop-blur-sm"
          : "rounded-sm border border-border bg-card p-4"
      }
    >
      <div className="text-[11px] font-mono-brand uppercase tracking-[0.3em] text-muted-foreground text-center">
        Top Cabbies
      </div>
      {isLoading ? (
        <p className="text-center text-xs text-muted-foreground mt-2 font-mono-brand tracking-widest">···</p>
      ) : (
        <ol className={compact ? "mt-2 space-y-0.5" : "mt-3 space-y-1.5"}>
          {rows!.map((r, i) => (
            <li
              key={i}
              className={`flex items-center gap-2 font-mono-brand tabular-nums ${
                compact ? "text-[11px]" : "text-sm"
              }`}
            >
              <span className="text-muted-foreground w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 text-left tracking-[0.3em] text-foreground/90">{r.initials}</span>
              <span className="text-olive font-bold">{r.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
