import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  updateTopicServ,
  getTopicDetailsServ,
} from "../../services/topic.services";

function UpdateTopic() {
  const navigate = useNavigate();
  const params = useParams();
  const [details, setDetails] = useState(null);
  const [initialData, setInitialData] = useState({
    topicName: "",
    srNo: "",
    assignment: null,
  });

  // ✅ Validation Schema updated for Image
  const topicSchema = Yup.object().shape({
    topicName: Yup.string().trim().required("Topic Name is required"),
    srNo: Yup.string().trim().required("Day is required"),
    assignment: Yup.mixed().test("fileFormat", "Only Images (JPG, PNG) are allowed", (value) => {
      if (!value || typeof value === "string") return true; // Agar naya file select nahi kiya toh skip
      const supportedFormats = ["image/jpg", "image/jpeg", "image/png"];
      return supportedFormats.includes(value.type);
    }),
  });

  const getTopicDetails = async () => {
    try {
      let response = await getTopicDetailsServ(params?.id);
      if (response?.data?.statusCode == "200") {
        const data = response.data.data;
        setDetails(data);
        setInitialData({
          topicName: data?.topicName || "",
          srNo: data?.srNo || "",
          assignment: data?.assignment || "", // Purana image URL
        });
      }
    } catch (error) {
      console.error("Error fetching details", error);
    }
  };

  useEffect(() => {
    getTopicDetails();
  }, []);

  const handleUpdateTopic = async (values) => {
    try {
      const formData = new FormData();
      formData.append("_id", params?.id);
      formData.append("topicName", values.topicName);
      formData.append("srNo", values.srNo);
      
      if (values.assignment instanceof File) {
        formData.append("assignment", values.assignment);
      }

      let response = await updateTopicServ(formData);
      
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/batch/" + details?.batchId?._id);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    }
  };

  return (
    <div className="container-fluid">
      <div className="col-lg-12 p-4">
        <h5 className="ms-1 mb-4">Update Topic</h5>

        <Formik
          enableReinitialize={true}
          initialValues={initialData}
          validationSchema={topicSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await handleUpdateTopic(values);
            setSubmitting(false);
          }}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form>
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Topic Details</div>
                <div className="form-section-body row g-3 p-3">
                  <div className="col-md-6">
                    <label className="form-label">Topic Name *</label>
                    <Field name="topicName" className="form-control" />
                    <ErrorMessage name="topicName" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Day *</label>
                    <Field name="srNo" type="number" className="form-control" />
                    <ErrorMessage name="srNo" component="div" className="text-danger small" />
                  </div>
                </div>
              </div>

              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Assignment (Image)</div>
                <div className="form-section-body row g-3 p-3">
                  <div className="col-md-12">
                    {/* Purani Image dikhane ke liye logic */}
                    {typeof values.assignment === "string" && values.assignment !== "" && (
                      <div className="mb-3">
                        <p className="small text-muted mb-1">Current Image:</p>
                        <img 
                          src={values.assignment} 
                          alt="Current Assignment" 
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }}
                        />
                      </div>
                    )}
                    
                    <label className="form-label">Upload New Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*" // ✅ Sirf images allow karega
                      className="form-control"
                      onChange={(event) => {
                        setFieldValue("assignment", event.currentTarget.files[0]);
                      }}
                    />
                    <ErrorMessage name="assignment" component="div" className="text-danger small" />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="button" onClick={() => navigate(-1)} className="btn btn-danger me-2">
                  Cancel
                </button>
                <button className="btn bgThemePrimary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Topic"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default UpdateTopic;