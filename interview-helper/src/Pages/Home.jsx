/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import PrintableArea from "./Component/PrintableArea";
import { savePDF } from "@progress/kendo-react-pdf";
import leftArrow from "../leftArrow.png";
import QuestionJSON from "./Util/questions.json";
import "../App.css";

function shuffleArray(array, endIndex = 10) {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, endIndex);
}

const QUESTIONS_EMPTY_STATE = {
  JS: [],
  React: [],
  Node: [],
  MongoDB: [],
  ProblemSolving: [],
  Others: [],
};

export const PLAN_NAME = window.localStorage.getItem("planName") || "PAID";

function Home() {

  const [formValues, setFormValues] = useState(() => {
    const initValue = JSON.parse(
      window.localStorage.getItem("questions") || "{}"
    );
    return initValue.formValues || {};
  });

  const [questions, setQuestions] = useState(() => {
    const initValue = JSON.parse(
      window.localStorage.getItem("questions") || "{}"
    );
    return initValue.questions || QUESTIONS_EMPTY_STATE;
  });

  const [currentState, setCurrentState] = useState(1);

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
  }, []);

  const onEditForm = (key, val) => {
    const updatedFormValues = { ...formValues, [key]: val };
    setFormValues(updatedFormValues);
    saveItForLater(updatedFormValues);
  };

  const onSetQuestions = (newQuestion) => {
    setQuestions(newQuestion);
    saveItForLater(formValues, newQuestion);
  };

  const print = () => {
    if (!formValues.name || !formValues.round || !formValues.role) {
      alert("Please provide name, round, and role.");
      return;
    }

    if (!JSON.parse(window.localStorage.getItem("feedback") || "[]").length) {
      alert("Please provide feedback for the candidate.");
      return;
    }

    const elementToPrint = document.querySelector(".print_wrapper");
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
  };

  const saveItForLater = (
    updatedFormVal = formValues,
    updatedQuestions = questions
  ) => {
    window.localStorage.setItem(
      "questions",
      JSON.stringify({
        formValues: updatedFormVal,
        questions: updatedQuestions,
      })
    );
  };

  const clearIt = () => {
    window.localStorage.removeItem("questions");
    setQuestions(QUESTIONS_EMPTY_STATE);
  };

  const generateQuestion = () => {
    setQuestions({
      JS: shuffleArray(QuestionJSON.JS),
      React: shuffleArray(QuestionJSON.React),
      Node: shuffleArray(QuestionJSON.Node),
      MongoDB: shuffleArray(QuestionJSON.MongoDB),
      ProblemSolving: shuffleArray(QuestionJSON.ProblemSolving, 2),
      Others: [],
    });
  };

  const generateSpecficQuestionTopic = (topic, isRemove) => {
    setQuestions((prevQuestions) => ({
      ...prevQuestions,
      [topic]: isRemove
        ? []
        : shuffleArray(
            QuestionJSON[topic],
            topic === "ProblemSolving" ? 2 : 10
          ),
    }));
  };

  const hide = () => {
    const reactApp = document.querySelector("#react-chrome-app");
    if (reactApp.style.height !== "0px") {
      reactApp.style.height = "0px";
      reactApp.style.width = "50px";
      reactApp.style.overflowY = "hidden";
      setCurrentState(0);
    } else {
      reactApp.style.height = "100vh";
      reactApp.style.width = "490px";
      reactApp.style.overflowY = "scroll";
      setCurrentState(1);
    }
  };

  return (
    <>
      <div className="d-flex container w-100">
        <button onClick={print} className="m-3 btn btn-success">
          Print
        </button>
        <button onClick={generateQuestion} className="m-3 btn btn-success">
          Generate Question
        </button>
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
          <button
            onClick={() => saveItForLater()}
            className="m-3 btn btn-success"
          >
            Save
          </button>
          <button onClick={clearIt} className="m-3 btn btn-success">
            Clear
          </button>
        </div>
      )}
      <PrintableArea
        onEditForm={onEditForm}
        formValues={formValues}
        questions={questions}
        setQuestions={onSetQuestions}
        generateSpecficQuestionTopic={generateSpecficQuestionTopic}
      />
    </>
  );
}

export default Home;
