import { useState, useMemo, useEffect, useCallback } from "react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "День Святого Валентина" },
    { name: "description", content: "Чи будеш моєю валентинкою?" },
  ];
}

const SVETA_IMAGES = [
  "/assets/sveta_one.jpg",
  "/assets/sveta_two.jpg",
  "/assets/sveta_four.jpg",
  "/assets/sveta_five.jpg",
  "/assets/sveta_six.jpg",
  "/assets/sveta_seven.jpg",
  "/assets/sveta_eight.jpg",
];

const DECOY_COLORS = [
  { bg: "#a3d9a5", icon: "🌿", label: "Plant" },
  { bg: "#f9c74f", icon: "⭐", label: "Star" },
  { bg: "#90bef4", icon: "🌊", label: "Wave" },
  { bg: "#f4a0a0", icon: "🧁", label: "Cupcake" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type GridItem =
  | { type: "sveta"; src: string }
  | { type: "decoy"; bg: string; icon: string; label: string };

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full max-w-md mx-auto mb-4 shrink-0">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              s <= step ? "bg-violet-500" : "bg-violet-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Step1({ onNext }: { onNext: () => void }) {
  const [noCount, setNoCount] = useState(0);

  const yesScale = 1 + noCount * 0.2;
  const noScale = Math.max(0.2, 1 - noCount * 0.15);

  return (
    <div className="flex flex-col items-center animate-fade-in flex-1 min-h-0 w-full max-w-md">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <h1 className="text-3xl md:text-5xl font-bold text-violet-600 text-center leading-tight">
          Ну шо ти, будеш моєю валентинкою? 💝
        </h1>
        {noCount >= 3 && (
          <p className="text-violet-400 text-sm animate-fade-in max-w-sm text-center">
            Ти шо? Тут є лише одна правильна відповідь... 😏
          </p>
        )}
      </div>
      <div className="flex items-center gap-4 w-full mt-auto pb-2">
        <button
          onClick={onNext}
          style={{ transform: `scale(${yesScale})` }}
          className="flex-1 py-4 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300 cursor-pointer"
        >
          Так
        </button>
        <button
          onClick={() => setNoCount((c) => c + 1)}
          style={{ transform: `scale(${noScale})`, opacity: noScale }}
          className="flex-1 py-4 bg-gray-300 hover:bg-gray-400 text-violet-800 font-bold rounded-xl shadow-lg transition-all duration-300 cursor-pointer"
        >
          Ні
        </button>
      </div>
    </div>
  );
}

function Step2({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState(false);

  const gridItems = useMemo<GridItem[]>(() => {
    const sveta: GridItem[] = SVETA_IMAGES.map((src) => ({
      type: "sveta",
      src,
    }));
    const decoys: GridItem[] = DECOY_COLORS.map((d) => ({
      type: "decoy",
      ...d,
    }));
    return shuffle([...sveta, ...decoys]);
  }, []);

  const toggleImage = (key: string) => {
    setError(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const getKey = (item: GridItem) =>
    item.type === "sveta" ? item.src : item.label;

  const handleVerify = () => {
    const selectedSveta = [...selected].filter((k) =>
      SVETA_IMAGES.includes(k)
    );
    const selectedDecoys = [...selected].filter(
      (k) => !SVETA_IMAGES.includes(k)
    );
    if (selectedSveta.length === 7 && selectedDecoys.length === 0) {
      onNext();
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in flex-1 min-h-0 w-full max-w-lg">
      <div className="flex-1 flex flex-col items-center gap-6 w-full min-h-0 overflow-y-auto py-4">
        <div className="text-center shrink-0">
          <p className="text-xs uppercase tracking-widest text-violet-300 mb-1">
            Перевірка!
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-violet-600">
            Обери всі фото зі Светіком!
          </h2>
        </div>

        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-3 w-full ${error ? "animate-shake" : ""}`}
        >
          {gridItems.map((item) => {
            const key = getKey(item);
            const isSelected = selected.has(key);
            return (
              <button
                key={key}
                onClick={() => toggleImage(key)}
                className={`relative aspect-square rounded-xl overflow-hidden border-3 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-violet-500 ring-2 ring-violet-300 scale-95"
                    : "border-transparent hover:border-violet-200"
                }`}
              >
                {item.type === "sveta" ? (
                  <img
                    src={item.src}
                    alt="Фото"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-4xl"
                    style={{ backgroundColor: item.bg }}
                  >
                    {item.icon}
                  </div>
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-violet-500/30 flex items-center justify-center">
                    <span className="text-white text-3xl drop-shadow-lg">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <p className="text-rose-500 text-sm animate-fade-in">
            Ну ти шо? Давай уважніше! 🤔
          </p>
        )}
      </div>

      <button
        onClick={handleVerify}
        disabled={selected.size === 0}
        className="w-full py-4 bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all duration-200 cursor-pointer mt-auto mb-2"
      >
        Підтвердити
      </button>
    </div>
  );
}

const LOVE_LETTER = `День святого Валентина не моя тема, але ти моя. Тому коротко: життя з тобою це найкращий плейлист, який я ніколи б сам не склав.

Ти — моя улюблена людина. Крапка.`;

function Step3({ onNext }: { onNext: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(LOVE_LETTER.slice(0, i));
      if (i >= LOVE_LETTER.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center animate-fade-in flex-1 min-h-0 w-full max-w-lg">
      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
        <span className="text-5xl">💌</span>
        <div className="w-full bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 border border-violet-100">
          <p className="text-lg md:text-xl text-violet-800 leading-relaxed whitespace-pre-line min-h-[120px]">
            {displayed}
            {!done && <span className="typewriter-cursor">|</span>}
          </p>
        </div>
        {done && (
          <p className="text-violet-500 text-lg font-medium animate-fade-in">
            З любов'ю, Макс💕
          </p>
        )}
      </div>
      {done && (
        <button
          onClick={onNext}
          className="w-full py-4 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 cursor-pointer mt-auto mb-2 animate-fade-in"
        >
          Далі
        </button>
      )}
    </div>
  );
}

const REASONS = [
  "Люблю тебе за твою усмішку 😊",
  "За твій гумор, який завжди рятує 😄",
  "За те, як ти обіймаєш 🤗",
  "За те, що ти завжди поруч 💛",
  "За те, як ти смієшся з моїх жартів 😂",
  "За те, що з тобою все стає краще ✨",
  "За те, як ти дивишся на мене 👀",
];

function Step4({ onNext }: { onNext: () => void }) {
  const [pulled, setPulled] = useState<number[]>([]);
  const [currentNote, setCurrentNote] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const pullNote = () => {
    const remaining = REASONS.map((_, i) => i).filter(
      (i) => !pulled.includes(i)
    );
    if (remaining.length === 0 || animating) return;

    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setAnimating(true);
    setCurrentNote(pick);
    setPulled((prev) => [...prev, pick]);
    setTimeout(() => setAnimating(false), 600);
  };

  const allPulled = pulled.length === REASONS.length;

  return (
    <div className="flex flex-col items-center animate-fade-in flex-1 min-h-0 w-full max-w-md">
      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full min-h-0 overflow-y-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-violet-600 text-center">
          Баночка з причинами 🫙
        </h2>
        <p className="text-violet-400 text-sm">
          Натисни на баночку, щоб дістати записку
        </p>

        {/* Jar */}
        <button
          onClick={pullNote}
          disabled={allPulled}
          className="relative cursor-pointer disabled:cursor-default group"
        >
          {/* Jar body */}
          <div className="w-40 h-52 bg-gradient-to-b from-violet-100/80 to-violet-200/60 rounded-b-3xl border-2 border-violet-300/50 relative overflow-hidden backdrop-blur transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
            {/* Jar lid */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-36 h-8 bg-violet-400 rounded-t-xl border-2 border-violet-500/50 z-10" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-44 h-4 bg-violet-400 rounded-sm border-2 border-violet-500/50 z-10" />

            {/* Paper slips inside */}
            <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center gap-1 px-3">
              {REASONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-3 rounded-sm transition-all duration-500 ${
                    pulled.includes(i) ? "w-0 opacity-0" : "opacity-80"
                  }`}
                  style={{
                    width: pulled.includes(i) ? 0 : `${60 + (i % 3) * 15}%`,
                    backgroundColor: [
                      "#ddd6fe",
                      "#ede9fe",
                      "#e9d5ff",
                      "#f3e8ff",
                      "#c4b5fd",
                      "#ddd6fe",
                      "#ede9fe",
                    ][i],
                    transform: `rotate(${-8 + (i % 5) * 4}deg)`,
                  }}
                />
              ))}
            </div>

            {/* Heart decorations */}
            <span className="absolute top-10 left-3 text-lg opacity-30">
              💗
            </span>
            <span className="absolute top-16 right-4 text-sm opacity-20">
              💕
            </span>
          </div>

          {/* Counter */}
          <div className="mt-3 text-sm text-violet-400 text-center">
            {pulled.length} / {REASONS.length}
          </div>
        </button>

        {/* Current note */}
        {currentNote !== null && (
          <div
            key={currentNote}
            className="w-full bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 border border-violet-100 animate-note-appear"
          >
            <p className="text-lg text-violet-800 text-center leading-relaxed">
              {REASONS[currentNote]}
            </p>
          </div>
        )}

        {allPulled && (
          <p className="text-violet-500 font-medium text-center animate-fade-in">
            Це всі причини... поки що 😘
          </p>
        )}
      </div>

      {allPulled && (
        <button
          onClick={onNext}
          className="w-full py-4 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 cursor-pointer mt-auto mb-2 animate-fade-in"
        >
          Далі
        </button>
      )}
    </div>
  );
}

const SCRATCH_COLS = 10;
const SCRATCH_ROWS = 8;
const TOTAL_TILES = SCRATCH_COLS * SCRATCH_ROWS;
const REVEAL_THRESHOLD = 0.4;

function Step5() {
  const [scratched, setScratched] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);

  const scratchTile = useCallback(
    (index: number) => {
      if (revealed) return;
      setScratched((prev) => {
        const next = new Set(prev);
        next.add(index);
        if (next.size / TOTAL_TILES >= REVEAL_THRESHOLD && !revealed) {
          setTimeout(() => {
            setRevealed(true);
            setConfettiVisible(true);
            setTimeout(() => setConfettiVisible(false), 2500);
          }, 300);
        }
        return next;
      });
    },
    [revealed]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isScratching) return;
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const index = target?.getAttribute("data-scratch-index");
      if (index) scratchTile(Number(index));
    },
    [isScratching, scratchTile]
  );

  return (
    <div className="flex flex-col items-center animate-fade-in flex-1 min-h-0 w-full max-w-md">
      {/* Full-screen confetti */}
      {confettiVisible && (
        <div className="fixed inset-0 pointer-events-none z-50 animate-confetti-bg">
          {["🎉", "✨", "💜", "🎶", "🎊", "💫", "🎵", "✨", "💜", "🎉", "🎶", "💫"].map(
            (emoji, i) => (
              <span
                key={i}
                className="absolute text-3xl animate-confetti-fall"
                style={{
                  left: `${5 + i * 8}%`,
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                {emoji}
              </span>
            )
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full min-h-0 overflow-y-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-violet-600 text-center">
          А тепер подарунок! 🎁
        </h2>
        <p className="text-violet-400 text-sm">
          Зітри картку, щоб побачити сюрприз
        </p>

        {/* Scratch card — clean image only */}
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl select-none touch-none"
          onPointerDown={() => setIsScratching(true)}
          onPointerUp={() => setIsScratching(false)}
          onPointerLeave={() => setIsScratching(false)}
          onPointerMove={handlePointerMove}
        >
          <img
            src="/assets/monsters.jpeg"
            alt="Of Monsters and Men"
            className="w-full object-cover"
          />

          {/* Scratch overlay */}
          {!revealed && (
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${SCRATCH_COLS}, 1fr)`,
                gridTemplateRows: `repeat(${SCRATCH_ROWS}, 1fr)`,
              }}
            >
              {Array.from({ length: TOTAL_TILES }).map((_, i) => (
                <div
                  key={i}
                  data-scratch-index={i}
                  onPointerEnter={() => isScratching && scratchTile(i)}
                  onPointerDown={() => scratchTile(i)}
                  className={`transition-opacity duration-300 ${
                    scratched.has(i) ? "opacity-0" : "opacity-100"
                  }`}
                  style={{
                    backgroundColor: `hsl(${265 + (i % 5) * 3}, ${50 + (i % 3) * 10}%, ${75 + (i % 4) * 3}%)`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Ticket info revealed below the image */}
        {revealed && (
          <div className="flex flex-col items-center gap-2 animate-fade-in w-full">
            <h3 className="text-2xl md:text-3xl font-black text-violet-600 text-center tracking-tight">
              Of Monsters and Men
            </h3>
            <div className="w-12 h-px bg-violet-300 my-1" />
            <p className="text-violet-500 font-medium text-lg">
              16 червня 2026
            </p>
            <p className="text-violet-400 text-sm">Початок о 19:00</p>
            <div className="mt-2 px-6 py-2.5 bg-violet-500 text-white rounded-full font-bold text-sm tracking-wide shadow-lg">
              🎫 2 КВИТКИ
            </div>
            <p className="text-violet-400 mt-2 text-center">
              Це для нас! 💜
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="h-dvh bg-gradient-to-br from-violet-50 via-white to-purple-50 flex flex-col items-center px-6 pt-6 pb-3 overflow-hidden">
      <ProgressBar step={currentStep} />
      <div className="flex-1 flex flex-col w-full max-w-lg min-h-0">
        {currentStep === 1 && (
          <Step1 onNext={() => setCurrentStep(2)} />
        )}
        {currentStep === 2 && (
          <Step2 onNext={() => setCurrentStep(3)} />
        )}
        {currentStep === 3 && (
          <Step3 onNext={() => setCurrentStep(4)} />
        )}
        {currentStep === 4 && (
          <Step4 onNext={() => setCurrentStep(5)} />
        )}
        {currentStep === 5 && <Step5 />}
      </div>
    </div>
  );
}
