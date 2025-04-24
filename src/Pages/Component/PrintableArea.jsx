import { memo } from "react";
import PropTypes from "prop-types";
import Form from "./Form";
import QuestionComponent from "./Question";

const PrintableArea = memo(({
  onEditForm,
  formValues,
  questions,
  setQuestions,
  generateSpecificQuestionTopic,
}) => {
  return (
    <div className="App print_wrapper">
      <Form onEditForm={onEditForm} formValues={formValues} />
      <QuestionComponent
        questions={questions}
        setQuestions={setQuestions}
        generateSpecificQuestionTopic={generateSpecificQuestionTopic}
      />
    </div>
  );
});

PrintableArea.propTypes = {
  onEditForm: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  questions: PropTypes.object.isRequired,
  setQuestions: PropTypes.func.isRequired,
  generateSpecificQuestionTopic: PropTypes.func.isRequired
};

export default PrintableArea;
