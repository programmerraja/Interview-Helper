import PropTypes from "prop-types";
import React from "react";

function FormField({ id, value, onChange, type = "text", children }) {
  return (
    <div className="col-sm">
      <div className="d-flex m-1">
        <p id={id}>{children}</p>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function Form({ formValues, onEditForm }) {
  return (
    <div className="container w-100">
      <div className="row">
        <FormField
          id="name"
          value={formValues["name"]}
          onChange={(value) => onEditForm("name", value)}
        >
          Name
        </FormField>
        <FormField
          id="role"
          value={formValues["role"]}
          onChange={(value) => onEditForm("role", value)}
        >
          Role
        </FormField>
      </div>
      <div className="row">
        <FormField
          id="round"
          value={formValues["round"]}
          onChange={(value) => onEditForm("round", value)}
        >
          Round
        </FormField>
        <div className="col-sm">
          <div className="d-flex m-1">
            <p id="date">Date: {new Date().toDateString()}</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <div className="d-flex m-1">
            <p id="status">Status</p>
            <select
              value={formValues["status"]}
              onChange={(e) => onEditForm("status", e.target.value)}
            >
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        <FormField
          id="interviewer"
          value={formValues["interviewer"]}
          onChange={(value) => onEditForm("interviewer", value)}
        >
          Interviewer
        </FormField>
      </div>
    </div>
  );
}

export default Form;
