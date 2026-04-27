import { useEffect, useRef, useState } from "react";
import { useGameEngine, POWER_OVERLAY } from "@/game/useGameEngine";
import { Board } from "@/game/Board";
import { HUD } from "@/game/HUD";
import { Controls } from "@/game/Controls";
import { StartScreen } from "@/game/StartScreen";
import { TutorialScreen } from "@/game/TutorialScreen";
import { ResultScreen } from "@/game/ResultScreen";
import { SettingsPanel } from "@/game/SettingsPanel";
import { useSettings } from "@/game/useSettings";

const MindTheCab = () => {
  const { settings, setCabScale, setHaptic, reset: resetSettings } = useSettings();
  const { state, items, hazards, player, collectFx, powerFx, start, reset, setDir, goTutorial, goStart, rank, timerTest, testElapsed } =
    useGameEngine({ haptics: settings.haptics });
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [activePowerBubble, setActivePowerBubble] = useState<{ id: number; mode: string } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Show a transient floating power bubble that auto-clears after the animation.
  useEffect(() => {
    if (!powerFx) return;
    setActivePowerBubble({ id: powerFx.id, mode: powerFx.mode });
    const t = window.setTimeout(() => setActivePowerBubble((cur) => (cur?.id === powerFx.id ? null : cur)), 1200);
    return () => window.clearTimeout(t);
  }, [powerFx]);

  const isLive = state.phase === "playing" || state.phase === "ready";

  return (
    <main
      ref={surfaceRef}
      className="fixed inset-0 mx-auto w-full max-w-lg bg-background flex flex-col overflow-hidden no-tap-highlight"
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)", touchAction: "none" }}
    >
      {/* Marquee strip when not playing */}
      {!isLive && (
        <div className="overflow-hidden border-b border-olive/30 marquee-tape">
          <div className="flex whitespace-nowrap animate-marquee text-[10px] font-mono-brand uppercase tracking-[0.32em] text-[hsl(0_0%_6%)] py-1.5 font-bold">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="px-4">
                MIND THE CAB · BUILT FOR &amp; AROUND PEOPLE · EST. 2017 ·
              </span>
            ))}
          </div>
        </div>
      )}

      {state.phase === "start" && <StartScreen onStart={goTutorial} />}
      {state.phase === "tutorial" && <TutorialScreen onGo={start} />}

      {isLive && (
        <>
          <HUD state={state} rank={rank} onOpenSettings={() => setSettingsOpen(true)} timerTest={timerTest} testElapsed={testElapsed} />
          <Board
            player={player}
            hazards={hazards}
            items={items}
            power={state.power}
            shakeKey={state.shakeKey}
            phase={state.phase}
            collectFx={collectFx}
            cabScale={settings.cabScale}
          />
          <Controls onDir={setDir} surfaceRef={surfaceRef} />

          {/* Ready overlay — paused, highlight the cab, prompt for first swipe */}
          {state.phase === "ready" && (
            <div className="pointer-events-none absolute inset-x-0 bottom-24 flex flex-col items-center gap-2 z-30 animate-fade-in">
              <span className="sticker-tape bg-orange-sticker text-[hsl(0_0%_6%)] shadow-orange">
                YOUR CAB IS READY
              </span>
              <div className="px-5 py-2 rounded-sm border border-olive/50 bg-black/70 backdrop-blur-sm">
                <p className="text-sm font-display font-bold uppercase tracking-[0.22em] text-olive neon-text text-center">
                  Swipe to ride
                </p>
              </div>
            </div>
          )}

          {/* Floating power bubble — flies up and away, doesn't block view */}
          {activePowerBubble && (
            <div
              key={activePowerBubble.id}
              className="pointer-events-none absolute left-1/2 top-[60%] z-30 animate-fly-up"
            >
              <div
                className={`px-3 py-1 rounded-sm font-display font-bold tracking-[0.18em] text-xs shadow-olive border whitespace-nowrap ${
                  activePowerBubble.mode === "matcha_hypnosis"
                    ? "bg-matcha text-[hsl(0_0%_6%)] border-matcha"
                    : activePowerBubble.mode === "no_compromise"
                    ? "bg-orange-sticker text-[hsl(0_0%_6%)] border-orange-sticker"
                    : activePowerBubble.mode === "cabbie_stories"
                    ? "bg-bc-blue text-[hsl(0_0%_6%)] border-bc-blue"
                    : "bg-cream text-[hsl(0_0%_6%)] border-cream"
                }`}
              >
                ▶ {POWER_OVERLAY[activePowerBubble.mode as Exclude<typeof activePowerBubble.mode, "none">]}
              </div>
            </div>
          )}
        </>
      )}

      {state.phase === "result" && (
        <ResultScreen
          score={state.score}
          rank={rank}
          hasArtifact={state.collectedBcArtifact}
          onReplay={start}
          onHome={() => { reset(); goStart(); }}
        />
      )}

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        setCabScale={setCabScale}
        setHaptic={setHaptic}
        reset={resetSettings}
      />
    </main>
  );
};

export default MindTheCab;
