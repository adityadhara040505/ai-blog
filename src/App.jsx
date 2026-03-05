import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import './index.css';

const API_BASE = 'http://localhost:5000/api';

const getSessionId = () => {
  let id = localStorage.getItem('blog_session_id');
  if (!id) {
    id = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('blog_session_id', id);
  }
  return id;
};

// ── Reading Progress ──────────────────────────────────────────────────
function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      setPct(el.scrollHeight - el.clientHeight > 0
        ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
        : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <div className="reading-progress" style={{ width: `${pct}%` }} />;
}


// ── Navbar ────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a className="navbar-brand" href="#">
          The <span>AI</span> Brief
        </a>
        <div className="navbar-meta">
          <span className="nav-tag">Deep Dive</span>
          <span className="nav-read-time">12 min read</span>
        </div>
      </div>
    </nav>
  );
}

// ── Section Image with caption ────────────────────────────────────────
function SectionImg({ src, alt, caption }) {
  return (
    <figure className="section-image-wrap">
      <img className="section-img" src={src} alt={alt} loading="lazy" />
      {caption && <figcaption className="img-caption">{caption}</figcaption>}
    </figure>
  );
}

// ── Article Header (replaces Hero) ────────────────────────────────────
function ArticleHeader({ likes, commentsCount }) {
  return (
    <header>
      <div className="article-header">
        <div className="article-header-inner">
          <div className="article-kicker">AI &amp; Machine Learning</div>
          <h1 className="article-title">
            From Query to Conversation: How Generative AI and Chatbots Actually Work
          </h1>
          <p className="article-subtitle">
            Behind every streamed response lies tokenization, attention mechanisms, and billions of learned patterns. Here&rsquo;s the full picture—from your keypress to the AI&rsquo;s reply.
          </p>
          <div className="article-byline">
            <div className="byline-left">
              <span className="byline-date">March 5, 2026</span>
              <span className="byline-divider">·</span>
              <span className="byline-readtime">12 min read</span>
              <span className="byline-divider">·</span>
              <span className="like-count-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likes.toLocaleString()} likes
              </span>
            </div>
            <div className="byline-right">
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {commentsCount} comment{commentsCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width hero photo below header */}
      <div className="hero-image-wrap">
        <img
          src="/images/hero.png"
          alt="A professional typing on a laptop in a modern office"
          className="hero-image"
        />
        <div className="hero-image-caption">
          Behind every AI chatbot response is a sophisticated sequence of mathematical transformations.
        </div>
      </div>
    </header>
  );
}

// ── Article Body ──────────────────────────────────────────────────────
function ArticleBody() {
  return (
    <article className="article-main">

      {/* Lead */}
      <p className="lead-para">
        Have you ever typed a question into ChatGPT and wondered what happens between pressing &ldquo;enter&rdquo; and watching that response stream out word by word? It feels almost magical. But behind that simple text box lies one of the most sophisticated technological achievements of our time—and it&rsquo;s entirely explainable.
      </p>

      {/* Section 1 */}
      <h2 id="what-happens" className="section-heading">The Short Version: What Actually Happens</h2>
      <p>
        When you ask a generative AI chatbot a question, five things happen in rapid succession. The entire sequence takes seconds—sometimes less time than it took you to read this sentence.
      </p>

      <ol className="timeline">
        {[
          ['01', 'Your words get broken down', ' into tiny numerical pieces the AI can process.'],
          ['02', 'The AI analyzes patterns', ' across everything it has learned from billions of documents.'],
          ['03', 'It predicts, token by token', ', what an appropriate response should be.'],
          ['04', 'The response gets decoded', ' back into natural language you can read.'],
          ['05', 'The conversation context', ' is carried forward so your next message makes sense.'],
        ].map(([n, b, r]) => (
          <li className="timeline-item" key={n}>
            <span className="tl-step">{n}</span>
            <p className="tl-text"><strong>{b}</strong>{r}</p>
          </li>
        ))}
      </ol>

      {/* Section 2 */}
      <h2 id="tokenization" className="section-heading">From Typing to Tokens: The First Step</h2>
      <p>
        When you type &ldquo;What is the capital of France?&rdquo; into a chatbot, the AI doesn&rsquo;t see words the way you do. It sees <strong>numbers</strong>. This process starts with <strong>tokenization</strong>—breaking your sentence into smaller pieces called tokens. These might be whole words, parts of words, or individual characters.
      </p>
      <p>
        The word &ldquo;unbelievable&rdquo; might become <code>[&ldquo;un&rdquo;, &ldquo;belie&rdquo;, &ldquo;vable&rdquo;]</code>—three tokens. Each token maps to a unique numerical ID in the model&rsquo;s vocabulary. GPT-4&rsquo;s vocabulary covers roughly <strong>100,000 tokens</strong> spanning multiple languages, technical terms, and even emoji.
      </p>

      <SectionImg
        src="/images/tokenization.png"
        alt="Neural network diagram showing tokenization"
        caption="A simplified view of how text flows from raw input through tokenization, attention, and output layers. Source: Editorial illustration."
      />

      <div className="pull-quote">
        <p>&ldquo;A word split poorly might lose meaning entirely. Modern tokenizers are sophisticated enough to handle these edge cases, but they&rsquo;re not perfect—which is one reason AI sometimes struggles with unusual names or specialized terminology.&rdquo;</p>
      </div>

      {/* Section 3 */}
      <h2 id="transformers" className="section-heading">The Architecture of Understanding: Transformers</h2>
      <p>
        Before 2017, most language AI used recurrent neural networks that processed words sequentially—slow and prone to forgetting the beginning of long sentences. Then came the <strong>Transformer architecture</strong>.
      </p>
      <p>
        In their landmark paper <em>&ldquo;Attention Is All You Need,&rdquo;</em> Google researchers introduced an approach where the model processes all words in your query <strong>simultaneously</strong>—analyzing how every word relates to every other word in parallel.
      </p>

      <div className="stats-row">
        <div className="stat-cell">
          <span className="stat-val">2017</span>
          <span className="stat-lbl">Transformer introduced</span>
        </div>
        <div className="stat-cell">
          <span className="stat-val">96</span>
          <span className="stat-lbl">Layers in GPT-3</span>
        </div>
        <div className="stat-cell">
          <span className="stat-val">175B</span>
          <span className="stat-lbl">GPT-3 parameters</span>
        </div>
      </div>

      <p>
        The key innovation is <strong>self-attention</strong>. Consider: &ldquo;The animal didn&rsquo;t cross the street because it was too tired.&rdquo; What does &ldquo;it&rdquo; refer to—the animal or the street? A human knows instantly. Self-attention lets the AI build these same connections by weighting the relationship between every pair of words.
      </p>
      <p>
        Modern Transformers use <strong>multi-head attention</strong>—multiple attention mechanisms running in parallel, each specializing in a different type of linguistic relationship. One head might track grammar, another pronoun references, another domain semantics. Think of it as a committee of experts each reading your sentence from a different perspective, then pooling their insights.
      </p>

      <SectionImg
        src="/images/transformer.png"
        alt="Transformer architecture encoder-attention-decoder diagram"
        caption="The Transformer's encoder-attention-decoder structure. Each &ldquo;head&rdquo; in multi-head attention learns different relationship patterns simultaneously."
      />

      {/* Section 4 */}
      <h2 id="black-box" className="section-heading">The Black Box: What the Model Actually Does</h2>
      <p>
        Once your query passes through the attention mechanisms, it enters the neural network itself—layer upon layer of mathematical transformations.
      </p>

      <div className="cards-grid">
        {[
          { icon: '', title: 'Encoder', desc: 'Reads your input and builds a rich numerical representation of its meaning.', cls: 'blue' },
          { icon: '', title: 'Decoder', desc: 'Generates the response token-by-token, conditioned on the encoder\'s output.', cls: 'slate' },
          { icon: '', title: '12–100+ Layers', desc: 'Each layer progressively refines the representation—grammar first, semantics later.', cls: 'green' },
          { icon: '', title: 'Billions of Parameters', desc: 'Numerical weights adjusted during training on vast text corpora—the model\'s entire "knowledge."', cls: 'red' },
        ].map((c) => (
          <div key={c.title} className={`info-card ${c.cls}`}>
            <span className="card-icon">{c.icon}</span>
            <div className="card-title">{c.title}</div>
            <p className="card-desc">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="key-point-box">
        <div className="kp-label">Key Insight</div>
        <p>
          <strong>Nobody explicitly programmed any of these capabilities.</strong> The model discovered patterns of grammar, reasoning, factual knowledge, and even humor entirely by analyzing text data during training. This is simultaneously its greatest strength and its fundamental limitation.
        </p>
      </div>

      {/* Section 5 */}
      <h2 id="generating" className="section-heading">Generating the Response: Word by Word</h2>
      <p>
        After processing your query, the model generates a response <strong>one token at a time</strong>. At each step it calculates a probability distribution over its entire vocabulary—roughly 100,000 candidates—then selects the next token.
      </p>
      <p>
        This selection is governed by a parameter called <strong>temperature</strong>. Low temperature (near 0) causes the model to almost always pick the highest-probability token, producing reliable but sometimes repetitive output. Higher temperature introduces controlled randomness—useful for creative tasks, but at the cost of consistency.
      </p>

      <div className="pull-quote">
        <p>&ldquo;When you watch an AI response streaming word by word, you are witnessing this process in real time. Each new word is a fresh probabilistic prediction built on everything that came before.&rdquo;</p>
      </div>

      {/* Section 6 */}
      <h2 id="context-window" className="section-heading">The Context Window: Working Memory</h2>

      <SectionImg
        src="/images/context.png"
        alt="Professional analysts reviewing data dashboards"
        caption="AI systems in production monitor vast streams of context continuously—analogous to an analyst tracking hundreds of data points at once."
      />

      <p>
        Modern chatbots maintain coherent conversations through their <strong>context window</strong>—the total amount of text the model can consider at once. Early models managed a few thousand tokens. Current frontier models handle upward of 128,000 tokens; GPT-4 Turbo can process over 300,000 tokens—roughly the length of three novels.
      </p>

      <div className="stats-row">
        <div className="stat-cell">
          <span className="stat-val">4K</span>
          <span className="stat-lbl">Early model limit</span>
        </div>
        <div className="stat-cell">
          <span className="stat-val">128K+</span>
          <span className="stat-lbl">Modern models</span>
        </div>
        <div className="stat-cell">
          <span className="stat-val">300K</span>
          <span className="stat-lbl">GPT-4 Turbo</span>
        </div>
      </div>

      <p>
        When a conversation exceeds the context window, the oldest content is silently dropped. This is why very long conversations can become disjointed. Some implementations extend memory using <strong>retrieval-augmented generation (RAG)</strong>—storing history externally and injecting only the most relevant passages when needed.
      </p>

      {/* Section 7 */}
      <h2 id="chatbots" className="section-heading">Why Different Chatbots Feel Different</h2>
      <p>
        The underlying Transformer architecture is largely shared across major AI systems. What differentiates them is training data, fine-tuning objectives, and explicit behavioral guidelines.
      </p>

      <ul className="content-list">
        {[
          ['ChatGPT (OpenAI)', 'Trained with extensive human feedback reinforcement. Conversational and safety-tuned, occasionally evasive on ambiguous requests.'],
          ['Claude (Anthropic)', '"Constitutional AI" training instills specific ethical guidelines. Tends toward thoroughness and caution.'],
          ['Gemini (Google)', 'Deeply integrated with Google Search\'s knowledge graph. Stronger on real-time factual retrieval, slightly less creative.'],
          ['Domain-specific AI', 'Fine-tuned for fields like medicine, law, or education. Sacrifices generality for depth and accuracy within a domain.'],
        ].map(([name, desc], i) => (
          <li key={name}>
            <span className="list-num">0{i + 1}</span>
            <span><strong>{name}</strong> — {desc}</span>
          </li>
        ))}
      </ul>

      {/* Section 8 */}
      <h2 id="business" className="section-heading">Business Applications: Beyond the Chat Window</h2>
      <p>
        Generative AI chatbots are being deployed across business operations at a pace that continues to accelerate. Research on Fortune Global 100 companies finds that <strong>56% use AI chatbots</strong> for productivity enhancement, with financial services leading at 92% adoption.
      </p>

      <div className="cards-grid">
        {[
          { icon: '', title: 'Customer Service', desc: '14% average productivity improvement; 34% gains for newer agents. Employment in the sector has risen post-pandemic.', cls: 'blue' },
          { icon: '', title: 'Internal Operations', desc: '56% of Fortune Global 100 deploy chatbots for knowledge management and workflow automation.', cls: 'slate' },
          { icon: '', title: 'Zero-Party Data', desc: 'Conversational quizzes collect preference data with user consent, enabling a virtuous personalization cycle.', cls: 'green' },
          { icon: '', title: 'Crisis Response', desc: 'During the Ukraine conflict, chatbots enabled real-time citizen reporting and humanitarian coordination at scale.', cls: 'red' },
        ].map((c) => (
          <div key={c.title} className={`info-card ${c.cls}`}>
            <span className="card-icon">{c.icon}</span>
            <div className="card-title">{c.title}</div>
            <p className="card-desc">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Section 9 */}
      <h2 id="road-ahead" className="section-heading">The Road Ahead</h2>

      <SectionImg
        src="/images/future.png"
        alt="Business professionals collaborating in a modern conference room"
        caption="Human-AI collaboration is increasingly shaping how organizations plan, decide, and communicate."
      />

      <p>
        The Transformer architecture that underpins modern chatbots is only seven years old. The trajectory since 2017 suggests the next seven years will be equally transformative.
      </p>

      <ul className="content-list">
        {[
          ['Multimodal Models', 'Processing text, images, audio, and video within a single unified model—enabling truly fluid, multi-sensory interaction.'],
          ['Agentic Systems', 'Moving from answering questions to taking actions: browsing the web, writing code, booking flights, negotiating with other AI systems.'],
          ['Extended Memory', 'Context windows approaching or exceeding human working memory, enabling genuinely persistent conversational relationships.'],
          ['Improved Reasoning', 'Deliberative architectures that reduce hallucination by separating fast pattern-matching from slower, verifiable reasoning.'],
        ].map(([name, desc], i) => (
          <li key={name}>
            <span className="list-num">0{i + 1}</span>
            <span><strong>{name}</strong> — {desc}</span>
          </li>
        ))}
      </ul>

      <div className="key-point-box">
        <div className="kp-label">Editorial Perspective</div>
        <p>
          Perhaps the most consequential development ahead won&rsquo;t be technological at all. It will be the collective decisions we make about <strong>what kind of relationship we want with these systems</strong>—tools or collaborators, utilities or companions. The technology can support any of these futures. The choice remains human.
        </p>
      </div>

      <hr className="art-divider" />

      {/* References */}
      <div className="references">
        <div className="references-title">Research References</div>
        {[
          '"Attention Is All You Need" — Vaswani et al., NeurIPS 2017',
          '"Generative AI as a Dialogic Partner" — Tang & Putra, 2025',
          '"Mental Models of Generative AI Chatbot Ecosystems" — Wang et al., 2025',
          '"AI Chatbots: Key Benefits and Challenges for Businesses" — Rotaru et al., 2025',
          '"Generating Tomorrow\'s Me" — Adam et al., 2025',
        ].map((r) => (
          <div className="ref-item" key={r}>{r}</div>
        ))}
      </div>
    </article>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────
function Sidebar() {
  const sections = [
    { label: 'What Actually Happens', id: 'what-happens' },
    { label: 'From Typing to Tokens', id: 'tokenization' },
    { label: 'Transformers & Attention', id: 'transformers' },
    { label: 'The Black Box', id: 'black-box' },
    { label: 'Generating the Response', id: 'generating' },
    { label: 'The Context Window', id: 'context-window' },
    { label: 'Why Chatbots Differ', id: 'chatbots' },
    { label: 'Business Applications', id: 'business' },
    { label: 'The Road Ahead', id: 'road-ahead' },
  ];
  const tags = ['Generative AI', 'LLM', 'Transformer', 'NLP', 'ChatGPT', 'Deep Learning', 'RAG', 'Context Window', 'Tokenization'];
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const observers = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navH = document.querySelector('.navbar')?.offsetHeight || 60;
    const top = el.getBoundingClientRect().top + window.scrollY - navH - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <aside className="article-sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">In this article</div>
        {sections.map(({ label, id }) => (
          <button
            key={id}
            className={`toc-link${activeId === id ? ' active' : ''}`}
            onClick={() => scrollTo(id)}
            aria-label={`Jump to section: ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Topics</div>
        <div className="tags-list">
          {tags.map((t) => (
            <span key={t} className="tag-chip">{t}</span>
          ))}
        </div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Publication</div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          The AI Brief &mdash; March 5, 2026<br />
          <strong style={{ color: 'var(--text-primary)' }}>Category:</strong> Deep Dive<br />
          <strong style={{ color: 'var(--text-primary)' }}>Reading time:</strong> 12 min
        </p>
      </div>
    </aside>
  );
}

// ── Engagement Toolbar ────────────────────────────────────────────────
function EngagementToolbar({ likes, hasLiked, onLike, commentsCount, onScrollToComments }) {
  return (
    <div className="engagement-toolbar" role="toolbar" aria-label="Article actions">
      <button
        id="like-btn"
        className={`eng-action${hasLiked ? ' liked' : ''}`}
        onClick={onLike}
        aria-label="Like this article"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {likes.toLocaleString()} {hasLiked ? 'Liked' : 'Like'}
      </button>
      <div className="eng-separator" />
      <button
        id="comments-btn"
        className="eng-action"
        onClick={onScrollToComments}
        aria-label="Jump to comments"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {commentsCount} Comment{commentsCount !== 1 ? 's' : ''}
      </button>
      <div className="eng-separator" />
      <button
        id="share-btn"
        className="eng-action"
        onClick={() => navigator.share?.({ title: 'How Generative AI Works', url: window.location.href })}
        aria-label="Share article"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share
      </button>
    </div>
  );
}

// ── Comment Form ──────────────────────────────────────────────────────
function CommentForm({ onSubmit, loading }) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    const ok = await onSubmit({ author, content });
    if (ok) setContent('');
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit} id="comment-form">
      <div className="form-row">
        <label className="form-label" htmlFor="author-input">Name</label>
        <input
          id="author-input"
          className="form-input"
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={60}
          required
        />
      </div>
      <div className="form-row">
        <label className="form-label" htmlFor="comment-input">Comment</label>
        <textarea
          id="comment-input"
          className="form-textarea"
          placeholder="Share your thoughts, questions, or insights on generative AI..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          required
        />
      </div>
      <div className="form-footer">
        <span className="char-count">{content.length} / 1000</span>
        <button
          type="submit"
          className="btn-submit"
          id="submit-comment-btn"
          disabled={loading || !author.trim() || !content.trim()}
        >
          {loading ? 'Posting…' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}

// ── Comment Card ──────────────────────────────────────────────────────
function CommentCard({ comment, sessionId }) {
  const [likes, setLikes] = useState(comment.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const initials = comment.author.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLike = async () => {
    try {
      const res = await axios.post(`${API_BASE}/comments/${comment._id}/like`, { sessionId });
      setLikes(res.data.likes);
      setHasLiked(res.data.hasLiked);
    } catch { /* noop */ }
  };

  return (
    <div className="comment-card anim-up">
      <div className="comment-meta">
        <div className="comment-author-info">
          <div className="comment-avatar" style={{ background: comment.avatar || '#0055a5' }}>
            {initials}
          </div>
          <div>
            <div className="comment-name">{comment.author}</div>
            <div className="comment-date">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
        <button
          className={`comment-like-btn${hasLiked ? ' liked' : ''}`}
          onClick={handleLike}
          aria-label="Like comment"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {likes > 0 && <span>{likes}</span>}
        </button>
      </div>
      <p className="comment-body">{comment.content}</p>
    </div>
  );
}

// ── Comments Section ──────────────────────────────────────────────────
function CommentsSection({ sessionId, commentsCount, setCommentsCount }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, msg: '' });

  const showToast = (msg) => {
    setToast({ visible: true, msg });
    setTimeout(() => setToast({ visible: false, msg: '' }), 3000);
  };

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/comments`);
      setComments(res.data);
      setCommentsCount(res.data.length);
    } catch {
      showToast('Could not load comments. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [setCommentsCount]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleSubmit = async ({ author, content }) => {
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/comments`, { author, content });
      setComments((prev) => [res.data, ...prev]);
      setCommentsCount((c) => c + 1);
      showToast('Comment posted successfully.');
      return true;
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to post. Please try again.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="comments-wrap" id="comments">
        <div className="comments-inner">
          <h2 className="comments-heading">
            Comments
            <span className="comments-count-badge">{commentsCount}</span>
          </h2>
          <p className="comments-subtext">
            We&apos;d love to hear your thoughts. Spam and promotional comments will be removed.
          </p>

          <CommentForm onSubmit={handleSubmit} loading={submitting} />

          {loading ? (
            <div className="loading-wrap">
              <div className="spinner" />
              Loading comments…
            </div>
          ) : comments.length === 0 ? (
            <div className="empty-comments">
              Be the first to leave a comment on this article.
            </div>
          ) : (
            <div className="comments-list">
              {comments.map((c) => (
                <CommentCard key={c._id} comment={c} sessionId={sessionId} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className={`toast${toast.visible ? ' show' : ''}`}>{toast.msg}</div>
    </>
  );
}

// ── Root App ──────────────────────────────────────────────────────────
export default function App() {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const sessionId = getSessionId();

  useEffect(() => {
    const init = async () => {
      try {
        const [stats, likeCheck] = await Promise.all([
          axios.get(`${API_BASE}/post/stats`),
          axios.post(`${API_BASE}/post/check-like`, { sessionId }),
        ]);
        setLikes(stats.data.likes);
        setCommentsCount(stats.data.comments);
        setHasLiked(likeCheck.data.hasLiked);
      } catch { /* server offline */ }
    };
    init();
  }, [sessionId]);

  const handleLike = async () => {
    try {
      const res = await axios.post(`${API_BASE}/post/like`, { sessionId });
      setLikes(res.data.likes);
      setHasLiked(res.data.hasLiked);
    } catch { /* noop */ }
  };

  const scrollToComments = () =>
    document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <ReadingProgress />
      <Navbar />

      <main>
        <ArticleHeader likes={likes} commentsCount={commentsCount} />

        <div className="article-layout">
          <ArticleBody />
          <Sidebar />
        </div>

        <EngagementToolbar
          likes={likes}
          hasLiked={hasLiked}
          onLike={handleLike}
          commentsCount={commentsCount}
          onScrollToComments={scrollToComments}
        />

        <CommentsSection
          sessionId={sessionId}
          commentsCount={commentsCount}
          setCommentsCount={setCommentsCount}
        />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">The AI Brief</div>
          <p className="footer-text">
            Exploring artificial intelligence from theory to practice. &copy; {new Date().getFullYear()} The AI Brief.
          </p>
        </div>
      </footer>
    </>
  );
}
