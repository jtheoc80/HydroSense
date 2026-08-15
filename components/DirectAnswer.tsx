interface DirectAnswerProps {
  question: string;
  answer: string;
  homeownerMeaning?: string;
}

export default function DirectAnswer({
  question,
  answer,
  homeownerMeaning,
}: DirectAnswerProps) {
  return (
    <section
      data-direct-answer
      aria-labelledby="direct-answer-heading"
      className="mt-10 overflow-hidden rounded-[1.75rem] border border-sky-200/70 bg-white text-slate-950 shadow-[0_28px_80px_-48px_rgba(14,165,233,0.7)]"
    >
      <div className="border-b border-slate-200 bg-sky-50 px-6 py-4 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
          Question
        </p>
        <h2 id="direct-answer-heading" className="mt-2 text-lg font-semibold text-[#001a4e] sm:text-xl">
          {question}
        </h2>
      </div>
      <div className="px-6 py-6 sm:px-8 sm:py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
          Direct answer
        </p>
        <p data-direct-answer-text className="mt-3 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
          {answer}
        </p>
        {homeownerMeaning ? (
          <p className="mt-5 border-l-2 border-cyan-400 pl-4 text-sm leading-6 text-slate-600">
            <strong className="text-[#001a4e]">What this means for your home:</strong>{" "}
            {homeownerMeaning}
          </p>
        ) : null}
      </div>
    </section>
  );
}
