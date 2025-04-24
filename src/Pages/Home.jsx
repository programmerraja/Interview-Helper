/* eslint-disable no-undef */
import { useEffect, useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import PrintableArea from "./Component/PrintableArea";
import { savePDF } from "@progress/kendo-react-pdf";
import leftArrow from "../leftArrow.png";
import QuestionJSON from "./Util/questions.json";
import useLocalStorage from "../hooks/useLocalStorage";
import { shuffleArray } from "../utils/arrayUtils";
import "../App.css";

// Constants
const QUESTIONS_EMPTY_STATE = {
  JS: [],
  React: [],
  Node: [],
  MongoDB: [],
  ProblemSolving: [],
  Others: [],
};

export const STORAGE_KEYS = {
  QUESTIONS: "questions",
  FEEDBACK: "feedback",
  PLAN_NAME: "planName"
};

export const PLAN_NAME = window.localStorage.getItem(STORAGE_KEYS.PLAN_NAME) || "PAID";

const ActionButton = memo(({ onClick, className, children }) => (
  <button onClick={onClick} className={`m-3 btn ${className}`}>
    {children}
  </button>
));

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

ActionButton.defaultProps = {
  className: "btn-success"
};

function Home() {
  const [storedData, setStoredData, clearStoredData] = useLocalStorage(STORAGE_KEYS.QUESTIONS, {
    formValues: {},
    questions: QUESTIONS_EMPTY_STATE
  });

  const [formValues, setFormValues] = useState(storedData.formValues || {});
  const [questions, setQuestions] = useState(storedData.questions || QUESTIONS_EMPTY_STATE);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setStoredData({
      formValues,
      questions
    });
  }, [formValues, questions, setStoredData]);

  const onEditForm = useCallback((key, val) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [key]: val
    }));
  }, []);

  const onSetQuestions = useCallback((newQuestions) => {
    setQuestions(newQuestions);
  }, []);

  const clearIt = useCallback(() => {
    clearStoredData();
    setFormValues({});
    setQuestions(QUESTIONS_EMPTY_STATE);
  }, [clearStoredData]);

  const generateQuestion = useCallback(() => {
    const newQuestions = {
      JS: shuffleArray(QuestionJSON.JS),
      React: shuffleArray(QuestionJSON.React),
      Node: shuffleArray(QuestionJSON.Node),
      MongoDB: shuffleArray(QuestionJSON.MongoDB),
      ProblemSolving: shuffleArray(QuestionJSON.ProblemSolving, 2),
      Others: [],
    };
    setQuestions(newQuestions);
  }, []);

  const generateSpecificQuestionTopic = useCallback((topic, isRemove) => {
    setQuestions((prevQuestions) => ({
      ...prevQuestions,
      [topic]: isRemove
        ? []
        : shuffleArray(
            QuestionJSON[topic],
            topic === "ProblemSolving" ? 2 : 10
          ),
    }));
  }, []);

  const hide = useCallback(() => {
    const reactApp = document.querySelector("#react-chrome-app");
    if (!reactApp) return;

    if (!isCollapsed) {
      reactApp.style.height = "0px";
      reactApp.style.width = "50px";
      reactApp.style.overflowY = "hidden";
    } else {
      reactApp.style.height = "100vh";
      reactApp.style.width = "490px";
      reactApp.style.overflowY = "scroll";
    }
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const print = useCallback(() => {
    if (!formValues.name || !formValues.round || !formValues.role) {
      alert("Please provide name, round, and role.");
      return;
    }

    try {
      // Read feedback directly from localStorage
      let feedback;
      try {
        feedback = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.FEEDBACK) || "[]");
        console.log("Feedback from localStorage:", feedback);
      } catch (error) {
        console.error("Error parsing feedback:", error);
        feedback = [];
      }

      if (!feedback || !feedback.length) {
        alert("Please provide feedback for the candidate.");
        return;
      }

      const elementToPrint = document.querySelector(".print_wrapper");
      if (!elementToPrint) {
        console.error("Print wrapper element not found");
        return;
      }

      const elementsToHide = document.querySelectorAll(".ignorePDF");
      const inputsAndSelects = document.querySelectorAll("input, select");

      elementsToHide.forEach((el) => (el.style.display = "none"));

      elementToPrint.style.color = "black";
      inputsAndSelects.forEach((el) => (el.style.color = "black"));

      savePDF(
        elementToPrint,
        {
          paperSize: "A4",
          fileName: `${formValues.name}-${formValues.round}-${formValues.role}`,
          margin: 10,
        },
        () => {
          elementToPrint.style.color = "white";
          elementsToHide.forEach((el) => (el.style.display = "inline"));
          inputsAndSelects.forEach((el) => (el.style.color = "white"));
        }
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    }
  }, [formValues]);

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "m" && e.ctrlKey) {
        hide();
      }
    };

    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [hide]);

  return (
    <>
      <div className="d-flex container w-100">
        <ActionButton onClick={print}>
          Print
        </ActionButton>
        <ActionButton onClick={generateQuestion}>
          Generate Questions
        </ActionButton>
      
        <div
          onClick={hide}
          className="m-3"
          style={{
            position: "absolute",
            right: 0,
            top: "-10px",
            transform: "rotate(-90deg)",
            cursor: "pointer",
          }}
        >
          <img src={leftArrow} height={26} width={23} alt="Toggle sidebar" />
        </div>
      </div>
      {PLAN_NAME !== "FREE" && (
        <div className="d-flex container w-100">
          <ActionButton onClick={() => setStoredData({ formValues, questions })}>
            Save
          </ActionButton>
          <ActionButton onClick={clearIt}>
            Clear
          </ActionButton>
        </div>
      )}
      <PrintableArea
        onEditForm={onEditForm}
        formValues={formValues}
        questions={questions}
        setQuestions={onSetQuestions}
        generateSpecificQuestionTopic={generateSpecificQuestionTopic}
      />
    </>
  );
}

export default Home;
