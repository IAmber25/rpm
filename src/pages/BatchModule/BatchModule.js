import React, { useEffect, useState } from "react";
import BatchRegistrationModal from "../../components/forms/BatchModule/BatchRegistrationModal/BatchRegistrationModal";
import TableComponent from "../../components/molecules/TableComponent/TableComponent";
import {
  deleteABatch,
  getAllBatchDetails,
  getBatchDetailsById,
} from "../../services/batchmodule/batchmodule";
import { Box, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCandidateToABatchModal from "../../components/forms/BatchModule/AddCandidateToABatchModal";
import ButtonComponent from "../../components/atoms/ButtonComponent/ButtonComponent";
import ConfirmDelete from "../../components/molecules/ConfirmDelete";
import { useToasts } from "react-toast-notifications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOffIcon from "@mui/icons-material/PersonOff";
const BATCH_COLUMNS = [
  {
    id: "col1",
    label: "Batch Id",
    minWidth: 100,
    align: "center",
    sort: false,
  },
  {
    id: "col2",
    label: "Batch Name",
    minWidth: 100,
    align: "center",
    sort: false,
  },
  {
    id: "col3",
    label: "Technologies",
    minWidth: 170,
    align: "center",
    sort: false,
  },
  {
    id: "col4",
    label: "Batch Trainer",
    minWidth: 80,
    align: "center",
    sort: false,
  },
  {
    id: "col5",
    label: "Status",
    minWidth: 100,
    align: "center",
    sort: false,
  },
  {
    id: "col6",
    label: "Actions",
    minWidth: 100,
    align: "center",
    sort: false,
  },
];

const BatchModule = () => {
  const [batchModal, setbatchModal] = useState(false);
  const [batchModalType, setbatchModalType] = useState("");
  const [tableRows, setTableRows] = useState([]);
  const [batchModalData, setbatchModalData] = useState({});
  const [openAddCandidateModal, setOpenAddCandidateModal] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const { addToast } = useToasts();

  const [bacthIdAndTrainerId, setBatchIdAndTrainerId] = useState({
    batchId: "",
    trainerId: "",
  });

  const [modalType, setModalType] = useState("map");

  const [batchIdForDelete, setBatchIdForDelete] = useState("");

  let openBatchModal = () => {
    setbatchModalType("ADD");
    setbatchModal(true);
  };

  let closeBatchModal = () => {
    setbatchModal(false);
  };

  let handleTrainerEdit = (batchId) => {
    batchDetailsID(batchId);
    setbatchModalType("EDIT");
    setbatchModal(true);
    // console.log("batchId", batchId);
  };

  let batchDetailsID = async (selectedBatchID) => {
    let { data, error } = await getBatchDetailsById(selectedBatchID);

    if (data) {
      if (data.isError) {
        // console.log("error in trainerDetailsID");
      } else {
        setbatchModalData({
          batchStatus: data.data?.batchStatus,
          batchId: data.data?.batchId,
          batchName: data.data?.batchName,
          technologies: data.data?.technologies,
        });
      }
    }
  };

  const deleteBatch = async () => {
    const { data, error } = await deleteABatch(batchIdForDelete);
    if (data) {
      if (data.isError) {
        addToast(data.message, { appearance: "error" });
      } else {
        await getAllTheBatchDetails();
        addToast(data.message, { appearance: "success" });
        setOpenConfirmDelete(false);
      }
    } else if (error) {
      addToast(error?.response?.data?.message, { appearance: "error" });
    }
  };

  const getAllTheBatchDetails = async () => {
    const { data, error } = await getAllBatchDetails();
    if (data) {
      if (data.isError) {
      } else {
        const tempArray = data.data.sort((a,b)=>b.batchId.slice(2)-a.batchId.slice(2)).map((val) => {
          const {
            batchId,
            batchName,
            technologies,
            startDate,
            trainerName,
            batchStatus,
            trainerId,
          } = val;
          return {
            id: batchId,
            col1: batchId,
            col2: batchName,
            col3: (
              <Box
                sx={{ width: "100%" }}
                display="flex"
                justifyContent="center"
              >
                <Stack
                  width={170}
                  useFlexGap
                  justifyContent="center"
                  flexWrap="wrap"
                  direction={"row"}
                  spacing={1}
                >
                  {technologies.map((val, idx) => {
                    return (
                      <Chip
                        variant="outlined"
                        key={idx}
                        label={val}
                        color="primary"
                        size="small"
                        sx={{ marginBottom: "4px" }}
                      />
                    );
                  })}
                </Stack>
              </Box>
            ),
            col4: trainerName ? trainerName : "--",
            col5: batchStatus,
            col6: (
              <Box
                display="flex"
                justifyContent="space-around"
                alignItems="center"
              >
                {batchStatus === "CREATED" || batchStatus === "ONGOING" ? (
                  <Tooltip title="Edit batch">
                    <EditIcon
                      className="cursor-pointer"
                      color="primary"
                      onClick={() => {
                        handleTrainerEdit(batchId);
                      }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Edit batch">
                    <EditIcon className="cursor-pointer" color="disabled" />
                  </Tooltip>
                )}

                {batchStatus === "CREATED" ? (
                  <Tooltip title="Delete batch">
                    <DeleteIcon
                      className="cursor-pointer"
                      color="error"
                      onClick={() => {
                        setBatchIdForDelete(batchId);
                        setOpenConfirmDelete(true);
                      }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Delete batch">
                    <DeleteIcon color="disabled" />
                  </Tooltip>
                )}
                <Box>
                  {batchStatus === "CREATED" || batchStatus === "ONGOING" ? (
                    <Tooltip title="Assign candidates">
                      <IconButton
                        onClick={() => {
                          setOpenAddCandidateModal(true);
                          setBatchIdAndTrainerId({
                            batchId: batchId,
                            trainerId,
                          });
                          setModalType("map");
                        }}
                      >
                        <PersonAddIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Assign candidates">
                      <PersonAddIcon
                        sx={{ paddingX: 0.5, paddingY: 0.5 }}
                        color="disabled"
                      />
                    </Tooltip>
                  )}
                </Box>
                <Box>
                  {batchStatus === "CREATED" || batchStatus === "ONGOING" ? (
                    <Tooltip title="Unassign candidates">
                      <IconButton
                        onClick={() => {
                          setOpenAddCandidateModal(true);
                          setBatchIdAndTrainerId({
                            batchId: batchId,
                            trainerId,
                          });
                          setModalType("unmap");
                        }}
                      >
                        <PersonOffIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Unassign candidates">
                      <PersonOffIcon
                        sx={{ paddingX: 0.5, paddingY: 0.5 }}
                        color="disabled"
                      />
                    </Tooltip>
                  )}
                </Box>
              </Box>
            ),
          };
        });

        setTableRows([...tempArray]);
      }
    } else if (error) {
    }
  };

  useEffect(() => {
    getAllTheBatchDetails();
  }, []);
  return (
    <>
      <BatchRegistrationModal
        batchModal={batchModal}
        closeBatchModal={closeBatchModal}
        batchModalType={batchModalType}
        getAllTheBatchDetails={getAllTheBatchDetails}
        batchModalData={batchModalData}
        setbatchModalType={setbatchModalType}
      />

      <TableComponent
        onHeaderBtnClick={openBatchModal}
        headerTitle="Batch list"
        addbtnlabel="Add batch"
        showAddBtn
        showHeader
        tableColumns={BATCH_COLUMNS}
        showSearchInput
        tableRows={tableRows}
        // customHeight
        // tableHeight="calc(100vh - 195px)"
      />
      {openAddCandidateModal && (
        <AddCandidateToABatchModal
          openAddCandidateModal={openAddCandidateModal}
          setOpenAddCandidateModal={setOpenAddCandidateModal}
          bacthIdAndTrainerId={bacthIdAndTrainerId}
          setBatchIdAndTrainerId={setBatchIdAndTrainerId}
          modalType={modalType}
        />
      )}
      <ConfirmDelete
        open={openConfirmDelete}
        onCancelBtnClick={() => {
          setOpenConfirmDelete(false);
        }}
        onSubmitBtnClick={() => {
          deleteBatch();
        }}
        onCloseBtnClick={() => {
          setOpenConfirmDelete(false);
        }}
      />
    </>
  );
};

export default BatchModule;
