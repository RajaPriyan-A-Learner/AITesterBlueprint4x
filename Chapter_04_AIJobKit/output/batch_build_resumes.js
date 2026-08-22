const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, LevelFormat, convertInchesToTwip, VerticalAlign, HighlightColor } = require("docx");

const NAVY = "1F3864";
const SLATE = "44546A";
const LIGHTBG = "EEF1F6";
const TEXT = "222222";
const FONT = "Calibri";

function r(text, opts = {}) { return new TextRun({ text, font: FONT, size: 20, color: TEXT, ...opts }); }
function hl(text, opts = {}) { return new TextRun({ text, font: FONT, size: 20, color: TEXT, highlight: HighlightColor.YELLOW, ...opts }); }

function heading(text) {
  return new Paragraph({
    spacing: { before: 240, after: 100 },
    border: { bottom: { color: NAVY, space: 2, style: BorderStyle.SINGLE, size: 6 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: NAVY, size: 21, font: FONT, characterSpacing: 10 })],
  });
}

function bullet(children, level = 0) {
  return new Paragraph({ numbering: { reference: "bullets", level }, spacing: { after: 40 }, children });
}

function bulletLine(boldLead, rest) {
  const children = [];
  if (boldLead) children.push(r(boldLead, { bold: true }));
  children.push(r(rest));
  return bullet(children);
}

function roleHeader(title, company, dates) {
  return new Paragraph({
    spacing: { before: 200, after: 20 },
    tabStops: [{ type: "right", position: convertInchesToTwip(6.5) }],
    children: [
      new TextRun({ text: title, bold: true, size: 22, color: NAVY, font: FONT }),
      new TextRun({ text: `  |  ${company}`, bold: true, size: 22, color: SLATE, font: FONT }),
      new TextRun({ text: `\t${dates}`, italics: true, size: 20, color: SLATE, font: FONT }),
    ],
  });
}

function roleSubline(text) {
  return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text, italics: true, size: 19, color: SLATE, font: FONT })] });
}

function skillLine(label, children) {
  return new Paragraph({ spacing: { after: 70 }, children: [r(label + ": ", { bold: true, color: NAVY }), ...children] });
}

function numberingConfig() {
  return {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 260, hanging: 200 } } } }],
      },
    ],
  };
}

function buildResume(companyName, roleShort, adjustments) {
  const doc = new Document({
    numbering: numberingConfig(),
    sections: [
      {
        properties: { page: { margin: { top: 620, bottom: 620, left: 620, right: 620 } } },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 30 },
            children: [new TextRun({ text: "RAJAPRIYAN KRISHNASAMY SUBRAMANIYAN", bold: true, size: 36, color: NAVY, font: FONT })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: adjustments.headline
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
            children: [new TextRun({ text: "+91 90927 64887   \u00B7   rajapriyan.krishnaswamy@gmail.com   \u00B7   Chennai, India   \u00B7   linkedin.com/in/rajapriyan-subramaniyan", size: 18, color: TEXT, font: FONT })],
          }),

          heading("Professional Summary"),
          new Paragraph({ spacing: { after: 80 }, children: adjustments.summary }),

          heading("Core Technical Skills"),
          skillLine("Automation & Testing", adjustments.skills.automation),
          skillLine("Languages, APIs & Data", adjustments.skills.languages),
          skillLine("CI/CD & Infrastructure", adjustments.skills.cicd),
          skillLine("QA Strategy & Domain", adjustments.skills.domain),
          skillLine("AI-Augmented Engineering", adjustments.skills.ai),

          heading("AI-Augmented QA Engineering - Differentiator Projects"),
          bulletLine("BDD Auto-Generator (LangGraph + Claude API): ", "Converts PDF functional specifications directly into executable SpecFlow .feature files, removing manual scenario authoring from new-feature intake and standardising BDD scenario quality across squads."),
          bulletLine("E-Commerce Test Automation Framework - github.com/RajaPriyan-A-Learner/UIAutomation_Csharp_Selenium: ", "POM + SpecFlow BDD covering product search, cart, checkout and payment; 95% code coverage, zero-flakiness via retry logic; wired into GitHub Actions CI with a Dockerized Selenium Grid."),
          bulletLine("Banking API Test Automation Suite: ", "RestSharp framework covering 200+ microservice endpoints with JSON schema validation and JMeter benchmarking; wired into the Azure DevOps CD pipeline, cutting API defect leakage by 50%."),

          heading("Professional Experience"),
          roleHeader("Lead SDET | Automation Architect", "Virtusa Consulting Services", "Nov 2023 \u2013 Present"),
          roleSubline("PMI Learning Management System & Education Provider Portal - 1M+ certification candidates, 500 training partners globally"),
          ...adjustments.virtusaBullets.map(b => bullet(b)),
          
          roleHeader("Senior SDET", "Virtusa Consulting Services", "Nov 2021 \u2013 Nov 2023"),
          roleSubline("PMI Career Navigator & PMI Kickoff - 2M+ daily active users, personalised career development and onboarding platform"),
          bulletLine("", "Cut manual testing effort by 60%, automating 150+ critical workflows spanning payment gateway, career personalisation engine and contract validation."),
          bulletLine("", "Partnered with developers, product owners and BAs during sprint planning to define testability requirements and acceptance criteria, embedding quality ownership from sprint day one."),
          bulletLine("", "Led post-incident RCA sessions and rolled out prevention strategies, reducing production defect leakage by 35%."),

          roleHeader("Automation Test Engineer", "HCL Technologies Ltd.", "Aug 2018 \u2013 Nov 2021"),
          roleSubline("CBA Home Lending Application & 5 Serviceability Calculators - Australia's largest bank, full mortgage lifecycle & APRA/ASIC compliance"),
          ...adjustments.hclBullets.map(b => bullet(b)),

          heading("Key Achievements"),
          bulletLine("", "Awarded Automation Champion, Q2 2024, for driving 95% automation coverage across enterprise PMI EdTech platforms."),
          bulletLine("", "Migrated the legacy framework to a modern SpecFlow BDD architecture with zero downtime and no regression in test coverage."),
          bulletLine("", "Delivered 4 internal training sessions on scalable test automation frameworks to 50+ engineers, raising team-wide automation standards."),

          heading("Certifications"),
          new Paragraph({ spacing: { after: 20 }, children: [r("ISTQB CTFL \u00B7 Microsoft Certified: Azure Data Fundamentals (DP-900) \u00B7 GenAI Assisted Engineer \u00B7 Python for Agentic AI \u00B7 Agentic AI Engineer \u00B7 AI Native Engineer (Claude Code)")] }),

          heading("Education"),
          new Paragraph({ children: [r("B.E. Electronics & Communication Engineering \u2014 Anna University, Chennai \u2014 2018")] }),
        ],
      },
    ],
  });

  Packer.toBuffer(doc).then((buf) => {
    fs.writeFileSync(`./Resume_${companyName}_${roleShort}.docx`, buf);
    console.log(`Generated Resume_${companyName}_${roleShort}.docx`);
  });
}

// 1. Woolworths Group (Senior Automation Engineer C#)
buildResume("Woolworths", "SrAutomationEng", {
  headline: [
    r("Senior Quality Engineer \u00B7 "), hl("Cloud-Native Architecture"), r(" \u00B7 Quality Engineering Leader")
  ],
  summary: [
    hl("Senior Quality Engineer"), r(" and Lead SDET with "), hl("7+ years scaling scalable test automation frameworks"), 
    r(" and QA strategy across the full SDLC. Deeply proficient in "), hl("C#"), r(" and modern automation tools like "), 
    hl("Playwright and Selenium"), r(". Took UI test coverage from 60% to 95%, reached 100% API coverage, cut production defects by 45%, and lifted release velocity by 40%. Champions "), 
    hl("shift-left testing practices"), r(", embeds quality ownership at sprint day one, and leverages "), hl("Agentic Engineering"), r(" workflows to ship robust, reliable software solutions aligned with business objectives.")
  ],
  skills: {
    automation: [r("Selenium WebDriver \u00B7 "), hl("Playwright (TypeScript)"), r(" \u00B7 Appium \u00B7 SpecFlow BDD \u00B7 Page Object Model \u00B7 Hybrid Framework \u00B7 NUnit \u00B7 xUnit \u00B7 MSTest \u00B7 TestNG \u00B7 TDD/BDD")],
    languages: [hl("C# \u00B7 .NET Core/.NET 6-8"), r(" \u00B7 Python \u00B7 SQL \u00B7 RestSharp \u00B7 RESTful API \u00B7 Contract Testing \u00B7 JSON Schema Validation \u00B7 Postman \u00B7 Swagger \u00B7 Microservices \u00B7 BFF Layer")],
    cicd: [r("Azure DevOps \u00B7 GitHub Actions \u00B7 Jenkins \u00B7 Docker \u00B7 Kubernetes \u00B7 Selenium Grid \u00B7 BrowserStack \u00B7 JMeter \u00B7 Continuous Testing \u00B7 "), hl("GCP/AWS/Azure environments")],
    domain: [hl("Shift-Left Testing"), r(" \u00B7 In-Sprint Automation \u00B7 Regression/Smoke/E2E/Cross-Browser/Mobile \u00B7 JIRA \u00B7 Financial Services \u00B7 EdTech \u00B7 Retail Banking")],
    ai: [hl("AI Coding Agents \u00B7 Agentic Workflows"), r(" \u00B7 Claude Code \u00B7 GitHub Copilot \u00B7 ADE \u00B7 OpenSpec \u00B7 LangGraph \u00B7 Claude API \u00B7 Prompt Engineering")]
  },
  virtusaBullets: [
    [r("Led 5 automation engineers across 3 Agile Scrum squads - set coding standards, "), hl("championed test automation via code reviews"), r(", mentored junior SDETs - cutting team code defects by 30%.")],
    [hl("Collaborated closely with Product Managers, BAs, and engineers"), r(" during sprint planning to shape acceptance criteria, and translate user stories into comprehensive test scenarios.")],
    [hl("Architected a highly scalable C# / Selenium WebDriver / SpecFlow BDD framework"), r(" with 4-5-worker parallel execution, cutting regression runtime by 65%.")],
    [r("Expanded coverage from 60% \u2192 95% UI and to 100% API, "), hl("integrating automated suites into CI/CD pipelines"), r(" (+40% velocity) and reducing post-release defects by 45%.")],
    [r("Deployed a Dockerized Selenium Grid on Kubernetes - 3x execution capacity, 25% lower infrastructure cost - and raised suite stability from 78% \u2192 96%.")],
    [hl("Leveraged AI coding agents and agentic workflows"), r(" with Claude Code, GitHub Copilot and ADE to accelerate test creation, framework maintenance, and engineering productivity; piloted "), hl("Playwright"), r(" for cross-browser testing.")]
  ],
  hclBullets: [
    [hl("Designed and built scalable test automation frameworks"), r(" containing a 250+ scenario regression suite in C# / Selenium / SpecFlow BDD across the Home Lending Application and 5 Serviceability Calculators.")],
    [r("Designed BDD/Gherkin test cases for HEM benchmarks, APRA interest rate buffer - zero-defect mortgage decisions across 24 production releases.")],
    [hl("Drove continuous improvement"), r(" by cutting regression execution time by 90% (50 hrs \u2192 5 hrs per release cycle), sustaining a 90%+ pass rate with zero regression-related incidents.")]
  ]
});

// 2. TEKsystems (Senior Quality Assurance Engineer)
buildResume("TEKsystems", "SrQAEng", {
  headline: [
    r("Senior Quality Engineer \u00B7 Automation Architect \u00B7 "), hl("UI & API Automation Expert")
  ],
  summary: [
    r("Senior Quality Engineering Leader and Lead SDET with 8+ years scaling enterprise test automation across the full SDLC. Took UI test coverage from 60% to 95%, reached 100% API coverage, and cut production defects by 45%. Deeply proficient in test automation using C# and "), 
    hl("JavaScript/TypeScript with Playwright"), r(" for both UI and API layers. Proven track record of "), hl("integrating automated suites into CI/CD pipelines"), r(", conducting rigorous "), hl("JSON/XML API validation"), r(", and driving a culture of automation within Agile/Scrum teams.")
  ],
  skills: {
    automation: [r("Selenium WebDriver \u00B7 Appium \u00B7 "), hl("Playwright (TypeScript/JavaScript)"), r(" \u00B7 SpecFlow BDD \u00B7 Page Object Model \u00B7 Hybrid Framework \u00B7 NUnit \u00B7 xUnit \u00B7 TestNG \u00B7 TDD/BDD")],
    languages: [r("C# \u00B7 "), hl("TypeScript \u00B7 JavaScript"), r(" \u00B7 Python \u00B7 SQL \u00B7 RestSharp \u00B7 "), hl("RESTful API & SOAP Services"), r(" \u00B7 Contract Testing \u00B7 "), hl("JSON/XML API Schema Validation"), r(" \u00B7 Postman \u00B7 Swagger")],
    cicd: [r("Azure DevOps \u00B7 GitHub Actions \u00B7 Jenkins \u00B7 Docker \u00B7 Kubernetes \u00B7 Selenium Grid \u00B7 BrowserStack \u00B7 JMeter \u00B7 "), hl("CI/CD Pipeline Integration")],
    domain: [r("Risk-Based Testing \u00B7 Shift-Left \u00B7 In-Sprint Automation \u00B7 Regression/Smoke/E2E/Cross-Browser/Mobile \u00B7 "), hl("Agile/Scrum Ceremonies"), r(" \u00B7 JIRA \u00B7 Financial Services \u00B7 EdTech")],
    ai: [r("Claude Code \u00B7 GitHub Copilot \u00B7 ADE \u00B7 OpenSpec \u00B7 LangGraph \u00B7 Claude API \u00B7 Prompt Engineering \u00B7 Context Engineering \u00B7 Harness Engineering")]
  },
  virtusaBullets: [
    [r("Led 5 automation engineers across 3 Agile Scrum squads - "), hl("coached other testers"), r(", set coding standards, ran reviews - cutting team code defects by 30%.")],
    [hl("Owned quality assurance across frontend and backend layers"), r(", defining test strategy with risk-based prioritisation and quality gates.")],
    [r("Architected a C# / Selenium WebDriver / SpecFlow BDD hybrid framework with 4-5-worker parallel execution, "), hl("keeping automated regression suites stable, reliable, and low-noise"), r(" (65% runtime reduction).")],
    [hl("Converted high-value manual regression cases into automated coverage"), r(" (60% \u2192 95% UI, 100% API), "), hl("integrated automated suites into CI/CD pipelines"), r(", and reduced post-release defects by 45%.")],
    [r("Deployed a Dockerized Selenium Grid on Kubernetes - 3x execution capacity, 25% lower infrastructure cost - and raised suite stability from 78% \u2192 96%.")],
    [r("Applied AI-augmented engineering to accelerate test scaffolding; piloted "), hl("Playwright using TypeScript/JavaScript"), r(" alongside the Selenium stack for cross-browser and "), hl("API UI automation"), r(" to evaluate framework modernisation.")]
  ],
  hclBullets: [
    [r("Built and maintained a 250+ scenario regression suite in C# / Selenium WebDriver / SpecFlow BDD / NUnit across the Home Lending Application and all 5 Serviceability Calculator variants.")],
    [hl("Identified, logged, prioritized, and tracked defects to closure in JIRA"), r("; reproduced issues and partnered with developers on root cause analysis for mortgage decisions across 24 production releases.")],
    [r("Cut regression execution time by 90% (50 hrs \u2192 5 hrs per release cycle), sustaining a 90%+ pass rate with zero regression-related incidents.")]
  ]
});

// 3. Pearson (Senior Quality Assurance Engineer)
buildResume("Pearson", "SrQAEng", {
  headline: [
    r("Senior Quality Engineer \u00B7 Automation Architect \u00B7 "), hl("EdTech QA Specialist")
  ],
  summary: [
    r("Senior Quality Engineering Leader and Lead SDET with 8+ years scaling enterprise test automation across the full SDLC, specializing in "), hl("EdTech platforms"), r(". Took UI test coverage from 60% to 95%, reached 100% API coverage, and cut production defects by 45%. Expertise in "), 
    hl("functional testing, regression testing, API testing, and Test Automation"), r(" using tools like "), hl("Selenium, Postman, and SpecFlow (C# alternative to Cucumber/Java)"), r(". Collaborates with cross-functional teams to embed quality throughout the delivery lifecycle.")
  ],
  skills: {
    automation: [hl("Selenium WebDriver \u00B7 SpecFlow BDD (equivalent to Cucumber)"), r(" \u00B7 Appium \u00B7 Playwright \u00B7 Page Object Model \u00B7 Hybrid Framework \u00B7 NUnit \u00B7 xUnit \u00B7 TestNG \u00B7 TDD/BDD")],
    languages: [hl("C# / .NET (equivalent to Java)"), r(" \u00B7 Python \u00B7 SQL \u00B7 RestSharp \u00B7 "), hl("API Testing"), r(" \u00B7 Contract Testing \u00B7 JSON Schema Validation \u00B7 "), hl("Postman"), r(" \u00B7 Swagger")],
    cicd: [r("Azure DevOps \u00B7 GitHub Actions \u00B7 Jenkins \u00B7 Docker \u00B7 Kubernetes \u00B7 Selenium Grid \u00B7 BrowserStack \u00B7 JMeter \u00B7 Continuous Testing")],
    domain: [hl("Functional Testing \u00B7 Regression Testing \u00B7 Agile Delivery Frameworks / Scrum"), r(" \u00B7 Shift-Left \u00B7 In-Sprint Automation \u00B7 "), hl("EdTech / LMS"), r(" \u00B7 Test Management Tools (JIRA)")],
    ai: [r("Claude Code \u00B7 GitHub Copilot \u00B7 ADE \u00B7 OpenSpec \u00B7 LangGraph \u00B7 Claude API \u00B7 Prompt Engineering \u00B7 Context Engineering \u00B7 Harness Engineering")]
  },
  virtusaBullets: [
    [hl("Led a small team of 5 QA engineers"), r(" across 3 Agile Scrum squads - set coding standards, ran reviews, mentored junior SDETs - cutting team code defects by 30%.")],
    [r("Defined QA methodologies and test strategy with risk-based prioritisation and entry/exit criteria across UI, API, performance, accessibility and mobile layers.")],
    [hl("Developed test cases, automated test scripts, and test data"), r("; architected a C# / "), hl("Selenium WebDriver / SpecFlow"), r(" hybrid framework with 4-5-worker parallel execution, cutting regression runtime by 65%.")],
    [hl("Executed testing activities, including functional, regression, and integration testing"), r(" (expanded coverage from 60% \u2192 95% UI and 100% API), reducing post-release defects by 45%.")],
    [r("Deployed a Dockerized Selenium Grid on Kubernetes - 3x execution capacity, 25% lower infrastructure cost - and raised suite stability from 78% \u2192 96% through flaky-test root cause analysis.")],
    [hl("Participated in agile ceremonies (stand-ups, sprint planning, retrospectives)"), r(" to champion quality and continuous improvement; implemented Azure DevOps quality gates blocking 12+ critical defects.")]
  ],
  hclBullets: [
    [r("Built and maintained a 250+ scenario regression suite in C# / Selenium WebDriver / SpecFlow BDD / NUnit across the Home Lending Application and all 5 Serviceability Calculator variants.")],
    [hl("Collaborated with developers and product owners during refinement to ensure clear, testable acceptance criteria"), r(" for APRA interest rate buffers - zero-defect mortgage decisions across 24 production releases.")],
    [r("Cut regression execution time by 90% (50 hrs \u2192 5 hrs per release cycle), sustaining a 90%+ pass rate with zero regression-related incidents.")]
  ]
});

// 4. Pine Labs (SDET III)
buildResume("PineLabs", "SDET_III", {
  headline: [
    r("SDET III \u00B7 Automation Architect \u00B7 "), hl("Fintech & Payments QA Specialist")
  ],
  summary: [
    r("Senior Quality Engineering Leader and Lead SDET with 8+ years scaling enterprise test automation, specializing in "), hl("Financial Services, Payments, and Banking workflows"), r(". Took UI test coverage from 60% to 95%, reached 100% API coverage, and cut production defects by 45%. Deeply proficient in "), 
    hl("API testing, automation mindset, and utilizing AI aggressively"), r(" to generate test cases and build tooling. Experienced in catching edge cases in complex transaction flows and building robust CI/CD regression suites using Appium (Flutter-adjacent mobile automation).")
  ],
  skills: {
    automation: [r("Selenium WebDriver \u00B7 "), hl("Appium (Mobile Automation)"), r(" \u00B7 Playwright \u00B7 SpecFlow BDD \u00B7 Page Object Model \u00B7 Hybrid Framework \u00B7 NUnit \u00B7 xUnit \u00B7 TestNG \u00B7 TDD/BDD")],
    languages: [r("C# \u00B7 .NET Core \u00B7 Python \u00B7 SQL \u00B7 RestSharp \u00B7 "), hl("API Testing (REST clients, Mocking)"), r(" \u00B7 Contract Testing \u00B7 JSON Schema Validation \u00B7 "), hl("Postman"), r(" \u00B7 Swagger \u00B7 Microservices")],
    cicd: [hl("CI/CD Integration (Azure DevOps, GitHub Actions, Jenkins)"), r(" \u00B7 Docker \u00B7 Kubernetes \u00B7 Selenium Grid \u00B7 "), hl("Device Farms (BrowserStack)"), r(" \u00B7 JMeter \u00B7 Continuous Testing")],
    domain: [r("Risk-Based Testing \u00B7 Shift-Left \u00B7 "), hl("Payments / Fintech Domain"), r(" \u00B7 "), hl("Reconciliation & Transaction Lifecycles"), r(" \u00B7 JIRA \u00B7 Retail Banking \u00B7 Mortgage Lending")],
    ai: [hl("AI Workflows (Claude, Copilot for test generation, code, tooling)"), r(" \u00B7 ADE \u00B7 OpenSpec \u00B7 LangGraph \u00B7 Claude API \u00B7 Prompt Engineering \u00B7 Context Engineering")]
  },
  virtusaBullets: [
    [hl("Owned product quality end-to-end"), r(" across 3 Agile Scrum squads - set coding standards, ran reviews, mentored junior SDETs - cutting team code defects by 30%.")],
    [hl("Tested at the API layer"), r(" by architecting a RestSharp framework covering 200+ microservice endpoints with JSON schema validation, catching state-machine bugs and cutting API defect leakage by 50%.")],
    [hl("Built and maintained automated regression suites"), r(" with 4-5-worker parallel execution, cutting regression runtime by 65% and wired into the Azure DevOps CI/CD pipeline.")],
    [hl("Used AI aggressively"), r(" via Claude Code, GitHub Copilot and ADE to accelerate test scaffolding, code review and framework maintenance; built a BDD Auto-Generator (LangGraph + Claude API).")],
    [r("Built an Appium + C# mobile framework from scratch on "), hl("BrowserStack"), r(" (the team's first mobile automation capability) and automated accessibility coverage.")],
    [hl("Collaborated directly with product and engineering"), r(" during sprint planning to define testability requirements, pushing back on ambiguous requirements and embedding quality ownership from sprint day one.")]
  ],
  hclBullets: [
    [r("Built and maintained a 250+ scenario regression suite in C# / Selenium WebDriver / SpecFlow BDD / NUnit across the Home Lending Application ("), hl("complex financial/banking domain"), r(").")],
    [hl("Hunted edge cases in financial transaction flows"), r(", designing BDD test cases for HEM benchmarks and APRA interest rate buffers - zero-defect mortgage decisions across 24 production releases.")],
    [r("Cut regression execution time by 90% (50 hrs \u2192 5 hrs per release cycle), sustaining a 90%+ pass rate with zero regression-related incidents.")]
  ]
});

