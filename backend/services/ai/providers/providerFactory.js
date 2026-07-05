const geminiProvider =
  require("./geminiProvider");

exports.getAIProvider =
  () => {
    return geminiProvider;
  };