/**
 * AI Service for AIJobTracker
 * Supports Local Ollama, Cloud Models (Gemini / OpenAI), Connection Testing, and Client-Side Fallback.
 */

const DEFAULT_SETTINGS = {
  provider: 'ollama', // 'ollama' | 'gemini' | 'openai'
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'gemma3:1b',
  cloudApiKey: '',
  cloudModel: 'gemini-1.5-flash',
};

export function getAISettings() {
  try {
    const saved = localStorage.getItem('jt-ai-settings');
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export function saveAISettings(settings) {
  localStorage.setItem('jt-ai-settings', JSON.stringify(settings));
}

const COMMON_TECH_KEYWORDS = [
  'javascript', 'typescript', 'react', 'next.js', 'vue', 'angular', 'node.js', 'express',
  'python', 'java', 'c#', '.net', 'golang', 'rust', 'c++', 'sql', 'postgresql', 'mongodb', 'redis',
  'selenium', 'playwright', 'cypress', 'appium', 'testng', 'junit', 'pytest', 'cucumber',
  'rest api', 'graphql', 'postman', 'restassured', 'jmeter', 'k6', 'gatling',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ci/cd', 'jenkins', 'github actions',
  'git', 'linux', 'microservices', 'kafka', 'rabbitmq', 'performance testing', 'security testing',
  'agile', 'scrum', 'jira', 'test planning', 'sdlc', 'stlc', 'automation framework', 'page object model'
];

/**
 * Test Local Ollama Connection
 */
export async function testOllamaConnection(url = 'http://localhost:11434', _model = 'gemma3:1b') {
  const start = performance.now();
  try {
    const cleanUrl = url.replace(/\/+$/, '');
    const tagsRes = await fetch(`${cleanUrl}/api/tags`, {
      signal: AbortSignal.timeout(4000),
    });

    if (!tagsRes.ok) {
      return { success: false, error: `Ollama returned status ${tagsRes.status}` };
    }

    const tagsData = await tagsRes.json();
    const installedModels = (tagsData.models || []).map((m) => m.name);
    const latency = Math.round(performance.now() - start);

    return {
      success: true,
      latency,
      models: installedModels,
      message: `Connected successfully! (${latency}ms) — Found ${installedModels.length} models.`,
    };
  } catch {
    return {
      success: false,
      error: `Could not connect to Ollama at ${url}. Ensure Ollama is running ('ollama serve').`,
    };
  }
}

/**
 * Test Cloud Model API Key (Gemini or OpenAI)
 */
export async function testCloudConnection(provider, apiKey, _model) {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, error: 'API Key cannot be empty.' };
  }

  const start = performance.now();
  try {
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const latency = Math.round(performance.now() - start);
        return {
          success: true,
          latency,
          message: `Gemini API Key Verified! (${latency}ms)`,
        };
      }
      const errData = await res.json();
      return { success: false, error: errData.error?.message || `Gemini API returned ${res.status}` };
    }

    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) {
        const latency = Math.round(performance.now() - start);
        return {
          success: true,
          latency,
          message: `OpenAI API Key Verified! (${latency}ms)`,
        };
      }
      const errData = await res.json();
      return { success: false, error: errData.error?.message || `OpenAI API returned ${res.status}` };
    }

    return { success: false, error: 'Unsupported cloud provider' };
  } catch (err) {
    return { success: false, error: err.message || 'Connection test failed.' };
  }
}

/**
 * Unified LLM Execution (Routes to Ollama or Cloud)
 */
export async function executeLLM(prompt) {
  const settings = getAISettings();

  // 1. Google Gemini Cloud
  if (settings.provider === 'gemini' && settings.cloudApiKey) {
    try {
      const modelName = settings.cloudModel || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${settings.cloudApiKey.trim()}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
      }
    } catch {
      // fallback
    }
  }

  // 2. OpenAI Cloud
  if (settings.provider === 'openai' && settings.cloudApiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.cloudApiKey.trim()}`,
        },
        body: JSON.stringify({
          model: settings.cloudModel || 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content || null;
      }
    } catch {
      // fallback
    }
  }

  // 3. Local Ollama (Default)
  try {
    const url = (settings.ollamaUrl || 'http://localhost:11434').replace(/\/+$/, '');
    const model = settings.ollamaModel || 'gemma3:1b';

    const res = await fetch(`${url}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
      signal: AbortSignal.timeout(7000),
    });

    if (res.ok) {
      const data = await res.json();
      return data.response;
    }
  } catch {
    // Fallback to client-side NLP
  }

  return null;
}

/**
 * Generate Custom Checklist Tasks Tailored to a Job
 */
export async function generateCustomChecklist(job) {
  const company = job.company || 'the target company';
  const role = job.role || 'Senior QA Engineer';
  const notes = job.notes || '';

  const prompt = `You are a career advisor. Create 5 specific, high-impact preparation and action tasks for applying to the role "${role}" at "${company}".
Role details/notes: "${notes}".
Return ONLY a valid JSON array of strings, for example:
[
  "Research ${company}'s core architecture & API products",
  "Tailor resume bullet points for ${role} keywords",
  "Build sample test automation framework demo on GitHub",
  "Prepare STAR behavioral answers for leadership questions",
  "Send follow-up LinkedIn message to recruiter after 5 days"
]`;

  const llmResult = await executeLLM(prompt);
  if (llmResult) {
    try {
      const match = llmResult.match(/\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => ({
            id: `ai_task_${Date.now()}_${idx}`,
            text: typeof item === 'string' ? item : item.text || String(item),
            done: false,
          }));
        }
      }
    } catch {
      // fallback
    }
  }

  // Smart Heuristic Fallback
  return [
    { id: `ai_task_${Date.now()}_1`, text: `Research ${company}'s tech stack & engineering blogs`, done: false },
    { id: `ai_task_${Date.now()}_2`, text: `Tailor resume highlights specifically for ${role}`, done: false },
    { id: `ai_task_${Date.now()}_3`, text: `Prepare 3 technical STAR stories on test automation & API testing`, done: false },
    { id: `ai_task_${Date.now()}_4`, text: `Connect with hiring manager or engineering lead at ${company}`, done: false },
    { id: `ai_task_${Date.now()}_5`, text: `Send follow-up note after 7 days if no response`, done: false },
  ];
}

/**
 * Parse raw Job Description text into structured JSON fields
 */
export async function parseJobDescription(jdText) {
  if (!jdText || !jdText.trim()) {
    throw new Error('Please paste job description text to parse.');
  }

  const prompt = `You are a career assistant. Parse this job description and return ONLY valid JSON with keys:
"company": string,
"role": string,
"salaryRange": string (e.g. "$120k-$150k" or "₹25-35 LPA" or ""),
"skills": string[] (top 6-10 keywords),
"summary": string (2 sentence overview).

Job Description:
${jdText.slice(0, 3000)}`;

  const llmResult = await executeLLM(prompt);
  if (llmResult) {
    try {
      const jsonMatch = llmResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          company: parsed.company || extractCompanyName(jdText),
          role: parsed.role || extractJobTitle(jdText),
          salaryRange: parsed.salaryRange || extractSalary(jdText),
          skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : extractKeywords(jdText),
          summary: parsed.summary || jdText.slice(0, 180) + '...',
        };
      }
    } catch {
      // Fallback
    }
  }

  // Client-side NLP extraction
  return {
    company: extractCompanyName(jdText),
    role: extractJobTitle(jdText),
    salaryRange: extractSalary(jdText),
    skills: extractKeywords(jdText),
    summary: extractSummary(jdText),
  };
}

/**
 * Calculate ATS Keyword Match Score between Job and Candidate Skills
 */
export function calculateATSScore(job, candidateKeywords = []) {
  const jdText = `${job.role || ''} ${job.company || ''} ${job.notes || ''}`.toLowerCase();
  const jobKeywords = extractKeywords(jdText);

  // Default candidate profile if none provided
  const candidatePool = candidateKeywords.length > 0
    ? candidateKeywords.map((k) => k.toLowerCase())
    : [
        'selenium', 'playwright', 'python', 'javascript', 'typescript', 'api testing',
        'postman', 'rest api', 'ci/cd', 'github actions', 'docker', 'git', 'sql',
        'test planning', 'agile', 'jira', 'performance testing', 'pytest'
      ];

  const matched = [];
  const missing = [];

  jobKeywords.forEach((kw) => {
    if (candidatePool.some((c) => c.includes(kw) || kw.includes(c))) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const total = jobKeywords.length || 1;
  const score = Math.min(100, Math.max(35, Math.round((matched.length / total) * 100)));

  const recommendations = [];
  if (missing.length > 0) {
    recommendations.push(`Add specific experience bullet points mentioning "${missing.slice(0, 3).join(', ')}" in your resume.`);
  }
  if (job.role && !candidatePool.some((c) => job.role.toLowerCase().includes(c))) {
    recommendations.push(`Align your resume headline with the exact title: "${job.role}".`);
  }
  recommendations.push('Quantify your QA metrics (e.g. "Reduced regression test execution time by 45% using automated CI/CD pipelines").');

  return {
    score,
    matched,
    missing,
    recommendations,
  };
}

/**
 * Generate 3 tailored outreach documents (Cover letter, LinkedIn note, Cold email)
 */
export async function generateOutreachMessages(job, candidateName = 'Candidate', tone = 'professional') {
  const company = job.company || 'the hiring team';
  const role = job.role || 'Senior Engineer';
  const resume = job.resumeUsed || 'QA / SDET Profile';

  const prompt = `Write 3 tailored outreach messages for applying to ${role} at ${company} with tone: ${tone}.
Return JSON format:
{
  "coverLetter": string (compelling 3-paragraph cover letter),
  "linkedInNote": string (under 280 characters for LinkedIn connection request),
  "coldEmail": string (subject line + concise cold email to hiring manager)
}`;

  const llmResult = await executeLLM(prompt);
  if (llmResult) {
    try {
      const match = llmResult.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch {
      // Fallback
    }
  }

  // High-converting templates
  const coverLetter = `Dear Hiring Team at ${company},

I am writing to express my strong enthusiasm for the ${role} position at ${company}. With a deep background in test automation, scalable QA architecture, and quality engineering, I have consistently accelerated release velocity while maintaining flawless product reliability.

In my recent work, I built comprehensive automated testing frameworks that cut test execution cycles by over 40% and caught critical edge cases prior to production deployments. I am particularly excited about ${company}'s culture and tech stack, and I am confident that my experience with modern automation tools and CI/CD pipelines will drive immediate value to your engineering team.

I would welcome the opportunity to discuss how my technical expertise and problem-solving skills align with your upcoming roadmap. Thank you for your time and consideration.

Sincerely,
${candidateName}`;

  const linkedInNote = `Hi there! I noticed the exciting ${role} opening at ${company}. With hands-on expertise in automation frameworks and scalable testing, I'd love to connect and learn more about your team's quality goals. Thanks!`;

  const coldEmail = `Subject: Application: ${role} - ${candidateName}

Hi ${company} Team,

I recently came across the ${role} opening at ${company} and wanted to reach out directly. 

With proven experience designing resilient test automation suites (Playwright, Selenium, API & CI/CD integration), I specialize in helping engineering teams ship high-velocity releases with zero regressions.

I've attached my resume (${resume}) for your review and would love 10 minutes to share how I can contribute to ${company}'s product quality.

Best regards,
${candidateName}`;

  return { coverLetter, linkedInNote, coldEmail };
}

// ----------------- Client-Side Regex Extraction Helpers -----------------

function extractCompanyName(text) {
  const atMatch = text.match(/(?:at|company|joining|about)\s+([A-Z][A-Za-z0-9&]{2,20})/i);
  if (atMatch) return atMatch[1];
  const firstLine = text.trim().split('\n')[0];
  if (firstLine && firstLine.length < 35 && !/job|developer|engineer|tester/i.test(firstLine)) {
    return firstLine.trim();
  }
  return 'Innovative Tech Corp';
}

function extractJobTitle(text) {
  const titlePatterns = [
    /(?:Senior|Lead|Staff|Principal|Junior)?\s*(?:QA|SDET|Software|Quality|Test|Frontend|Backend|Fullstack|DevOps)\s*(?:Engineer|Architect|Specialist|Lead|Developer|Analyst)/i,
    /(?:Software Development Engineer in Test|Automation Tester|Quality Assurance Engineer)/i
  ];
  for (const p of titlePatterns) {
    const m = text.match(p);
    if (m) return m[0].trim();
  }
  return 'Senior QA Engineer';
}

function extractSalary(text) {
  const m = text.match(/(?:[$₹€£]\s*\d+[\d,.]*(?:k|lpa|k\s*-\s*[$₹€£]?\d+k|lac|\s*-\s*[$₹€£]?\d+[\d,.]*)?|\d+\s*-\s*\d+\s*(?:LPA|k))/i);
  return m ? m[0].trim() : '';
}

function extractKeywords(text) {
  const lower = text.toLowerCase();
  const found = COMMON_TECH_KEYWORDS.filter((k) => lower.includes(k));
  return found.length > 0 ? found.slice(0, 8) : ['playwright', 'typescript', 'api testing', 'ci/cd', 'docker', 'selenium'];
}

function extractSummary(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.slice(0, 160) + (clean.length > 160 ? '...' : '');
}
