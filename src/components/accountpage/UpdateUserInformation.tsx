import React, { useEffect, useState } from "react";
import InputForm from "../common/inputform/InputForm";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axios from "../../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { userState } from "../../redux/reducers/auth/user.reducer";
import {
  getProfileUser,
  updateProfileUser,
} from "../../redux/actions/auth/user.action";
import { failureNoti, successNoti } from "../../utils/notifications";
import { CircularProgress } from "@mui/material";

interface valuesInput {
  id: number;
  label: string;
  name: string;
  type: string;
  placeholder: string;
  errorMessage?: string;
  pattern?: string;
}

const UpdateUserInformation = () => {
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: "",
  }) as any;
  const [image, setImage] = useState<string>("") as any;
  const [uploading, setUploading] = useState<boolean>(false);

  const uploadFileHandler = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/upload", formData, config);

      setImage(data.url);
      setUploading(false);
    } catch (error: any) {
      setUploading(false);
    }
  };

  const [reload, setReload] = useState<boolean>(false);

  const dispatch = useDispatch();

  const userProfile = useSelector<RootState, userState>(
    (state) => state.profileUser
  );
  const { userInfo, success: successProfile } = userProfile;

  const userUpdate = useSelector<RootState, userState>(
    (state) => state.updateProfileUser
  );
  const { success, error, isFetching } = userUpdate;

  useEffect(() => {
    dispatch(getProfileUser());
  }, [dispatch, reload]);

  const submitUpdateUser = async (e: any) => {
    e.preventDefault();
    await dispatch(
      updateProfileUser({
        firstname: values.firstname,
        lastname: values.lastname,
        avatar: image,
        password: values.password,
      })
    );
    setReload(!reload);
  };

  useEffect(() => {
    if (successProfile) {
      setValues({
        firstname: userInfo?.firstname,
        lastname: userInfo?.lastname,
      });
      setImage(userInfo?.avatar);
    }
  }, [userInfo, successProfile]);

  useEffect(() => {
    if (success) {
      successNoti();
    }
    if (error) {
      failureNoti();
    }
  }, [success, error]);

  const inputs: Array<valuesInput> = [
    {
      id: 1,
      label: "T??n *",
      name: "firstname",
      type: "text",
      placeholder: "Nh???p t??n",
    },
    {
      id: 2,
      label: "H??? *",
      name: "lastname",
      type: "text",
      placeholder: "Nh???p h???",
    },
    {
      id: 3,
      label: "M???t kh???u *",
      name: "password",
      type: "password",
      placeholder: "M???t kh???u",
      errorMessage:
        "M???t kh???u ph???i t??? 6-20 k?? t??? v?? bao g???m ??t nh???t 1 ch???,1 s??? v?? 1 k?? t??? ?????c bi???t",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$`,
    },
    {
      id: 4,
      label: "X??c nh???n m???t kh???u *",
      name: "confirmPassword",
      type: "password",
      placeholder: "Nh???p l???i m???t kh???u",
      errorMessage: "M???t kh???u ph???i tr??ng nhau!",
      pattern: values.password,
    },
  ];

  return (
    <div className="profile__change">
      <div className="heading">C???P NH???T TH??NG TIN T??I KHO???N</div>
      <div className="signin__form">
        <form className="form" onSubmit={submitUpdateUser}>
          <div className="avatar-profile">
            <div className="avatar-picture">
              <img
                src={
                  image
                    ? image
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
              />
              {uploading ? (
                <CircularProgress size="1rem" />
              ) : (
                <label htmlFor="file">
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
              )}
              <input
                type="file"
                id="file"
                onChange={(e) => uploadFileHandler(e)}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
          </div>
          {inputs.map((input) => (
            <InputForm
              key={input.id}
              {...input}
              value={(values as any)[input.name]}
            />
          ))}
          <div className="form-btn">
            <button type="submit">C???p nh???t</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserInformation;
