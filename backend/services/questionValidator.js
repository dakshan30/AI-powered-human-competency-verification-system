/*
====================================
VALIDATE QUESTIONS
====================================
*/

exports.validateQuestions =
  (questions) => {
    if (
      !Array.isArray(
        questions
      )
    ) {
      throw new Error(
        "Questions must be an array"
      );
    }

    const validated =
      questions.filter(
        (question) => {
          return (
            question.question &&
            question.difficulty &&
            question.skill
            
          );
        }
      );

    return validated;
  };