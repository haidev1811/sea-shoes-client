import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Chart } from "../../../components";
import { RootState } from "../../../redux/store";
import { orderState } from "../../../redux/reducers/order/order.reducer";
import {
  getDetailOrder,
  updateStatusOrder,
} from "../../../redux/actions/order/order.action";
import { failureNoti, successNoti } from "../../../utils/notifications";
import { CircularProgress } from "@mui/material";
import {
  toVND,
  checkPaymentStatus,
  checkDeliveryStatus,
  payments,
  deliveries,
} from "../../../utils/datatablesource";

interface Params {
  id: string;
}

const SingleUserPage = () => {
  const [paymentStatus, setPaymentStatus] = useState<string>("") as any;
  const [deliveryStatus, setDeliveryStatus] = useState<string>("") as any;
  const [reload, setReload] = useState<boolean>(false);

  const params: Params = useParams();
  const history = useHistory();

  const dispatch = useDispatch();
  const detailOrder = useSelector<RootState, orderState>(
    (state) => state.detailOrder
  );
  const { orderInfo, success: successDetail, isFetching } = detailOrder;

  const updatedStatusOrder = useSelector<RootState, orderState>(
    (state) => state.updateStatusOrder
  );
  const { error: updateError, success } = updatedStatusOrder;

  useEffect(() => {
    dispatch(getDetailOrder(params.id));
  }, [dispatch, params.id, reload]);

  useEffect(() => {
    if (successDetail) {
      // setName(orderInfo?.name);
    }
  }, [orderInfo, successDetail]);

  useEffect(() => {
    if (updateError) {
      failureNoti();
    }
    if (success) {
      successNoti();
    }
  }, [updateError, success]);

  useEffect(() => {
    if (successDetail) {
      setPaymentStatus(orderInfo?.paymentStatus);
      setDeliveryStatus(orderInfo?.deliveryStatus);
    }
  }, [orderInfo, successDetail]);

  const submitUpdateOrderStatus = async (e: any) => {
    e.preventDefault();
    await dispatch(
      updateStatusOrder({ id: params.id, paymentStatus, deliveryStatus })
    );
    setReload(!reload);
  };

  const onCancel = () => {
    history.push("/admin/order");
  };

  return (
    <div className="singleContainer">
      <Navbar />
      <div className="top">
        <div className="left">
          <div className="editButton">S???a</div>
          <h1 className="title">Th??ng tin</h1>
          {isFetching ? (
            <CircularProgress />
          ) : (
            <div className="item">
              <div className="details">
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{orderInfo?.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">S??? ??i???n tho???i:</span>
                  <span className="itemValue">{orderInfo?.phoneNumber}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">?????a ch??? giao h??ng:</span>
                  <span className="itemValue">
                    {orderInfo?.shippingAddress}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">S???n ph???m:</span>
                </div>
                {orderInfo?.orderItems.map((item: any, index: any) => (
                  <div className="d-flex">
                    <img src={item.image} alt="" className="itemImg-sub" />
                    <div>
                      <div className="detailItem">
                        <span className="itemKey">T??n:</span>
                        <span className="itemValue">{item.name}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">S??? l?????ng:</span>
                        <span className="itemValue">{item.quantity}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">M??u s???c:</span>
                        <span className="itemValue">{item.colour}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Size:</span>
                        <span className="itemValue">{item.size}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="detailItem">
                  <span className="itemKey">T???ng ????n h??ng:</span>
                  <span className="itemValue">
                    {toVND(orderInfo?.totalPrice)}???
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Ph?? ship:</span>
                  <span className="itemValue">
                    {toVND(orderInfo?.shippingPrice)}???
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Tr???ng th??i thanh to??n:</span>
                  <span className="itemValue">
                    {checkPaymentStatus(orderInfo?.paymentStatus!)}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Tr???ng th??i giao h??ng:</span>
                  <span className="itemValue">
                    {checkDeliveryStatus(orderInfo?.deliveryStatus!)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="right">
          <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
        </div>
      </div>
      <div className="bottom">
        <h1 className="title">Ch???nh s???a</h1>
        <form onSubmit={submitUpdateOrderStatus} className="form-flex">
          <div className="formInput">
            <label>T??nh tr???ng thanh to??n</label>
            <select
              id="category_product"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              {payments?.map((item) => (
                <option value={item.value} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="formInput">
            <label>T??nh tr???ng giao h??ng</label>
            <select
              id="category_product"
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
            >
              {deliveries?.map((item) => (
                <option value={item.value} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="formInput d-flex mt-4">
            <button className="button-admin mr-1">L??u</button>
            <button className="button-admin ml-1" onClick={onCancel}>
              H???y
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SingleUserPage;
