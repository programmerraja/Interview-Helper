import Form from "./Form";
import Question from "./Question";

function PrintableArea({
  onEditForm,
  formValues,
  questions,
  setQuestions,
  generateSpecficQuestionTopic,
}) {
  return (
    <div className="App print_wrapper">
      <Form onEditForm={onEditForm} formValues={formValues} />
      <Question
        questions={questions}
        setQuestions={setQuestions}
        generateSpecficQuestionTopic={generateSpecficQuestionTopic}
      />
    </div>
  );
}

export default PrintableArea;
