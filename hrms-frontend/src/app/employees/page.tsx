"use client";
import { useEffect, useState } from "react";
import CustomTable from "@/components/CustomTable/CustomTable";
import { TableHeadiingForEmployee } from "@/constants/constants";
import Searchbar from "@/components/Searchbar/Searchbar";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { getAllUserData } from "@/services/user/slices/allUser/user";
import { useDispatch, useSelector } from "react-redux";
import {
  IconEdit,
  IconLock,
  IconLockOpen,
  IconTrash,
} from "@tabler/icons-react";
import EmployeeForm from "@/components/employeeSection/employeeCreateForm/EmployeeForm";
import { CustomModal } from "@/components/CustomModal/CustomModal";
import { useLazyGetAllDataApiByNameQuery } from "@/services/user/allApis/getUser";
import { manageUserSelector } from "@/services/user/slices/allUser/userSelector";
import {
  useDeleteDataApiByNameMutation,
  useUpdateDataApiByNameMutation,
} from "@/services/user/allApis/usersApi";

export default function Employees() {
  const [search, setSearch] = useState("");

  const [allDataApi, { data, error, isLoading, isSuccess }] =
    useLazyGetAllDataApiByNameQuery();

  const [
    updateUserData,
    { data: userUpdatedData, isSuccess: updateUserSuccess },
  ] = useUpdateDataApiByNameMutation();
  const [deleteUserData, { data: userDeletedData }] =
    useDeleteDataApiByNameMutation();
  // console.group(userDeletedData, "userDeletedData");

  const { allUserData } = useSelector(manageUserSelector);

  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useDispatch();
  const handleOnClose = () => {
    close();
    form.reset();
  };
  useEffect(() => {
    if (!updateUserSuccess) return;
    const params = {
      page: 1,
      limit: 120,
    };
    allDataApi(params);
  }, [updateUserSuccess]);

  useEffect(() => {
    if (data?.users.length > 0) {
      dispatch(getAllUserData(data?.users));
    }
  }, [data, isSuccess]);

  const onHandelUpdate = async (row: any) => {
    const mydata = {
      department: row.department,
      role: row.role,
      fname: row.fname,
      lname: row.lname,
      email: row.email,
    };
    const result = await updateUserData({
      user_id: row._id,
      data: mydata,
      owner_id: "66fa989f82603080b4a64da9",
    });

    const params = {
      page: 1,
      limit: 120,
    };
    await allDataApi(params);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };
  const deleteModal = async (row: any) => {
    const mydata = {
      isDeleted: true,
    };
    const response = await deleteUserData({
      owner_id: "66fa989f82603080b4a64da9",
      user_id: row._id,
    });
  };
  const updateStatus = async (row: any) => {
    const mydata = {
      isActive: !row.isActive,
    };

    const result = await updateUserData({
      user_id: row._id,
      data: mydata,
      owner_id: "66fa989f82603080b4a64da9",
    });
  };
  const ActionContent = ({
    data,
    row,
  }: {
    data?: any;
    row?: any;
    editModal: (row: any) => void;
  }) => {
    const editModal = (row: any) => {
      open();
      form.setValues(row);
    };
    return (
      <div className="flex gap-2">
        <button onClick={() => editModal(row)}>
          <IconEdit className=" h-[25px] w-[25px]  text-blue-600 cursor-pointer" />
        </button>
        <button onClick={() => deleteModal(row)}>
          <IconTrash className=" h-[25px] w-[25px]  text-red-500 cursor-pointer" />
        </button>
        {row.isActive === true ? (
          <button onClick={() => updateStatus(row)}>
            <IconLockOpen className=" h-[25px] w-[25px] text-blue-600  cursor-pointer" />
          </button>
        ) : (
          <button onClick={() => updateStatus(row)}>
            <IconLock className=" h-[25px] w-[25px]  text-red-500 cursor-pointer" />
          </button>
        )}
      </div>
    );
  };

  const form = useForm({
    mode: "controlled",
    validateInputOnChange: true,
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      role: "",
      department: "",
    },
    validate: {
      fname: (value) => {
        if (!value) {
          return "Field is required";
        }
        if (value.length < 3) {
          return "Name should be at least 3 letters";
        } else {
          return value.length > 50 ? "Name should not exceed 50 letters" : null;
        }
      },

      lname: (value) => {
        if (!value) {
          return "Field is required";
        }
        if (value.length < 3) {
          return "Name should be at least 3 letters";
        } else {
          return value.length > 50 ? "Name should not exceed 50 letters" : null;
        }
      },
      email: (value) => {
        if (!value) {
          return "Field is required";
        } else {
          return /^\S+@\S+$/.test(value) ? null : "Invalid email";
        }
      },
      role: (value) => (value ? null : "Select field is required"),
      department: (value) => (value ? null : "Select field is required"),
    },
  });
  return (
    <>
      <div className="flex justify-between items-center p-2 max-sm:flex-col-reverse max-sm:items-start">
        <div>My Team ({allUserData.length})</div>
        <div className="flex items-center gap-3 max-sm:w-full 2xl:w-[40%]">
          <div className="flex  lg:justify-end max-sm:w-[30%] max-sm:justify-between ">
            <CustomModal
              opened={opened}
              open={open}
              close={handleOnClose}
              buttonlabel={"Add User"}
              modalTitle={"Apply for add user"}
              content={
                <>
                  <EmployeeForm
                    onClose={handleOnClose}
                    form={form}
                    onHandelUpdate={onHandelUpdate}
                  />
                </>
              }
            />
          </div>
          <div className=" max-sm:w-full">
            <Searchbar
              value={search}
              handleSearch={handleSearchChange}
              placeholder="Search"
              iconcolor="#9ca3af"
              classname=""
            />
          </div>
        </div>
      </div>
      <CustomTable
        data={allUserData}
        headingdata={TableHeadiingForEmployee}
        showConfirmRejectButton={true}
        showDotIcon={false}
        opened={open}
        ActionContent={ActionContent}
        form={form}
      />
    </>
  );
}
