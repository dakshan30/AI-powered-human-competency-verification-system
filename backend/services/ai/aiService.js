const {
  getAIProvider,
} = require(
  "./providers/providerFactory"
);

/*
====================================
GENERATE AI RESPONSE
====================================
*/

exports.generateAIResponse =
  async ({
    systemPrompt = "",

    userPrompt = "",
  }) => {
    try {
      /*
      VALIDATION
      */

      if (!userPrompt) {
        throw new Error(
          "User prompt is required"
        );
      }

      /*
      PROVIDER
      */

      const provider =
        getAIProvider();

      /*
      FINAL PROMPT
      */

      const finalPrompt = `
SYSTEM:
${systemPrompt}

USER:
${userPrompt}
`;

      /*
      RESPONSE
      */

      const response =
        await provider.generateContent(
          finalPrompt
        );

      return response;
    } catch (error) {
      console.log(
        "AI Service Error:",
        error.message
      );

      throw new Error(
        "AI response generation failed"
      );
    }
  };