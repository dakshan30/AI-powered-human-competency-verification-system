/*
====================================
REPORTS SYSTEM INITIALIZATION
====================================
*/

const fs =
  require("fs");

const path =
  require("path");

/*
REQUIRED DIRECTORIES
*/

const requiredDirs = [
  "reports",
  "archives",
  "exports",
];

/*
INITIALIZE REPORTS SYSTEM
*/

const initializeReportsSystem =
  () => {
    console.log(
      "Initializing reports system..."
    );

    const backendDir =
      path.join(
        __dirname,
        ".."
      );

    requiredDirs.forEach(
      (dir) => {
        const dirPath =
          path.join(
            backendDir,
            dir
          );

        if (
          !fs.existsSync(
            dirPath
          )
        ) {
          fs.mkdirSync(
            dirPath,
            {
              recursive:
                true,
            }
          );

          console.log(
            `✓ Created ${dir} directory`
          );
        } else {
          console.log(
            `✓ ${dir} directory exists`
          );
        }
      }
    );

    /*
    CLEANUP OLD EXPORTS
    */

    const exportsDir =
      path.join(
        backendDir,
        "exports"
      );

    if (
      fs.existsSync(
        exportsDir
      )
    ) {
      const files =
        fs.readdirSync(
          exportsDir
        );

      let cleaned = 0;

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

          const ageHours =
            (Date.now() -
              stats.mtimeMs) /
            (1000 * 60 * 60);

          if (
            ageHours > 24
          ) {
            fs.unlinkSync(
              filePath
            );

            cleaned++;
          }
        }
      );

      if (cleaned > 0) {
        console.log(
          `✓ Cleaned ${cleaned} old export files`
        );
      }
    }

    console.log(
      "Reports system initialized successfully!"
    );
  };

module.exports =
  initializeReportsSystem;
