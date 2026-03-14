import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createNotifyServ } from "../../services/notification.service";
import { getUserListServ } from "../../services/user.service";
import { toast } from "react-toastify";
import { MultiSelect } from "react-multi-select-component";

// ✅ Validation Schema: Yeh define karta hai ki kaunsi field kab error degi
const NotifySchema = Yup.object().shape({
  title: Yup.string()
    .trim() // Sahi hai
    .min(3, "Title is too short!")
    .required("Title is required"),

  subTitle: Yup.string()
    .trim() // Sahi hai
    .min(10, "Message should be at least 10 characters")
    .required("Message is required"),

  notifyUserIds: Yup.array()
    // .trim() HATA DIYA (Array par nahi lagta)
    .min(1, "Please select at least one user"),

  mode: Yup.array()
    // .trim() HATA DIYA
    .min(1, "Please select at least one notification mode"),

  isScheduled: Yup.boolean(),

  date: Yup.string()
    .trim() // Sahi hai kyunki ye string type hai
    .when("isScheduled", {
      is: true,
      then: (schema) => schema.required("Please select a date for scheduling"),
    }),

  time: Yup.string()
    .trim() // Sahi hai
    .when("isScheduled", {
      is: true,
      then: (schema) => schema.required("Please select a time for scheduling"),
    }),
});

function Notify() {
  const [btnLoader, setBtnLoader] = useState(false);
  const [userList, setUserList] = useState([]);

  // Users list fetch karne ke liye
  const getUserListFunc = async () => {
    try {
      let response = await getUserListServ({ pageCount: 100, isUserApproved: true });
      if (response?.data?.statusCode == "200") {
        setUserList(response?.data?.data);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUserListFunc();
  }, []);

  return (
    <div className="m-4">
      <div className="border shadow-sm p-5 bg-white rounded">
        <h3>Notify User</h3>
        <p className="text-secondary">Create and send notifications with real-time validation.</p>
        <hr />

        <Formik
          initialValues={{
            title: "",
            subTitle: "",
            icon: null,
            notifyUserIds: [],
            mode: [],
            isScheduled: false,
            date: "",
            time: "",
          }}
          validationSchema={NotifySchema}
          onSubmit={async (values, { resetForm }) => {
            setBtnLoader(true);
            try {
              const fd = new FormData();
              fd.append("title", values.title);
              fd.append("subTitle", values.subTitle);
              if (values.icon) fd.append("icon", values.icon);
              fd.append("notifyUserIds", JSON.stringify(values.notifyUserIds));
              fd.append("mode", JSON.stringify(values.mode));
              fd.append("isScheduled", values.isScheduled);
              
              if (values.isScheduled) {
                fd.append("date", values.date);
                fd.append("time", values.time);
              }

              let response = await createNotifyServ(fd);
              if (response?.data?.statusCode == "200") {
                resetForm();
                toast.success(response?.data?.message || "Notification Sent!");
              }
            } catch (error) {
              toast.error(error?.response?.data?.message);
            }
            setBtnLoader(false);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="row">
                {/* --- Left Column: Form Inputs --- */}
                <div className="col-lg-8">
                  {/* Title Field */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Title <span className="text-danger">*</span></label>
                    <Field 
                      name="title" 
                      className={`form-control ${touched.title && errors.title ? "is-invalid" : ""}`} 
                      placeholder="e.g. New Update Available" 
                    />
                    <ErrorMessage name="title" component="div" className="text-danger small mt-1" />
                  </div>

                  {/* Message Field */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Message <span className="text-danger">*</span></label>
                    <Field 
                      as="textarea" 
                      name="subTitle" 
                      rows="3"
                      className={`form-control ${touched.subTitle && errors.subTitle ? "is-invalid" : ""}`} 
                      placeholder="Write your notification message here..." 
                    />
                    <ErrorMessage name="subTitle" component="div" className="text-danger small mt-1" />
                  </div>

                  {/* File Upload */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Notification Icon / Image</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      onChange={(e) => setFieldValue("icon", e.target.files[0])} 
                    />
                  </div>

                  {/* MultiSelect Users */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Target Users <span className="text-danger">*</span></label>
                    <MultiSelect
                      options={userList.map((v) => ({ value: v?._id, label: v?.firstName }))}
                      value={userList
                        .filter((v) => values.notifyUserIds.includes(v._id))
                        .map((v) => ({ value: v._id, label: v.firstName }))}
                      onChange={(selected) => setFieldValue("notifyUserIds", selected.map((s) => s.value))}
                      labelledBy="Select User"
                    />
                    {touched.notifyUserIds && errors.notifyUserIds && (
                      <div className="text-danger small mt-1">{errors.notifyUserIds}</div>
                    )}
                  </div>

                  {/* Notification Modes */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Delivery Mode <span className="text-danger">*</span></label>
                    <div className={`border p-3 rounded ${touched.mode && errors.mode ? "border-danger" : ""}`}>
                      {["email", "text", "push", "in_app"].map((m) => (
                        <div key={m} className="form-check mb-1">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`mode-${m}`}
                            checked={values.mode.includes(m)}
                            onChange={() => {
                              const nextValue = values.mode.includes(m)
                                ? values.mode.filter((v) => v !== m)
                                : [...values.mode, m];
                              setFieldValue("mode", nextValue);
                            }}
                          />
                          <label className="form-check-label text-capitalize" htmlFor={`mode-${m}`}>
                            {m.replace("_", " ")}
                          </label>
                        </div>
                      ))}
                    </div>
                    {touched.mode && errors.mode && (
                      <div className="text-danger small mt-1">{errors.mode}</div>
                    )}
                  </div>

                  {/* Scheduling Toggle */}
                  <div className="form-check form-switch mb-3">
                    <Field 
                      type="checkbox" 
                      name="isScheduled" 
                      className="form-check-input" 
                      id="scheduleSwitch" 
                    />
                    <label className="form-check-label" htmlFor="scheduleSwitch">
                      Schedule for later?
                    </label>
                  </div>

                  {/* Date and Time (Visible only if isScheduled is true) */}
                  {values.isScheduled && (
                    <div className="row mb-3 animate__animated animate__fadeIn">
                      <div className="col-md-6">
                        <label className="small fw-bold">Select Date</label>
                        <Field 
                          name="date" 
                          type="date" 
                          className={`form-control ${touched.date && errors.date ? "is-invalid" : ""}`} 
                        />
                        <ErrorMessage name="date" component="div" className="text-danger small mt-1" />
                      </div>
                      <div className="col-md-6">
                        <label className="small fw-bold">Select Time</label>
                        <Field 
                          name="time" 
                          type="time" 
                          className={`form-control ${touched.time && errors.time ? "is-invalid" : ""}`} 
                        />
                        <ErrorMessage name="time" component="div" className="text-danger small mt-1" />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn bgThemePrimary w-100 py-2 mt-2 shadow-sm" 
                    disabled={btnLoader}
                  >
                    {btnLoader ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
                    ) : (
                      "Broadcast Notification"
                    )}
                  </button>
                </div>

                {/* --- Right Column: Mobile Preview --- */}
                <div className="col-lg-4 d-none d-lg-block">
                  <div className="notifyMobile position-sticky" style={{ top: '20px' }}>
                    <img src="/assets/images/phone.png" alt="phone" className="img-fluid" />
                    <div className="notificationContent px-3">
                      <div className="bg-white shadow rounded p-2 mt-5 mx-1" style={{ borderLeft: "4px solid #dc3545" }}>
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className="mb-0 text-dark fw-bold text-truncate" style={{ maxWidth: '80%' }}>
                            {values.title || "Your Title Here"}
                          </h6>
                          <small className="text-muted" style={{ fontSize: '10px' }}>Now</small>
                        </div>
                        <p className="small text-secondary mb-0 mt-1" style={{ fontSize: '12px', lineHeight: '1.2' }}>
                          {values.subTitle || "Message preview will appear here as you type..."}
                        </p>
                        {values.icon && (
                          <img 
                            src={URL.createObjectURL(values.icon)} 
                            className="img-fluid mt-2 rounded shadow-sm" 
                            alt="preview" 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Notify;