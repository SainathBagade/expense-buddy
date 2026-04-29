import { useEffect, useMemo, useState } from "react";

const emojis = [
  { icon: "🎁", msg: "You're my sunshine 🌞" },
  { icon: "🎂", msg: "Sweetest soul ever 💕" },
  { icon: "🍰", msg: "Life is better with you 🍭" },
  { icon: "🌹", msg: "Forever special 💖" },
  { icon: "🎀", msg: "Cute as magic ✨" },
  { icon: "💝", msg: "My precious gift 🎁" },
  { icon: "🧸", msg: "Cuddles forever 🤗" },
  { icon: "🎭", msg: "Colorful like dreams 🌈" },
  { icon: "🎊", msg: "Celebrate you always 🎉" },
];

const Loader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[radial-gradient(circle,_#1a0d2e,_#000)]">
    <div className="text-7xl animate-spin-slow">🎂</div>
    <p className="font-display text-xl text-pink-200">Loading birthday magic…</p>
  </div>
);

const Hero = () => (
  <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 relative">
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-2xl opacity-70 animate-float"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 8) * 0.4}s`,
            animationDuration: `${6 + (i % 5)}s`,
          }}
        >
          {["🎀", "✨", "🎈", "💖", "🌸"][i % 5]}
        </span>
      ))}
    </div>
    <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-pink-300 via-fuchsia-300 to-yellow-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,105,180,0.4)] animate-glow">
      Happy Birthday Priya! 🎉
    </h1>
    <p className="mt-4 text-pink-100/80 max-w-xl">
      Tap every little gift to unlock your surprise ✨
    </p>
  </section>
);

const EmojiGrid = ({ onComplete }: { onComplete: () => void }) => {
  const [clicked, setClicked] = useState<number[]>([]);

  const handleClick = (i: number) => {
    if (clicked.includes(i)) return;
    const updated = [...clicked, i];
    setClicked(updated);
    if (updated.length === emojis.length) setTimeout(onComplete, 1200);
  };

  return (
    <section className="px-6 py-10">
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
        {emojis.map((e, i) => {
          const isOpen = clicked.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`group rounded-3xl p-5 md:p-6 backdrop-blur-md border border-white/10 transition-all duration-500 ${
                isOpen
                  ? "bg-pink-500/30 scale-105 shadow-[0_0_40px_rgba(255,105,180,0.5)]"
                  : "bg-white/5 hover:bg-pink-500/20 hover:scale-110"
              }`}
            >
              <div className="text-4xl md:text-5xl">{e.icon}</div>
              <p
                className={`mt-2 text-xs md:text-sm text-pink-100 transition-all ${
                  isOpen ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"
                }`}
              >
                {e.msg}
              </p>
            </button>
          );
        })}
      </div>
      <h2 className="mt-12 text-center font-display text-5xl md:text-7xl font-bold text-pink-300 animate-glow">
        PRIYA
      </h2>
      <p className="text-center mt-2 text-pink-100/60 text-sm">
        {clicked.length} / {emojis.length} unlocked
      </p>
    </section>
  );
};

const SurpriseSection = () => {
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const confetti = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 4,
        emoji: ["🎊", "🎉", "✨", "💖", "🎀", "🌸"][i % 6],
      })),
    []
  );

  return (
    <section className="relative px-6 py-16 text-center overflow-hidden">
      {countdown <= 0 &&
        confetti.map((c, i) => (
          <span
            key={i}
            className="absolute top-0 text-2xl animate-fall pointer-events-none"
            style={{
              left: `${c.left}%`,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          >
            {c.emoji}
          </span>
        ))}

      <div className="text-5xl mb-4">🎂🕯️🕯️🕯️</div>

      {countdown > 0 ? (
        <p className="font-display text-3xl text-pink-200 animate-pulse">
          Surprise in {countdown}…
        </p>
      ) : (
        <div className="max-w-xl mx-auto rounded-3xl p-8 bg-white/10 backdrop-blur-xl border border-pink-300/30 shadow-[0_0_60px_rgba(255,105,180,0.3)] animate-pop">
          <h2 className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-300 to-yellow-200 bg-clip-text text-transparent">
            Surprise! 💖
          </h2>
          <p className="mt-4 text-pink-100/90 leading-relaxed">
            Priya, you make life magical. Wishing you endless happiness, love,
            and all the cake in the world! 🎀🎂
          </p>
        </div>
      )}
    </section>
  );
};

const Footer = () => {
  const share = async () => {
    const data = {
      title: "Happy Birthday Priya",
      text: "A special birthday surprise!",
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied!");
      }
    } catch {}
  };

  return (
    <footer className="flex justify-center gap-4 py-10">
      <button
        onClick={share}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-medium shadow-lg hover:scale-105 transition"
      >
        Share 💌
      </button>
    </footer>
  );
};

const Birthday = () => {
  const [loading, setLoading] = useState(true);
  const [allClicked, setAllClicked] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#2d0d3e,_#000)] text-white">
      <Hero />
      <EmojiGrid onComplete={() => setAllClicked(true)} />
      {allClicked && <SurpriseSection />}
      <Footer />
    </div>
  );
};

export default Birthday;
