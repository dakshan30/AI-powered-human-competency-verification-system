/*
====================================
PARSE AI RESPONSE
====================================
*/

exports.parseAIResponse =
  (content) => {
    try {
      /*
      CLEAN RESPONSE
      */

      let cleaned =
        content.trim();

      /*
      REMOVE MARKDOWN
      */

      cleaned =
        cleaned.replace(
          /```json/g,
          ""
        );

      cleaned =
        cleaned.replace(
          /```/g,
          ""
        );

      /*
      FIND JSON START
      */

      const start =
        cleaned.indexOf("{");

      const end =
        cleaned.lastIndexOf(
          "}"
        );

      /*
      EXTRACT JSON
      */

      cleaned =
        cleaned.substring(
          start,
          end + 1
        );

      /*
      PARSE
      */

      return JSON.parse(
        cleaned
      );
    } catch (error) {
      console.log(
        "AI Parse Error:",
        error
      );

      throw new Error(
        "Invalid AI response"
      );
    }
  };