/*
====================================
REPORT EXPORT SERVICE
====================================
*/

const { Parser } =
  require("json2csv");

const XLSX =
  require("xlsx");

const fs =
  require("fs");

const path =
  require("path");

const crypto =
  require("crypto");

/*
====================================
EXPORT TO CSV
====================================
*/

exports.exportReportsToCSV =
  async (
    reports,
    fileName =
      "reports"
  ) => {
    return new Promise(
      (
        resolve,
        reject
      ) => {
        try {
          /*
          PREPARE DATA
          */

          const csvData =
            reports.map(
              (report) => ({
                "Interview ID":
                  report._id,
                "Candidate Name":
                  report
                    .candidateName,
                "Candidate Email":
                  report
                    .candidateEmail,
                "Interview Date":
                  new Date(
                    report
                      .interviewDate
                  ).toLocaleDateString(),
                "Competency Score":
                  `${
                    report.competency
                  }%`,
                "ATS Score":
                  `${
                    report.atsScore
                  }%`,
                "Trust Score":
                  `${
                    report.trustScore
                  }%`,
                "Recommendation":
                  report
                    .recommendation,
                "Status":
                  report.status,
              })
            );

          /*
          PARSE CSV
          */

          const parser =
            new Parser();

          const csv =
            parser.parse(
              csvData
            );

          /*
          FILE PATH
          */

          const exportsDir =
            path.join(
              __dirname,
              "../exports"
            );

          if (
            !fs.existsSync(
              exportsDir
            )
          ) {
            fs.mkdirSync(
              exportsDir,
              {
                recursive:
                  true,
              }
            );
          }

          const filePath =
            path.join(
              exportsDir,
              `${fileName}-${crypto
                .randomBytes(4)
                .toString(
                  "hex"
                )}.csv`
            );

          /*
          WRITE FILE
          */

          fs.writeFileSync(
            filePath,
            csv
          );

          resolve(filePath);
        } catch (
          error
        ) {
          reject(error);
        }
      }
    );
  };

/*
====================================
EXPORT TO EXCEL
====================================
*/

exports.exportReportsToExcel =
  async (
    reports,
    fileName =
      "reports"
  ) => {
    return new Promise(
      (
        resolve,
        reject
      ) => {
        try {
          /*
          PREPARE DATA
          */

          const excelData =
            reports.map(
              (report) => ({
                "Interview ID":
                  report._id,
                "Candidate Name":
                  report
                    .candidateName,
                "Email":
                  report
                    .candidateEmail,
                "Date":
                  new Date(
                    report
                      .interviewDate
                  ).toLocaleDateString(),
                "Competency %":
                  Number(
                    report.competency
                  ),
                "ATS %":
                  Number(
                    report.atsScore
                  ),
                "Trust %":
                  Number(
                    report.trustScore
                  ),
                "Recommendation":
                  report
                    .recommendation,
                "Status":
                  report.status,
              })
            );

          /*
          CREATE WORKSHEET
          */

          const ws =
            XLSX.utils.json_to_sheet(
              excelData
            );

          /*
          SET COLUMN WIDTHS
          */

          ws["!cols"] = [
            {
              wch: 20,
            },
            {
              wch: 25,
            },
            {
              wch: 25,
            },
            {
              wch: 12,
            },
            {
              wch: 12,
            },
            {
              wch: 10,
            },
            {
              wch: 10,
            },
            {
              wch: 15,
            },
            {
              wch: 12,
            },
          ];

          /*
          CREATE WORKBOOK
          */

          const wb =
            XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(
            wb,
            ws,
            "Reports"
          );

          /*
          FILE PATH
          */

          const exportsDir =
            path.join(
              __dirname,
              "../exports"
            );

          if (
            !fs.existsSync(
              exportsDir
            )
          ) {
            fs.mkdirSync(
              exportsDir,
              {
                recursive:
                  true,
              }
            );
          }

          const filePath =
            path.join(
              exportsDir,
              `${fileName}-${crypto
                .randomBytes(4)
                .toString(
                  "hex"
                )}.xlsx`
            );

          /*
          WRITE FILE
          */

          XLSX.writeFile(
            wb,
            filePath
          );

          resolve(filePath);
        } catch (
          error
        ) {
          reject(error);
        }
      }
    );
  };

/*
====================================
EXPORT SINGLE REPORT
====================================
*/

exports.exportSingleReportToCSV =
  async (
    report,
    fileName =
      "report"
  ) => {
    return new Promise(
      (
        resolve,
        reject
      ) => {
        try {
          /*
          PREPARE DATA
          */

          const csvData = [
            [
              "Field",
              "Value",
            ],
            [
              "Interview ID",
              report._id,
            ],
            [
              "Candidate",
              report
                .candidateName,
            ],
            [
              "Email",
              report
                .candidateEmail,
            ],
            [
              "Date",
              new Date(
                report
                  .interviewDate
              ).toLocaleString(),
            ],
            [
              "Competency",
              `${
                report.competency
              }%`,
            ],
            [
              "ATS Score",
              `${
                report.atsScore
              }%`,
            ],
            [
              "Trust Score",
              `${
                report.trustScore
              }%`,
            ],
            [
              "Recommendation",
              report
                .recommendation,
            ],
            [
              "Status",
              report.status,
            ],
          ];

          const csv =
            csvData
              .map((row) =>
                row
                  .map(
                    (cell) =>
                      typeof cell ===
                      "string" &&
                      cell.includes(
                        ","
                      )
                        ? `"${cell}"`
                        : cell
                  )
                  .join(",")
              )
              .join("\n");

          /*
          FILE PATH
          */

          const exportsDir =
            path.join(
              __dirname,
              "../exports"
            );

          if (
            !fs.existsSync(
              exportsDir
            )
          ) {
            fs.mkdirSync(
              exportsDir,
              {
                recursive:
                  true,
              }
            );
          }

          const filePath =
            path.join(
              exportsDir,
              `${fileName}-${crypto
                .randomBytes(4)
                .toString(
                  "hex"
                )}.csv`
            );

          fs.writeFileSync(
            filePath,
            csv
          );

          resolve(filePath);
        } catch (
          error
        ) {
          reject(error);
        }
      }
    );
  };

/*
====================================
CLEAN OLD EXPORT FILES
====================================
*/

exports.cleanOldExports =
  (
    maxAgeHours = 24
  ) => {
    try {
      const exportsDir =
        path.join(
          __dirname,
          "../exports"
        );

      if (
        !fs.existsSync(
          exportsDir
        )
      ) {
        return 0;
      }

      const files =
        fs.readdirSync(
          exportsDir
        );

      let deleted = 0;

      const now =
        Date.now();

      files.forEach(
        (file) => {
          const filePath =
            path.join(
              exportsDir,
              file
            );

          const stats =
            fs.statSync(
              filePath
            );

          const age =
            (now -
              stats.mtimeMs) /
            (1000 * 60 * 60);

          if (
            age > maxAgeHours
          ) {
            fs.unlinkSync(
              filePath
            );

            deleted++;
          }
        }
      );

      return deleted;
    } catch (
      error
    ) {
      console.error(
        "Clean exports error:",
        error
      );

      return 0;
    }
  };
