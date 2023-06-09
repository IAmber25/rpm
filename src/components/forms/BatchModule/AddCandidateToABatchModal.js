import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import ModalComponent from "../../molecules/ModalComponent";
import TableComponent from "../../molecules/TableComponent/TableComponent";
import {
  getTheCandidatesWhoAreUnmapped,
  mapCandidateToABatch,
  mapOrUnmapCandidateToABatch,
} from "../../../services/batchmodule/batchmodule";
import { useToasts } from "react-toast-notifications";
import { getCandidatesOfABatch } from "../../../services/batchmodule/batchmodule";
const CANDIDATE_DETAILS_FOR_TABLE = [
  {
    id: "col1",
    label: "Candidate Name",
    minWidth: 120,
    align: "center",
    sort: false,
  },
  {
    id: "col2",
    label: "Gender",
    minWidth: 120,
    align: "center",
    sort: false,
  },
  {
    id: "col3",
    label: "Phone Number",
    minWidth: 120,
    align: "center",
    sort: false,
  },
];

const AddCandidateToABatchModal = ({
  openAddCandidateModal,
  setOpenAddCandidateModal,
  bacthIdAndTrainerId,
  modalType,
}) => {
  const { addToast } = useToasts();
  const [unmappedCandidateRows, setUnmappedCandidateRows] = useState([]);
  const [candidateIds, setCandidateIds] = useState([]);

  const [mappedCandidateRows, setMappedCandidateRows] = useState([]);

  const getUnmappedCandidates = async () => {
    const { data, error } = await getTheCandidatesWhoAreUnmapped();
    if (data) {
      if (data.isError) {
      } else {
        console.log(data.data, " ---data.data");
        const tempArray = data.data.map((val) => {
          const { candidateId, candidateName, gender, selfContactNumber } = val;
          return {
            id: candidateId,
            col1: candidateName,
            col2: gender,
            col3: selfContactNumber,
          };
        });

        setUnmappedCandidateRows([...tempArray]);
      }
    } else if (error) {
    }
  };

  const getMappepCandidates = async () => {
    const { data, error } = await getCandidatesOfABatch(
      bacthIdAndTrainerId?.batchId
    );

    if (data) {
      if (data.error) {
      } else {
        const tempArray = data?.data?.candidateInfoLists.map((val) => {
          const { candidateId, candidateName, gender, selfContactNumber } = val;

          return {
            id: candidateId,
            col1: candidateName,
            col2: gender,
            col3: selfContactNumber,
          };
        });

        setMappedCandidateRows([...tempArray]);
      }
    } else if (error) {
    }
  };

  useEffect(() => {
    if (modalType === "map") getUnmappedCandidates();
    else getMappepCandidates();
  }, [modalType]);

  const handleClose = () => {
    setOpenAddCandidateModal(false);
    setCandidateIds([]);
  };

  const mapOrUnmapTheCandidate = async () => {
    if (candidateIds.length !== 0) {
      const payload = {
        batchId: bacthIdAndTrainerId.batchId,
        trainerId: bacthIdAndTrainerId.trainerId,
        candidateIds: candidateIds,
      };
      const status = modalType === "map" ? true : false;
      const { data, error } = await mapOrUnmapCandidateToABatch(
        payload,
        status
      );
      if (data) {
        if (data.isError) {
          console.log(data, "---this is data");
          addToast(data.message, { appearance: "error" });
        } else {
          if (modalType === "map") await getUnmappedCandidates();
          else await getMappepCandidates();
          addToast(data.message, { appearance: "success" });
        }
      } else if (error) {
        console.log(error);
        addToast(error?.response?.data?.message, { appearance: "error" });
      }
    }
  };

  return (
    <Box>
      <ModalComponent
        onCloseBtnClick={handleClose}
        onCancelBtnClick={handleClose}
        open={openAddCandidateModal}
        showClearBtn={false}
        onSubmitBtnClick={() => {
          mapOrUnmapTheCandidate();
        }}
        modalTitle={
          modalType === "map"
            ? "Map Candidates To Batch"
            : "Unmap Candidates From Batch"
        }
      >
        <TableComponent
          showCheckbox
          tableRows={
            modalType === "map" ? unmappedCandidateRows : mappedCandidateRows
          }
          tableColumns={CANDIDATE_DETAILS_FOR_TABLE}
          tableSize="small"
          onSelectionChange={(val) => {
            const tempArray = [...val];
            console.log(tempArray, "---tempArray");
            setCandidateIds([...tempArray]);
          }}
          showFooterButtonFilled={false}
          showFooterButtonOutlined={false}
        />
      </ModalComponent>
    </Box>
  );
};

export default AddCandidateToABatchModal;
