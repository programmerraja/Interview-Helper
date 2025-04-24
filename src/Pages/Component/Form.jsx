import PropTypes from "prop-types";
import React, { memo, useCallback } from "react";

const FormField = memo(({ id, value = "", onChange, type = "text", children, ariaLabel }) => {
  const handleChange = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="col-sm">
      <div className="d-flex m-1">
        <p id={id}>{children}</p>
        <input
          type={type}
          value={value || ""}
          onChange={handleChange}
          aria-label={ariaLabel || id}
        />
      </div>
    </div>
  );
});

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string
};

const SelectField = memo(({ id, value = "", onChange, options, children, ariaLabel }) => {
  const handleChange = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="col-sm">
      <div className="d-flex m-1">
        <p id={id}>{children}</p>
        <select
          value={value || ""}
          onChange={handleChange}
          aria-label={ariaLabel || id}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});

SelectField.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string
};

const DateDisplay = memo(() => {
  return (
    <div className="col-sm">
      <div className="d-flex m-1">
        <p id="date">Date: {new Date().toDateString()}</p>
      </div>
    </div>
  );
});

const Form = memo(({ formValues = {}, onEditForm }) => {
  const handleNameChange = useCallback((value) => onEditForm("name", value), [onEditForm]);
  const handleRoleChange = useCallback((value) => onEditForm("role", value), [onEditForm]);
  const handleRoundChange = useCallback((value) => onEditForm("round", value), [onEditForm]);
  const handleStatusChange = useCallback((value) => onEditForm("status", value), [onEditForm]);
  const handleInterviewerChange = useCallback((value) => onEditForm("interviewer", value), [onEditForm]);

  // Status options
  const statusOptions = [
    { value: "Selected", label: "Selected" },
    { value: "Rejected", label: "Rejected" }
  ];

  return (
    <div className="container w-100">
      <div className="row">
        <FormField
          id="name"
          value={formValues.name}
          onChange={handleNameChange}
          ariaLabel="Candidate Name"
        >
          Name
        </FormField>
        <FormField
          id="role"
          value={formValues.role}
          onChange={handleRoleChange}
          ariaLabel="Job Role"
        >
          Role
        </FormField>
      </div>
      <div className="row">
        <FormField
          id="round"
          value={formValues.round}
          onChange={handleRoundChange}
          ariaLabel="Interview Round"
        >
          Round
        </FormField>
        <DateDisplay />
      </div>
      <div className="row">
        <SelectField
          id="status"
          value={formValues.status}
          onChange={handleStatusChange}
          options={statusOptions}
          ariaLabel="Candidate Status"
        >
          Status
        </SelectField>
        <FormField
          id="interviewer"
          value={formValues.interviewer}
          onChange={handleInterviewerChange}
          ariaLabel="Interviewer Name"
        >
          Interviewer
        </FormField>
      </div>
    </div>
  );
});

Form.propTypes = {
  formValues: PropTypes.object,
  onEditForm: PropTypes.func.isRequired
};

export default Form;
