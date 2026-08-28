export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Write",
      desc: "Enter a movie review. Our system accepts any text and treats it as raw input from a user."
    },
    {
      num: "02",
      title: "Process",
      desc: "The NLP pipeline cleans the text, removes HTML and stopwords, and lemmatizes words while carefully preserving negation words (like 'not', 'never')."
    },
    {
      num: "03",
      title: "Analyze",
      desc: "A trained TF-IDF (Term Frequency-Inverse Document Frequency) vectorizer converts the cleaned text into numerical features."
    },
    {
      num: "04",
      title: "Predict",
      desc: "A Logistic Regression machine learning model evaluates the features and predicts whether the sentiment is positive or negative."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
          How it <span className="italic font-serif text-[var(--gold)]">Works</span>
        </h1>
        <p className="text-[var(--muted)] max-w-xl mx-auto font-light leading-relaxed">
          Our sentiment analysis engine uses classical Natural Language Processing (NLP) techniques combined with Machine Learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Decorative connecting line */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#333] to-transparent -translate-y-1/2" />
        <div className="hidden md:block absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-[#333] to-transparent -translate-x-1/2" />

        {steps.map((step, idx) => (
          <div key={idx} className="cinematic-card p-10 rounded-xl relative z-10 group hover:-translate-y-1">
            <div className="text-[var(--gold)] text-5xl font-serif italic mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
              {step.num}
            </div>
            <h3 className="text-xl font-medium tracking-wide mb-4 text-[var(--foreground)] uppercase">
              {step.title}
            </h3>
            <p className="text-[var(--muted)] font-light leading-relaxed text-sm">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
