import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  updateTopicServ,
  getTopicDetailsServ,
} from "../../services/courseTopic.services";

function UpdateCourseTopic() {
  const navigate = useNavigate();
  const params = useParams();
  const [details, setDetails] = useState(null);
  const [initialData, setInitialData] = useState({
    topicName: "",
    srNo: "",
    videoUrl: "",
    assignment: "",
    thumbnail: "",
  });

  // ✅ Validation Schema updated
  const topicSchema = Yup.object().shape({
    topicName: Yup.string().trim().required("Topic Name is required"),
    srNo: Yup.string().trim().required("Day is required"),
    videoUrl: Yup.string().url("Invalid URL").required("Video URL is required"),
    assignment: Yup.mixed().test("fileFormat", "Only Images (JPG, PNG) are allowed", (value) => {
      if (!value || typeof value === "string") return true; 
      const supportedFormats = ["image/jpg", "image/jpeg", "image/png"];
      return supportedFormats.includes(value.type);
    }),
    thumbnail: Yup.mixed().test("fileFormat", "Only Images (JPG, PNG) are allowed", (value) => {
      if (!value || typeof value === "string") return true;
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
          videoUrl: data?.videoUrl || "",
          assignment: data?.assignment || "", 
          thumbnail: data?.thumbnail || "",
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
      formData.append("videoUrl", values.videoUrl);
      if (values.assignment instanceof File) {
        formData.append("assignment", values.assignment);
      }
      if (values.thumbnail instanceof File) {
        formData.append("thumbnail", values.thumbnail);
      }

      let response = await updateTopicServ(formData);
      
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/course-details/" + details?.courseId?._id);
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
              {/* Text Fields Section */}
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Topic Details</div>
                <div className="form-section-body row g-3 p-3">
                  <div className="col-md-4">
                    <label className="form-label">Topic Name *</label>
                    <Field name="topicName" className="form-control" />
                    <ErrorMessage name="topicName" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Day *</label>
                    <Field name="srNo" type="number" className="form-control" />
                    <ErrorMessage name="srNo" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Video URL *</label>
                    <Field name="videoUrl" className="form-control" />
                    <ErrorMessage name="videoUrl" component="div" className="text-danger small" />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Media Assets (Images)</div>
                <div className="form-section-body row g-3 p-3">
                  
                  {/* Thumbnail Update */}
                  <div className="col-md-6">
                    <label className="form-label">Thumbnail</label>
                    {typeof values.thumbnail === "string" && values.thumbnail && (
                      <div className="mb-2">
                        <img src={values.thumbnail} alt="Thumb" style={{ width: "80px", borderRadius: "5px" }} />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => setFieldValue("thumbnail", e.currentTarget.files[0])}
                    />
                    <ErrorMessage name="thumbnail" component="div" className="text-danger small" />
                  </div>

                  {/* Assignment Update */}
                  <div className="col-md-6">
                    <label className="form-label">Assignment Image</label>
                    {typeof values.assignment === "string" && values.assignment && (
                      <div className="mb-2">
                        <img src={values.assignment} alt="Assign" style={{ width: "80px", borderRadius: "5px" }} />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => setFieldValue("assignment", e.currentTarget.files[0])}
                    />
                    <ErrorMessage name="assignment" component="div" className="text-danger small" />
                  </div>

                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="button" onClick={() => navigate(-1)} className="btn btn-danger me-2">Cancel</button>
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

export default UpdateCourseTopic;