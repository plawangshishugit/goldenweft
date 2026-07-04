"use client";

import { useEffect, useState, useRef } from "react";
import AdvisorProgress from "./AdvisorProgress";
import StepIntro from "./StepIntro";
import StepSingleChoice from "./StepSingleChoice";
import AdvisorResult from "./AdvisorResult";
import { AnimatePresence, motion } from "framer-motion";

/* ---------- STEPS ---------- */
export const steps = [
  "intro",
  "occasion",
  "drape",
  "style",
  "tone",
  "investment",
  "result",
] as const;

export type StepKey = (typeof steps)[number];

const STORAGE_KEY = "gw_advisor_state";

export default function AdvisorLayout() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<1 | -1>(1);
  const [lastEdited, setLastEdited] = useState<string | null>(null);

  /** Hydration guard — runs restore exactly once */
  const hydrated = useRef(false);

  /* ---------- RESTORE (RUNS ONCE ONLY) ---------- */
  useEffect(() => {
    if (hydrated.current) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed.step === "number") {
          setStep(parsed.step);
          setAnswers(parsed.answers ?? {});
        }
      } catch {}
    }

    hydrated.current = true;
  }, []);

  /* ---------- PERSIST (AFTER HYDRATION ONLY) ---------- */
  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step, answers })
    );
  }, [step, answers]);

  const currentStep = steps[step];

  /* ---------- NAV ---------- */
  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const select = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setLastEdited(key); // track which step was last answered for partial re-ranking
    next();
  };

  const restart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setStep(0);
    setDirection(1);
    setLastEdited(null);
  };

  /* ---------- INTRO ---------- */
  if (currentStep === "intro") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="intro"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
        >
          <StepIntro onNext={() => setStep(1)} />
        </motion.div>
      </AnimatePresence>
    );
  }

  /* ---------- RESULT ---------- */
  if (currentStep === "result") {
    return (
      <AdvisorResult
        answers={answers}
        onRestart={restart}
        lastEdited={lastEdited}
      />
    );
  }

  /* ---------- QUESTIONS ---------- */
  return (
    <div className="min-h-screen flex flex-col justify-center">
      <AdvisorProgress current={step} total={steps.length - 2} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
          transition={{ duration: 0.25 }}
        >
          <StepSingleChoice
            step={currentStep}
            onSelect={select}
            onBack={back}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
