/ backend/utils/csvExport.js
const json2csv = require('json2csv').parse;

const exportResponsesToCSV = (responses, formQuestions) => {
  try {
    if (!responses || responses.length === 0) {
      return '';
    }

    // Transform responses to flat structure
    const flattenedData = responses.map(response => {
      const flatResponse = {
        submittedAt: response.submittedAt,
        id: response._id
      };

      // Add answers as separate columns
      response.answers.forEach((answer, index) => {
        const question = formQuestions[index];
        const questionText = question ? question.text : `Question ${index + 1}`;
        flatResponse[questionText] = answer.value;
      });

      return flatResponse;
    });

    // Generate CSV
    const csv = json2csv(flattenedData);
    return csv;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export responses to CSV');
  }
};

module.exports = { exportResponsesToCSV };