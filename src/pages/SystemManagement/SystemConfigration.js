import React, { useEffect, useState } from "react";
import {
  getSystemConfigrationDetailsServ,
  updateSystemConfigrationDetailsServ,
} from "../../services/systemConfigration.services";
import { toast } from "react-toastify";
function SystemConfigration() {
  const [systemConfigrationDetails, setSystemConfigrationDetails] = useState({
    isPaydayLoanActive: "",
    isRegularLoanActive: "",
  });
  const getConfigrationDetailsFunc = async () => {
    try {
      let response = await getSystemConfigrationDetailsServ();
      if (response?.data?.statusCode == "200") {
        setSystemConfigrationDetails({
          isPaydayLoanActive: response?.data?.data?.isPaydayLoanActive,
          isRegularLoanActive: response?.data?.data?.isRegularLoanActive,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getConfigrationDetailsFunc();
  }, []);
  const [btnLoader, setBtnLoader]=useState(false)
  const updateSystemConfigrationFunc = async () => {
    setBtnLoader(true)
    try {
      let response = await updateSystemConfigrationDetailsServ(
        systemConfigrationDetails
      );
      if (response?.data?.statusCode == "200") {
        getConfigrationDetailsFunc();
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error("Internal Servwer Error");
    }
    setBtnLoader(false)
  };
  return (
    <div className="m-4">
      <div className="border shadow-sm p-5 bg-white rounded">
        <h3>Manage Your System Configuration</h3>
        <p className="text-secondary">
          Customize and fine-tune your system settings by selecting the desired
          configuration options below. You can modify these preferences anytime
          to suit your business needs.
        </p>
        <hr />
        <div className="row">
          <div className="col-6">
            <div className="border-bottom  d-flex justify-content-between p-2">
              <div className="d-flex align-items-center">
                <div
                  className="me-3 d-flex justify-content-center border align-items-center"
                  style={{
                    height: "50px",
                    background: "whitesmoke",
                    width: "50px",
                    borderRadius: "50%",
                  }}
                >
                  <i className="bi bi-cash-coin "></i>
                </div>

                <div>
                  <p className="mb-0">Regular Loan</p>
                  <small className="text-secondary">
                    A standard loan crafted to support your bigger financial
                    ambitions.
                  </small>
                </div>
              </div>
              <div>
                {systemConfigrationDetails?.isRegularLoanActive ? <button
                  className="status-toggle pending bg-success"
                  style={{ width: "50px" }}
                  onClick={() => setSystemConfigrationDetails({...systemConfigrationDetails, isRegularLoanActive:false})}
                >
                  <div className="circle"></div>
                </button>:<button
                  className="status-toggle  bg-secondary"
                  style={{ width: "50px" }}
                  onClick={() => setSystemConfigrationDetails({...systemConfigrationDetails, isRegularLoanActive:true})}
                >
                  <div className="circle"></div>
                </button>}
                
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="border-bottom  d-flex justify-content-between p-2">
              <div className="d-flex align-items-center">
                <div
                  className="me-3 d-flex justify-content-center border align-items-center"
                  style={{
                    height: "50px",
                    background: "whitesmoke",
                    width: "50px",
                    borderRadius: "50%",
                  }}
                >
                  <i className="bi bi-cash "></i>
                </div>

                <div>
                  <p className="mb-0">Payday Loan</p>
                  <small className="text-secondary">
                    Fast and convenient loan for urgent financial requirements.
                  </small>
                </div>
              </div>
              <div>
                {systemConfigrationDetails?.isPaydayLoanActive ? <button
                  className="status-toggle pending bg-success"
                  style={{ width: "50px" }}
                  onClick={() => setSystemConfigrationDetails({...systemConfigrationDetails, isPaydayLoanActive:false})}
                >
                  <div className="circle"></div>
                </button>:<button
                  className="status-toggle  bg-secondary"
                  style={{ width: "50px" }}
                  onClick={() => setSystemConfigrationDetails({...systemConfigrationDetails, isPaydayLoanActive:true})}
                >
                  <div className="circle"></div>
                </button>}
              </div>
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-end">
            {btnLoader ? <button className="btn bgThemePrimary" style={{opacity:"0.5"}}>Updating ...</button>:<button className="btn bgThemePrimary" onClick={()=>updateSystemConfigrationFunc()}>Submit</button>}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemConfigration;
