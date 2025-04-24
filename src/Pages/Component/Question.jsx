import { useEffect, useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { PLAN_NAME, STORAGE_KEYS } from "../Home";
import useLocalStorage from "../../hooks/useLocalStorage";

const QuestionComponent = memo(({ setQuestions, questions, generateSpecificQuestionTopic }) => {
  return (
    <div className="container mt-4 w-100">
      <div className="row px-4">
        {Object.keys(questions).map((topic) => (
          <TopicSection
            key={topic}
            topic={topic}
            questions={questions}
            setQuestions={setQuestions}
            generateSpecificQuestionTopic={generateSpecificQuestionTopic}
          />
        ))}
      </div>
      <div className="row px-4">
        <FeedbackForm />
      </div>
    </div>
  );
});

QuestionComponent.propTypes = {
  setQuestions: PropTypes.func.isRequired,
  questions: PropTypes.object.isRequired,
  generateSpecificQuestionTopic: PropTypes.func.isRequired
};

// Topic section component
const TopicSection = memo(({
  topic,
  questions,
  setQuestions,
  generateSpecificQuestionTopic,
}) => {
  const handleGenerate = useCallback(() => generateSpecificQuestionTopic(topic), [generateSpecificQuestionTopic, topic]);
  const handleRemove = useCallback(() => generateSpecificQuestionTopic(topic, true), [generateSpecificQuestionTopic, topic]);

  return (
    <div className="topic-section">
      <div className="d-flex">
        <p>{topic}</p>
        {topic !== "Others" && PLAN_NAME !== "FREE" && (
          <div className="d-flex align-items-center ignorePDF">
            <button className="btn btn-link ignorePDF" onClick={handleGenerate}>
              <div className="reloadSingle"></div>
            </button>
            <button className="btn btn-link text-danger" onClick={handleRemove}>
              <i className="fa crossIcon ignorePDF" aria-hidden="true"></i>
            </button>
          </div>
        )}
      </div>
      <QuestionList
        topic={topic}
        questions={questions}
        setQuestions={setQuestions}
      />
    </div>
  );
});

TopicSection.propTypes = {
  topic: PropTypes.string.isRequired,
  questions: PropTypes.object.isRequired,
  setQuestions: PropTypes.func.isRequired,
  generateSpecificQuestionTopic: PropTypes.func.isRequired
};

const QuestionList = memo(({ topic, questions, setQuestions }) => {
  const [currentQuestions, setCurrentQuestions] = useState(
    questions[topic] || []
  );
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    setCurrentQuestions(questions[topic] || []);
  }, [questions, topic]);

  // Add a new question
  const addQuestion = useCallback((event, input) => {
    if (event.key === "Enter" && input.value.trim()) {
      const updatedQuestions = [...currentQuestions, input.value.trim()];
      setCurrentQuestions(updatedQuestions);
      setQuestions({ ...questions, [topic]: updatedQuestions });
      setNewQuestion("");
    }
  }, [currentQuestions, questions, setQuestions, topic]);

  const removeQuestion = useCallback((index) => {
    const updatedQuestions = currentQuestions.filter((_, i) => i !== index);
    setCurrentQuestions(updatedQuestions);
    setQuestions({ ...questions, [topic]: updatedQuestions });
  }, [currentQuestions, questions, setQuestions, topic]);

  const handleInputChange = useCallback((e) => {
    setNewQuestion(e.target.value);
  }, []);

  return (
    <div>
      <ol>
        {currentQuestions.map((question, index) => (
          <li key={index}>
            {topic === "ProblemSolving" ? (
              <span dangerouslySetInnerHTML={{ __html: question }}></span>
            ) : (
              <span>{question}</span>
            )}
            <button
              className="btn btn-link text-danger"
              onClick={() => removeQuestion(index)}
              aria-label="Remove question"
            >
              <i className="fa crossIcon ignorePDF">&#x2717;</i>
            </button>
          </li>
        ))}
      </ol>
      <input
        className="ignorePDF"
        type="text"
        placeholder="Write your question and press enter"
        onKeyDown={(e) => addQuestion(e, e.target)}
        value={newQuestion}
        onChange={handleInputChange}
        aria-label="Add new question"
      />
    </div>
  );
});

QuestionList.propTypes = {
  topic: PropTypes.string.isRequired,
  questions: PropTypes.object.isRequired,
  setQuestions: PropTypes.func.isRequired
};

const FeedbackForm = memo(() => {
  const [feedbacks, setFeedbacks] = useLocalStorage(STORAGE_KEYS.FEEDBACK, []);
  const [newFeedback, setNewFeedback] = useLocalStorage("feedbackNew", "");

  const addFeedback = useCallback((event, input) => {
    if (event.key === "Enter" && input.value.trim()) {
      const updatedFeedbacks = [...feedbacks, input.value.trim()];
      setFeedbacks(updatedFeedbacks);
      setNewFeedback("");
    }
  }, [feedbacks, setFeedbacks, setNewFeedback]);

  const removeFeedback = useCallback((index) => {
    const updatedFeedbacks = feedbacks.filter((_, i) => i !== index);
    setFeedbacks(updatedFeedbacks);
  }, [feedbacks, setFeedbacks]);

  const handleInputChange = useCallback((e) => {
    setNewFeedback(e.target.value);
  }, [setNewFeedback]);

  return (
    <div>
      <p>Feedback:</p>
      <ol>
        {feedbacks.map((feedback, index) => (
          <li key={index}>
            {feedback}
            <button
              className="btn btn-link text-danger"
              onClick={() => removeFeedback(index)}
              aria-label="Remove feedback"
            >
              <i className="fa crossIcon ignorePDF">&#x2717;</i>
            </button>
          </li>
        ))}
      </ol>
      <input
        type="text"
        placeholder="Write your feedback and press enter"
        onKeyDown={(e) => addFeedback(e, e.target)}
        value={newFeedback}
        onChange={handleInputChange}
        aria-label="Add new feedback"
      />
    </div>
  );
});

export default QuestionComponent;
