const PDFDocument =
  require("pdfkit");

const fs =
  require("fs");

const path =
  require("path");

const clampScore =
  (value) =>
    Math.max(
      0,
      Math.min(
        100,
        Number(value) || 0
      )
    );

const safeText =
  (value, fallback = "N/A") =>
    value && String(value).trim()
      ? String(value)
      : fallback;

const formatDateTime =
  (value) => {
    if (!value) {
      return "N/A";
    }

    return new Date(
      value
    ).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

const drawSectionTitle =
  (doc, title) => {
    doc
      .moveDown(0.8)
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor("#0F172A")
      .text(title);

    doc
      .moveTo(50, doc.y + 6)
      .lineTo(545, doc.y + 6)
      .lineWidth(1)
      .strokeColor("#D1D5DB")
      .stroke();

    doc.moveDown(0.8);
  };

const drawKeyValueGrid =
  (doc, entries) => {
    entries.forEach(
      ([label, value]) => {
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor("#475569")
          .text(
            `${label}: `,
            {
              continued:
                true,
            }
          )
          .font("Helvetica")
          .fillColor("#111827")
          .text(
            safeText(value)
          );
      }
    );
  };

const drawBulletList =
  (doc, items, emptyText) => {
    if (
      !items ||
      items.length === 0
    ) {
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#6B7280")
        .text(emptyText);

      return;
    }

    items.forEach((item) => {
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#111827")
        .text(
          `- ${safeText(item)}`,
          {
            indent: 10,
          }
        );
    });
  };

/*
====================================
GENERATE PDF REPORT
====================================
*/

exports.generatePDFReport =
  async (
    reportData,
    reportName
  ) => {
    return new Promise(
      (
        resolve,
        reject
      ) => {
        /*
        REPORT PATH
        */

        const reportsDir =
          path.join(
            __dirname,
            "../reports"
          );

        /*
        CREATE DIR
        */

        if (
          !fs.existsSync(
            reportsDir
          )
        ) {
          fs.mkdirSync(
            reportsDir,
            {
              recursive:
                true,
            }
          );
        }

        /*
        FILE PATH
        */

        const filePath =
          path.join(
            reportsDir,

            `${reportName}.pdf`
          );

        /*
        DOC
        */

        const doc =
          new PDFDocument({
            margin: 50,
          });

        /*
        STREAM
        */

        const stream =
          fs.createWriteStream(
            filePath
          );

        doc.pipe(stream);

        /*
        HEADER
        */

        doc
          .rect(
            0,
            0,
            doc.page.width,
            120
          )
          .fill("#0F172A");

        doc
          .fillColor("#F8FAFC")
          .font("Helvetica-Bold")
          .fontSize(24)
          .text(
            "AI Competency Report",
            50,
            42
          );

        doc
          .font("Helvetica")
          .fontSize(11)
          .fillColor("#CBD5E1")
          .text(
            "Enterprise interview assessment generated from live candidate, resume, and interview analytics.",
            50,
            78,
            {
              width: 430,
            }
          );

        doc
          .fillColor("#111827")
          .moveDown(3.2);

        drawSectionTitle(
          doc,
          "Executive Summary"
        );

        drawKeyValueGrid(doc, [
          [
            "Candidate",
            reportData
              .candidate?.name,
          ],
          [
            "Email",
            reportData
              .candidate?.email,
          ],
          [
            "Interview ID",
            reportData
              .interviewId,
          ],
          [
            "Completed At",
            formatDateTime(
              reportData
                .interviewMeta
                ?.completedAt
            ),
          ],
          [
            "Recommendation",
            reportData
              .recommendation
              ?.label,
          ],
          [
            "Trust Score",
            `${clampScore(
              reportData
                .trustScore
            )}%`,
          ],
          [
            "Candidate Rank",
            reportData
              .candidateRank,
          ],
          [
            "ATS Score",
            `${clampScore(
              reportData
                .resume
                ?.atsScore
            )}%`,
          ],
        ]);

        drawSectionTitle(
          doc,
          "Resume Intelligence"
        );

        drawKeyValueGrid(doc, [
          [
            "Detected Role",
            reportData
              .resume
              ?.detectedRole,
          ],
          [
            "Experience Level",
            reportData
              .resume
              ?.experienceLevel,
          ],
          [
            "Top Skills",
            (
              reportData
                .resume
                ?.skills || []
            )
              .slice(0, 12)
              .join(", ") ||
              "N/A",
          ],
        ]);

        drawSectionTitle(
          doc,
          "Competency Scores"
        );

        Object.entries(
          reportData.scores ||
            {}
        ).forEach(
          ([key, value]) => {
            doc
              .font("Helvetica-Bold")
              .fontSize(11)
              .fillColor("#111827")
              .text(
                `${key}: `,
                {
                  continued:
                    true,
                }
              )
              .font("Helvetica")
              .text(
                `${clampScore(
                  value
                )}%`
              );
          }
        );

        drawSectionTitle(
          doc,
          "Integrity Overview"
        );

        drawKeyValueGrid(doc, [
          [
            "Warnings",
            reportData
              .integrity
              ?.warnings,
          ],
          [
            "Tab Switches",
            reportData
              .integrity
              ?.tabSwitches,
          ],
          [
            "Fullscreen Violations",
            reportData
              .integrity
              ?.fullscreenViolations,
          ],
          [
            "Suspicious Activity Score",
            reportData
              .integrity
              ?.suspiciousActivityScore,
          ],
          [
            "Integrity Flags",
            (
              reportData
                .integrity
                ?.flags || []
            ).join(", ") ||
              "None",
          ],
        ]);

        drawSectionTitle(
          doc,
          "Strength Summary"
        );

        reportData.analytics.strengths.forEach(
          (
            strength
          ) => {
            doc.text(
              `• ${strength}`
            );
          }
        );

        /*
        IMPROVEMENTS
        */

        doc.moveDown();

        doc
          .fontSize(18)
          .text(
            "Improvement Areas"
          );

        reportData.analytics.improvements.forEach(
          (
            improvement
          ) => {
            doc.text(
              `• ${improvement}`
            );
          }
        );

        /*
        ANSWERS
        */

        doc.addPage();

        doc
          .fontSize(20)
          .text(
            "Interview Analysis"
          );

        doc.moveDown();

        reportData.answers.forEach(
          (
            answer,
            index
          ) => {
            doc
              .fontSize(14)
              .text(
                `Q${index + 1}: ${answer.question}`
              );

            doc.moveDown(
              0.3
            );

            doc
              .fontSize(11)
              .text(
                `Answer: ${answer.answer}`
              );

            doc.moveDown(
              0.3
            );

            doc.text(
              `Score: ${answer.evaluation.overallScore}%`
            );

            doc.text(
              `Feedback: ${answer.evaluation.feedback}`
            );

            doc.moveDown();
          }
        );

        /*
        FOOTER
        */

        doc.moveDown(2);

        doc
          .fontSize(10)
          .text(
            "Generated by AI Powered Resume Competency Verification System",
            {
              align:
                "center",
            }
          );

        /*
        FINALIZE
        */

        doc.end();

        stream.on(
          "finish",

          () => {
            resolve(
              filePath
            );
          }
        );

        stream.on(
          "error",

          reject
        );
      }
    );
  };
