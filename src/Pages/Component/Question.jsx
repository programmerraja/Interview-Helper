import { useEffect, useState } from "react";
import { PLAN_NAME } from "../Home";

function Form({ setQuestions, questions, generateSpecficQuestionTopic }) {
  return (
    <div className="container mt-4 w-100">
      <div className="row px-4">
        {Object.keys(questions).map((topic) => (
          <TopicSection
            key={topic}
            topic={topic}
            questions={questions}
            setQuestions={setQuestions}
            generateSpecficQuestionTopic={generateSpecficQuestionTopic}
          />
        ))}
      </div>
      <div className="row px-4">
        <FeedBackForm />
      </div>
    </div>
  );
}

function TopicSection({
  topic,
  questions,
  setQuestions,
  generateSpecficQuestionTopic,
}) {
  const handleGenerate = () => generateSpecficQuestionTopic(topic);
  const handleRemove = () => generateSpecficQuestionTopic(topic, true);

  return (
    <div className="topic-section">
      <div className="d-flex">
        <p>{topic}</p>
        {topic !== "Others" && PLAN_NAME !== "FREE" && (
          <div className="d-flex align-items-center ignorePDF">
            <button className="btn btn-link ignorePDF" onClick={handleGenerate}>
              <div class="reloadSingle"></div>
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
}

function QuestionList({ topic, questions, setQuestions }) {
  const [currentQuestions, setCurrentQuestions] = useState(
    questions[topic] || []
  );
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    setCurrentQuestions(questions[topic] || []);
  }, [questions, topic]);

  const addQuestion = (event, input) => {
    if (event.key === "Enter" && input.value.trim()) {
      const updatedQuestions = [...currentQuestions, input.value];
      setCurrentQuestions(updatedQuestions);
      setQuestions({ ...questions, [topic]: updatedQuestions });
      setNewQuestion("");
    }
  };

  const removeQuestion = (index) => {
    const updatedQuestions = currentQuestions.filter((_, i) => i !== index);
    setCurrentQuestions(updatedQuestions);
    setQuestions({ ...questions, [topic]: updatedQuestions });
  };

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
        onChange={(e) => setNewQuestion(e.target.value)}
      />
    </div>
  );
}

function FeedBackForm() {
  const [feedbacks, setFeedbacks] = useState(() => {
    return JSON.parse(window.localStorage.getItem("feedback") || "[]");
  });
  const [newFeedback, setNewFeedback] = useState(() => {
    return window.localStorage.getItem("feedbackNew") || "";
  });

  const addFeedback = (event, input) => {
    if (event.key === "Enter" && input.value.trim()) {
      const updatedFeedbacks = [...feedbacks, input.value];
      setFeedbacks(updatedFeedbacks);
      setNewFeedback("");
      window.localStorage.setItem("feedback", JSON.stringify(updatedFeedbacks));
      window.localStorage.setItem("feedbackNew", "");
    }
  };

  const removeFeedback = (index) => {
    const updatedFeedbacks = feedbacks.filter((_, i) => i !== index);
    setFeedbacks(updatedFeedbacks);
    window.localStorage.setItem("feedback", JSON.stringify(updatedFeedbacks));
  };

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
            >
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
          </li>
        ))}
      </ol>
      <input
        type="text"
        placeholder="Write your feedback and press enter"
        onKeyDown={(e) => addFeedback(e, e.target)}
        value={newFeedback}
        onChange={(e) => setNewFeedback(e.target.value)}
      />
    </div>
  );
}

export default Form;
