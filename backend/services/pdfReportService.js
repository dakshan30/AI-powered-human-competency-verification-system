const PDFDocument =
  require("pdfkit");

const fs =
  require("fs");

const path =
  require("path");

const crypto =
  require("crypto");

/*
====================================
UTILITY FUNCTIONS
====================================
*/

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

const formatDate =
  (value) => {
    if (!value) {
      return "N/A";
    }

    return new Date(
      value
    ).toLocaleDateString(
      "en-IN",
      {
        dateStyle:
          "short",
      }
    );
  };

const getScoreColor =
  (score) => {
    score = clampScore(
      score
    );
    if (score >= 80)
      return "#10B981";
    if (score >= 60)
      return "#F59E0B";
    return "#EF4444";
  };

const getRecommendationColor =
  (
    recommendation
  ) => {
    const rec = String(
      recommendation
    )
      .toUpperCase()
      .trim();

    if (
      rec === "STRONG_HIRE"
    ) {
      return "#10B981";
    }
    if (rec === "HIRE") {
      return "#3B82F6";
    }
    if (rec === "HOLD") {
      return "#F59E0B";
    }
    return "#EF4444";
  };

const drawHeader =
  (doc, title) => {
    const pageWidth =
      doc.page.width;
    const pageHeight =
      doc.page.height;

    /*
    BACKGROUND
    */

    doc
      .rect(
        0,
        0,
        pageWidth,
        80
      )
      .fill("#0F172A");

    /*
    TITLE
    */

    doc
      .fillColor("#F8FAFC")
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(
        title,
        50,
        25
      );

    /*
    FOOTER INFO
    */

    doc
      .fillColor("#CBD5E1")
      .font("Helvetica")
      .fontSize(9)
      .text(
        `Generated: ${formatDateTime(
          new Date()
        )} | Page ${doc.bufferedPageRange().count}`,
        50,
        55
      );

    /*
    LINE
    */

    doc
      .moveTo(
        50,
        doc.page.height -
          30
      )
      .lineTo(
        doc.page.width -
          50,
        doc.page.height -
          30
      )
      .lineWidth(0.5)
      .strokeColor(
        "#E5E7EB"
      )
      .stroke();
  };

const drawPageFooter =
  (doc) => {
    const pageHeight =
      doc.page.height;

    doc
      .fillColor("#9CA3AF")
      .font("Helvetica")
      .fontSize(8)
      .text(
        "AI Powered Resume Competency Verification System | Confidential",
        50,
        pageHeight -
          25,
        {
          align:
            "center",
        }
      );

    doc
      .text(
        `Page ${doc.bufferedPageRange().count}`,
        50,
        pageHeight -
          15,
        {
          align:
            "center",
        }
      );
  };

const drawSectionTitle =
  (doc, title) => {
    doc
      .moveDown(0.8)
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#0F172A")
      .text(title);

    doc
      .moveTo(50, doc.y + 4)
      .lineTo(
        doc.page.width -
          50,
        doc.y + 4
      )
      .lineWidth(1.5)
      .strokeColor(
        "#3B82F6"
      )
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
          .fontSize(10)
          .fillColor("#111827")
          .text(
            safeText(value)
          );
      }
    );
  };

const drawBulletList =
  (
    doc,
    items,
    emptyText
  ) => {
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

    items.forEach(
      (item) => {
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("#111827")
          .text(
            `• ${safeText(
              item
            )}`,
            {
              indent: 10,
            }
          );
      }
    );
  };

const drawScoreBar =
  (doc, score) => {
    const score_val =
      clampScore(score);
    const barWidth = 200;
    const barHeight = 15;

    const startX = 50;
    const startY = doc.y;

    /*
    BACKGROUND
    */

    doc
      .rect(
        startX,
        startY,
        barWidth,
        barHeight
      )
      .fillColor(
        "#E5E7EB"
      )
      .fill();

    /*
    FILLED
    */

    const fillWidth =
      (score_val /
        100) *
      barWidth;

    doc
      .rect(
        startX,
        startY,
        fillWidth,
        barHeight
      )
      .fillColor(
        getScoreColor(
          score_val
        )
      )
      .fill();

    /*
    TEXT
    */

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#111827")
      .text(
        `${score_val}%`,
        startX +
          barWidth +
          10,
        startY + 2
      );

    doc.moveDown(1.5);
  };

/*
====================================
GENERATE PDF REPORT (PRODUCTION)
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
        try {
          /*
          VALIDATION
          */

          if (
            !reportData ||
            typeof reportData !==
              "object"
          ) {
            throw new Error(
              "Invalid report data"
            );
          }

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
              `${reportName}-${crypto
                .randomBytes(4)
                .toString(
                  "hex"
                )}.pdf`
            );

          /*
          DOC SETUP
          */

          const doc =
            new PDFDocument(
              {
                margin: 50,
                bufferPages:
                  true,
              }
            );

          /*
          STREAM
          */

          const stream =
            fs.createWriteStream(
              filePath
            );

          doc.pipe(stream);

          /*
          PAGE 1: COVER
          */

          drawHeader(
            doc,
            "AI Competency Report"
          );

          doc.moveDown(2);

          drawSectionTitle(
            doc,
            "Executive Summary"
          );

          /*
          CANDIDATE INFO
          */

          drawKeyValueGrid(
            doc,
            [
              [
                "Candidate",
                reportData
                  .candidate
                  ?.name,
              ],
              [
                "Email",
                reportData
                  .candidate
                  ?.email,
              ],
              [
                "Interview ID",
                reportData
                  .interviewId,
              ],
              [
                "Completed",
                formatDateTime(
                  reportData
                    .interviewMeta
                    ?.completedAt
                ),
              ],
              [
                "Report ID",
                crypto
                  .randomBytes(
                    6
                  )
                  .toString(
                    "hex"
                  )
                  .toUpperCase(),
              ],
            ]
          );

          doc.moveDown(1);

          /*
          RECOMMENDATION CARD
          */

          const rec =
            reportData
              .recommendation;
          const recColor =
            getRecommendationColor(
              rec?.key
            );

          doc
            .rect(
              50,
              doc.y,
              doc.page.width -
                100,
              60
            )
            .stroke(
              recColor
            );

          doc
            .font(
              "Helvetica-Bold"
            )
            .fontSize(12)
            .fillColor(
              recColor
            )
            .text(
              "RECOMMENDATION",
              60,
              doc.y + 10
            );

          doc
            .font(
              "Helvetica-Bold"
            )
            .fontSize(14)
            .fillColor(
              "#111827"
            )
            .text(
              rec?.label ||
                "HOLD",
              60,
              doc.y + 5
            );

          doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor(
              "#6B7280"
            )
            .text(
              rec?.reason ||
                "N/A",
              60,
              doc.y + 5,
              {
                width: 400,
              }
            );

          doc.moveDown(3);

          /*
          KEY METRICS
          */

          drawSectionTitle(
            doc,
            "Key Metrics"
          );

          doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor("#111827")
            .text(
              "Competency Score"
            );

          drawScoreBar(
            doc,
            reportData
              .scores
              ?.competency
          );

          doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor("#111827")
            .text(
              "Trust Score"
            );

          drawScoreBar(
            doc,
            reportData
              .trustScore
          );

          doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor("#111827")
            .text(
              "ATS Score"
            );

          drawScoreBar(
            doc,
            reportData
              .resume
              ?.atsScore
          );

          doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#6B7280")
            .text(
              `Rank: ${
                reportData
                  .candidateRank
              }`,
              50,
              doc.y + 5
            );

          doc.moveDown(1.5);

          drawPageFooter(
            doc
          );

          /*
          PAGE 2: DETAILED SCORES
          */

          doc.addPage();

          drawHeader(
            doc,
            "Competency Analysis"
          );

          doc.moveDown(2);

          drawSectionTitle(
            doc,
            "Score Breakdown"
          );

          /*
          SCORE GRID
          */

          const scoreKeys =
            Object.keys(
              reportData
                .scores || {}
            ).filter(
              (k) =>
                k !==
                "competency"
            );

          scoreKeys
            .forEach(
              (key) => {
                const score =
                  reportData
                    .scores[
                    key
                  ];

                doc
                  .font(
                    "Helvetica-Bold"
                  )
                  .fontSize(11)
                  .fillColor(
                    "#111827"
                  )
                  .text(
                    key
                      .charAt(0)
                      .toUpperCase() +
                      key.slice(
                        1
                      )
                  );

                drawScoreBar(
                  doc,
                  score
                );
              }
            );

          /*
          RESUME INTEL
          */

          drawSectionTitle(
            doc,
            "Resume Intelligence"
          );

          drawKeyValueGrid(
            doc,
            [
              [
                "Detected Role",
                reportData
                  .resume
                  ?.detectedRole,
              ],
              [
                "Experience",
                reportData
                  .resume
                  ?.experienceLevel,
              ],
              [
                "Top Skills",
                (
                  reportData
                    .resume
                    ?.skills ||
                  []
                )
                  .slice(
                    0,
                    8
                  )
                  .join(", ") ||
                  "N/A",
              ],
            ]
          );

          doc.moveDown(1);

          /*
          INTEGRITY
          */

          drawSectionTitle(
            doc,
            "Integrity Check"
          );

          const integrity =
            reportData.integrity;

          drawKeyValueGrid(
            doc,
            [
              [
                "Warnings",
                integrity
                  ?.warnings || 0,
              ],
              [
                "Tab Switches",
                integrity
                  ?.tabSwitches ||
                  0,
              ],
              [
                "Fullscreen Violations",
                integrity
                  ?.fullscreenViolations ||
                  0,
              ],
            ]
          );

          if (
            integrity?.flags
              ?.length > 0
          ) {
            doc.moveDown(
              0.5
            );

            doc
              .font(
                "Helvetica-Bold"
              )
              .fontSize(10)
              .fillColor(
                "#475569"
              )
              .text(
                "Flags: "
              );

            drawBulletList(
              doc,
              integrity.flags
            );
          }

          drawPageFooter(
            doc
          );

          /*
          PAGE 3: ANALYTICS
          */

          doc.addPage();

          drawHeader(
            doc,
            "Analytics & Insights"
          );

          doc.moveDown(2);

          drawSectionTitle(
            doc,
            "Strengths"
          );

          drawBulletList(
            doc,
            reportData
              .analytics
              ?.strengths,
            "No notable strengths recorded."
          );

          doc.moveDown(
            1
          );

          drawSectionTitle(
            doc,
            "Improvement Areas"
          );

          drawBulletList(
            doc,
            reportData
              .analytics
              ?.improvements,
            "No areas for improvement."
          );

          doc.moveDown(
            1
          );

          /*
          IMPROVEMENT PLAN
          */

          if (
            reportData
              .improvementPlan
              ?.length > 0
          ) {
            drawSectionTitle(
              doc,
              "Recommended Improvement Plan"
            );

            drawBulletList(
              doc,
              reportData
                .improvementPlan
            );

            doc.moveDown(
              1
            );
          }

          drawPageFooter(
            doc
          );

          /*
          PAGE 4: INTERVIEW QA
          */

          if (
            reportData
              .answers
              ?.length > 0
          ) {
            doc.addPage();

            drawHeader(
              doc,
              "Interview Q&A Analysis"
            );

            doc.moveDown(
              2
            );

            reportData
              .answers
              .slice(
                0,
                10
              )
              .forEach(
                (
                  answer,
                  index
                ) => {
                  if (
                    doc.y >
                    doc.page
                      .height -
                      100
                  ) {
                    doc.addPage();

                    drawHeader(
                      doc,
                      "Interview Q&A Analysis (continued)"
                    );

                    doc.moveDown(
                      2
                    );
                  }

                  doc
                    .font(
                      "Helvetica-Bold"
                    )
                    .fontSize(11)
                    .fillColor(
                      "#111827"
                    )
                    .text(
                      `Q${index + 1}: ${
                        answer
                          .question
                          ?.substring(
                            0,
                            100
                          ) ||
                        "N/A"
                      }...`
                    );

                  doc
                    .font(
                      "Helvetica"
                    )
                    .fontSize(10)
                    .fillColor(
                      "#6B7280"
                    )
                    .text(
                      `Answer: ${
                        answer
                          .answer
                          ?.substring(
                            0,
                            150
                          ) ||
                        "N/A"
                      }...`,
                      {
                        indent:
                          10,
                      }
                    );

                  doc
                    .font(
                      "Helvetica"
                    )
                    .fontSize(10)
                    .fillColor(
                      "#111827"
                    )
                    .text(
                      `Score: ${
                        answer
                          .evaluation
                          ?.overallScore ||
                        0
                      }%`,
                      {
                        indent:
                          10,
                      }
                    );

                  doc.moveDown(
                    1
                  );

                  drawPageFooter(
                    doc
                  );
                }
              );
          }

          /*
          FINAL PAGE: FOOTER
          */

          doc.moveDown(
            3
          );

          doc
            .font(
              "Helvetica"
            )
            .fontSize(9)
            .fillColor(
              "#6B7280"
            )
            .text(
              "This report is generated by the AI Powered Resume Competency Verification System.",
              {
                align:
                  "center",
              }
            );

          doc
            .text(
              "For more information, contact support@company.com",
              {
                align:
                  "center",
              }
            );

          doc
            .text(
              `Report Hash: ${crypto
                .createHash(
                  "sha256"
                )
                .update(
                  JSON.stringify(
                    reportData
                  )
                )
                .digest(
                  "hex"
                )
                .substring(
                  0,
                  16
                )}`,
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
        } catch (
          error
        ) {
          reject(error);
        }
      }
    );
  };
