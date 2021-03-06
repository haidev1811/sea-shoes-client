import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import axios from "../../utils/axios";
import { districts, provinces } from "../../utils/address";
import { RootState } from "../../redux/store";
import { authState } from "../../redux/reducers/auth/auth.reducer";
import { createOrder } from "../../redux/actions/order/order.action";
import { CircularProgress } from "@mui/material";
import { failureNoti, successNoti } from "../../utils/notifications";

const Payment = () => {
  const [sdkReady, setSdkReady] = useState<boolean>(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const authLogin = useSelector<RootState, authState>(
    (state) => state.authLogin
  );
  const { authInfo } = authLogin;

  const [email, setEmail] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [fullAddress, setFullAddress] = useState<string>("");
  const [district, setDistrict] = useState([]) as any;

  const userInfo = localStorage.getItem("sea-user")
    ? JSON.parse(localStorage.getItem("sea-user")!).user
    : null;

  const orders = localStorage.getItem("sea-cart-items")
    ? JSON.parse(localStorage.getItem("sea-cart-items")!)
    : null;

  const [payOnline, setPayOnline] = useState<boolean>(false);
  const onTogglePayOnline = () => {
    setPayOnline(!payOnline);
  };

  useEffect(() => {
    if (!authInfo) {
      history.push("/login");
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      addPayPalScript();
    } else {
      setSdkReady(true);
    }
  }, [history, authInfo]);

  const successPaymentHandler = async (paymentStatus: string) => {
    await dispatch(
      createOrder({
        orderItems: orders,
        totalPrice,
        fullname,
        email,
        phoneNumber,
        shippingAddress: fullAddress,
        shippingPrice: 30000,
        paymentStatus,
      })
    );
    successNoti();
    history.push("/");
  };

  const toVND = (price: any) => {
    let vnd =
      typeof price === "undefined"
        ? 0
        : price.toLocaleString("vi-VN", {
            currency: "VND",
          });
    return vnd;
  };

  const priceDiscount = (price: any, discount: any) => {
    return toVND(price - price * (discount / 100));
  };

  const totalPrice = orders?.reduce(
    (acc: any, item: any) =>
      acc + (item.price - item.price * (item.discount / 100)) * item.quantity,
    0
  );

  const endPrice = totalPrice + 30000;

  const handleProvince = (e: any) => {
    let districtSelect = districts.filter(
      (ite: any) => ite.province_code === e.target.value
    );
    setDistrict(districtSelect);
  };
  const handleDistrict = (e: any) => {
    let fullAddress = districts.filter(
      (ite: any) => ite.code === e.target.value
    )[0].full_name;
    setAddress(fullAddress);
    setFullAddress(fullAddress);
  };

  const handlerFullAddress = (e: any) => {
    let optionsAddress = e.target.value;
    setFullAddress(optionsAddress + ", " + address);
  };

  const failurePaymentHandler = () => {
    failureNoti();
  };

  return (
    <div className="root-payment">
      <div className="payment">
        <div className="payment__infor">
          <div className="payment__infor-head">
            <a href="./evo.html" className="link">
              Sea Fashion
            </a>
          </div>
          <div className="payment__infor-main">
            <div className="main-left">
              <div className="main__head">
                <span>
                  <i className="far fa-address-card"></i>Th??ng tin nh???n h??ng
                </span>
                <a href="./signin.html" className="link">
                  <i className="far fa-user-circle"></i>
                  {`${userInfo.firstname} ${userInfo.lastname}`}
                </a>
              </div>
              <form>
                <div className="form-item-pay">
                  <input
                    type="text"
                    required
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-item-pay">
                  <input
                    type="text"
                    required
                    placeholder="H??? v?? t??n"
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
                <div className="form-item-pay">
                  <input
                    type="text"
                    required
                    placeholder="S??? ??i???n tho???i (t??y ch???n)"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <select
                  name="calc_shipping_provinces"
                  required
                  onChange={handleProvince}
                >
                  <option value="">T???nh / Th??nh ph???</option>
                  {provinces.map((item: any, index: any) => (
                    <option value={item.code}>{item.name}</option>
                  ))}
                </select>
                <select
                  name="calc_shipping_district"
                  required
                  onChange={handleDistrict}
                >
                  <option value="">Qu???n / Huy???n</option>
                  {district.map((item: any, index: any) => (
                    <option value={item.code}>{item.name}</option>
                  ))}
                </select>
                <div className="form-item-pay">
                  <input
                    type="text"
                    required
                    placeholder="?????a ch??? (t??y ch???n)"
                    onChange={handlerFullAddress}
                  />
                </div>
                <div className="form-item-pay">
                  <textarea name="" id="">
                    Ghi ch?? (tu??? ch???n)
                  </textarea>
                </div>
              </form>
            </div>
            <div className="main-right">
              <div className="main__head">
                <span>
                  <i className="fas fa-truck-moving"></i>V???n chuy???n
                </span>
              </div>
              <div className="main-right__note">
                Vui l??ng nh???p th??ng tin giao h??ng
              </div>
              <div className="main__head">
                <span>
                  <i className="far fa-credit-card"></i>Thanh to??n
                </span>
              </div>
              <div className="main-right__pay mb-1">
                <div className="payments">
                  <div
                    className={`payments__dot ${!payOnline ? "active" : ""}`}
                    onClick={onTogglePayOnline}
                  ></div>
                  <div className="payments__text">
                    Thanh to??n khi giao h??ng (COD)
                  </div>
                  <div className="payments__icon">
                    <i className="far fa-money-bill-alt"></i>
                  </div>
                </div>
                <div className="payment-note">
                  B???n ch??? ph???i thanh to??n khi nh???n ???????c h??ng
                </div>
              </div>
              <div className="main-right__pay">
                <div className="payments">
                  <div
                    className={`payments__dot ${payOnline ? "active" : ""}`}
                    onClick={onTogglePayOnline}
                  ></div>
                  <div className="payments__text">Thanh to??n tr???c tuy???n</div>
                  <div className="payments__icon">
                    <i className="far fa-money-bill-alt"></i>
                  </div>
                </div>
                <div className="payment-note">
                  B???n c?? th??? thanh to??n ????n h??ng th??ng qua c???ng thanh to??n
                  online
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="payment__order">
          <div className="row-1">
            <div className="payment__order-head">
              ????n h??ng (<span>{orders.length} s???n ph???m</span>)
            </div>
            <div className="payment__order-list">
              {orders.map((order: any, index: any) => (
                <div className="list-item" key={index}>
                  <div className="list-item__left">
                    <div className="list-item__left-img">
                      <img src={order.image} alt="" />
                      <span className="number">{order.quantity}</span>
                    </div>
                    <div className="list-item__left-infor">
                      <span className="infor__name">{order.name}</span>
                      {order.size && order.colour && (
                        <div className="d-flex">
                          <span className="infor__size">
                            Size: {order.size}-
                          </span>
                          <span className="infor__size">
                            -M??u: {order.colour}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="list-item__right">
                    {priceDiscount(order.price, order.discount)}???
                  </div>
                </div>
              ))}
            </div>
            <div className="payment__order-promotion">
              <div className="form-item">
                <input type="text" required placeholder="Nh???p m?? gi???m gi??" />
              </div>
              <button>??p d???ng</button>
            </div>
            <div className="payment__order-cal">
              <span>T???m t??nh</span>
              <span>{toVND(totalPrice)}???</span>
            </div>
            <div className="payment__order-cal">
              <span>Ph?? v???n chuy???n</span>
              <span>- 30.000???</span>
            </div>
            <div className="payment__order-total">
              <span>T???ng c???ng</span>
              <span>{toVND(endPrice)}???</span>
            </div>

            <div className="payment__order-btn">
              <Link to="/cart" className="link">
                <i className="fas fa-chevron-left"></i>Quay v??? gi??? h??ng
              </Link>
              <div className={`${!payOnline ? "d-none" : ""}`}>
                {!sdkReady ? (
                  <CircularProgress />
                ) : (
                  <PayPalButton
                    amount={totalPrice}
                    onSuccess={() => successPaymentHandler("paid")}
                    onError={failurePaymentHandler}
                  />
                )}
              </div>
              <button
                onClick={() => successPaymentHandler("unpaid")}
                className={`${payOnline ? "d-none" : ""}`}
              >
                ?????t h??ng
              </button>
            </div>
          </div>
        </div>

        <div className="payment-temp"></div>
      </div>
    </div>
  );
};

export default Payment;
