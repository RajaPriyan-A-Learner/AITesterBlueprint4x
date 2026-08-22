/*
 * Reusable resume-generation template.
 *
 * HOW TO USE THIS FILE:
 * Copy it, then fill in the CONTENT section at the bottom with the specific
 * person's tailored resume content for one job description. The helpers
 * above (colors, r/hl text runs, heading/bullet/stat builders) implement the
 * visual style in ../references/style_guide.md — don't rewrite them.
 *
 * Key convention: use r("text") for unchanged/original content, and
 * hl("text") for anything added or reworded specifically to match the JD.
 * hl() renders with a yellow highlight so the user can audit every change.
 *
 * Run with: node build_resume.js
 * Then verify visually — see SKILL.md Step 6 (convert to PDF, render pages,
 * check for overflow) before presenting the file to the user.
 */

const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  LevelFormat, convertInchesToTwip, VerticalAlign, HighlightColor,
} = require("docx");

// ---- style constants (see references/style_guide.md) ----
const NAVY = "1F3864";
const SLATE = "44546A";
const LIGHTBG = "EEF1F6";
const TEXT = "222222";
const FONT = "Calibri";

// ---- text run helpers ----
// r() = plain/unchanged text. hl() = tailored/added text (yellow highlight).
function r(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: 20, color: TEXT, ...opts });
}
function hl(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: 20, color: TEXT, highlight: HighlightColor.YELLOW, ...opts });
}

// ---- structural helpers ----
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

// Simple one-run bullet (no highlight). For mixed plain+highlighted bullets,
// build the Paragraph inline with numbering: {reference:"bullets", level:0}
// and a children array mixing r(...) and hl(...) calls — see the Pearson
// example in the conversation history this skill was built from.
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

function statCell(number, label) {
  return new TableCell({
    width: { size: 20, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: LIGHTBG },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 120, bottom: 120, left: 60, right: 60 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "D0D5DD" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "D0D5DD" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "D0D5DD" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "D0D5DD" },
    },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [new TextRun({ text: number, bold: true, size: 26, color: NAVY, font: FONT })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, size: 14, color: SLATE, font: FONT, bold: true })] }),
    ],
  });
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

// ---------------------------------------------------------------------
// CONTENT — replace everything below with the specific tailored resume.
// This is a minimal skeleton showing the expected shape; follow
// references/style_guide.md for full section order and conventions.
// ---------------------------------------------------------------------

const doc = new Document({
  numbering: numberingConfig(),
  sections: [
    {
      properties: { page: { margin: { top: 620, bottom: 620, left: 620, right: 620 } } },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 30 },
          children: [new TextRun({ text: "FULL NAME", bold: true, size: 36, color: NAVY, font: FONT })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: "Title Line · Tailored Headline · Third Descriptor", bold: true, size: 22, color: SLATE, font: FONT })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 160 },
          children: [new TextRun({ text: "phone   \u00B7   email   \u00B7   location   \u00B7   linkedin", size: 18, color: TEXT, font: FONT })],
        }),

        heading("Professional Summary"),
        new Paragraph({ spacing: { after: 80 }, children: [r("Fill in — mirror JD phrasing where honestly true, wrapped in hl().")] }),

        heading("Core Technical Skills"),
        skillLine("Category One", [r("skill \u00B7 skill \u00B7 "), hl("newly surfaced JD-matching skill")]),

        heading("Professional Experience"),
        roleHeader("Job Title", "Company", "Start \u2013 End"),
        roleSubline("One-line context for this role/program."),
        bulletLine("", "A rewritten bullet mirroring JD language where true — build inline with r()/hl() mix for partial highlights."),

        heading("Certifications"),
        heading("Education"),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  require("fs").writeFileSync("./output_resume.docx", buf);
  console.log("written");
});

module.exports = { r, hl, heading, bullet, bulletLine, roleHeader, roleSubline, statCell, skillLine, numberingConfig, NAVY, SLATE, LIGHTBG, TEXT, FONT };
