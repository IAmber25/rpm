import React, { useEffect, useState } from "react";
import ModalComponent from "../../../molecules/ModalComponent";
import { Box, Grid } from "@mui/material";
import InputBoxComponent from "../../../atoms/InputBoxComponent/InputBoxComponent";
import MultiSelectComponent from "../../../atoms/MultiSelectComponent/MultiSelectComponent";
import { saveBatchDetails } from "../../../../services/batchmodule/batchmodule";
import { useToasts } from "react-toast-notifications";
import CheckBoxComponentTwo from "../../../atoms/CheckBoxComponentTwo/CheckBoxComponentTwo";
import { regex } from "../../../../regex/regex";

let batchRegistrationFormErrorObj = {
  batchName: "",
  technologies: "",
};

function BatchRegistrationModal({
  batchModal,
  closeBatchModal,
  batchModalType,
  getAllTheBatchDetails,
  batchModalData,
  setbatchModalType,
}) {
  const [batchRegistrationForm, setbatchRegistrationForm] = useState({
    batchName: "",
    batchStatus: "",
    technologies: [],
  });

  const [batchStatusCheckbox, setbatchStatusCheckbox] = useState("");
  const [skillsList, setskillsList] = useState([
    { id: "HTML", title: "HTML", value: "HTML" },
    { id: "CSS", title: "CSS", value: "CSS" },
    { id: "Javascript", title: "Javascript", value: "Javascript" },
    { id: "React", title: "React", value: "React" },
    { id: "Java", title: "Java", value: "Java" },
    { id: "Sql", title: "Sql", value: "Sql" },
  ]);

  const [batchRegistrationFormError, setbatchRegistrationFormError] = useState(
    batchRegistrationFormErrorObj
  );

  const {nameWithSpacesAndNumbers} = regex

  let { addToast } = useToasts();
  // validation
  const handleBatchDetailsError = () => {
    let batchRegistrationFormErrorObj = {
      batchName: "",
      technologies: "",
    };

    let theError = false;

    let { batchName, technologies } = batchRegistrationForm;

    if (batchName.trim() === "") {
      batchRegistrationFormErrorObj.batchName = "This field is required";
      theError = true;
    }else if(batchName.length >20){
      batchRegistrationFormErrorObj.batchName = "Upto 20 characters allowed";
      theError = true;
    }else if(!nameWithSpacesAndNumbers.test(batchName.trim())){
      batchRegistrationFormErrorObj.batchName = "Only numbers and alphabets are allowed";
      theError = true;

    }

    if (technologies?.length === 0) {
      batchRegistrationFormErrorObj.technologies = "This field is required";
      theError = true;
    }

    setbatchRegistrationFormError({ ...batchRegistrationFormErrorObj });

    return theError;
  };

  const handleTextInputChange = (e) => {
    setbatchRegistrationForm({
      ...batchRegistrationForm,
      [e.target.name]: e.target.value,
    });
  };

  let clearAllField = () => {
    setbatchRegistrationForm({
      batchName: "",
      batchStatus: "",
      technologies: [],
    });

    setbatchStatusCheckbox("");
  };

  let clearAll = () => {
    clearAllField();
    clearValidationFields();
  };

  let clearValidationFields = () => {
    setbatchRegistrationFormError(batchRegistrationFormErrorObj);
  };

  let submitBatchDetails = () => {
    if (!handleBatchDetailsError()) {
      createPayloadAndCallApi();
    }
  };

  useEffect(() => {
    if (batchModalType === "EDIT") {
      let tempTechnologies = [];
      if (batchModalData.technologies?.length > 0) {
        batchModalData.technologies.map((val) => {
          return tempTechnologies.push({ id: val, title: val, value: val });
        });
      }

      setbatchRegistrationForm({
        batchStatus: batchModalData.batchStatus,
        batchId: batchModalData?.batchId,
        batchName: batchModalData?.batchName,
        technologies: tempTechnologies,
      });
      setbatchStatusCheckbox(batchModalData.batchStatus);
    }
  }, [batchModalData]);

  let createPayloadAndCallApi = async () => {
    let addPayload = {
      batchName: batchRegistrationForm.batchName,
      technologies: batchRegistrationForm.technologies.map((val) => val.title),
    };

    let editPayload = {
      batchStatus: batchStatusCheckbox,
      batchId: batchRegistrationForm.batchId,
      batchName: batchRegistrationForm.batchName,
      technologies: batchRegistrationForm.technologies.map((val) => val.title),
    };

    let { data, error } =
      batchModalType === "ADD"
        ? await saveBatchDetails(addPayload)
        : await saveBatchDetails(editPayload);
    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "info" });
      } else {
        addToast(data.message, { appearance: "success" });
        getAllTheBatchDetails();
        closeBatchModal();
        clearAllField();
        setbatchModalType("");
      }
    } else if (error) {
      addToast(data.message, { appearance: "error" });
    }
  };


  useEffect(() => {
    clearValidationFields();
    clearAllField();
  }, [batchModalType]);

  let handleBatchStatus = (checkType) => {
  if (batchStatusCheckbox === "CREATED" && checkType === "markOngoing") {
      setbatchStatusCheckbox("ONGOING");
    } else if (
      checkType === "markOngoing" &&
      batchStatusCheckbox === "ONGOING"
    ) {
      setbatchStatusCheckbox("CREATED");
    }

    if (batchStatusCheckbox === "ONGOING" && checkType === "markCompleted") {
      setbatchStatusCheckbox("COMPLETED");
    } else if (
      checkType === "markCompleted" &&
      batchStatusCheckbox === "COMPLETED"
    ) {
      setbatchStatusCheckbox("ONGOING");
    }
  };

  return (
    <>
      <ModalComponent
        open={batchModal}
        onCloseBtnClick={closeBatchModal}
        onCancelBtnClick={closeBatchModal}
        modalTitle={
          batchModalType === "ADD" ? "Add Batch Details" : "Edit Batch Details"
        }
        onSubmitBtnClick={submitBatchDetails}
        onClearBtnClick={clearAll}
        modalWidth={580}
      >
        <Box marginX={3}>
          <Box marginTop={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputBoxComponent
                  label="Batch name"
                  name="batchName"
                  value={batchRegistrationForm.batchName}
                  onChange={(e) => {
                    handleTextInputChange(e);
                  }}
                  error={batchRegistrationFormError.batchName}
                  helperText={batchRegistrationFormError.batchName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MultiSelectComponent
                  list={skillsList}
                  label="Technologies"
                  name="technologies"
                  value={batchRegistrationForm.technologies}
                  onSelectionChange={(e, val) => {
                    setbatchRegistrationForm({
                      ...batchRegistrationForm,
                      technologies: [...val],
                    });
                  }}
                  error={batchRegistrationFormError.technologies}
                  helperText={batchRegistrationFormError.technologies}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {batchRegistrationForm.batchStatus === "CREATED" ? (
                  <CheckBoxComponentTwo
                    label="Mark batch status as ongoing"
                    onChange={() => {
                      handleBatchStatus("markOngoing");
                    }}
                    checked={batchStatusCheckbox === "ONGOING" ? true : false}
                  />
                ) : batchRegistrationForm.batchStatus === "ONGOING" ? (
                  <CheckBoxComponentTwo
                    label="Mark batch status as completed"
                    onChange={() => {
                      handleBatchStatus("markCompleted");
                    }}
                    checked={batchStatusCheckbox === "COMPLETED" ? true : false}
                  />
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </ModalComponent>
    </>
  );
}

export default BatchRegistrationModal;
